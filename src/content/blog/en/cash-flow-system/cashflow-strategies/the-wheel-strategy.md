---
title: "The Wheel Strategy: Perpetual Motion Machine for Option Cash Flow (Core Strategy 01)"
description: "How to generate 2% monthly cash flow consistently? The Wheel perfectly combines CSP and Covered Call to build a never-stopping cash flow engine."
date: 2025-12-25
categories:
  - - 稳定现金流系统
    - 核心现金流策略
tags:
  - The Wheel
  - Options Strategy
  - Cash Flow
  - CSP
  - Covered Call
lang: en
catalog: true
---

## What is The Wheel?

**The Wheel** is the most classic cash flow strategy in options trading, forming an infinite loop with two complementary strategies:

```
Step 1: Cash-Secured Put (CSP)
    ↓ (get assigned)
Step 2: Hold stock
    ↓
Step 3: Covered Call (CC)
    ↓ (get assigned)
Return to Step 1 → Repeat
```

### Core Philosophy

> **"I'm willing to buy quality stocks at reasonable prices, collect rent while holding, sell at target price, then start over."**

---

## Complete Wheel Process

### Stage 1: Sell Cash-Secured Put

**Action:**
- Choose stock you're willing to hold (e.g., AAPL)
- Sell Put option
- Collect premium

**Two Outcomes:**

#### Outcome A: Stock doesn't fall below strike
- Put expires worthless
- You keep 100% premium
- Return to Stage 1, sell next Put

#### Outcome B: Stock falls below strike
- Get assigned, buy 100 shares at strike
- Actual cost = Strike - Premium
- Enter Stage 2

---

### Stage 2: Hold Stock

**Now you hold 100 shares**
- Wait for price recovery
- Collect dividends if available
- Prepare for Stage 3

---

### Stage 3: Sell Covered Call

**Action:**
- Sell Call option
- Collect premium again
- Set strike at your target sell price

**Two Outcomes:**

#### Outcome A: Stock doesn't reach strike
- Call expires worthless
- Keep premium, continue holding
- Sell next Call

#### Outcome B: Stock reaches strike
- Get assigned, sell 100 shares at strike
- You gain: Buy-sell spread + all premiums
- Return to Stage 1, restart

---

## Real Case: Complete AAPL Wheel Cycle

### Background
- Initial capital: $20,000
- Ticker: AAPL
- Period: Jan-Jun 2024

---

### Step 1: Sell CSP (Jan 1)

**Market:**
- AAPL price: $180
- Target buy price: $175

**Trade:**
- Sell 1 Feb 1st $175 Put
- Collect premium: $3.00 × 100 = **$300**
- Reserve cash: $17,500

**Result (Feb 1):**
- AAPL drops to $172
- Assigned, buy 100 shares at $175
- **Actual cost: $175 - $3 = $172/share**

---

### Step 2: Hold Stock (Feb)

**Position:**
- Hold 100 AAPL shares
- Cost: $172/share
- Market price: $172 (flat)

**Wait:**
- Price consolidates
- Receive dividend: $0.24 × 100 = **$24**

---

### Step 3: Sell Covered Call (Feb 15)

**Market:**
- AAPL rebounds to $176
- Target sell price: $180

**Trade:**
- Sell 1 Mar 15th $180 Call
- Collect premium: $2.50 × 100 = **$250**

**Result (Mar 15):**
- AAPL rises to $182
- Assigned, sell 100 shares at $180

**Profit Calculation:**
```
Buy cost: $172 × 100 = $17,200
Sell proceeds: $180 × 100 = $18,000
Dividend: $24
Premium (CC): $250
Premium (CSP): $300

Total profit: ($18,000 - $17,200) + $24 + $250 + $300
           = $800 + $574
           = $1,374

Capital invested: $17,500
Return: $1,374 / $17,500 = 7.85%
Holding period: 2.5 months
Annualized: ~38%
```

---

## Advantages of The Wheel

### 1. Two-Way Profit
- **Stock drops**: Sell Put, collect premium
- **Hold stock**: Collect dividends
- **Stock rises**: Sell Call, collect premium + spread
- **Profit either way**

### 2. Lower Stock Cost
**Traditional buy:**
- Cost: $175/share

**Wheel buy:**
- Strike: $175
- CSP premium: -$3
- CC premium: -$2.5
- **Actual cost: $169.5/share** (3.1% lower)

### 3. Compound Acceleration
```
Round 1: Capital $20,000 → Profit $1,374
Round 2: Capital $21,374 → Profit $1,470
Round 3: Capital $22,844 → Profit $1,572
...
After 1 year: Capital ~$28,500
Annualized: 42.5%
```

### 4. Mental Peace
- Not afraid of drops: buy at good price
- Not afraid of rises: Call premium + sell profit
- **Market volatility becomes profit tool**

---

## Silent's Note

> - **The Wheel is cash flow perpetual motion**: As long as market moves, you profit
> - **Patience is key**: Not chasing quick riches, pursuing steady compound
> - **Stock selection matters more than technique**: Good stocks let you sleep well
> - **From today, make your holdings work for you**

**Next Episode:** PMCC (Poor Man's Covered Call) — How to achieve same cash flow with 1/10 capital.

---
