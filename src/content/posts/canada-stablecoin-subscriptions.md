---
title: "Canada's Stablecoin Subscription Layer: CADD, Solana Allowances, and the CAD-Native Billing Rail Nobody Has Built Yet"
description: "A strategy memo for Canadian builders on the collision of Solana's new subscription program and the CADD stablecoin — what's live, what's announced, what's hypothetical, and the unbuilt company in the gap."
pubDate: 2026-06-23
featured: false
authors: ["Liam C.", "Mikail R.", "Claude-do"]
heroImage: "/img/c1.png"
heroAlt: "A CAD stablecoin feeding an on-chain subscription rail — a vision: Solana authorization is live today, CADD is announced, the CAD-native rail itself is still hypothetical."
faq:
  - q: "What is the Solana subscriptions program?"
    a: "The Solana subscriptions program is a standalone, audited on-chain smart contract that lets a user sign once to authorize bounded, recurring pulls from their own wallet. Amount caps, billing periods, expiry, and cancellation are all enforced by code rather than by merchant goodwill. It went live on Solana mainnet around June 3, 2026, built by Moonsong Labs with the Solana Foundation and audited by Cantina."
  - q: "What is CADD, the Canadian-dollar stablecoin?"
    a: "CADD is a regulated Canadian-dollar stablecoin that launched on May 4, 2026, backed by Shopify, Wealthsimple, Shakepay, National Bank of Canada, and ATB. It currently lives on Base, Ethereum, and Tempo. A Solana deployment is planned but not yet live, and no date has been announced."
  - q: "Can you build a CAD stablecoin subscription on Solana today?"
    a: "Not in Canadian dollars yet. The Solana subscriptions program is live and you could ship a USDC subscription on it today, but CADD is not yet on Solana — so any CAD-denominated subscription would currently bill in a USD-pegged token, leaving Canadian customers with FX exposure on a CAD-priced product. CAD-native plans wait on the CADD Solana deployment."
  - q: "Does the Solana subscriptions program work with any token, including regulated stablecoins?"
    a: "It works with plain SPL Token and USDC today. For Token-2022 it accepts only a restricted extension set: the SDK rejects mints configured with confidential transfer, transfer fees, permanent delegates, transfer hooks, pausability, and several others (error codes 118–124 in @solana/subscriptions). This matters for CADD because a regulated stablecoin might want a transfer hook for compliance — and a hooked mint would be rejected by the program."
  - q: "What is the business opportunity in Canada's stablecoin subscription stack?"
    a: "The on-chain authorization layer is live and audited, but no one operates the billing-ops layer on top of it — the service that cranks period boundaries, retries failed pulls and dunning, issues receipts from on-chain events, and wraps the SDKs in a REST API and dashboard. That 'Stripe Billing for Solana' service, built CAD-native for the home market, is the unbuilt company in the gap. Superteam Canada offers grants of up to $10,000 CAD that fit it."
entities:
  - name: "Solana"
    sameAs: "https://solana.com"
  - name: "Solana Foundation"
    sameAs: "https://solana.org"
  - name: "Shopify"
    sameAs: "https://www.shopify.com"
  - name: "Wealthsimple"
    sameAs: "https://www.wealthsimple.com"
  - name: "Cantina"
    sameAs: "https://cantina.xyz"
  - name: "Superteam Canada"
    sameAs: "https://superteam.ca"
  - name: "USDC"
    sameAs: "https://www.circle.com"
---

*A strategy memo for Canadian builders. Everything in here is either live, announced, or clearly labeled hypothetical — and the difference matters more than the hype.*

---

## 1. Two facts on a collision course

Canadians subscribe to almost everything. Streaming, software, phone plans, meal kits, gym memberships — the default way a Canadian household pays for an ongoing service is a pre-authorized debit or a card-on-file charge, riding decades-old payment rails. Those rails work, mostly. They also fail in well-known ways: cards expire and silently kill subscriptions, chargebacks arrive months later, every renewal pays a percentage toll to the card networks, and "cancel anytime" is a policy promise enforced by a support queue, not by the payment system itself.

In the first half of 2026, two things happened that — together — sketch a genuinely different design for recurring payments in Canada.

**First**, Solana shipped the authorization half of a programmable billing system. On June 3, 2026, a standalone, audited on-chain program (a "program" is Solana's term for a smart contract) for subscriptions and spending allowances went live on Solana mainnet. Built by Moonsong Labs with the Solana Foundation and audited by Cantina, it lets a user sign **once** to authorize bounded, rule-enforced pulls from their own account — caps, periods, expiry, and cancellation all enforced by code that neither the merchant nor the user can quietly rewrite.

**Second**, Canada — unusually among G7 countries — got its own regulated Canadian-dollar stablecoin. CADD launched May 4, 2026, backed by a who's-who of Canadian commerce and finance: Shopify, Wealthsimple, Shakepay, National Bank of Canada, and ATB. Today CADD lives on Base, Ethereum, and Tempo. A Solana deployment is **planned, not live**.

This memo is about the collision of those two facts: what a CAD-native, code-enforced subscription rail would look like, who in Canada it fits, what honestly stops it today, and the specific business — small, grant-sized, unbuilt — that sits in the gap.

---

## 2. The table you should read before anything else

![Status board — LIVE TODAY: the Solana subscriptions program, Cantina audit, SPL/USDC, TS SDK · ANNOUNCED/COMING: CADD (not yet on Solana) · HYPOTHETICAL: every integration scenario in this memo.](/img/c2.png)

Most coverage of this topic blurs three very different epistemic categories. This memo refuses to. Here is exactly where everything stands as of June 9, 2026:

| Status | Claim | Detail |
|---|---|---|
| **LIVE TODAY** | Solana subscriptions/allowances program on mainnet | Live since ~June 3, 2026; program ID `De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44` |
| **LIVE TODAY** | Security audit | Audited by Cantina (covers the program up to commit `b4b0345f`; later commits unaudited) |
| **LIVE TODAY** | Token support | Works with SPL Token; Token-2022 (Solana's newer token standard) only with a restricted extension set — the SDK rejects mints using confidential transfer, transfer fees, permanent delegates, and several other extensions. USDC and plain SPL stablecoins qualify today |
| **LIVE TODAY** | Developer tooling | TypeScript SDK (`@solana/subscriptions`), Rust crate (`subscriptions ^0.1`), devnet demo app; no dedicated CLI yet |
| **LIVE TODAY** | Design partners | Helius, Confirmo, Dynamic, Majority, Mesh, Meow — none Canadian yet |
| **ANNOUNCED / COMING** | CADD itself | Launched May 4, 2026 — but on Base, Ethereum, and Tempo, **not Solana** |
| **ANNOUNCED / COMING** | CADD on Solana | Planned. **Not live. No date.** Everything CAD-denominated in this memo waits on this |
| **ANNOUNCED / COMING** | CADD's backers | Shopify, Wealthsimple, Shakepay, National Bank of Canada, ATB back the stablecoin — backing CADD is **not** the same as integrating Solana subscriptions |
| **HYPOTHETICAL** | Every integration scenario in this memo | Shopify subscription boxes, FreshBooks-style invoicing, Wealthsimple-style recurring buys, AI-agent budgets — all are **archetypes I constructed**, not announced products |

To restate in prose, because tables get skimmed: the subscription program is real, audited, and on mainnet right now — you could ship a USDC subscription on it this afternoon. CADD is real but lives on other chains; its Solana deployment is a stated plan. And **no Canadian company named in this memo has announced any integration between the two**. Shopify backs CADD and once ran a Solana Pay checkout integration (2022–23), which makes the Shopify scenario the least far-fetched — but it is still a scenario. FreshBooks, Telus, Rogers, Bell, and Crave have no crypto surface at all; when their names appear here, they are stand-ins for a business shape, nothing more.

If you only remember one thing: this memo describes an opportunity, not a product. The credibility of the opportunity depends on being honest about exactly that.

---

## 3. How the primitive actually works

**The Solana subscriptions program is a standalone, audited on-chain smart contract that lets a user sign once to authorize bounded, rule-enforced recurring pulls from their own wallet — with amount caps, periods, expiry, and cancellation all enforced by code rather than by merchant goodwill.** Strip away the jargon and the mechanism is four ideas.

**One signature, bounded forever after.** The user signs a single transaction that creates an on-chain authorization: "this merchant may pull up to X of this token, on these terms." After that, the user never signs again for routine charges. The program — not the merchant's goodwill — enforces the bounds. Under the hood, a program-controlled account becomes the delegate for the user's token account, but every pull is gated by the specific authorization's rules: amount caps, period boundaries, expiry, cancellation status, and an allowlist of destination accounts.

**Three flavors of authorization.** A **fixed delegation** is a cumulative cap with an optional expiry — "pull up to $500 total before September," the on-chain analog of a card pre-auth or a hard budget. A **recurring delegation** is a per-period cap that resets — "up to $4,000 per month until the contract ends," with the period specified in seconds, so the window can be anything from sub-hourly metering intervals to a year. (Merchant-published *plans*, below, are coarser: their periods run in whole hours, one hour to one year.) A **subscription plan** is the merchant-facing product: the merchant publishes terms once — amount, period, token, destination accounts — and those core terms are **immutable after creation**. The merchant can pause a plan, set an end date, rotate up to four authorized "pullers," or update a metadata link; it can never quietly raise the price or change where the money goes. Each subscriber's wallet keeps a snapshot of the terms it agreed to, and the program compares that snapshot against the live plan on every pull — if anything material changed, the pull fails.

**The merchant pulls; the user can leave.** On each billing cycle, the merchant (or one of its whitelisted pullers) sends the pull transaction and pays the network fee — about 5,000 lamports, a fraction of a cent (a lamport is the smallest unit of SOL, Solana's native token). Cancellation is a single transaction signed by the subscriber, checked by the program before any transfer moves. "Cancel anytime" stops being a policy page and becomes a property of the rail.

**What it deliberately does not do.** The program validates and executes pulls; it does not *schedule* them. There is no on-chain alarm clock — somebody off-chain must send the pull transaction each period. It is a standalone program, not a token-standard extension and not a protocol change, and it works only with token accounts (so not native SOL directly, though wrapped SOL works). Hold these limits in mind; section 5 is built on them.

---

## 4. Three Canadian archetypes, mapped to the right tool

![Three primitives, three jobs: a fixed allowance (hard-capped budget), a recurring delegation (per-period payouts), and a subscription plan (merchant-published billing).](/img/c3.png)

Each of the following is hypothetical. Each is mapped to the authorization type that actually fits it — because the mapping is where most hand-wavy coverage falls apart.

### 4a. The subscription-box merchant on Shopify → **subscription plans**

*Hypothetical, with a realism anchor: Shopify backs CADD and previously shipped a Solana Pay checkout integration (2022–23). No Shopify–subscriptions-program integration exists or has been announced.*

Picture a Toronto coffee-subscription merchant doing $40/month boxes. Today she pays card processing fees that commonly run near three percent plus a fixed per-transaction fee — illustratively, on the order of a dollar and change of every $40 renewal evaporating before shipping costs. Her quiet killer, though, is involuntary churn: subscribers whose cards expire or get reissued and who never bother re-entering a number.

On this rail, she publishes a **subscription plan**: $40-equivalent in a stablecoin, 730-hour period (~monthly), her treasury account as the immutable destination. A customer signs once to subscribe. Every month, her billing service pulls — paying ~5,000 lamports, a fraction of a cent, instead of a percentage. There is no card to expire: the authorization persists until the customer cancels or the plan ends. Program transfers are not card-network chargebacks — refund and dispute policy moves up a layer, to the merchant — which cuts fraud losses but also removes a consumer protection she now has to own herself rather than outsource to a card network. And her "cancel anytime" claim is now machine-checkable: the cancellation check runs inside the transfer logic itself.

What's the catch? Today she'd be billing in USDC, which means her Canadian customers carry FX exposure on a CAD-priced product. **This archetype is exactly what CADD-on-Solana would unlock** — CAD-denominated plans, CAD settlement, no FX wobble between subscription price and bank deposit. That is the entire reason the CADD timeline matters.

### 4b. The contractor-invoicing platform → **recurring delegations**

*Hypothetical. FreshBooks has no crypto surface today — the name here is purely an archetype for "Canadian SMB invoicing/payroll software."*

A FreshBooks-style platform serves freelancers who bill the same clients monthly. Today: invoice, e-transfer or card link, wait, nudge, wait. The recurring relationship exists socially but not mechanically.

The right primitive here is **not** a subscription plan — invoice amounts vary month to month, and plan amounts are immutable. It's the **recurring delegation**: the client authorizes "up to $6,000 per 30-day period, expiring at contract end" in favor of the contractor (delegation periods are specified in seconds, so a 30-day window — or any other — is exact). Each month the contractor (or the platform acting as a whitelisted puller) pulls the actual invoiced amount — $4,850 one month, $5,920 the next — and the per-period cap resets on schedule. And because delegation periods go down to seconds, the same shape stretches to genuinely metered billing — per-day or even per-hour usage charges under the same client-held cap — which no card rail offers a freelancer platform today. The client retains a hard ceiling and a revocation switch; the contractor gets pull-based settlement instead of chase-based collections. Same shape works in reverse for retainer-style payroll: an agency sets a recurring delegation per contractor, and payday is a pull, not a payables run.

For the platform, this changes the business model: it stops being a document tool that hands off to payment rails and becomes the **puller of record** — which, as section 6 argues, is where the new revenue lives.

### 4c. Recurring buys and AI-agent budgets → **fixed allowances**

*Hypothetical. Wealthsimple backs CADD; it has announced nothing about Solana subscriptions.*

A Wealthsimple-style platform offers recurring crypto or asset purchases. Rather than holding card credentials or pre-funding a custodial balance, the user grants a **fixed delegation** from their own wallet: "pull up to $1,200 total, expiring in 12 months" — a self-custodied annual budget the platform draws down with each scheduled buy. The cumulative cap is the safety property: worst case, ever, is the cap.

The same primitive is the natural fit for the newest spender on the block: AI agents. If you give an agent your card, you trust the agent. If you give it a fixed allowance, you trust the cap — the program rejects anything beyond it regardless of how confused or compromised the agent gets. This isn't a fringe idea: an agentic-commerce payments spec (the MPP spec, developed in the Tempo ecosystem) already references this style of bounded delegation as the budget mechanism for autonomous agents. For a Canadian fintech audience the pitch is one sentence: **fixed allowances are spending-limit cards for software, enforced by the rail instead of the issuer.**

---

## 5. The honest holes: what stops this today

**CADD is not on Solana.** The headline gap. Every CAD-denominated scenario above waits on a deployment that is announced but unshipped, with no public date. Until then, Canadian builders on this rail are billing in USDC and eating the FX mismatch.

**There is no scheduler, and someone must be paid to care.** The program enforces *whether* a pull is valid, never *when* it happens. Solana's previous general-purpose automation network, Clockwork, is dead, and nothing has filled the gap. So every merchant needs off-chain infrastructure that wakes up at period boundaries, sends pull transactions, retries failures, and notices when a subscriber's balance can't cover the pull. This is unglamorous, essential, and — see section 6 — entirely unbuilt as a service.

**The compliance-hook question (the subtle one).** Token-2022, Solana's newer token standard, supports "transfer hooks" — a mint can require its own program to run on every transfer, which is precisely the mechanism a regulated issuer might want for compliance controls (allowlists, sanctions screening, transfer policy). Here's the constraint: **the subscriptions program rejects any mint with a configured transfer hook — and transfer hooks are only one entry on a longer rejection list.** The program's TypeScript SDK ships a dedicated error code for each disallowed Token-2022 extension: confidential transfer, non-transferable, permanent delegate, transfer hook, transfer fee, mint close authority, and pausable (error codes 118–124 in `@solana/subscriptions`). In other words, Token-2022 mints are supported only with a restricted extension set — and worth flagging: some official-docs phrasing suggests confidential transfers are supported, which the SDK's own error table contradicts; this memo goes with the SDK. Now put the two halves together. CADD is a *regulated* CAD stablecoin backed by, among others, one of Canada's largest banks — and that makes this the open design question this memo most wants answered: **what will CADD's Solana mint configuration be?** If the eventual deployment expresses its compliance posture through a configured transfer hook, the regulated stablecoin and the subscription rail — the two protagonists of this memo — would be unable to talk to each other. Nothing forces that outcome: CADD could deploy as plain SPL Token, or as Token-2022 without any of the rejected extensions, handling compliance at the issuance/redemption boundary instead of the transfer layer — but the rejection list above means the needle is narrower than "just skip the hook": transfer fees, permanent delegates, and pausability are off the table too. Nobody announcing partnerships has publicly addressed the choice, and it should be the first question any Canadian builder asks the CADD team. A second-order wrinkle: if the subscriptions program were later updated to accommodate hooked mints, that change would land outside the current audit's scope (the Cantina audit covers the program only up to a specific commit).

**FX, UX, and the tax elephant.** Until CADD lands, CAD-priced subscriptions settle in USD-pegged tokens — FX risk on both sides. Wallet UX has a genuine optics problem: the program's design grants its program-controlled account a maximum-value token approval, and wallet interfaces may display that raw number and frighten users, even though every actual pull is hard-capped by the user's specific authorization. And in Canada, the tax treatment of recurring stablecoin payments is a genuinely open question — whether each monthly pull has reporting consequences for the payer is something to put to a tax professional, not something this memo can settle. None of these are fatal; all of them are real; only the last one needs an accountant before it needs an engineer.

---

## 6. The opportunity: Stripe Billing for Solana, built in Canada

![The opportunity, as a stack: a CAD-native subscription rail (allowances, recurring payments, billing logic) atop Solana, settling in CADD — built for Canada, not yet built.](/img/c4.png)

*As of June 22, 2026, CADD is live on Base, Ethereum, and Tempo — **not yet on Solana**. A Solana deployment is planned, with no date announced. The stack above is the opportunity, not a shipped product.*

Walk back through the holes and notice something: the biggest one is not a protocol problem. It's a missing *company*.

The authorization layer is live, audited, and free to build on. What no one operates is the **billing-ops layer** — the service that turns a raw on-chain primitive into something a coffee merchant or an invoicing platform can actually run a business on. Concretely, it would:

- **Crank period boundaries.** Maintain the schedule the chain doesn't: know when each subscriber's period rolls over and fire the pull transaction, as one of the plan's up-to-four whitelisted pullers.
- **Retry and dun.** When a pull fails — usually an underfunded balance — retry on a backoff schedule, notify the subscriber ("your subscription needs a top-up"), and mark the account delinquent after a grace window. This is dunning, the least sexy and most revenue-protective function in subscription commerce.
- **Issue receipts from on-chain truth.** The program emits structured events on every lifecycle change — created, cancelled, resumed, and every transfer. A billing service consumes those events to generate receipts, revenue dashboards, churn metrics, and accountant-ready exports, all derived from a ledger that cannot disagree with itself.
- **Manage plan operations.** Handle the sharp edges: plans' destination accounts are immutable, so treasury rotation means sunsetting a plan and migrating subscribers — a painful manual process that a good service turns into a guided workflow.
- **Abstract the SDKs.** Wrap the TypeScript and Rust SDKs in the thing every merchant actually wants: a REST API and a dashboard.

This is "Stripe Billing for Solana" — not a payments processor (the chain is the processor), but the orchestration, reliability, and reporting layer on top. It is almost suspiciously well-shaped for a small Canadian team: the heavy cryptography and audit work is already done upstream; the remaining work is scheduling infrastructure, webhooks, and product polish. The Canadian angle is not decorative: if CADD ships on Solana, the first billing-ops service with CAD-denominated plans, CAD reporting, and CRA-aware export formats wins the home market by default, and the CADD backer list (Shopify, Wealthsimple, Shakepay, National Bank, ATB) is a ready-made integration roadmap — hypothetically, today; commercially, the moment any of them moves.

And the starting capital is sitting in the open. Superteam Canada, based in Toronto, runs grants of up to $10,000 CAD — small by venture standards, exactly right for "build the scheduler, sign two design-partner merchants, run real USDC subscriptions on mainnet while waiting for CADD." The program went live June 3. The stablecoin's backers are Canadian household names. The gap between them has a job description and a funding source.

If you're a Canadian builder reading this: the rail is live, the gap is documented above in embarrassing detail, and nobody — as of this writing — has claimed it. Go be the boring, essential layer.

---

## 7. Sources

All claims trace to the verified research digest for this series (compiled 2026-06-09); primary sources cited there include:

- Solana Foundation announcement and documentation for the subscriptions program (solana.com news + docs)
- Program repository: `github.com/solana-program/subscriptions` (incl. ADR-002 and AUDIT_STATUS.md)
- Cantina audit (coverage to commit `b4b0345f`, per AUDIT_STATUS.md dated 2026-04-08)
- Devnet demo: solana-subscriptions-program.vercel.app
- TypeScript SDK `@solana/subscriptions`; Rust crate `subscriptions ^0.1`
- CoinDesk coverage of the CADD launch (2026-05-04; Base/Ethereum/Tempo; backer list; Solana planned)
- MPP agentic-commerce spec: `github.com/tempoxyz/mpp-specs` (PR #270)
- Superteam Canada (superteam.ca) — Toronto; grants ≤$10k CAD
- Secondary press: MEXC, Cointrust, The Defiant coverage of the program launch

---

## 8. FAQ

<div class="faq">

<div class="faq-item">
<div class="faq-q">What is the Solana subscriptions program?</div>
<div class="faq-a">The Solana subscriptions program is a standalone, audited on-chain smart contract that lets a user sign once to authorize bounded, recurring pulls from their own wallet. Amount caps, billing periods, expiry, and cancellation are all enforced by code rather than by merchant goodwill. It went live on Solana mainnet around June 3, 2026, built by Moonsong Labs with the Solana Foundation and audited by Cantina.</div>
</div>

<div class="faq-item">
<div class="faq-q">What is CADD, the Canadian-dollar stablecoin?</div>
<div class="faq-a">CADD is a regulated Canadian-dollar stablecoin that launched on May 4, 2026, backed by Shopify, Wealthsimple, Shakepay, National Bank of Canada, and ATB. It currently lives on Base, Ethereum, and Tempo. A Solana deployment is planned but not yet live, and no date has been announced.</div>
</div>

<div class="faq-item">
<div class="faq-q">Can you build a CAD stablecoin subscription on Solana today?</div>
<div class="faq-a">Not in Canadian dollars yet. The Solana subscriptions program is live and you could ship a USDC subscription on it today, but CADD is not yet on Solana — so any CAD-denominated subscription would currently bill in a USD-pegged token, leaving Canadian customers with FX exposure on a CAD-priced product. CAD-native plans wait on the CADD Solana deployment.</div>
</div>

<div class="faq-item">
<div class="faq-q">Does the Solana subscriptions program work with any token, including regulated stablecoins?</div>
<div class="faq-a">It works with plain SPL Token and USDC today. For Token-2022 it accepts only a restricted extension set: the SDK rejects mints configured with confidential transfer, transfer fees, permanent delegates, transfer hooks, pausability, and several others (error codes 118–124 in <code>@solana/subscriptions</code>). This matters for CADD because a regulated stablecoin might want a transfer hook for compliance — and a hooked mint would be rejected by the program.</div>
</div>

<div class="faq-item">
<div class="faq-q">What is the business opportunity in Canada's stablecoin subscription stack?</div>
<div class="faq-a">The on-chain authorization layer is live and audited, but no one operates the billing-ops layer on top of it — the service that cranks period boundaries, retries failed pulls and dunning, issues receipts from on-chain events, and wraps the SDKs in a REST API and dashboard. That "Stripe Billing for Solana" service, built CAD-native for the home market, is the unbuilt company in the gap. Superteam Canada offers grants of up to $10,000 CAD that fit it.</div>
</div>

</div>

