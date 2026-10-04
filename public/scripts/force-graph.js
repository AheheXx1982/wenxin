/*!
 * ForceGraph 统一知识图谱引擎 v1.0.1 · 2026-10-04（v1.0.1：单击锁定修复——拖拽阈值 3→12px / 触摸 8→14px / 点按时限 500→800ms；标签 pointer-events:none——他人标签盖球不再抢悬停 / 锁错节点）
 * SilentXx 三站统一图谱：结构 · 样式 · 交互一致，便于维护
 *
 * 鼠标三态：悬停 = 临时高亮预览（移开复原）· 单击 = 锁定高亮（不自动隐藏）· 双击 = 打开链接
 * 触屏手势：单指拖拽平移 · 双指捏合缩放 · 点按 = 锁定 · 双击 = 打开
 * 数量自适应：逻辑画布随节点数扩展（spread = √(N/120)，0.85–1.9）；
 *             窄屏（宽 < 620）额外加宽画布 + 初始缩放居中（手机可分屏阅读）
 * 配套：＋ / − / ⟲ 缩放按钮（自动注入，可关）
 *
 * 用法：
 *   ForceGraph.init({
 *     wrap: 'graph-view',            // 容器（相对定位）或元素
 *     data: { nodes: [...], edges: [{source, target}] },
 *     tip: 'graph-tooltip',          // 气泡元素（可选）
 *     tipText: n => `${n.id} · ${n.count} 篇`,   // 用原始数据节点
 *     radius: n => 5, fill: n => '#1f2937', label: n => n.id,
 *     openHref: n => '/tags/x',      // 双击 / 双击点按 → 打开
 *     onOpen: (n, api) => {},        // 或自定义打开动作（优先于 openHref）
 *     force: { ... },                // 覆盖力导向参数（可选）
 *     zoomButtons: false,            // 关掉缩放按钮（可选）
 *   });
 * 调试：wrap.__fg —— { view(), state(), nodes, edges, W, H, spread, z0, reset() }
 */
(function () {
  'use strict';

  var STYLE_ID = 'fg-style';
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '.fg-zoom{position:absolute;top:8px;right:8px;z-index:6;display:flex;flex-direction:column;gap:4px}' +
      '.fg-zoom button{width:32px;height:32px;border:1px solid rgba(0,0,0,.14);border-radius:8px;background:rgba(255,255,255,.93);color:#444;font-size:15px;line-height:1;cursor:pointer;padding:0}' +
      '.fg-zoom button:hover{background:#fff;border-color:rgba(0,0,0,.3);color:#111}' +
      '.fg-zoom button:active{transform:scale(.96)}';
    (document.head || document.documentElement).appendChild(st);
  }

  var STORE = (window.__forceGraphs = window.__forceGraphs || []);

  function init(opts) {
    opts = opts || {};
    var wrap = typeof opts.wrap === 'string' ? document.getElementById(opts.wrap) : opts.wrap;
    if (!wrap) return null;
    if (wrap.__fg) return wrap.__fg; // 幂等：重复 init 返回既有实例
    var svg = opts.svg
      ? typeof opts.svg === 'string'
        ? document.getElementById(opts.svg)
        : opts.svg
      : wrap.querySelector('svg');
    if (!svg) return null;
    var tip = opts.tip ? (typeof opts.tip === 'string' ? document.getElementById(opts.tip) : opts.tip) : null;
    var data = opts.data || { nodes: [], edges: [] };
    if (!data.nodes || !data.nodes.length) return null;

    injectStyle();
    var NS = 'http://www.w3.org/2000/svg';
    var F = {
      repulsion: 1600,
      springK: 0.004,
      springRest: 110,
      centerK: 0.02,
      damping: 0.88,
      drift: 0.006,
      maxSpeed: 0.5,
      labelGap: 6,
    };
    if (opts.force) {
      for (var fk in opts.force) F[fk] = opts.force[fk];
    }

    // —— 数量自适应视口：逻辑画布随节点数扩展；窄屏加宽 + 初始缩放居中 ——
    var cW = wrap.clientWidth || 800;
    var cH = wrap.clientHeight || 600;
    var nN = data.nodes.length;
    var spread = Math.min(1.9, Math.max(0.85, Math.sqrt(nN / 120)));
    var narrow = cW > 0 && cW < 620;
    var W, H, z0;
    if (narrow) {
      W = Math.max(760, Math.round(cW * 2.2), Math.round(560 * spread));
      H = Math.max(640, Math.round(cH * 1.2), Math.round(560 * spread));
      z0 = Math.min(0.85, Math.max(0.55, cW / 620));
    } else {
      W = Math.round(cW * spread);
      H = Math.round(cH * spread);
      z0 = Math.min(1, Math.max(0.6, 1 / Math.sqrt(spread)));
    }
    var zoom = z0;
    var panX = (cW - W * z0) / 2;
    var panY = (cH - H * z0) / 2;
    var pan0X = panX,
      pan0Y = panY;

    // —— 节点 / 边 ——
    var nodes = data.nodes.map(function (n) {
      return {
        id: n.id,
        ref: n,
        x: W / 2 + (Math.random() - 0.5) * W * 0.5,
        y: H / 2 + (Math.random() - 0.5) * H * 0.5,
        vx: 0,
        vy: 0,
        r: opts.radius ? opts.radius(n) : n.r != null ? n.r : 5,
        color: opts.fill ? opts.fill(n) : n.color || '#1f2937',
        label: opts.label ? String(opts.label(n)) : String(n.label != null ? n.label : n.id),
      };
    });
    var nodeById = {};
    nodes.forEach(function (n) {
      nodeById[n.id] = n;
    });
    var edges = (data.edges || [])
      .map(function (e) {
        var s = e.source != null ? e.source : e.s;
        var t = e.target != null ? e.target : e.t;
        return { source: nodeById[s], target: nodeById[t] };
      })
      .filter(function (e) {
        return e.source && e.target;
      });

    function step() {
      var i, j, a, b, dx, dy, dist, force, fx, fy;
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i];
          b = nodes[j];
          dx = b.x - a.x;
          dy = b.y - a.y;
          dist = Math.sqrt(dx * dx + dy * dy) || 1;
          force = F.repulsion / (dist * dist);
          dx /= dist;
          dy /= dist;
          a.vx -= dx * force * 0.5;
          a.vy -= dy * force * 0.5;
          b.vx += dx * force * 0.5;
          b.vy += dy * force * 0.5;
        }
      }
      for (i = 0; i < edges.length; i++) {
        a = edges[i].source;
        b = edges[i].target;
        dx = b.x - a.x;
        dy = b.y - a.y;
        dist = Math.sqrt(dx * dx + dy * dy) || 1;
        force = (dist - F.springRest) * F.springK;
        fx = (dx / dist) * force;
        fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.vx += (W / 2 - a.x) * F.centerK;
        a.vy += (H / 2 - a.y) * F.centerK;
        a.vx += (Math.random() - 0.5) * F.drift;
        a.vy += (Math.random() - 0.5) * F.drift;
        a.vx *= F.damping;
        a.vy *= F.damping;
        a.vx = Math.max(-F.maxSpeed, Math.min(F.maxSpeed, a.vx));
        a.vy = Math.max(-F.maxSpeed, Math.min(F.maxSpeed, a.vy));
        a.x += a.vx;
        a.y += a.vy;
        a.x = Math.max(50, Math.min(W - 50, a.x));
        a.y = Math.max(50, Math.min(H - 50, a.y));
      }
    }

    // —— 三态交互状态：hoverId 临时预览 / selId 持久锁定 ——
    var edgeEls = [],
      nodeEls = [],
      hitEls = [],
      labelEls = [];
    var viewport = null;
    var hoverId = null,
      selId = null,
      litMap = null;
    var hoverTimer = null;
    var moved = false,
      dragging = false,
      startX = 0,
      startY = 0,
      startPanX = 0,
      startPanY = 0;
    var touchMoved = false,
      touchT0 = 0,
      lastTouch = 0,
      lastTouchX = 0,
      lastTouchY = 0;
    var lastTapT = 0,
      lastTapX = 0,
      lastTapY = 0,
      pinchD0 = 1,
      pinchZ0 = 1;

    function recentTouch() {
      return Date.now() - lastTouch < 700;
    }
    function scheduleClear() {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        hoverId = null;
        repaint();
      }, 400);
    }
    function openNode(n) {
      if (!n) return;
      if (opts.onOpen) {
        opts.onOpen(n.ref, api);
        return;
      }
      var u = opts.openHref ? opts.openHref(n.ref) : '';
      if (u) window.location.href = u;
    }
    function pickNode(cx, cy) {
      var rect = wrap.getBoundingClientRect();
      var wx = (cx - rect.left - panX) / zoom,
        wy = (cy - rect.top - panY) / zoom;
      var best = null,
        bestD = 1e9,
        i,
        n,
        d,
        lim;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        d = Math.sqrt((n.x - wx) * (n.x - wx) + (n.y - wy) * (n.y - wy));
        lim = Math.max(n.r + 12, 18 / zoom);
        if (d <= lim && d < bestD) {
          best = n;
          bestD = d;
        }
      }
      return best;
    }

    // —— 高亮绘制：悬停预览 / 单击锁定共用；锁定球加紫环 ——
    function repaint() {
      var i, e, c;
      var node = nodeById[hoverId || selId] || null;
      litMap = null;
      if (node) {
        var lit = {};
        lit[node.id] = 1;
        for (i = 0; i < edges.length; i++) {
          e = edges[i];
          if (e.source.id === node.id) lit[e.target.id] = 1;
          if (e.target.id === node.id) lit[e.source.id] = 1;
        }
        litMap = lit;
        for (i = 0; i < edges.length; i++) {
          e = edges[i];
          if (e.source.id === node.id || e.target.id === node.id) {
            edgeEls[i].setAttribute('stroke', '#a855f7');
            edgeEls[i].setAttribute('stroke-width', '0.9');
            edgeEls[i].setAttribute('opacity', '0.9');
          } else {
            edgeEls[i].setAttribute('opacity', '0.15');
          }
        }
        for (i = 0; i < nodes.length; i++) {
          var on = lit[nodes[i].id] ? '1' : '0.18';
          nodeEls[i].setAttribute('opacity', on);
          labelEls[i].setAttribute('opacity', on);
        }
      } else {
        for (i = 0; i < edges.length; i++) {
          edgeEls[i].setAttribute('stroke', '#d1d5db');
          edgeEls[i].setAttribute('stroke-width', '0.3');
          edgeEls[i].setAttribute('opacity', '0.45');
        }
        for (i = 0; i < nodes.length; i++) {
          nodeEls[i].setAttribute('opacity', '1');
          labelEls[i].setAttribute('opacity', '1');
        }
      }
      for (i = 0; i < nodes.length; i++) {
        c = graphCircle(i);
        if (!c) continue;
        c.setAttribute('fill', node && nodes[i].id === node.id ? '#a855f7' : nodes[i].color);
        if (nodes[i].id === selId) {
          c.setAttribute('stroke', '#7C3AED');
          c.setAttribute('stroke-width', '2.2');
        } else {
          c.setAttribute('stroke', '#fff');
          c.setAttribute('stroke-width', '1');
        }
      }
    }
    function graphCircle(i) {
      var g = nodeEls[i];
      return g ? g.querySelector('circle:not(.node-hit)') : null;
    }

    function showTip(n, cx, cy) {
      if (!tip) return;
      var rect = wrap.getBoundingClientRect();
      tip.textContent = opts.tipText ? opts.tipText(n.ref) : n.label;
      tip.classList.remove('hidden');
      tip.style.left = cx - rect.left + 14 + 'px';
      tip.style.top = cy - rect.top - 10 + 'px';
    }
    function hideTip() {
      if (tip) tip.classList.add('hidden');
    }

    function build() {
      svg.innerHTML = '';
      viewport = document.createElementNS(NS, 'g');
      svg.appendChild(viewport);
      edgeEls = [];
      hitEls = [];
      nodeEls = [];
      labelEls = [];
      edges.forEach(function (e) {
        var hit = document.createElementNS(NS, 'line');
        hit.setAttribute('class', 'edge-hit');
        hit.setAttribute('data-edge', '1');
        hit.setAttribute('stroke', 'rgba(0,0,0,0)');
        hit.setAttribute('stroke-width', '14');
        hit.setAttribute('pointer-events', 'stroke');
        hit.addEventListener('mouseenter', function () {
          if (recentTouch()) return;
          clearTimeout(hoverTimer);
          hoverId = e.source.id;
          repaint();
        });
        hit.addEventListener('mouseleave', scheduleClear);
        viewport.appendChild(hit);
        var line = document.createElementNS(NS, 'line');
        line.setAttribute('stroke', '#d1d5db');
        line.setAttribute('stroke-width', '0.3');
        line.setAttribute('opacity', '0.45');
        viewport.appendChild(line);
        edgeEls.push(line);
      });
      nodes.forEach(function (n) {
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'node');
        g.setAttribute('data-node', n.id);
        var hit = document.createElementNS(NS, 'circle');
        hit.setAttribute('class', 'node-hit');
        hit.setAttribute('r', String(n.r + 12));
        hit.setAttribute('fill', 'none');
        hit.setAttribute('pointer-events', 'all');
        g.appendChild(hit);
        hitEls.push(hit);
        var circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('r', String(n.r));
        circle.setAttribute('fill', n.color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1');
        circle.style.cursor = 'pointer';
        g.appendChild(circle);
        var enter = function (ev) {
          if (recentTouch()) return;
          clearTimeout(hoverTimer);
          hoverId = n.id;
          repaint();
          showTip(n, ev.clientX, ev.clientY);
        };
        var move = function (ev) {
          if (!tip) return;
          var rect = wrap.getBoundingClientRect();
          tip.style.left = ev.clientX - rect.left + 14 + 'px';
          tip.style.top = ev.clientY - rect.top - 10 + 'px';
        };
        var leave = function () {
          hideTip();
          scheduleClear();
        };
        var click = function () {
          if (moved || recentTouch()) return;
          selId = n.id; // 单击 = 锁定高亮（不打开）
          repaint();
        };
        var dclick = function () {
          if (moved || recentTouch()) return;
          openNode(n); // 双击 = 打开链接
        };
        g.addEventListener('click', click);
        g.addEventListener('dblclick', dclick);
        g.addEventListener('mouseenter', enter);
        g.addEventListener('mousemove', move);
        g.addEventListener('mouseleave', leave);
        viewport.appendChild(g);
        nodeEls.push(g);

        var t = document.createElementNS(NS, 'text');
        t.setAttribute('font-size', '11');
        t.setAttribute('fill', '#374151');
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('dominant-baseline', 'hanging');
        t.setAttribute('data-node', n.id);
        t.textContent = n.label;
        t.style.cursor = 'pointer';
        t.style.pointerEvents = 'none'; // v1.0.1：标签不再拦截指针——密集区他人标签盖住球时不再抢悬停 / 锁错节点（点击 / 双击只认球）
        t.addEventListener('click', click);
        t.addEventListener('dblclick', dclick);
        t.addEventListener('mouseenter', enter);
        t.addEventListener('mousemove', move);
        t.addEventListener('mouseleave', leave);
        svg.appendChild(t);
        labelEls.push(t);
      });
    }

    function tick() {
      viewport.setAttribute('transform', 'translate(' + panX + ',' + panY + ') scale(' + zoom + ')');
      step();
      edges.forEach(function (e, i) {
        edgeEls[i].setAttribute('x1', e.source.x);
        edgeEls[i].setAttribute('y1', e.source.y);
        edgeEls[i].setAttribute('x2', e.target.x);
        edgeEls[i].setAttribute('y2', e.target.y);
      });
      nodes.forEach(function (n, i) {
        nodeEls[i].setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
        hitEls[i].setAttribute('r', String(Math.max(n.r + 12, 16 / zoom)));
        labelEls[i].setAttribute(
          'transform',
          'translate(' + (panX + n.x * zoom) + ',' + (panY + (n.y + n.r) * zoom + F.labelGap) + ')',
        );
        labelEls[i].setAttribute('visibility', zoom < 0.5 && !(litMap && litMap[nodes[i].id]) ? 'hidden' : 'visible');
      });
    }

    function zoomAt(mx, my, nz) {
      nz = Math.min(4, Math.max(0.3, nz));
      panX = mx - ((mx - panX) / zoom) * nz;
      panY = my - ((my - panY) / zoom) * nz;
      zoom = nz;
    }
    function resetView() {
      zoom = z0;
      panX = pan0X;
      panY = pan0Y;
    }

    svg.style.touchAction = 'none';
    svg.style.userSelect = 'none';
    svg.style.webkitUserSelect = 'none';
    svg.style.cursor = 'grab';

    build();
    (function animate() {
      tick();
      requestAnimationFrame(animate);
    })();

    // —— 滚轮缩放（光标锚点）——
    wrap.addEventListener(
      'wheel',
      function (ev) {
        if (recentTouch()) return;
        ev.preventDefault();
        hideTip();
        var rect = wrap.getBoundingClientRect();
        zoomAt(ev.clientX - rect.left, ev.clientY - rect.top, zoom * Math.exp(-ev.deltaY * 0.0012));
      },
      { passive: false },
    );

    // —— 鼠标拖拽平移 ——
    svg.addEventListener('mousedown', function (ev) {
      if (recentTouch()) return;
      dragging = true;
      moved = false;
      startX = ev.clientX;
      startY = ev.clientY;
      startPanX = panX;
      startPanY = panY;
      svg.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', function (ev) {
      if (!dragging) return;
      var dx = ev.clientX - startX,
        dy = ev.clientY - startY;
      // v1.0.1：拖拽判定阈值 3→12——真机点击手抖（3~8px）不再被误判为拖拽而吞掉单击
      if (Math.abs(dx) + Math.abs(dy) > 12) moved = true;
      if (moved) {
        panX = startPanX + dx;
        panY = startPanY + dy;
      } // v1.0.1：未过阈值不误平移（点球画面不飘）
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      svg.style.cursor = 'grab';
    });

    // —— 触屏：单指拖拽 · 双指捏合 · 点按锁定 / 双击打开 ——
    function tDist(ts) {
      var dx = ts[0].clientX - ts[1].clientX,
        dy = ts[0].clientY - ts[1].clientY;
      return Math.sqrt(dx * dx + dy * dy) || 1;
    }
    function tMid(ts) {
      return { x: (ts[0].clientX + ts[1].clientX) / 2, y: (ts[0].clientY + ts[1].clientY) / 2 };
    }
    svg.addEventListener(
      'touchstart',
      function (ev) {
        lastTouch = Date.now();
        hideTip();
        if (ev.touches.length === 2) {
          dragging = false;
          touchMoved = true;
          pinchD0 = tDist(ev.touches);
          pinchZ0 = zoom;
        } else if (ev.touches.length === 1) {
          dragging = true;
          moved = false;
          touchMoved = false;
          touchT0 = Date.now();
          startX = ev.touches[0].clientX;
          startY = ev.touches[0].clientY;
          startPanX = panX;
          startPanY = panY;
          lastTouchX = startX;
          lastTouchY = startY;
        }
        if (ev.cancelable) ev.preventDefault();
      },
      { passive: false },
    );
    svg.addEventListener(
      'touchmove',
      function (ev) {
        lastTouch = Date.now();
        if (ev.touches.length === 2) {
          var mid = tMid(ev.touches);
          var rect = wrap.getBoundingClientRect();
          zoomAt(mid.x - rect.left, mid.y - rect.top, (pinchZ0 * tDist(ev.touches)) / pinchD0);
        } else if (dragging && ev.touches.length === 1) {
          var t0 = ev.touches[0];
          lastTouchX = t0.clientX;
          lastTouchY = t0.clientY;
          var dx2 = t0.clientX - startX,
            dy2 = t0.clientY - startY;
          if (Math.abs(dx2) + Math.abs(dy2) > 14) {
            // v1.0.1：8→14（手指微滚仍算点按）
            moved = true;
            touchMoved = true;
          }
          if (touchMoved) {
            panX = startPanX + dx2;
            panY = startPanY + dy2;
          }
        }
        if (ev.cancelable) ev.preventDefault();
      },
      { passive: false },
    );
    svg.addEventListener(
      'touchend',
      function (ev) {
        lastTouch = Date.now();
        if (ev.touches.length >= 1) {
          if (ev.touches.length === 1) {
            dragging = true;
            moved = true;
            touchMoved = true;
            startX = ev.touches[0].clientX;
            startY = ev.touches[0].clientY;
            startPanX = panX;
            startPanY = panY;
          }
          return;
        }
        dragging = false;
        if (touchMoved || Date.now() - touchT0 > 800) return; // v1.0.1：500→800ms（轻按稍慢也认点按锁定）
        var cx = lastTouchX,
          cy = lastTouchY,
          now = Date.now();
        var tEl = ev.target && ev.target.closest ? ev.target.closest('[data-node]') : null;
        if (now - lastTapT < 330 && Math.abs(cx - lastTapX) < 40 && Math.abs(cy - lastTapY) < 40) {
          lastTapT = 0;
          openNode(tEl ? nodeById[tEl.getAttribute('data-node')] : pickNode(cx, cy)); // 双击 = 打开
          if (ev.cancelable) ev.preventDefault();
          return;
        }
        lastTapT = now;
        lastTapX = cx;
        lastTapY = cy;
        var n = tEl ? nodeById[tEl.getAttribute('data-node')] : pickNode(cx, cy);
        if (n) {
          selId = n.id;
          repaint(); // 点按 = 锁定高亮
          showTip(n, cx, cy);
        } else {
          selId = null;
          repaint();
        }
        if (ev.cancelable) ev.preventDefault();
      },
      { passive: false },
    );

    // —— 空白处单击 = 取消锁定高亮（点线 / 点球不清除）——
    svg.addEventListener('click', function (ev) {
      if (moved || recentTouch()) return;
      var t = ev.target;
      if (t && t.closest && (t.closest('[data-node]') || t.closest('[data-edge]'))) return;
      selId = null;
      repaint();
      hideTip();
    });

    // —— 缩放按钮 ＋ / − / ⟲ ——
    if (opts.zoomButtons !== false) {
      var ctl = document.createElement('div');
      ctl.className = 'fg-zoom no-print';
      ctl.innerHTML =
        '<button type="button" title="放大">＋</button><button type="button" title="缩小">−</button><button type="button" title="复位视图">⟲</button>';
      wrap.appendChild(ctl);
      var bs = ctl.querySelectorAll('button');
      bs[0].addEventListener('click', function () {
        zoomAt(cW / 2, cH / 2, zoom * 1.35);
      });
      bs[1].addEventListener('click', function () {
        zoomAt(cW / 2, cH / 2, zoom / 1.35);
      });
      bs[2].addEventListener('click', resetView);
    }

    var api = {
      version: '1.0.1',
      view: function () {
        return { zoom: zoom, panX: panX, panY: panY, selId: selId, hoverId: hoverId };
      },
      state: function () {
        return { hoverId: hoverId, selId: selId };
      },
      repaint: repaint,
      reset: resetView,
      zoomAt: zoomAt,
      nodes: nodes,
      edges: edges,
      W: W,
      H: H,
      spread: spread,
      z0: z0,
      narrow: narrow,
    };
    wrap.__fg = api;
    STORE.push(api);
    return api;
  }

  window.ForceGraph = { version: '1.0.1', init: init };
})();
