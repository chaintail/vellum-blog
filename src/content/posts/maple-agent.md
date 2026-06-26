---
title: "MapleAgent: Give AI Agents a Budget, Not Your Wallet"
description: "We built a demo on Solana's new native subscriptions & allowances — a capped, revocable budget an AI agent spends on its own, with revocation enforced by the chain itself."
pubDate: 2026-06-23
featured: true
authors: ["Liam C.", "Claude-do"]
faq:
  - q: "What is MapleAgent?"
    a: "MapleAgent is a Solana demo app that gives an AI agent a capped, revocable on-chain budget so it can pay for the tools it needs autonomously — without ever touching the user's wallet or private key. It's built on Solana's native subscriptions and allowances primitive and was made for Superteam Canada."
  - q: "How do you give an AI agent a budget without handing over your wallet?"
    a: "You create a capped, expiring allowance on-chain — a bounded, revocable right to pull funds, limited by amount, by time period, and by destination. The agent spends within that allowance via delegated transfers it signs itself; the user signs once to grant the allowance and never signs an individual charge. The private key is never shared."
  - q: "What are Solana's native subscriptions and allowances?"
    a: "It's a standalone, audited on-chain Solana program that lets a token holder grant someone else a bounded, revocable right to pull funds — capped by amount, capped by period, and restricted by destination. Once signed, the limits hold until revoked, which makes it a natural fit for recurring payments and autonomous agent spending."
  - q: "What happens when you revoke an AI agent's allowance?"
    a: "Revocation is enforced by the Solana program itself, not just the app's UI. When you revoke, the delegation account is closed, so the chain refuses any further pulls. MapleAgent proved this end-to-end on devnet: after revocation, the agent's next spend attempt was rejected on-chain, verifiable in a block explorer."
  - q: "Is every agent spend auditable?"
    a: "Yes. Every charge is a delegated transfer the agent signs, and each one produces an on-chain receipt, so the entire run is auditable and explorer-verifiable. MapleAgent demonstrated the full flow on Solana devnet with real transactions: create the budget, agent spends, revoke, and post-revoke spend blocked on-chain."
entities:
  - name: "Solana"
    sameAs: "https://solana.com"
  - name: "Superteam"
    sameAs: "https://superteam.fun"
  - name: "Vellum Network"
    sameAs: "https://vellum.network"
---

<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin:1.75rem 0;padding:1.15rem 1.4rem;border:1px solid #e3d9c2;border-left:5px solid #C8102E;border-radius:12px;background:#fbf7ee;">
  <span style="font-size:1.08rem;font-weight:600;line-height:1.4;">🍁 MapleAgent is live — try the interactive demo yourself.</span>
  <a href="https://maple.vellum.network" style="flex:0 0 auto;display:inline-block;padding:0.65rem 1.25rem;border-radius:8px;background:#C8102E;color:#fff;font-weight:700;text-decoration:none;white-space:nowrap;">Open the live demo&nbsp;→</a>
</div>

<video controls playsinline preload="metadata" poster="/maple-agent-hero.png" style="width:100%;border-radius:12px;display:block;margin:1.5rem 0;background:#0e1116;">
  <source src="/maple-agent.mp4?v=final" type="video/mp4" />
  Your browser doesn't support embedded video — <a href="/maple-agent.mp4?v=final">download the demo (mp4)</a>.
</video>

We've been going deep on Solana's new **native subscriptions and allowances** primitive — a standalone, audited on-chain program that lets a token holder grant someone else a *bounded, revocable* right to pull funds: capped by amount, capped by period, restricted by destination, revocable at will. Sign once, and the limits hold forever after. If you want the full technical anatomy, we wrote what we think is the best breakdown on the internet: **[Permissioned Pulls →](/posts/permissioned-pulls/)**.

But reading about new tech only gets you so far. So we got our hands dirty and built a demo app to put it through its paces: **MapleAgent**.

**MapleAgent is a Solana demo app that gives an AI agent a capped, revocable on-chain budget — built on Solana's native subscriptions and allowances — so the agent can pay for tools autonomously without ever touching the user's wallet or private key.**

The pitch is one line — *give an AI agent a budget, not your wallet.* You create a capped, expiring allowance for the agent (say, 10 mock USDC for 24 hours). The agent then goes off and autonomously pays for the tools it needs — MapleWeather, TorontoEvents, VIAPlanner, MapleHotels and friends — to plan a low-cost Saturday in Toronto for a visiting Solana builder. Every charge is a delegated transfer the agent signs; the user never signs a single one.

The point is the **guardrails**, and they aren't promises — they're enforced by the program. The agent never touches your private key. It can never spend past the cap. Every spend produces an on-chain receipt, so the whole run is auditable. And when you revoke the allowance, the next spend attempt doesn't just *fail politely in our UI* — it's **rejected by the Solana program itself** (the revoked delegation account is closed, so the chain refuses the pull). We proved exactly that end-to-end on devnet: create the budget → agent spends → revoke → post-revoke spend blocked on-chain, all with real, explorer-verifiable transactions.

That's the model agentic commerce actually needs: bounded autonomy. Not your keys handed to a bot, not a custodian sitting in the middle — just a spending cap the chain enforces, that you can pull back at any moment. MapleAgent is a small, deliberately legible demo of that idea, built for **Superteam Canada**.

**Try it live:** [maple.vellum.network](https://maple.vellum.network) · **Code:** [github.com/chaintail/maple-agent](https://github.com/chaintail/maple-agent) · Built on Solana. 🍁

---

## FAQ

<div class="faq">

<div class="faq-item">
<div class="faq-q">What is MapleAgent?</div>
<div class="faq-a">MapleAgent is a Solana demo app that gives an AI agent a capped, revocable on-chain budget so it can pay for the tools it needs autonomously — without ever touching the user's wallet or private key. It's built on Solana's native subscriptions and allowances primitive and was made for <strong>Superteam Canada</strong>.</div>
</div>

<div class="faq-item">
<div class="faq-q">How do you give an AI agent a budget without handing over your wallet?</div>
<div class="faq-a">You create a capped, expiring allowance on-chain — a bounded, revocable right to pull funds, limited by amount, by time period, and by destination. The agent spends within that allowance via delegated transfers it signs itself; the user signs once to grant the allowance and never signs an individual charge. The private key is never shared.</div>
</div>

<div class="faq-item">
<div class="faq-q">What are Solana's native subscriptions and allowances?</div>
<div class="faq-a">It's a standalone, audited on-chain Solana program that lets a token holder grant someone else a bounded, revocable right to pull funds — capped by amount, capped by period, and restricted by destination. Once signed, the limits hold until revoked, which makes it a natural fit for recurring payments and autonomous agent spending.</div>
</div>

<div class="faq-item">
<div class="faq-q">What happens when you revoke an AI agent's allowance?</div>
<div class="faq-a">Revocation is enforced by the Solana program itself, not just the app's UI. When you revoke, the delegation account is closed, so the chain refuses any further pulls. MapleAgent proved this end-to-end on devnet: after revocation, the agent's next spend attempt was rejected on-chain, verifiable in a block explorer.</div>
</div>

<div class="faq-item">
<div class="faq-q">Is every agent spend auditable?</div>
<div class="faq-a">Yes. Every charge is a delegated transfer the agent signs, and each one produces an on-chain receipt, so the entire run is auditable and explorer-verifiable. MapleAgent demonstrated the full flow on Solana devnet with real transactions: create the budget, agent spends, revoke, and post-revoke spend blocked on-chain.</div>
</div>

</div>
