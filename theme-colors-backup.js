// 备份：十二种主题颜色定义
const themeColors = [
  { name: '玫红', value: 'default', color: '#e91e63' },
  { name: '蓝色', value: 'blue', color: '#2196f3' },
  { name: '绿色', value: 'green', color: '#4caf50' },
  { name: '紫色', value: 'purple', color: '#9c27b0' },
  { name: '橙色', value: 'orange', color: '#ff9800' },
  { name: '青色', value: 'cyan', color: '#00bcd4' },
  { name: '粉色', value: 'pink', color: '#e91e63' },
  { name: '黄色', value: 'yellow', color: '#ffeb3b' },
  { name: '红色', value: 'red', color: '#f44336' },
  { name: '靛蓝', value: 'indigo', color: '#3f51b5' },
  { name: '琥珀', value: 'amber', color: '#ffc107' },
  { name: '青绿', value: 'teal', color: '#009688' },
];

// 备份：字体选项定义
const fonts = [
  { name: '思源宋体', value: 'noto', family: '"Noto Serif SC", serif', color: '#222222' },
  { name: 'Playfair 优雅体', value: 'playfair', family: '"Playfair Display", serif', color: '#1a1a1a' },
  { name: '得意黑体', value: 'smiley-sans', family: '"Smiley Sans", sans-serif', color: '#2a2a2a', weight: 'bold' },
  { name: 'Tirra 艺术体', value: 'tirra', family: '"Tirra", serif', color: '#2a2a2a' },
  { name: '优雅手写体', value: 'mrs-saint-delafield', family: '"Mrs Saint Delafield", cursive', color: '#2a2a2a' },
  { name: '自由理想体', value: 'ziyoulixiang', family: '"自由理想体", cursive', color: '#2a2a2a' },
];

// 备份：主题模式定义
const themes = [
  { name: '浅色', value: 'light', icon: 'ri:sun-line' },
  { name: '深色', value: 'dark', icon: 'ri:moon-line' },
];

// 备份：泡泡特效和随机效果的CSS样式
const bubbleEffectsCSS = `
  @keyframes particleBurst {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) 
                 translateX(calc(cos(var(--angle)) * 30px))
                 translateY(calc(sin(var(--angle)) * 30px))
                 scale(0);
    }
  }
  
  .color-bubble.selected {
    box-shadow: 
      0 0 0 3px rgba(255, 255, 255, 0.8),
      0 8px 25px rgba(0,0,0,0.2),
      0 0 30px var(--color-value) !important;
    transform: scale(1.1) !important;
    animation: selectedPulse 2s ease-in-out infinite;
  }
  
  @keyframes selectedPulse {
    0%, 100% {
      box-shadow: 
        0 0 0 3px rgba(255, 255, 255, 0.8),
        0 8px 25px rgba(0,0,0,0.2),
        0 0 30px var(--color-value);
    }
    50% {
      box-shadow: 
        0 0 0 6px rgba(255, 255, 255, 0.6),
        0 12px 35px rgba(0,0,0,0.3),
        0 0 40px var(--color-value);
    }
  }
`;

// 备份：JavaScript随机效果代码
const randomEffectsJS = `
  // 随机主题颜色功能
  function getRandomColor() {
    const colors = ['#e91e63', '#2196f3', '#4caf50', '#9c27b0', '#ff9800', '#00bcd4', '#e91e63', '#ffeb3b', '#f44336', '#3f51b5', '#ffc107', '#009688'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // 泡泡爆炸效果
  function createParticleExplosion(x, y, color) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = \`
        position: absolute;
        left: \${x}px;
        top: \${y}px;
        width: 4px;
        height: 4px;
        background: \${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        --angle: \${(i / particleCount) * 2 * Math.PI}rad;
        animation: particleBurst 0.6s ease-out forwards;
      \`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }
`;

export { themeColors, fonts, themes, bubbleEffectsCSS, randomEffectsJS };