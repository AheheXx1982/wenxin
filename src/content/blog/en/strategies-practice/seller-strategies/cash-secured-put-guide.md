---
title: "Cash-Secured Put: The First Lesson for Option Sellers (Seller Strategy 01·CSP)"
description: "Want to earn monthly cash flow with options? Start with CSP. This guide teaches you how to use the cash-secured put strategy to collect premiums while controlling risk."
date: 2025-12-25
categories:
  - - 期权策略与实战
    - 卖方核心策略
tags:
  - Seller Strategy
  - CSP
  - Cash Flow
  - Options Basics
lang: en
catalog: true
---

## What is Cash-Secured Put (CSP)?

**Cash-Secured Put** is one of the most basic and safest strategies for option sellers.

### Simple Explanation

You tell the market:
> **"If the stock drops to $X, I'm willing to buy 100 shares at that price, and I have the cash reserved. In return, please pay me a premium upfront."**

### Strategy Structure

- **Action**: Sell 1 Put option (Sell Put)
- **Collateral**: Reserve enough cash to buy 100 shares (Strike × 100)
- **Income**: Immediately receive premium
- **Risk**: Must buy stock at strike price if it falls below

---

## CSP Profit Logic

### Three Outcomes

#### Outcome 1: Stock Stays Flat or Rises (Best Case)
- Put option expires worthless
- **You keep 100% of the premium**
- Can sell another round

#### Outcome 2: Stock Drops Slightly, Above Strike
- Put option expires worthless
- **You keep 100% of the premium**
- No obligations

#### Outcome 3: Stock Drops Below Strike (Assignment)
- Buy 100 shares at strike price
- **Actual cost = Strike - Premium**
- Can then execute Covered Call

---

## Real Example: AAPL CSP

### Current Market
- AAPL price: $180
- Your view: Won't fall below $175 in 30 days

### Execute CSP

**Sell:**
- Sell 1 Put, 30 DTE, $175 strike
- Collect premium: $2.50/share × 100 = **$250**
- Reserve cash: $175 × 100 = $17,500

### Three Scenarios After 30 Days

#### A: AAPL rises to $185
- Put expires worthless
- **Net profit: $250**
- 30-day return: $250 / $17,500 = **1.43%**
- Annualized: ~**17%**

#### B: AAPL stays at $180
- Put expires worthless
- **Net profit: $250**
- Same returns

#### C: AAPL drops to $170
- Buy 100 shares at $175
- Actual cost: $175 - $2.50 = **$172.50/share**
- Market price $170, paper loss $250
- But cost is $2.50/share lower than buying directly

---

## Core Advantages of CSP

### 1. Defined Risk
- Maximum loss = (Strike - Premium) × 100
- Much safer than naked Put

### 2. High Win Rate
- Profit as long as stock doesn't fall below strike
- Win rate typically 70%-85%

### 3. Certain Income
- Premium credited immediately
- Not dependent on stock rising

### 4. "Forced Bottom-Fishing" Benefit
- If assigned, you buy quality stock at discount
- Can then execute Covered Call for more income

---

## Silent's Note

> - **CSP is the first lesson**: Simple, safe, steady income
> - **Core is stock selection**: Only sell Puts on stocks you want to own
> - **Patience is key**: Don't chase high premiums, chase high win rates
> - **Combine with Wheel**: CSP + Covered Call = Cash flow perpetual motion

**Next Episode:** Covered Call — How to make your holdings pay you "wages" every month.

---
