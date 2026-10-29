# adultos.entraining — Core

*Internal reference. Everything that is a decision, with its evidence grade. Nothing that is decoration.*

Companion files: `tokens.css` (the values), `PROMPTS.md` (asset generation), `VOL-0-evidence-framework.md` (why the grades mean what they mean).

Grades: **A** robust evidence · **B** binding standard · **C** practice consensus · **D** common preference, must be a setting · **E** refuted, prohibited · **⚠** unsourced conjecture.

---

## 1. What the product is

An app that accompanies an adult through everyday administration: money, home, habits, paperwork, health. Step by step. No judgement.

The reader is not a beginner at life. They are an adult who finds a specific class of task hard, on some days more than others. Every design decision follows from that sentence, and the two failure modes it rules out are **condescension** and **pressure**.

## 2. Principles

Six. Each has a grade and a failure mode, because a principle you cannot fail is not a principle.

**2.1 Variable capacity is the normal case.** The same person has different capacity on different days. The product never assumes yesterday's user.
*Grade: ⚠ as stated. The mechanism is plausible and it is the brand's central bet. It has not been tested with users. Treat it as a hypothesis with a research obligation, not a finding.*
*Fails when:* the interface implies the user has fallen behind.

**2.2 Nothing is the only channel.** Never colour alone, never expression alone, never metaphor alone, never position alone.
*Grade: A (C4) for colour; A (N2) for metaphor; C for expression.*
*Fails when:* removing colour, or covering the mascot's face, changes what a screen means.

**2.3 Progress is visible; obligation is not manufactured.** Show what has been done. Never show what has been missed as a penalty.
*Grade: A (G1, G2). Deci, Koestner & Ryan 1999, 128 studies: tangible expected contingent rewards undermine intrinsic motivation for tasks the person already wants to do.*
*Fails when:* a counter reaches zero, or a notification implies a debt.

**2.4 Every action is reversible and every step is optional.** Autonomy is one of the three needs that intrinsic motivation rests on.
*Grade: A (G2, Self-Determination Theory).*
*Fails when:* a flow cannot be exited, or a choice cannot be undone.

**2.5 One calm default plus controls. No diagnosis modes.** There is no "autism mode" and no "ADHD mode". Sensitivities are transdiagnostic and the needs conflict with each other.
*Grade: C (N4). The prohibition on diagnosis modes follows from grade-D reasoning: preferences that are real for a subset must be settings, never defaults applied to a category of person.*
*Fails when:* the product asks the user to declare a condition to get a setting.

**2.6 Plainness is not simplification.** Reduce the visual and procedural load. Never reduce the intellectual content, and never apply easy-read conventions to an adult who did not ask for them.
*Grade: A (S3) for plain language. C, with a weak and contested base, for easy-read formats (N8).*
*Fails when:* the copy explains something the reader already knows, or the tone drops below adult.

## 3. Colour

Values in `tokens.css`. The rules:

**3.1 The six brand pastels never encode meaning.** Measured against the cream ground they range from 1.08:1 to 2.08:1. None clears the 3:1 threshold for a graphical object. They are surface, and only surface.

The critical pair: **`--pastel-green` against `--pastel-peach` is 1.03:1.** Identical luminance, adjacent hue. A red-green colour-blind reader has nothing at all to separate them. If any screen distinguishes two things by those two colours, the distinction does not exist for roughly 8% of male users. *Grade A (C4, C5).*

**3.2 There is one accent and it does one job per screen.** `--accent` at 4.55:1 light and 8.57:1 dark. It marks the primary action, or the current step, or the completed item. Not all three on the same screen.

**3.3 Errors are amber, never red, and never colour alone.** `--attention`, plus an icon, plus text. Red is avoided for tone: this product does not tell an adult they got it wrong in red. *The avoidance of red is brand, grade C. The prohibition on colour-alone is grade B (WCAG 1.4.1) and grade A (C4).*

There is a real tension here worth knowing about. COGA argues for familiar conventions, and red-means-error is the most familiar convention there is. The resolution: keep the familiar *shape* of an error (icon, position, wording) and change only the hue. The icon and text carry the recognition.

**3.4 Cream is taste, not accessibility.** `--ground` is `#FDFBF6`. It is defensible as brand and as glare reduction at maximum luminance. It is **not** a treatment. The clinical literature on coloured overlays and tinted lenses is grade E: three of four systematic reviews found insufficient evidence, and AAP, AAO and RANZCO all have position statements against. *Never claim a therapeutic effect for a background colour.* Background is user-adjustable. *Grade D (C7).*

**3.5 Dark mode text is not pure white.** `--ink` in dark is `#E9E6DF` at 13.85:1. Pure white on near-black produces halation, worst for readers with astigmatism.

**3.6 Contrast is measured, never judged by eye.** Then judged by eye anyway, in both modes, because the sRGB formula models perception poorly at the extremes. *Grade B for the threshold, grade A (C3) for the formula's known limits.*

## 4. Type

**4.1 Nunito.** Rounded, warm, double-storey `a`. Not Poppins Rounded, whose single-storey `a` lowers letterform distinctness. *Grade C — the sans-serif preference is practice consensus with a weak experimental base. Chosen because the brand is warm, not because it is proven.*

**4.2 No dyslexia font. This is a decision, and it is documented so it does not get relitigated.**

OpenDyslexic and Dyslexie do not work. Wery & Diliberto (2017): no improvement in rate or accuracy, and no participant preferred it. Kuster et al. (2018), n=170 and n=147: Dyslexie neither helps nor hinders, and children preferred Arial. Rello & Baeza-Yates (2013): OpenDyslexic ranked below Verdana and Helvetica. *Grade E.*

Shipping one signals care and delivers nothing. If a user asks for it, provide it in settings and do not market it.

**4.3 What does work: spacing and size.** Increased letter spacing improves reading in dyslexia (Zorzi et al. 2012, PNAS, replicated). Larger type improves reading rate more for dyslexic than typical readers (O'Brien, Mansfield & Legge). *Both grade A.*

So `--text-tracking` defaults to `0.04em` and is user-adjustable to `0.12em`. Body is 18px, not 16px. System text scaling is honoured everywhere.

**4.4 No capitals in body copy.** *Grade A (T5) for continuous text.* For 1–3 word labels the effect is much smaller and commonly overstated (grade C) — avoid them anyway, for tone.

**4.5 Left-aligned, never justified. Maximum 60 characters per line.** *Grade C, BDA style guide.*

**4.6 Semantics outrank typography.** For many dyslexic users, text-to-speech quality matters more than any font choice. Correct headings, labels, and landmarks come before any typographic refinement. *Grade C, and a priority ordering rather than an evidence claim.*

## 5. The mascot

**5.1 Class: companion.** Most explanatory characters should have no face, so that no meaning can leak into an expression. This one keeps its face, because in a support product warmth is functional rather than decorative. The face is then held to the same discipline as metaphor and colour.

**5.2 The cover-the-face test.** Put a thumb over the face. Does the screen still say what it says? If yes, the expression is warmth and it ships. If no, the expression is carrying information and needs a label, a handled object, or a caption behind it. *This test runs on every asset.*

**5.3 Construction.** One asymmetric organic blob. Fill `--pastel-green`, **always with a `--blob-outline` stroke**. The fill is 1.58:1 against the ground; without the outline the body has no reliable edge for a low-vision reader. Two filled ellipse eyes, fixed position. One curved mouth stroke. Short curved arms only when the action needs hands. No fingers.

**5.4 No interior grain, no pencil shading, no scribble shadow.** The existing brand assets have all three. The scribble under the mascot is concentric ring texture, which is the pattern-glare family: repeating high-contrast patterns near 3 cycles per degree trigger discomfort, headache and perceptual distortion in susceptible readers. Ground the figure with one flat ellipse or nothing. *Grade A (N3, Evans & Stevenson 2008).*

**5.5 Closed expression set. Three shapes, fixed meanings, nothing else.**

| Shape | Reads as | Always paired with |
|---|---|---|
| Gentle upward curve | present, attentive | the object being handled |
| Flat short line | working, neutral | the step label |
| Closed eyes, same curve | resting, paused | an explicit "pausa" or "después" label |

**Prohibited expressions:** surprise, confusion, worry, excitement, question marks overhead, sweat drops, motion lines for emotion, raised-hand shrugs. Each asks the reader to infer an internal state, and several read as the character being overwhelmed — the wrong message from a support product.

**5.6 Scale is fixed within any series.** A character that changes size between screens forces re-identification each time. *Grade C (N5).*

**5.7 Scope boundary.** The illustration checklist governs the **explanatory layer**: onboarding, how a feature works, what a form needs, what happens next. It does not govern reassurance art or empty-state illustration. Forcing a literal spine onto reassurance content empties it.

The dividing question: **does the reader need this image in order to do something?** If yes, checklist. If no, brand book.

## 6. Motion

**6.1 Most of this section is craft.** Durations and easing curves have no evidence base worth the name. They are specified so the product is consistent, not because they are correct. *Grade C (M4).*

**6.2 What is not craft — the absolute prohibitions.**

- **Nothing flashes more than three times per second. No exception, no setting.** Photosensitive seizure risk. *Grade A (M1), WCAG 2.3.1.*
- **No parallax on scroll, no large-field zoom, no autoplaying video.** Large-field motion triggers vestibular symptoms. *Grade A for mechanism (M2), C for interface prevalence.*
- **`prefers-reduced-motion` is honoured everywhere.** *Grade B (M3).*

**6.3 Reduced means removed or cross-faded.** Not "slightly faster". Every animation ships with its reduced counterpart, and the reduced counterpart is reviewed, not assumed.

**6.4 The breath.** The mascot has an idle loop: `--dur-breath` at `--blob-breath-scale`, ease-breath, infinite. Amplitude 1.8%, deliberately small. It never stops while the mascot is on screen, because a still character reads as frozen, and it stops entirely under reduced motion.

**6.5 The ceiling on celebration.** No confetti, no burst particles, no screen shake, no fanfare. Completion is marked by the accent colour arriving on the completed item and a short settle. Celebration that outsizes the act is condescension, and the brand's own voice already rejects it.

**6.6 Waiting is honest.** A progress indicator shows real progress or shows nothing. No fake activity, no simulated thinking, no spinner that outlives the request it represents.

## 7. Motivation, and what not to build

This is the section with the strongest evidence in the project and the widest gap between that evidence and industry practice.

**7.1 The finding.** Tangible, expected, contingent rewards undermine intrinsic motivation for tasks the person already finds worth doing. Deci, Koestner & Ryan (1999), meta-analysis of 128 studies. *Grade A.*

**7.2 The three needs.** Autonomy, competence, relatedness. Support them and motivation holds; thwart them and it corrodes. Every mechanic gets tested against all three before it ships. *Grade A (Self-Determination Theory).*

**7.3 Prohibited mechanics.**

| Prohibited | Why | Grade |
|---|---|---|
| Streak counter that resets to zero | Weaponises loss aversion; the display of a zero is the harm | C for the streak analysis, A for the underlying loss-aversion mechanism |
| Points, XP, badges on core tasks | Extrinsic reward attached to something already wanted | A (G1) |
| Global or social leaderboards | Comparison thwarts competence for anyone below the median | A (G2) |
| Guilt-framed notifications ("te extrañamos", "llevas 5 días sin…") | Manufactured obligation, thwarts autonomy | A (G2) for the mechanism |
| Any counter that can display 0 | Same as the streak, in general form | — |

**7.4 What replaces them.** **Consistency rate, not streaks.** "12 of the last 30 days" is true, cannot reach zero from a single miss, and rewards the pattern rather than the perfect run. Progress is shown as accumulation, never as a gap.

**7.5 The open question, stated as open.** The claim that streak loss is *disproportionately* harmful to people with executive-function differences or anxiety is mechanistically plausible and I have found no direct study. *Grade ⚠.* It is the load-bearing assumption of the product's positioning. Build on it; do not assert it as established; test it. Note that grade-A evidence already points away from streaks for everyone, so the design conclusion holds regardless of how the specific claim resolves.

## 8. UX rules that carry weight

**8.1 Delete 7±2.** Miller measured recall of unidimensional stimuli, not visible options, and objected to the extrapolation himself. Visible menus rely on recognition, not recall. There is no usability gain from truncating a list to seven. *Grade E (K3).* Structure lists meaningfully; do not cut them to hit a number.

**8.2 Never require the user to hold information across screens.** Working memory is small and variable. If a value is needed on screen three, it is visible on screen three. *Grade A (K1).*

**8.3 "Reduce cognitive load" is only usable when counted.** Three countable quantities, checked per screen:
- decisions required
- items the user must remember from a previous screen (target: zero)
- new terms introduced (target: at most one)

*The underlying theory is grade A; the UI heuristic is grade C and gets used to justify whatever the designer already wanted (K6). Counting is what makes it real.*

**8.4 Reminders.** Default frequency low. Always silenceable in one tap from the notification itself. Never guilt-framed. A reminder states the thing, not the failure to do the thing.

**8.5 Errors.** No blame, always a next action, always reversible. Amber, icon, text. The sentence names what happened and what to do, in that order, and never uses the second person as an accusation.

**8.6 Empty states.** An empty state is the most common first impression. It says what this space is for and offers exactly one action. It does not apologise and it does not celebrate emptiness.

**8.7 Confirmations.** Confirm only what cannot be undone. Everything that can be undone gets an undo instead of a dialogue.

**8.8 Familiar patterns over clever ones.** Standard controls, standard positions, standard icons, always labelled. *Grade C (COGA design patterns, N5).*

**8.9 Targets 48px, gap 8px.** WCAG 2.2 SC 2.5.8 sets 24px as the floor; both platform conventions set 48. *Grade B for the floor, C for the number used.*

## 9. Voice

British-English structure, Spanish copy. The copy is the artifact, so it appears in Spanish.

**9.1 Register.** Adult to adult. Warm, plain, unhurried. Never a coach, never a parent, never a cheerleader.

**9.2 The brand's own lines, which are already correct:**
> Vamos paso a paso.
> Pequeñas acciones, grandes cambios.
> No tienes que saberlo todo.
> Aquí nadie nace sabiendo.

These are literal, non-ironic, and make no demand. That is the register.

**9.3 Patterns that work.**

| Situation | Write | Not |
|---|---|---|
| Interrupted task | "Puedes seguir cuando quieras." | "¡No abandones ahora!" |
| Missed days | "Retomamos donde lo dejaste." | "Llevas 5 días sin entrar." |
| Completed step | "Listo. Siguiente: [x]." | "¡Increíble! ¡Eres imparable! 🎉" |
| Error | "Ese dato no se guardó. Puedes escribirlo otra vez." | "Error: campo inválido." |
| Long form | "Son 4 pasos. Puedes pausar en cualquiera." | "Completa el formulario." |
| Empty state | "Aquí van tus trámites. Empieza por uno." | "No tienes nada todavía." |

**9.4 Prohibited in copy.** Exclamation marks in system messages. Emoji in functional copy. "Solo", "simplemente", "fácil", "rápido" — all of which tell a struggling reader that the thing they find hard is easy. Guilt framing. Second person as accusation. Streak language.

**9.5 One idea per sentence, roughly 10 to 16 words.** *Grade A for plain-language comprehension effects (S3); grade C for any specific length rule, and Spanish readability indices transfer badly from English.*

## 10. QA gates

Run on every screen and every asset. A gate is open or closed; there is no partial.

**Comprehension**
1. Cover the mascot's face. Does the screen still say what it says?
2. Convert to greyscale. Is every distinction still readable?
3. Does any meaning depend on a metaphor?
4. Items the user must remember from a previous screen: zero?

**Vision**
5. Text contrast at least 4.5:1; graphical objects and boundaries at least 3:1. Measured, both modes.
6. No pastel encodes meaning.
7. No capitals in body copy.
8. No hatching, stripes, halftone, or repeating high-contrast texture.
9. Text at least 18px, system scaling honoured, tracking adjustable.

**Motion**
10. Nothing flashes above 3Hz.
11. Every animation has a reviewed reduced-motion counterpart.
12. No parallax, no autoplay.

**Motivation**
13. No counter can display zero.
14. No notification implies a debt.
15. Every step is skippable and every action reversible.

**Process**
16. Not validated until reviewed by people from the audience. *This is the gate that matters most and the only one currently open across the whole product.* The European easy-read standard requires named proofreaders from the target population before a document may carry its mark. Nothing here has had that.

---

## What is deliberately not in this document

Storyboarding, cinematography, sound design, campaign calendars, funnel architecture. They are craft, they are not blocking, and a document nobody finishes is worse than a short one. If any of them becomes a real constraint, it gets its own page here rather than its own volume.
