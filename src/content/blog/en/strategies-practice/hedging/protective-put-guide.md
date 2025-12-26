---
title: "Protective Put: Insurance for Your Holdings (Hedging Strategy 01)"
description: "Hold stocks but fear crashes? Protective Put lets you cap downside while keeping upside potential. Learn how to use options as portfolio insurance."
date: 2025-12-25
categories:
  - - 期权策略与实战
    - 买方与对冲策略
tags:
  - Hedging Strategy
  - Protective Put
  - Risk Management
  - Buyer Strategy
lang: en
catalog: true
---

## What is Protective Put?

**Protective Put** is the most direct way to insure your stock holdings.

### Strategy Structure
- **Hold**: 100 shares of stock
- **Buy**: 1 Put option (Long Put)
- **Purpose**: Lock maximum loss while keeping upside

### Analogy

Like buying car insurance:
- **Premium**: Option premium
- **Coverage**: Put strike price
- **Claim**: Put gains value when stock falls below strike

---

## P&L Analysis

### Real Example

You hold 100 AAPL shares at $180:

**Execute Protective Put:**
- Buy 1 Put, 30 DTE, $175 strike
- Pay premium: $3.00/share × 100 = **$300**

### After 30 Days

#### A: AAPL rises to $200
- Put expires worthless, lose $300 premium
- Stock profit: ($200 - $180) × 100 = $2,000
- **Net profit: $2,000 - $300 = $1,700**

#### B: AAPL drops to $170
- Stock loss: ($180 - $170) × 100 = $1,000
- Put profit: ($175 - $170) × 100 = $500
- **Net loss: $1,000 - $500 + $300 = $800**

#### C: AAPL crashes to $150
- Stock loss: ($180 - $150) × 100 = $3,000
- Put profit: ($175 - $150) × 100 = $2,500
- **Net loss: $3,000 - $2,500 + $300 = $800**
- **Maximum loss is locked!**

---

## When to Use Protective Put?

### Scenario 1: Major Events
- Before earnings
- Before Fed meetings
- Regulatory changes

### Scenario 2: Protect Profits
- Stock up 50%, fear pullback
- Buy Put to lock in gains

### Scenario 3: Market Volatility Spike
- VIX surging
- Black swan risks rising

---

## Silent's Note

> - **Protective Put is defense, not offense**
> - **Cost is necessary**: Like insurance, it's for peace of mind
> - **Combine with Collar to reduce cost**: Trade some upside for free protection
> - **Don't over-protect**: Use stop loss for small moves, Put for major risks

**Next Episode:** Credit Spread — How to harvest steady premiums in range-bound markets.

---
