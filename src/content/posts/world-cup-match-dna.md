---
title: "Match DNA: Turning a Live World Cup Final Into a Verifiable Memory"
description: "Built for the Superteam Earn × TxODDS World Cup Hackathon, Match DNA compiles live TxLINE odds and match events into a canonical, provable \"genome\" of a football match — and we ran it live, honestly, through the real Spain vs Argentina final."
pubDate: 2026-07-19
featured: true
authors: ["Liam C.", "Claude-do"]
heroImage: "/img/matchdna-hero.png"
heroAlt: "Concentric glowing rings in cyan, amber, mint, and violet forming a witnessed genome around a central waveform, on a near-black background"
faq:
  - q: "What is Match DNA?"
    a: "Match DNA is a hackathon submission built for the Superteam Earn × TxODDS World Cup Hackathon's Consumer & Fan Experiences track. It converts a live sports data feed — TxLINE consensus odds and match events from TxODDS — into a canonical, cryptographically verifiable \"genome\" of a football match: a chain of five-minute interval rings that only counts as proven once an on-chain proof from Solana actually seals it."
  - q: "What do the liquid, amber, and crystal ring states mean?"
    a: "They're Match DNA's honesty model, not decoration. Liquid is what one browser has observed so far — it can be incomplete or reordered. Amber means an interval has closed and the backend has reconciled and deduplicated it into canonical geometry, but the on-chain proof hasn't arrived yet. Crystal means the required TxLINE proof has actually verified against Solana. A fourth state, quarantined, holds intervals whose data conflicts with itself rather than silently guessing. Nothing is shown as sealed before it's actually sealed."
  - q: "Did Match DNA really capture the real World Cup final live?"
    a: "Yes — the live capture ran through the project's own shipped TxLineClient against verified TxLINE mainnet credentials for the actual Spain vs Argentina final, not a replay. Spain won 1-0 in the second period of extra time. One honest gap from that run: for part of the match, one of the mirror URLs stayed pinned to a frozen pre-kickoff snapshot because of an alias issue rather than showing live progress; the team caught and fixed it and is naming it here rather than hiding it."
  - q: "What isn't proven yet — what are Match DNA's honest limitations?"
    a: "The default offline showcase uses a synthetic, explicitly-labeled fixture with local SHA-256 Merkle vectors that verify against themselves but are never claimed to exist in TxLINE's real Solana accounts. On both the live final and the 103-match historic archive, rings stay amber rather than crystal, because the project's Anchor commit/reveal program has been written and unit-tested but never compiled or deployed to mainnet. Match DNA states this plainly rather than showing a fake \"verified\" state."
  - q: "What's in the Match DNA repo?"
    a: "A React replay studio, a reusable TypeScript SDK for deterministic journals and five-minute compilation, typed TxLINE normalization and proof helpers, a credential-safe Fastify gateway, a CLI that generates and independently verifies the full artifact bundle, deterministic SVG/WAV renderers, and an Anchor program for commit/reveal and proof-gated sealing via a raw CPI into TxLINE's official on-chain program. At release validation: 16/16 TypeScript build tasks, 39/39 tests, and 10/10 production build targets passed."
entities:
  - name: "TxODDS"
    sameAs: "https://txodds.net"
  - name: "Solana"
    sameAs: "https://solana.com"
  - name: "Superteam Earn"
    sameAs: "https://earn.superteam.fun"
  - name: "PulsePlay"
    sameAs: "https://0xpulseplay.com"
---

<video controls preload="metadata" style="width:100%;border-radius:12px">
  <source src="https://shared.claude.do/public/match-dna-live-final.mp4" type="video/mp4" />
  Your browser doesn't support embedded video — <a href="https://shared.claude.do/public/match-dna-live-final.mp4">download the demo (mp4)</a>.
</video>

Full demo: [shared.claude.do/public/match-dna-demo-player](https://shared.claude.do/public/match-dna-demo-player)

<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin:1.75rem 0;padding:1.15rem 1.4rem;border:1px solid #e3d9c2;border-left:5px solid #74ddff;border-radius:12px;background:#fbf7ee;">
  <span style="font-size:1.08rem;font-weight:600;line-height:1.4;">⚽ Match DNA is live — open the replay studio and the story page yourself.</span>
  <a href="https://match-dna.vercel.app" style="flex:0 0 auto;display:inline-block;padding:0.65rem 1.25rem;border-radius:8px;background:#0d1526;color:#fff;font-weight:700;text-decoration:none;white-space:nowrap;">Open the live studio&nbsp;→</a>
</div>

Spain beat Argentina 1–0 in tonight's World Cup Final, the winner arriving in the second period of extra time after two other goals came and went under VAR review before it. Ninety-plus minutes of odds swings, false starts, and one goal that actually counted — the exact kind of messy, real-time chaos that **Match DNA** was built to turn into something calm, structured, and checkable.

**Match DNA is a hackathon submission that converts a live sports data feed into a deterministic, cryptographically verifiable record of a football match, anchored to on-chain proofs on Solana.** It was built for the **Superteam Earn × TxODDS World Cup Hackathon**, in the Consumer & Fan Experiences track, by Liam and an AI agent working as his engineering partner — including live, during the match itself. Match DNA is part of **PulsePlay**, our family of open sports-prediction tools built for this hackathon.

## Every match already has a shape

The core idea, straight from the project's own docs: TxLINE consensus odds and live match events get compiled, minute by minute, into a canonical **genome** of the game — a chain of five-minute interval "rings" that move through a strict material lifecycle.

- **Liquid** — a low-latency witness rendering of what one browser has seen so far. It can differ slightly between tabs after reconnects or out-of-order delivery.
- **Amber** — the interval has closed and the backend has reconciled, deduplicated, and compiled one canonical ring. The geometry is now immutable, even if the proof hasn't arrived yet.
- **Crystal** — the required TxLINE proof has verified against the correct Solana root account. The ring keeps the exact same geometry and gains a proof fingerprint.
- **Quarantined** — conflicting source identities or a failed proof check hold a ring back rather than silently resolving it.

Arrival order never defines canonical truth, the browser never authors canonical state, and amber geometry cannot change once a root arrives — those are stated design principles, not just marketing copy. The pipeline behind it runs in five stages: ingest the TxLINE odds and event stream, witness it as liquid five-minute rings, compile closed intervals into amber, crystallize the ones with a verified proof (or quarantine the ones that don't reconcile), then render and export — canvas geometry, an SVG snapshot, a WAV sonification, and an optional Solana anchor.

## What actually ran during tonight's final

This wasn't a recording played back after the fact. The live capture ran through the project's own shipped `TxLineClient`, authenticated against verified TxLINE mainnet credentials, against the real Spain vs Argentina fixture — the team confirmed auth, a live odds snapshot, a live score snapshot, and a real Server-Sent-Events message on that exact connection before kickoff. By the last check taken well before full time, the live capture had already processed 3,005 of 3,735 consensus odds ticks and 818 of 831 score events for the match — a running counter mid-match, not a final tally, since capture kept going as the match ran deep into extra time.

<img src="/img/matchdna-live-studio.png" alt="The Match DNA studio witnessing Spain vs Argentina before kickoff, showing a 0-0 witness stream, three-way probability bars at 33/33/33, and a live signals panel" style="width:100%;border-radius:12px;display:block;margin:1.5rem 0;" />

*The live studio pre-kickoff — witness stream at 0′, three-way odds sitting at 33/33/33, zero rings crystallized because zero should be at that point in the match.*

Honest limitation, named plainly: one field-mapping pass is still short of a fully live-mapped feed — some live TxLINE field variants aren't yet recognized by the normalizers and fall back to defaults rather than reading the true value. And for part of the match, one of the mirror URLs (a secondary, non-primary domain pointing at the same deploy) stayed pinned to a frozen pre-kickoff snapshot because of an alias-caching issue on our end, rather than showing live progress — anyone who happened to check that specific mirror during that window saw stale data, not the real thing. We caught it, fixed the alias, and are naming it here because surfacing exactly this kind of gap, even about our own infrastructure, is the whole point of the project.

The live run also taught the team an on-brand lesson about its own tooling: the underlying feed re-announces a single goal multiple times as it moves from a provisional broadcast, through VAR review, to a confirmed detail broadcast — each one a distinct event at the identical match clock. A naive counter that increments on every goal-tagged broadcast will count a goal that happened once as if it happened two or three times. The fix was to trust only the feed's own authoritative running score total, never the announcement events themselves — the same liquid-versus-canonical distinction the whole product is built around, showing up as a real bug in the team's own capture script before it showed up as a concept on a slide.

## 103 matches of tournament history, one pipeline

Alongside the live final, the same witness pipeline ran back across the tournament: 103 of 105 attempted historic World Cup fixtures were successfully recorded and rendered, spanning June 11 to July 18, 2026. The two exclusions weren't render failures — an automatic quality gate correctly dropped two fixtures with genuinely empty captures (zero odds ticks, zero score events, no kickoff or goal action).

A few of the recorded results along the way: France 0–2 Spain in the semifinal (July 14), England 1–2 Argentina in the other semifinal (July 15), and a 28-goal third-place playoff, France 4–6 England after extra time (July 18) — every one of them rendered through the exact same rings-and-proofs pipeline as tonight's final, not a special-cased highlight reel.

## What's proven, what isn't — stated plainly

Numbers from the project's own release validation, not memory:

| Gate | Result |
|---|---:|
| TypeScript / Turbo tasks | 16/16 passed |
| Tests | 39/39 passed |
| Production build targets | 10/10 passed |
| Artifact verifier — ring links | 20 |
| Artifact verifier — proof paths | 40 |

And the honesty that matters more than any of those numbers: the default offline showcase is an **offline proof replay of a synthetic fixture**. Its SHA-256 Merkle paths verify locally against themselves, but the project does not claim those local roots exist in the referenced TxLINE accounts on Solana — it says so directly, everywhere the state shows up in the interface. On both tonight's live final and the full historic archive, rings stay **amber** — witnessed and canonical, never faked past that — because the project's Anchor program, which supports commit/reveal and a proof-gated seal via a raw cross-program invocation into TxLINE's own on-chain program, has been written and unit-tested but never compiled or deployed to mainnet.

The project's own trust statement puts it better than we could: *"A TxLINE Merkle proof establishes that a specific record was included in the dataset committed by TxODDS to Solana. It does not independently prove what physically happened on the pitch, and TxODDS remains the originating oracle."*

## The match, heard

Every canonical ring also has a sound. A deterministic PCM renderer turns the sealed geometry of the match into a WAV file — root note, mode, and a heartbeat pulse all derived from the match's own hash-seeded state — while a separate, much quieter live tone plays during the match itself as rings canonicalize in real time. The project's own line for it:

> "The live performance is what you heard. The canonical score is what the match remembers."

## Try it yourself

- **Live MVP:** [match-dna.vercel.app](https://match-dna.vercel.app) — interactive replay studio, signal inspector, proof microscope.
- **The story page:** [matchdna.0xpulseplay.com/story](https://matchdna.0xpulseplay.com/story) — the pipeline, the live final, the historic archive, and the honesty section, in one page.
- **Historic archive:** [match-dna-history.vercel.app](https://match-dna-history.vercel.app) — all 103 recorded fixtures.
- **Code:** [github.com/0xPulsePlay/match-dna](https://github.com/0xPulsePlay/match-dna) — source, the validation report, and the docs behind every claim in this post.

Built on **Solana**, on live data from **TxODDS**, for the **Superteam Earn × TxODDS World Cup Hackathon**. ⚽

---

## FAQ

<div class="faq">

<div class="faq-item">
<div class="faq-q">What is Match DNA?</div>
<div class="faq-a">Match DNA is a hackathon submission built for the Superteam Earn × TxODDS World Cup Hackathon's Consumer &amp; Fan Experiences track. It converts a live sports data feed — TxLINE consensus odds and match events from TxODDS — into a canonical, cryptographically verifiable "genome" of a football match: a chain of five-minute interval rings that only counts as proven once an on-chain proof from Solana actually seals it.</div>
</div>

<div class="faq-item">
<div class="faq-q">What do the liquid, amber, and crystal ring states mean?</div>
<div class="faq-a">They're Match DNA's honesty model, not decoration. Liquid is what one browser has observed so far — it can be incomplete or reordered. Amber means an interval has closed and the backend has reconciled and deduplicated it into canonical geometry, but the on-chain proof hasn't arrived yet. Crystal means the required TxLINE proof has actually verified against Solana. A fourth state, quarantined, holds intervals whose data conflicts with itself rather than silently guessing. Nothing is shown as sealed before it's actually sealed.</div>
</div>

<div class="faq-item">
<div class="faq-q">Did Match DNA really capture the real World Cup final live?</div>
<div class="faq-a">Yes — the live capture ran through the project's own shipped TxLineClient against verified TxLINE mainnet credentials for the actual Spain vs Argentina final, not a replay. Spain won 1-0 in the second period of extra time. One honest gap from that run: for part of the match, one of the mirror URLs stayed pinned to a frozen pre-kickoff snapshot because of an alias issue rather than showing live progress; the team caught and fixed it and is naming it here rather than hiding it.</div>
</div>

<div class="faq-item">
<div class="faq-q">What isn't proven yet — what are Match DNA's honest limitations?</div>
<div class="faq-a">The default offline showcase uses a synthetic, explicitly-labeled fixture with local SHA-256 Merkle vectors that verify against themselves but are never claimed to exist in TxLINE's real Solana accounts. On both the live final and the 103-match historic archive, rings stay amber rather than crystal, because the project's Anchor commit/reveal program has been written and unit-tested but never compiled or deployed to mainnet. Match DNA states this plainly rather than showing a fake "verified" state.</div>
</div>

<div class="faq-item">
<div class="faq-q">What's in the Match DNA repo?</div>
<div class="faq-a">A React replay studio, a reusable TypeScript SDK for deterministic journals and five-minute compilation, typed TxLINE normalization and proof helpers, a credential-safe Fastify gateway, a CLI that generates and independently verifies the full artifact bundle, deterministic SVG/WAV renderers, and an Anchor program for commit/reveal and proof-gated sealing via a raw CPI into TxLINE's official on-chain program. At release validation: 16/16 TypeScript build tasks, 39/39 tests, and 10/10 production build targets passed.</div>
</div>

</div>
