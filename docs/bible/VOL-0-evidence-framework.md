# adultos.entraining — Visual Bible
## Volume 0: Evidence Framework

*The spine of the whole bible. Every rule in Volumes I to VII carries a grade from this document. A rule without a grade is not a rule yet.*

---

## 0.1 Why this volume exists

The brief asked to distinguish solid evidence from advice that circulates widely and rests on little. That distinction cannot be made once, in an introduction, and then forgotten. It has to be attached to each individual rule, because a bible is read in fragments: someone opens it to settle an argument about a button, and whatever that page says becomes the decision.

So the grade travels with the rule. `Grade A` and `Grade D` produce different obligations, and the difference is operational rather than rhetorical.

## 0.2 The grading scale

| Grade | Meaning | What it obliges |
|---|---|---|
| **A** | **Robust evidence.** Replicated experimental findings, meta-analysis, or an established physiological mechanism. | Non-negotiable. Overriding it requires new evidence, not a design opinion. |
| **B** | **Binding standard.** Codified in a standard with legal, contractual, or platform force, whatever the quality of the underlying evidence. | Mandatory for compliance reasons. Never state it as *proven* when it is only *required*. |
| **C** | **Practice consensus.** Independent practitioner sources converge; no strong experimental base, no contrary evidence either. | Default. Overridable with a written reason. |
| **D** | **Common preference, not universal.** Real for a subset of people, not generalisable to all. | **Must be a user setting. Never a hard default.** This is the grade that most often gets mistaken for A. |
| **E** | **Refuted or unsupported.** Popular and wrong, or popular and empty. | Prohibited. Named explicitly so it does not creep back. |
| **⚠** | **Unsourced conjecture.** Reasoning from mechanism with no study behind it, including mine. | Usable as a hypothesis. Must be labelled. Must not be presented to anyone as a finding. |

Two conversion rules that make the scale bite:

1. **A grade D claim can never become a product default.** If the evidence says "helps some people", the design answer is a control, not a decision. This single rule prevents most of the harm that "neuroinclusive design" advice causes when applied uniformly.
2. **A grade B claim must be labelled as compliance, not as science.** WCAG's 4.5:1 threshold is required. It is not thereby the perceptually correct number, and the standards body itself is working on a replacement.

## 0.3 What the named sources actually are

The brief listed seven bodies of guidance. They are not the same kind of object, and treating them as interchangeable is the first error to avoid.

| Source | What it is | Grade it can confer |
|---|---|---|
| **WCAG 2.2 (W3C)** | Normative technical standard. Referenced by EN 301 549, the European Accessibility Act, and litigation in several jurisdictions. | **B**. Some individual criteria also have **A** evidence behind them; most do not, and that is fine for a standard. |
| **W3C COGA, *Making Content Usable*** | A **Working Group Note**, explicitly *not required for WCAG conformance*. Expert task-force consensus, built from user needs and personas rather than trials. | **C** at best. It is the single most useful document in the list for this product, and it is not a standard. Do not cite it as one. |
| **Apple Human Interface Guidelines (Accessibility)** | Platform convention plus a set of OS-level APIs (`prefers-reduced-motion`, Dynamic Type, VoiceOver contracts). | **B** for the API contracts, because the platform enforces them. **C** for the aesthetic advice. Almost no published evidence accompanies either. |
| **Google Material Design (Accessibility)** | Same shape as Apple: enforceable API surface wrapped in unevidenced style guidance. | **B** for API, **C** for style. |
| **Nielsen Norman Group** | Practitioner research organisation. Quality varies sharply by article: some report their own studies, many synthesise. NN/g is also one of the better debunkers of UX folklore. | **C** by default. **A** only where the specific article reports or cites a study, which must be checked individually. |
| **Cambridge Inclusive Design Toolkit** | A *method*, with a capability-loss dataset behind the exclusion calculator. Not a set of visual rules. | **C** for method. The exclusion data is **A** as epidemiology. |
| **Microsoft Inclusive Design** | A *stance* ("solve for one, extend to many") and a process. Contains essentially no empirical claims. | **C** for method. Confers no grade on any visual decision. Do not cite it to justify a colour. |

The pattern worth internalising: **the sources with the most authority make the fewest specific visual claims, and the sources making the most specific visual claims have the least authority.** Anything in this bible that specifies a hex value, a duration, or a curve is a craft decision constrained by evidence, not derived from it, and it should say so.

---

## 0.4 The ledger

### Colour and contrast

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| C1 | Insufficient luminance contrast impairs legibility | **A** | Large psychophysics literature | Contrast is measured, never eyeballed |
| C2 | The threshold is 4.5:1 for normal text, 3:1 for large text and graphical objects | **B** | WCAG 2.2 SC 1.4.3, 1.4.11 | Hard gate in QA. Label as compliance |
| C3 | The sRGB contrast-ratio formula models perception poorly, especially for dark mode and thin weights | **A** | Known limitation; APCA developed as replacement for WCAG 3 | Pass 1.4.3, then check by eye in both modes. Never treat 4.51:1 as safe and 4.49:1 as unsafe |
| C4 | Around 8% of men and 0.5% of women of northern European descent have a red-green colour vision deficiency | **A** | Stable epidemiology | Colour never encodes alone. Greyscale test in QA |
| C5 | Red and green adjacent, or any pair at similar luminance, is the worst case | **A** | Follows from C4 plus luminance | Banned. `#A7D7A3` vs `#FFB7A3` at 1.03:1 is exactly this failure |
| C6 | Specific colours reliably produce specific emotions (blue calms, green means growth) | **E** | Effects are small, culturally variable, context-dependent, poorly replicated | The brand's green is a **brand** decision. Never justify it as therapeutic |
| C7 | Pure white backgrounds cause discomfort for some readers; cream or pastel is preferable | **D** | BDA style guide; individual preference explicitly acknowledged in the guidance itself | Cream is a defensible **default aesthetic**. It is **not** an accessibility feature, and background must be user-adjustable |
| C8 | Coloured overlays and precision-tinted lenses treat reading difficulty | **E** | Suttle et al. 2018 overview of systematic reviews: three of four found insufficient evidence. AAP, AAO and RANZCO position statements against. Benefits attributed largely to placebo | Never claim a therapeutic effect for any colour choice. This is the clearest E in the ledger and it sits uncomfortably close to C7 |

**Note on C7 versus C8.** These are frequently conflated, including by people who should know better. C8 concerns a *clinical* claim about treating reading disability. C7 concerns *screen glare* at maximum luminance, which is a different mechanism and a much weaker claim. The honest position: cream is a taste that some people prefer and nobody is harmed by, offered as a setting. Anything stronger than that is not supportable.

### Typography

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| T1 | Dyslexia-specific fonts (OpenDyslexic, Dyslexie) improve reading | **E** | Wery & Diliberto 2017: no improvement, and no participant preferred it. Kuster et al. 2018, n=170 + n=147: Dyslexie neither helps nor hinders; Arial preferred. Rello & Baeza-Yates 2013: OpenDyslexic below Verdana and Helvetica | **Do not ship one.** Offering it signals care and delivers nothing. If users request it, provide it as a preference and do not market it |
| T2 | Increased letter spacing improves reading in dyslexic readers | **A** | Zorzi et al. 2012, PNAS; replicated | Increased tracking is a real intervention. Ship it as a default and as a control |
| T3 | Larger type improves reading rate for dyslexic readers more than for typical readers | **A** | O'Brien, Mansfield & Legge | Generous base size, and honour Dynamic Type / system font scaling |
| T4 | Sans-serif is more legible than serif on screen | **C** | Practitioner consensus; experimental evidence is weak and mostly null at normal sizes | Use sans because the brand is rounded and friendly, not because it is proven |
| T5 | Continuous text in ALL CAPS is read more slowly | **A** | Tinker and successors; word-shape and familiarity effects | No capitals in body copy |
| T6 | Short labels in caps are meaningfully harder | **C** | Effect shrinks sharply at 1–3 words; commonly overstated | Avoid caps anyway, for tone. Do not claim it is an accessibility fix |
| T7 | Text-to-speech compatibility matters more than any typographic choice for many dyslexic users | **C** | BDA guidance; consistent practitioner reporting | Semantic markup and screen-reader quality outrank font selection in the priority order |

**The typographic upshot.** The interventions with real evidence are **spacing and size**, both of which are boring and free. The intervention with no evidence is the special font, which is visible and marketable. Any brand that ships OpenDyslexic and skips adjustable spacing has optimised for looking inclusive.

### Cognitive load and working memory

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| K1 | Working memory is sharply capacity-limited | **A** | Cowan 2001 and the surrounding literature | Never require the user to hold information across screens |
| K2 | The limit is about four chunks, not seven | **A**, with live debate | Cowan's four versus Pascual-Leone's seven is still argued (Morra et al. 2024). What is settled: it is small and it depends on chunking, familiarity, and task | Use "a few", not a number, in the design system |
| K3 | Menus, lists, and navigation should be limited to 7±2 items | **E** | Miller's finding concerned recall of unidimensional stimuli, not visible options. Miller himself objected to the extrapolation. NN/g: visible menus rely on recognition, not recall, so no usability gain from the limit | **Delete this from the design system.** Structure lists meaningfully; do not truncate them to hit a number |
| K4 | Chunking improves retention | **A** | Miller's actual contribution | Group related fields, steps, and amounts |
| K5 | Cognitive Load Theory is a sound frame for instructional design | **A** for the core, **C** for the tripartite split | Sweller's intrinsic/extraneous distinction is well supported. The third category, germane load, has been repeatedly redefined by Sweller himself and is contested | Use intrinsic versus extraneous. Do not build a system on germane load |
| K6 | "Reduce cognitive load" as a UI heuristic | **C** | Directionally sound, almost never operationalised. In practice it is used to justify whatever the designer already wanted | Only usable when converted to something countable: number of decisions per screen, number of items to remember across screens, number of new terms |
| K7 | Learning styles (visual, auditory, kinaesthetic) should shape interface design | **E** | Thoroughly refuted; persists in neurodiversity design advice | Prohibited. Offer *multiple formats* because people have different access needs, not because they have "styles" |

### Motion, animation, and safety

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| M1 | Flashing above three flashes per second can trigger seizures in photosensitive individuals | **A** | Harding and successors; the basis of WCAG 2.3.1 | Absolute prohibition. No exceptions, no settings |
| M2 | Large-field motion, parallax, and zoom can trigger vestibular symptoms | **A** for mechanism, **C** for interface prevalence | Vestibular physiology solid; the specific claim that UI parallax causes it rests on practitioner reports | Honour `prefers-reduced-motion`. Treat it as a hard requirement |
| M3 | `prefers-reduced-motion` must be honoured | **B** | Platform API on iOS, Android, and the web; WCAG 2.3.3 (AAA) | Every animation ships with a reduced variant. Reduced means *removed or cross-faded*, not *slightly faster* |
| M4 | Specific durations and easing curves (200–300ms, ease-out) feel correct | **C** | Craft consensus across Material, HIG, and animation practice. No evidence base worth the name | Specify them in the Motion Bible as **craft**, clearly marked. This is Volume III's honest status for most of its content |
| M5 | Anticipation, squash-and-stretch, and the rest of the Disney principles improve comprehension | **⚠** | They are craft heuristics from character animation, developed for narrative film. No transfer evidence to interface comprehension that I have found | Usable. Label as craft. Do not dress as cognitive science |

### Motivation, behaviour, and gamification

This is the section with the strongest evidence and the largest gap between evidence and industry practice.

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| G1 | Tangible, expected, contingent rewards undermine intrinsic motivation for tasks that are already interesting | **A** | Deci, Koestner & Ryan 1999, meta-analysis of 128 studies. Lepper et al. on overjustification | Points and badges attached to something the user already wants to do will make them want it less |
| G2 | Autonomy, competence, and relatedness support intrinsic motivation; thwarting them corrodes it | **A** | Self-Determination Theory; very large corpus | Every mechanic is tested against the three needs before it ships |
| G3 | Gamification produces both positive and negative effects depending on implementation | **A** for the finding that it is conditional; **C** for any specific prescription | Consistent across reviews | No mechanic is safe in the abstract. Judge implementations, not categories |
| G4 | Streaks that reset to zero exploit loss aversion | **C** | The mechanism (Kahneman & Tversky) is **A**. The application to streak counters is practitioner analysis, not trial data | Reward **consistency rate**, not unbroken runs. Never display a zero |
| G5 | Streak loss is disproportionately harmful to users with executive-function differences or anxiety | **⚠** | Mechanistically plausible: all-or-nothing framing plus loss aversion plus a population with variable-capacity days. I have found no direct study | This is the load-bearing assumption of the whole product's motivation design. **It is a hypothesis and must be tested with users, not asserted** |
| G6 | Notifications framed as obligation increase disengagement | **⚠** | Plausible; I have no source | Test it |

**The design consequence, stated plainly.** G1 and G2 are grade A and they point the same direction: this product should not attach extrinsic rewards to the things the user already wants to do. What it can do without contradicting the evidence is *make progress visible* (competence), *keep every choice reversible and optional* (autonomy), and *never manufacture obligation*. G5, which is the emotional heart of the product's positioning, is currently unsourced. Building the brand on it is fine. Claiming it is established is not.

### Neurodivergence-specific design

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| N1 | Autistic adults have a general deficit in metaphor comprehension | **Contested, trending to E** | Kalandadze et al. 2018 meta-analysis: the difference shrinks or disappears under vocabulary and verbal-ability matching. Lampri et al. 2024 review: mixed | Do not build a rule on a deficit claim |
| N2 | Metaphor imposes a processing cost even where comprehension is intact | **A** | Longer reaction times reported consistently across studies, including those finding no accuracy difference | This, not N1, is the basis for the literal-first illustration rule. Metaphor is permitted when redundant |
| N3 | High-contrast repeating patterns near 3 cycles per degree trigger visual discomfort in susceptible people | **A** | Wilkins et al.; Evans & Stevenson 2008 Pattern Glare Test normative values | Hatching, dense stripes, and moiré-prone textures banned outright |
| N4 | Visual hypersensitivity is transdiagnostic rather than tied to one condition | **C** | Reported across neurodivergence, neurology, and mental health populations | Do not build per-diagnosis sensory modes. Build one calm default plus controls |
| N5 | Predictable, consistent layouts reduce re-orientation cost | **C** | COGA design patterns; strong practitioner convergence; thin experimental base | Default. Consistency beats novelty across a series |
| N6 | Most published "UX for ADHD" and "UX for autism" guidance | **C at best, frequently ⚠** | Predominantly practitioner opinion, small-n studies, or extrapolation from clinical findings to interface decisions | Treat as hypothesis generation. Do not cite as evidence in the bible |
| N7 | Sensory-informed spatial design for autism (ASPECTSS and similar) | **C** | Emerging; developed for architecture, limited transfer evidence to screens | Borrow the vocabulary, not the authority |
| N8 | Easy-read formats improve comprehension for people with intellectual disabilities | **C**, with a weak and mixed base | Widely promoted in policy; the evidence base is limited and contested | Use where asked for. Never apply by default to an adult audience that did not request it |

### Standards, language, and process

| # | Claim | Grade | Basis | What it obliges here |
|---|---|---|---|---|
| S1 | WCAG 2.2 AA conformance | **B** | Legally referenced in the EU (EAA, EN 301 549) and elsewhere | Minimum floor, not the goal |
| S2 | COGA patterns are required for accessibility | **E as stated** | The document says the opposite of itself: explicitly not required for WCAG conformance | Adopt them because they are good, not because they are mandatory |
| S3 | Plain language improves comprehension across populations | **A** for readability effects on comprehension; **C** for any specific formula | Robust general finding; specific readability indices are crude for Spanish | Write plainly. Do not chase a Flesch score in Spanish, where the indices transfer badly |
| S4 | Materials must be reviewed by people from the target population | **B** in the easy-read tradition, **A** as method | Inclusion Europe requires named proofreaders from the audience for logo use. Cambridge and Microsoft frameworks both centre this | **No output in this bible ships as validated without user review.** Grades A to E describe evidence, not this product |

---

## 0.5 The four things this ledger should change immediately

1. **Do not ship a dyslexia font.** Ship adjustable letter spacing and honour system text scaling instead (T1, T2, T3).
2. **Delete the 7±2 rule** wherever it appears in the design system (K3).
3. **Never display a zeroed streak.** Track consistency rate. The mechanism behind streak harm is grade C and the population-specific claim is unsourced, but grade A evidence on extrinsic rewards already points away from the mechanic (G1, G4, G5).
4. **Reclassify the cream background** from accessibility feature to brand aesthetic plus user setting (C7, C8). This corrects a claim made too strongly in the illustration skill built earlier: cream is defensible as taste and as glare reduction, not as a treatment.

## 0.6 How grades are maintained

Every rule in Volumes I to VII is written in this form:

> **Rule.** Body copy uses increased letter spacing, default 0.04em, user-adjustable to 0.12em.
> **Grade.** A (T2).
> **If challenged.** Zorzi et al. 2012, PNAS. Replicated.

A rule that cannot be written in that form is not ready. When the honest answer is ⚠, write ⚠. A bible with visible gaps is more useful than one with invisible ones, because the gaps are where the user research goes.

---

## Sources

Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences* 24(1).
Deci, E., Koestner, R. & Ryan, R. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin* 125(6).
Evans, B. & Stevenson, S. (2008). The Pattern Glare Test: a review and determination of normative values. *Ophthalmic and Physiological Optics* 28(4).
Griffiths, P. et al. (2016). The effect of coloured overlays and lenses on reading: a systematic review. *Ophthalmic and Physiological Optics* 36(5).
Inclusion Europe. *Information for all: European standards for making information easy to read and understand.*
Kalandadze, T. et al. (2018). Figurative language comprehension in individuals with autism spectrum disorder: a meta-analytic review. *Autism* 22(2).
Kuster, S. et al. (2018). Dyslexie font does not benefit reading in children with or without dyslexia. *Annals of Dyslexia* 68.
Lampri, S. et al. (2024). Figurative language processing in autism spectrum disorders: a review. *Autism Research* 17(4).
Miller, G. (1956). The magical number seven, plus or minus two. *Psychological Review* 63(2).
Morra, S., Patella, P. & Muscella, L. (2024). Modelling working memory capacity. *Journal of Cognition* 7(1).
Rello, L. & Baeza-Yates, R. (2013). Good fonts for dyslexia. *ASSETS '13*.
Suttle, C. et al. (2018). Efficacy of coloured overlays and lenses for treating reading difficulty: an overview of systematic reviews. *Clinical and Experimental Optometry* 101(4).
Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science* 12(2).
W3C (2021). *Making Content Usable for People with Cognitive and Learning Disabilities.* Working Group Note.
W3C (2023). *Web Content Accessibility Guidelines 2.2.*
Wery, J. & Diliberto, J. (2017). The effect of a specialized dyslexia font, OpenDyslexic, on reading rate and accuracy. *Annals of Dyslexia* 67(2).
Zorzi, M. et al. (2012). Extra-large letter spacing improves reading in dyslexia. *PNAS* 109(28).
