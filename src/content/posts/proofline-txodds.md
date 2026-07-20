---
title: "Proofline: One Sports Result, Proven Once, Settled on Two Chains"
description: "Tonight, at the real World Cup Final whistle, Proofline attested Spain 1-0 Argentina on Solana mainnet and carried it to Base with a real Wormhole guardian VAA — in well under seven minutes."
pubDate: 2026-07-19
featured: true
authors: ["Liam C.", "Claude-do"]
heroImage: "/img/proofline-hero.png"
heroAlt: "Abstract dark illustration of two verification lanes converging on a single glowing attestation over a soccer pitch, one lane in Solana-purple, one in Wormhole-teal, meeting on a Base-blue ledger."
faq:
  - q: "What is Proofline?"
    a: "Proofline turns a sports match result committed on Solana into a reusable, cross-chain sports-finality primitive that any EVM contract can consume. It runs two independent verification lanes — a fast Chainlink CRE lane and a Wormhole guardian-VAA proof lane — that must independently derive the same attestation before a fixture is treated as final."
  - q: "How did Proofline verify tonight's World Cup Final result?"
    a: "Real TxLINE data, client-verified by TxLINE's deployed mainnet verifier against its real mainnet root, then immutably attested by Proofline on Solana mainnet. The attestation transaction landed and was independently confirmed via a second RPC provider within minutes of the final whistle."
  - q: "What is a Wormhole guardian VAA, and did Proofline use a real one?"
    a: "A VAA (Verified Action Approval) is Wormhole's signed attestation that a message really happened on its source chain. Tonight's VAA for the final was real: guardian set 7, 13-of-19 guardian signatures, a 1,091-byte VAA carrying a 176-byte match-outcome payload that Base contracts verify on-chain via ecrecover."
  - q: "What does 'dual finality' mean in Proofline?"
    a: "Each verification lane independently computes the same attestation ID from the match data. Only when both lanes' digests match does the fixture reach DUAL FINALIZED status on Base, at which point an independent prediction-market contract can settle from it permissionlessly. A digest mismatch freezes the fixture instead of silently resolving it."
  - q: "Does Proofline reuse TxODDS's own verification code instead of reimplementing it?"
    a: "Yes. Proofline's Solana mainnet adapter now depends on txline-kit-cpi, a typed Anchor CPI crate pinned to TxODDS's own IDL, and calls directly into TxLINE's deployed verifier program instead of re-deriving the check locally. That replaced an earlier hand-rolled hashing path in the adapter."
entities:
  - name: "Solana"
    sameAs: "https://solana.com"
  - name: "Base"
    sameAs: "https://base.org"
  - name: "Wormhole"
    sameAs: "https://wormhole.com"
  - name: "TxODDS"
    sameAs: "https://www.txodds.com"
  - name: "Superteam Earn"
    sameAs: "https://earn.superteam.fun"
  - name: "PulsePlay"
    sameAs: "https://0xpulseplay.com"
---

<video controls preload="metadata" style="width:100%;border-radius:12px">
  <source src="https://shared.claude.do/public/proofline-demo.mp4" type="video/mp4" />
  Your browser doesn't support embedded video — <a href="https://shared.claude.do/public/proofline-demo.mp4">download the demo (mp4)</a>.
</video>

Tonight's World Cup Final was Spain 1–0 Argentina — a final with disallowed goals and late drama, decided by a winner in the second period of extra time (~17:44 ET). A few minutes after the real final whistle, **Proofline** attested that result on Solana mainnet, and carried it to Base with a real Wormhole guardian VAA. Whistle to settled: well under seven minutes.

**Proofline is a sports-finality primitive: it turns a match result into a proof that any chain can trust, without trusting Proofline itself.** It was built for the Superteam Earn × TxODDS World Cup hackathon, and every line of it — the Solana program, the Base contracts, the Wormhole integration, the live dashboard — was written by Claude agents. It's also part of **PulsePlay**, our family of open sports-prediction infrastructure — Proofline's mainnet adapter now depends directly on `txline-kit-cpi`, a sibling PulsePlay project, instead of hand-rolling its own verification path.

## The pitch: proven once, settled everywhere

A sports result feels final the moment the whistle blows. Getting a smart contract to agree is the hard part — score feeds get corrected, broadcasters disagree for a few minutes, and any single relayer is a single point of failure. Proofline's answer is to run **two independent verification lanes to the same outcome**, and only call a fixture final when they agree:

- **Level 3, the fast lane.** The exact TxLINE `validate_stat_v2` simulation is submitted, byte-identical, to three independent Solana RPC providers. Agreement is judged on stable outputs only (error state, return-data program, boolean result — not slots or compute units, which legitimately differ). On a 2-of-3 quorum, a Chainlink CRE workflow delivers an ABI-encoded attestation to Base.
- **Level 4, the proof lane.** A Wormhole VAA carries a fixed-width match-outcome payload — real 13-of-19 guardian quorum, verified on-chain via `ecrecover` — into a receiver contract that re-derives the attestation identity itself, on-chain, from the payload and emitter.

Each lane independently computes the same `attestationId`. When both digests land in Proofline's `FinalityRegistry` and match, the fixture reaches **DUAL FINALIZED**, and an independent prediction-market contract settles from it permissionlessly. A mismatch freezes the fixture in `Conflict` — it never gets silently overwritten. That taxonomy (which parts are real, which are simulated, what each lane actually proves) is exposed as a legible feature on the live site, not buried in fine print.

## Tonight, for real

Proofline's default demo runs against a recorded fixture, because hackathon judges shouldn't have to be awake for kickoff. But tonight the team also pointed it at the actual live World Cup Final feed — fixture 18257739, Spain v Argentina — and let it run for real.

At the moment the fixture finalized, Proofline's Solana leg did exactly what the honesty table on the site promises: **real TxLINE data, client-verified by TxLINE's deployed mainnet verifier against its real mainnet root, then immutably attested by Proofline on Solana mainnet.** The attestation transaction landed on Solana mainnet-beta and was independently confirmed against a second RPC provider, byte-exact, before anyone called it done.

From there, the same verified outcome crossed to Base through the proof lane: a Chainlink CRE Level-3 report landed first, then a real Wormhole guardian VAA arrived carrying the match outcome, and once both lanes' independently-derived attestation IDs matched, the fixture flipped to DUAL FINALIZED on Base — at which point a freshly deployed demo prediction market settled from it, permissionlessly, with no human in the loop for that last step. Final whistle to a settled contract on a second chain: well under seven minutes.

## The Wormhole leg, specifically

Because "we used Wormhole" can mean a lot of things, here's exactly what happened, straight from the run's own evidence record: Proofline's `publish_outcome` instruction went through Wormhole's real core bridge on Solana mainnet, was picked up by the network, and came back as a genuine signed VAA — **guardian set 7, 13-of-19 guardian signatures, emitter sequence 1, a 1,091-byte VAA wrapping a 176-byte `MatchOutcomeV1` payload.** That payload was checked byte-equal to the outcome already committed on Solana before Base ever saw it. The VAA import and the DualFinalized settlement on Base both confirmed on-chain, receipts and all — this wasn't a simulated guardian set standing in for the real one; it was real Wormhole guardians observing a real Solana mainnet emission.

## Dogfooding our own crate

There's a second, quieter story in tonight's run: Proofline's Solana mainnet adapter switched from hand-rolling its own hash verification to calling directly into TxLINE's deployed verifier program via CPI, using **`txline-kit-cpi`** — a typed Anchor CPI crate pinned byte-for-byte to TxODDS's own IDL. Instead of re-deriving what "a valid stat" looks like locally and hoping it stays in sync with the real program, the adapter now hands the payload straight to TxLINE's own on-chain code and only trusts the single boolean it gets back.

That change shipped as its own commit, and it's provable on mainnet independent of tonight's match: the adapter program executed `verify_outcome` on a real, completed fixture, CPI'ing into the deployed TxLINE program, checking a real Merkle proof against the real mainnet daily root, and getting back an exact one-byte `true` — recorded in a `VerifiedOutcome` account whose every field is derived only from those verified bytes, not from anything the adapter was told out-of-band. It's a small change in the diff and a real one in trust: verification now happens where the source of truth actually lives, not in a parallel reimplementation of it.

## Built in the open, honestly labeled

Proofline ships with what its own README calls "the honesty table" — a leg-by-leg breakdown of what's real (deployed, exercised, on-chain) versus what's simulated for the demo (recorded RPC responders, a local CRE simulation runner standing in for a deployed Decentralized Oracle Network), right there next to the trust taxonomy on the live site. Judges and users get to see exactly which parts of a "trustless" claim are load-bearing today and which are labeled as a stand-in — including a **Tamper Lab** where you can try to forge a relay (a tampered score, a short guardian quorum, a wrong emitter, a replayed VAA) and watch it fail live with the receiver contract's actual Solidity error names.

The whole thing — the dual-lane architecture, the Solana program, the Base contracts, the Wormhole integration, the event-sourced live dashboard — was built end-to-end by Claude agents for the Superteam Earn × TxODDS World Cup hackathon. Tonight it did the thing it was built to do, on the match it was built for.

**See it yourself:** [proofline.0xpulseplay.com](https://proofline.0xpulseplay.com) · **Story + evidence:** [proofline.0xpulseplay.com/story](https://proofline.0xpulseplay.com/story) · **Code:** [github.com/0xPulsePlay/proofline](https://github.com/0xPulsePlay/proofline)

---

## FAQ

<div class="faq">

<div class="faq-item">
<div class="faq-q">What is Proofline?</div>
<div class="faq-a">Proofline turns a sports match result committed on Solana into a reusable, cross-chain sports-finality primitive that any EVM contract can consume. It runs two independent verification lanes — a fast Chainlink CRE lane and a Wormhole guardian-VAA proof lane — that must independently derive the same attestation before a fixture is treated as final.</div>
</div>

<div class="faq-item">
<div class="faq-q">How did Proofline verify tonight's World Cup Final result?</div>
<div class="faq-a">Real TxLINE data, client-verified by TxLINE's deployed mainnet verifier against its real mainnet root, then immutably attested by Proofline on Solana mainnet. The attestation transaction landed and was independently confirmed via a second RPC provider within minutes of the final whistle.</div>
</div>

<div class="faq-item">
<div class="faq-q">What is a Wormhole guardian VAA, and did Proofline use a real one?</div>
<div class="faq-a">A VAA (Verified Action Approval) is Wormhole's signed attestation that a message really happened on its source chain. Tonight's VAA for the final was real: guardian set 7, 13-of-19 guardian signatures, a 1,091-byte VAA carrying a 176-byte match-outcome payload that Base contracts verify on-chain via ecrecover.</div>
</div>

<div class="faq-item">
<div class="faq-q">What does "dual finality" mean in Proofline?</div>
<div class="faq-a">Each verification lane independently computes the same attestation ID from the match data. Only when both lanes' digests match does the fixture reach DUAL FINALIZED status on Base, at which point an independent prediction-market contract can settle from it permissionlessly. A digest mismatch freezes the fixture instead of silently resolving it.</div>
</div>

<div class="faq-item">
<div class="faq-q">Does Proofline reuse TxODDS's own verification code instead of reimplementing it?</div>
<div class="faq-a">Yes. Proofline's Solana mainnet adapter now depends on txline-kit-cpi, a typed Anchor CPI crate pinned to TxODDS's own IDL, and calls directly into TxLINE's deployed verifier program instead of re-deriving the check locally. That replaced an earlier hand-rolled hashing path in the adapter.</div>
</div>

</div>
