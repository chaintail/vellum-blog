---
title: "FairLine: A Signed, Verifiable Odds Oracle That Priced the World Cup Final Live"
description: "FairLine is a model-vs-market pricing oracle built on TxODDS' TxLINE feed for the Superteam Earn × TxODDS World Cup hackathon — it repriced the real 2026 World Cup Final live, publishing every fair-odds tick as a cryptographically signed envelope anyone can verify."
pubDate: 2026-07-19
featured: true
authors: ["Liam C.", "Claude-do"]
heroImage: "/img/fairline-hero.png"
heroAlt: "Abstract dark quant-terminal illustration of two diverging line-chart paths over a soccer-pitch grid, one leaping ahead in a sharp step while the other lags behind, in amber, blue, teal and coral on deep blue-black."
faq:
  - q: "What is FairLine?"
    a: "FairLine is a model-vs-market pricing oracle for in-play soccer. It ingests real match state — score, clock, cards — from TxODDS' TxLINE feed, reprices the match continuously with a transparent in-play Poisson model, and publishes its own fair odds as a public feed of Ed25519-signed envelopes. It is a pricing oracle, not a quoting bot: it needs no venue to quote on, and any downstream system can verify its prices cryptographically without trusting an API."
  - q: "How does FairLine price a live soccer match?"
    a: "At any moment, FairLine models the goals left to be scored as independent Poisson variables, scaled by a time-decay profile (goals arrive faster as a match ages) and adjusted for red cards. A Dixon-Coles correction fixes the classic low-score underprediction. The model's pre-match intensities are fitted directly to the real de-margined market board, so at kickoff the model and the market agree by construction — every point of in-play divergence after that is genuine repricing, not a baked-in disagreement."
  - q: "What happened when Spain scored the winning goal against Argentina?"
    a: "Spain's goal landed 39 seconds into the second period of extra time. In FairLine's own captured feed data, TxLINE's live extra-time market went dark — an empty price envelope — right at that instant, and didn't reopen for about 60 seconds, consistent with the free World Cup tier's batch-delay cadence. When it reopened, the home win's implied probability had jumped from roughly 41% to roughly 94%. FairLine's model, by contrast, reprices directly off TxLINE's score and clock state rather than waiting on the market's own board to reopen."
  - q: "Can I verify FairLine's prices myself?"
    a: "Yes. Every published tick is a JSON envelope signed with Ed25519. Fetch the public key from /api/key, canonicalize the envelope by recursively sorting its keys and stripping the signature field, and verify offline — no API trust required. FairLine also hosts a POST /api/verify convenience endpoint that does this for you and returns a plain valid: true/false."
  - q: "Is FairLine a betting product?"
    a: "No. FairLine makes no real-money claims anywhere. Its live mode runs on TxLINE's free World Cup tier, which carries a 60-second batch delay — informative for understanding how a market reprices around events, not tradeable. Its replay mode runs entirely on a clearly labeled synthetic fixture for demo purposes."
entities:
  - name: "TxODDS"
    sameAs: "https://www.txodds.com"
  - name: "Superteam"
    sameAs: "https://superteam.fun"
  - name: "Solana"
    sameAs: "https://solana.com"
  - name: "PulsePlay"
    sameAs: "https://0xpulseplay.com"
---

We built FairLine for the Superteam Earn × TxODDS World Cup hackathon, and tonight it did the thing it was built to do: it priced the real 2026 World Cup Final, live, off TxODDS' TxLINE feed, while Spain and Argentina played it out to the second period of extra time.

**FairLine is a model-vs-market pricing oracle for in-play soccer** — it reprices a match continuously from real score and clock state, and publishes its own fair odds as a public feed of cryptographically signed data, right alongside the market's own consensus, so its "edge" against the market is something anyone can check tick by tick instead of a claim they have to trust.

It is deliberately positioned as a pricing oracle, not a quoting bot. It doesn't need a venue to quote on — a market maker, a bet screener, a settlement layer, or an AI agent can subscribe to the feed and verify every price cryptographically, offline, without ever trusting FairLine's API. FairLine is part of **PulsePlay**, our family of open sports-prediction tools, all built the same way: verifiable by design, not by claim.

## How it prices a match

The model is intentionally small and legible — about 200 lines, fully unit tested. At any in-play moment it treats the goals still to come as independent Poisson variables, scaled down by a time-decay curve (goals arrive faster as a match wears on, matching the well-documented second-half skew), corrected for the classic Dixon-Coles low-score underprediction, and adjusted for red cards (a short-handed team's remaining scoring intensity drops, its opponent's rises).

The part that matters most for honesty: the model's pre-match intensities are fitted directly against the real de-margined market board for that fixture, so at kickoff the model and the market start in near-total agreement — reproduced to within a few hundredths of a probability point. Everything that diverges after that is real in-play repricing, earned tick by tick, not a disagreement baked in from the whistle.

Every tick — 1X2 and totals, model probabilities next to the market's, plus the resulting edge in probability points and EV — goes out as an Ed25519-signed envelope over a public SSE feed. Anyone can fetch the public key and verify any envelope offline: recursively sort its keys, strip the signature field, check the signature. There's also a `POST /api/verify` convenience endpoint for a plain `valid: true/false`.

Two modes share one code path. The default is a clearly labeled, deterministic synthetic replay — same reducers, same model, always honestly flagged in a `dataSource` block on every envelope, so a demo works at any hour without server state. The other is live mode: the same engine pointed at TxODDS' real TxLINE mainnet feed, on the free World Cup tier's 60-second batch delay, pricing the actual final.

## Tonight, live: Spain 1–0 Argentina

The match finished Spain 1, Argentina 0 — the winner arriving 39 seconds into the second period of extra time. Argentina finished the match with a red card and four yellow cards; Spain picked up none of either. (The match also saw a couple of other goals waved off by VAR along the way, as elimination finals tend to produce.)

Pulling FairLine's own captured feed data from around the winning goal turns up a small, honest, and genuinely interesting artifact: TxLINE's own live extra-time market went dark the instant the goal landed — an empty price envelope, no quotes — and didn't come back for roughly sixty seconds. When it reopened, the home win's implied probability had jumped from about 41% to about 94%. That's the free-tier's documented batch delay showing up exactly where you'd expect it to: right around the highest-leverage moment of the match, the market takes about a minute to catch its breath and reprice.

FairLine's model doesn't have to wait for that reopen. Because every tick is a pure function of TxLINE's own score and clock state rather than a derivative of the market's own board, it reprices on its own poll cadence the moment the score changes — it doesn't sit blank until the consensus feed decides to speak again. That's the whole design thesis in one live data point: a pricing oracle that answers "what should this be worth right now" independently of whether the market you're comparing it to is currently willing to say.

We pulled the final envelope straight from the running feed and ran it through FairLine's own verifier before writing this: signature valid, final score 1–0, match state terminal. Not a screenshot, not a claim — a live signature check against the actual final result.

## Honest about the free tier

FairLine's docs are unusually candid about what building against a free-tier live sports feed under a hackathon deadline actually involves, and we think that candor is worth keeping in the write-up rather than polishing away:

- The odds snapshot endpoint returns nothing at all outside an explicit `asOf` time window — undocumented, and it cost a debugging cycle before the fix was obvious.
- The scores snapshot endpoint only carries a rolling window of the last ~35–40 events, which can silently drop real events — including goals — between polls. An earlier pass mistook the *history* endpoint for broken because a naive `.json()` parse failed on it (it's actually one-shot SSE text, not a JSON array); the fix was to parse it correctly and use it as the reliable source of current state, not just history. That mistake cost real correctness during the live final before it was caught.
- Devnet faucets for testing the free-tier on-chain activation were dry on finals day, so only the mainnet path was tested end to end.

None of that is unusual for integrating a real live-sports feed under deadline — it's just rarely written down. All 21 of the engine's unit tests pass, and the security posture is deliberately narrow: credentials live in environment variables only, the signing key never leaves the deployment, and every read endpoint is public by design because the whole point is an oracle nobody has to trust blindly.

## For judges, builders, and agents

The repo is public and MIT-licensed at [github.com/chaintail/fairline](https://github.com/chaintail/fairline), with the model math, the feed schema, the architecture, and the TxLINE integration notes all written up in `docs/`. FairLine also ships a thin stdio MCP server wrapping its three read endpoints (fair odds, market edge, signing key) as a Claude Code plugin, plus an `/llms.txt` index sized for an agent's context window — so a trading agent, a settlement layer, or another Claude session can pull verifiable fair odds without any of FairLine's own code running on their side.

Try it yourself:

```bash
curl "https://fairline-demo.vercel.app/api/state?mode=replay"
curl -N "https://fairline-demo.vercel.app/api/feed?mode=live"
curl "https://fairline-demo.vercel.app/api/key"
```

Every number in this post came from FairLine's own live feed or its own repo, fetched and checked the same night the final was played.

---

## FAQ

<div class="faq">

<div class="faq-item">
<div class="faq-q">What is FairLine?</div>
<div class="faq-a">FairLine is a model-vs-market pricing oracle for in-play soccer. It ingests real match state — score, clock, cards — from TxODDS' TxLINE feed, reprices the match continuously with a transparent in-play Poisson model, and publishes its own fair odds as a public feed of Ed25519-signed envelopes. It is a pricing oracle, not a quoting bot: it needs no venue to quote on, and any downstream system can verify its prices cryptographically without trusting an API.</div>
</div>

<div class="faq-item">
<div class="faq-q">How does FairLine price a live soccer match?</div>
<div class="faq-a">At any moment, FairLine models the goals left to be scored as independent Poisson variables, scaled by a time-decay profile (goals arrive faster as a match ages) and adjusted for red cards. A Dixon-Coles correction fixes the classic low-score underprediction. The model's pre-match intensities are fitted directly to the real de-margined market board, so at kickoff the model and the market agree by construction — every point of in-play divergence after that is genuine repricing, not a baked-in disagreement.</div>
</div>

<div class="faq-item">
<div class="faq-q">What happened when Spain scored the winning goal against Argentina?</div>
<div class="faq-a">Spain's goal landed 39 seconds into the second period of extra time. In FairLine's own captured feed data, TxLINE's live extra-time market went dark — an empty price envelope — right at that instant, and didn't reopen for about 60 seconds, consistent with the free World Cup tier's batch-delay cadence. When it reopened, the home win's implied probability had jumped from roughly 41% to roughly 94%. FairLine's model, by contrast, reprices directly off TxLINE's score and clock state rather than waiting on the market's own board to reopen.</div>
</div>

<div class="faq-item">
<div class="faq-q">Can I verify FairLine's prices myself?</div>
<div class="faq-a">Yes. Every published tick is a JSON envelope signed with Ed25519. Fetch the public key from /api/key, canonicalize the envelope by recursively sorting its keys and stripping the signature field, and verify offline — no API trust required. FairLine also hosts a POST /api/verify convenience endpoint that does this for you and returns a plain valid: true/false.</div>
</div>

<div class="faq-item">
<div class="faq-q">Is FairLine a betting product?</div>
<div class="faq-a">No. FairLine makes no real-money claims anywhere. Its live mode runs on TxLINE's free World Cup tier, which carries a 60-second batch delay — informative for understanding how a market reprices around events, not tradeable. Its replay mode runs entirely on a clearly labeled synthetic fixture for demo purposes.</div>
</div>

</div>
