---
title: "MapleAgent: Give AI Agents a Budget, Not Your Wallet"
description: "We built a demo on Solana's new native subscriptions & allowances — a capped, revocable budget an AI agent spends on its own, with revocation enforced by the chain itself."
pubDate: 2026-06-23
featured: true
authors: ["Liam C.", "Claude-do"]
---

<video controls playsinline preload="metadata" poster="/maple-agent-hero.png" style="width:100%;border-radius:12px;display:block;margin:1.5rem 0;background:#0e1116;">
  <source src="/maple-agent.mp4?v=final" type="video/mp4" />
  Your browser doesn't support embedded video — <a href="/maple-agent.mp4?v=final">download the demo (mp4)</a>.
</video>

We've been going deep on Solana's new **native subscriptions and allowances** primitive — a standalone, audited on-chain program that lets a token holder grant someone else a *bounded, revocable* right to pull funds: capped by amount, capped by period, restricted by destination, revocable at will. Sign once, and the limits hold forever after. If you want the full technical anatomy, we wrote what we think is the best breakdown on the internet: **[Permissioned Pulls →](/posts/permissioned-pulls/)**.

But reading about new tech only gets you so far. So we got our hands dirty and built a demo app to put it through its paces: **MapleAgent**. The pitch is one line — *give an AI agent a budget, not your wallet.* You create a capped, expiring allowance for the agent (say, 10 mock USDC for 24 hours). The agent then goes off and autonomously pays for the tools it needs — MapleWeather, TorontoEvents, VIAPlanner, MapleHotels and friends — to plan a low-cost Saturday in Toronto for a visiting Solana builder. Every charge is a delegated transfer the agent signs; the user never signs a single one.

The point is the **guardrails**, and they aren't promises — they're enforced by the program. The agent never touches your private key. It can never spend past the cap. Every spend produces an on-chain receipt, so the whole run is auditable. And when you revoke the allowance, the next spend attempt doesn't just *fail politely in our UI* — it's **rejected by the Solana program itself** (the revoked delegation account is closed, so the chain refuses the pull). We proved exactly that end-to-end on devnet: create the budget → agent spends → revoke → post-revoke spend blocked on-chain, all with real, explorer-verifiable transactions.

That's the model agentic commerce actually needs: bounded autonomy. Not your keys handed to a bot, not a custodian sitting in the middle — just a spending cap the chain enforces, that you can pull back at any moment. MapleAgent is a small, deliberately legible demo of that idea, built for **Superteam Canada**.

**Try it live:** [maple.vellum.network](https://maple.vellum.network) · **Code:** [github.com/chaintail/maple-agent](https://github.com/chaintail/maple-agent) · Built on Solana. 🍁
