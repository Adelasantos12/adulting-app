# adultos.entraining — Visual Bible
## Architecture, page budget, and build order

---

## A.1 Scope reality

A 180–300 page bible cannot be written in one pass, and a version that could would be filler. The brief's own priority — separate solid evidence from repeated folklore — is the expensive part, because it requires retrieval and adjudication rather than generation.

The realistic shape:

| | |
|---|---|
| Total target | 240 pages across seven volumes plus Volume 0 |
| Volume 0 (done) | 16 pages |
| Per-volume build | 1 working session each, 25–45 pages |
| Sessions remaining | 7, plus one consolidation pass |

Volume 0 is done and it is the load-bearing one. Every subsequent volume is an application of it.

## A.2 Which volumes are evidence-led and which are craft

Being clear about this now prevents the bible from developing a uniform tone of false authority.

| Volume | Character | Grade profile |
|---|---|---|
| I — Philosophy | Positioning. Partly evidence-anchored (calm, load), mostly brand decision | Mixed; must not borrow authority from IV |
| II — Visual identity | Craft, constrained by evidence | Constraints A/B, choices C/craft |
| III — Motion Bible | **Almost entirely craft** | M1–M3 are A/B. Everything else is C or craft. Say so on the volume's first page |
| IV — Neuroinclusive design system | **The evidence volume** | A/B/C/D throughout, D items shipped as settings |
| V — UX | Standards plus craft plus the strongest behavioural evidence in the project | G1–G5 govern gamification |
| VI — AI Prompt Bible | Pure craft and tooling. No evidence claims available | Craft. Its job is reproducibility, not rightness |
| VII — Marketing | Craft, with a live ethics problem | See A.4 |

## A.3 Volume contents

### Volume I — Philosophy (28 pp)

1. Mission, and the one sentence the product is (2)
2. Six principles, each with its grade and its failure mode (6)
3. The psychology of calm: what is supported, what is aesthetic (4) — *leans on K5, K6, N3, N4; must not overclaim*
4. Cognitive load, operationalised into countable quantities (5) — *K1–K7. Converts "reduce load" into decisions per screen, items held across screens, new terms introduced*
5. What "being an adult" means for this brand (4) — pure positioning, and the volume should admit it
6. Emotional tone, and the register boundary between reassurance and instruction (5)
7. Anti-principles: what the brand will not do even when it converts (2)

### Volume II — Visual identity (42 pp)

1. Brand, logo, lockups, clear space, minimum sizes (6)
2. Mascot anatomy: construction geometry, proportions, turnaround, scale rules (8)
3. Expressions: the closed set, fixed meanings, and the cover-the-face rule (5)
4. Emotion range and its ceiling — what the mascot never feels on screen (3)
5. Pose library, and how a limbless body performs literal actions (5)
6. Colour: the six brand pastels, their measured contrast, the derived accessible accent `#4F7F4A`, light and dark tokens (6) — *C1–C8*
7. Typography: Nunito, scale, spacing, the OpenDyslexic decision and its reasoning (4) — *T1–T7*
8. Iconography: literal-first, always labelled, the prohibited symbol list (3)
9. Illustration: the accessible-illustrations skill as the production standard (2)

### Volume III — Motion Bible (35 pp)

Opens with a page stating that most of this volume is grade C craft.

1. Breathing: idle loop, amplitude, period, and why it never stops (3)
2. Walking: a body with no legs, weight, and settle (4)
3. Celebrating: the ceiling on celebration, and why confetti is banned (3)
4. Thinking and waiting: honest progress, no fake activity (3)
5. Timing and easing tables (4) — *M4, craft*
6. Permitted movements (3)
7. **Prohibited movements** (4) — *M1 absolute: no flashing above 3Hz. M2/M3: no parallax, no large-field zoom, no autoplay*
8. Reduced-motion variants: every animation, paired (4) — *M3, B, mandatory*
9. Storytelling, rhythm, cinematography (4) — craft
10. Sound and music, including silence as the default state (3)

### Volume IV — Neuroinclusive design system (45 pp)

The volume where Volume 0 does its work. Structured by *need*, not by diagnosis, because N4 says sensitivities are transdiagnostic and per-diagnosis modes are the wrong architecture.

1. Architecture: one calm default plus controls; why there are no diagnosis modes (4)
2. Cognitive load (5) — *K1–K7*
3. Attention and executive function (5) — *N6; most sources here are ⚠, and the chapter says so*
4. Literal comprehension and ambiguity (4) — *N1, N2*
5. Reading and text (5) — *T1–T7; the dyslexia-font decision documented in full*
6. Anxiety and pressure (4) — *G1–G5*
7. Fatigue and variable capacity (3)
8. Migraine, photosensitivity, visual stress (4) — *M1, N3; the only chapter with absolute prohibitions*
9. Colour vision (3) — *C4, C5*
10. Low vision (3) — *C1–C3*
11. Motor accessibility: targets, timing, no required precision (3)
12. Screen readers and semantics (4) — *S1*
13. Language: plain Spanish, and why readability indices transfer badly (3) — *S3*

### Volume V — UX (35 pp)

1. Component inventory with accessibility contracts (6)
2. Dashboard: what is shown by default and what is one tap away (4)
3. Navigation: flat, labelled, no hidden gestures (4)
4. Reminders: frequency, tone, and the right to silence (4)
5. **Gamification: what to avoid** (6) — *G1–G5. The consistency-rate model replacing streaks. No zeroed counters, ever*
6. Microcopy in Spanish, with the register boundary from Volume I (5)
7. Empty states (2)
8. Errors: no blame, always a next action (2)
9. Confirmations and reversibility (2)

### Volume VI — AI Prompt Bible (30 pp)

Its purpose is **reproducibility**, not aesthetic authority. Character consistency is a tooling problem.

1. Master image prompt, with the locked block and the variable block (4)
2. Character consistency: reference images, seeds, and the limits of each (4)
3. Master video prompt (3)
4. Runway: what it holds and what it drops (3)
5. Veo (3)
6. Kling (3)
7. Midjourney and Sora, with a note on which are available (3)
8. Per-channel derivatives: Instagram, TikTok, YouTube (4)
9. **Verification protocol** (3) — every generated asset checked against Volume II tokens, because generators do not hold hex values or spelled labels. This chapter is why the SVG pipeline exists alongside the prompts

### Volume VII — Marketing (25 pp)

1. Funnel (4)
2. Storytelling and the brand's narrative spine (4)
3. Campaigns and calendar (4)
4. Shorts, reels, and CTA (5)
5. **Applied behavioural psychology, and its limits here** (8) — see below

## A.4 One structural objection, raised once

Volume VII asks for behavioural psychology applied ethically. The tension is sharper for this product than for most, and the bible should name it rather than smooth it.

The product's stated audience is adults who find everyday administration hard. The persuasion techniques that populate growth marketing — scarcity, streak pressure, manufactured urgency, loss-framed notifications — work by exploiting exactly the mechanisms that make that audience's life difficult. Grade A evidence (G1, G2) already says these techniques will damage the intrinsic motivation the product depends on. So the ethical constraint and the effectiveness constraint point the same way, which is unusual and worth using: Volume VII can be written as *what works because it is honest*, rather than as a list of permitted manipulations.

Concretely, the volume should carry a prohibited-technique list with the same force as Volume III's prohibited movements.

## A.5 A second objection, also raised once

A 240-page document is a studio artefact. Pixar bibles exist because hundreds of artists need a shared reference and cannot ask the director. For a small team, the functional equivalents are a design token file, a component library, a 20-page core document, and a prompt pack — all of which get used, whereas a 240-page PDF gets skimmed once.

The bible is still worth building if its purpose is *external*: investor and partner legibility, licensing, onboarding contractors, or a public accessibility commitment. If the purpose is internal consistency, the same content ships better as tokens plus a short core.

This is a decision about audience, not about quality, and it changes what gets built next.

## A.6 Build order

Not the numbered order. Dependencies first.

| Session | Volume | Why here |
|---|---|---|
| 1 | **IV — Neuroinclusive design system** | Everything else cites it. Building II before IV means rewriting II |
| 2 | **II — Visual identity** | Tokens and anatomy unblock III, VI, and V |
| 3 | **V — UX** | Needs II's tokens and IV's constraints |
| 4 | **III — Motion Bible** | Needs the anatomy from II |
| 5 | **VI — AI Prompt Bible** | Needs II and III to have something to reproduce |
| 6 | **I — Philosophy** | Written last, honestly. A philosophy volume written first describes intentions; written last it describes what the system actually does |
| 7 | **VII — Marketing** | Needs the whole product to exist |
| 8 | Consolidation | Cross-references, grade audit, contradiction sweep |

## A.7 Language

Volume 0 and this document are in British English, per standing preference. Volumes V and VII contain Spanish microcopy and brand voice, which cannot be written in English without becoming a translation exercise; those two are drafted in Spanish with English structural headings. Volumes II, III, IV, and VI stay in English.

## A.8 Standing rules for every volume

1. Every rule carries a grade, a citation, and an "if challenged" line.
2. No grade D item is a hard default. It is a setting.
3. No grade E item appears except in a prohibition list, named.
4. Where the honest answer is ⚠, write ⚠.
5. No output is described as validated. The product has not been tested with its users yet, and S4 makes that the gate that matters most.
