# adultos.entraining — Prompt pack

Copy-paste templates. `[SQUARE BRACKETS]` are the only parts you change.

**Read this first.** Image and video generators do not hold hex values, font sizes, or spelled labels. Anything that has to be exact — a colour token, a Spanish label, a contrast ratio — is added afterwards in vector, not asked for in the prompt. See §6.

---

## 1. Locked character block

Paste verbatim into every prompt that contains the mascot. Do not paraphrase it, do not shorten it, do not let a model rewrite it. Character consistency comes from an unchanging block plus a reference image, and the block is the part you control.

> A small, calm, rounded blob character with a soft sage-green body and a thin dark charcoal outline. Two simple dark oval eyes, wide apart. One small gentle curved smile. No nose, no ears, no hair, no clothing, no fingers. Short soft curved arms only when holding something. Completely flat colour, no shading, no gradient, no pencil texture, no grain, no crosshatching, no visible brush strokes. Sitting or standing on a plain surface with at most one soft flat shadow ellipse beneath. The character is calm and neutral, never cute, never a mascot pose, never winking, never surprised, never distressed.

## 2. Master image prompt

> [LOCKED CHARACTER BLOCK]
>
> The character is [LITERAL ACTION — what it physically does, e.g. "holding a single sheet of paper with one filled line on it"].
>
> Scene: [LITERAL OBJECTS, maximum three, e.g. "a plain desk and one open tray"]. Everything is drawn literally. Nothing represents anything else.
>
> Background: a plain soft warm off-white cream, approximately #FDFBF6. Never pure white. Completely empty, no pattern, no texture, no gradient, no paper grain, no vignette.
>
> Style: flat vector-like illustration with even-weight dark charcoal outlines. Absolutely no hatching, no cross-hatching, no stippling, no halftone, no repeating stripes, no dot patterns, no shading, no drop shadows.
>
> Colour: the cream background, dark charcoal outlines, the sage-green character, and one single accent — a medium forest green, approximately #4F7F4A — used on exactly one element. No other colours anywhere. No red. No orange. No bright saturated colour.
>
> Composition: [16:9 / 1:1 / 9:16]. At least half the frame empty. One clear focal point. Reading order strictly left to right. Maximum five objects including the character. No frame, no border, no title, no text.
>
> Mood: calm, plain, unhurried, quiet. Not whimsical, not quirky, not playful, not busy, not chaotic.

**Note the last line of the composition block: no text.** Generate the image without labels, then composite the Spanish labels in vector. Models misspell rendered text routinely and Spanish accents are the first thing they lose.

## 3. Master video prompt

> [LOCKED CHARACTER BLOCK]
>
> Single continuous shot, locked camera, no camera movement of any kind. No pan, no zoom, no dolly, no parallax, no handheld shake, no rack focus.
>
> The character [SINGLE SLOW ACTION, e.g. "slowly sets one sheet of paper down onto the desk, then rests still"]. One action only. The movement is slow, soft, and settles completely.
>
> Background: plain soft cream #FDFBF6, completely static and completely empty.
>
> Style: flat 2D illustration, even dark outlines, flat colour, no texture, no shading, no particles, no light rays, no lens flare, no bokeh, no depth of field.
>
> Lighting: flat and even. No moving light, no flicker, no strobe, no colour shift, no pulsing.
>
> Pace: slow and steady throughout. No speed ramps, no fast cuts, no sudden movement, no bounce, no snap.
>
> Duration [3–5] seconds. Loops seamlessly.

**Absolute constraints, every time.** Locked camera. No flashing of any kind. Nothing above three changes per second anywhere in the frame. A generated clip that flickers is discarded, not fixed in post.

## 4. Per-tool notes

Tools change; verify current behaviour before a large batch.

**Runway.** Holds a locked camera reliably when told explicitly and repeatedly. Tends to add ambient drift to backgrounds — state "completely static background" or the cream will breathe. Weak on flat colour: watch for introduced gradients. Use image-to-video from an approved still rather than text-to-video, always.

**Veo.** Strongest at holding character consistency from a reference frame; also the most likely to add cinematic lighting you did not ask for. Front-load the negatives. Explicitly forbid depth of field, which it adds by default.

**Kling.** Good motion quality, weakest prompt adherence on style constraints. Expect to regenerate more. Reference-image conditioning is essential rather than optional here. Check every output for introduced texture.

**Midjourney.** Best for stills, worst for exact colour. Use `--style raw` and low stylise. Treat every output's palette as wrong until sampled and corrected.

**Sora.** Availability varies by region and plan. If used, same constraints as Veo.

The common failure across all five: **they add.** Texture, lighting, colour, motion, depth. The prompts above are mostly a list of things not to add, and that is the correct proportion.

## 5. Channel derivatives

Change aspect and safe area only. Never change the character block, never change the palette, never raise the pace.

| Channel | Aspect | Notes |
|---|---|---|
| Instagram feed | 1:1 or 4:5 | Labels composited, never generated |
| Reels / TikTok / Shorts | 9:16 | Keep the top 15% and bottom 20% clear of content for platform UI. **No trend-driven fast cuts.** The pace constraint outranks platform convention |
| YouTube thumbnail | 16:9 | No shocked face, no arrows, no red circles. The whole genre is prohibited here |
| App Store | per platform spec | Screenshots carry real UI, not illustration |

## 6. Verification protocol

Every generated asset, before it is used. This is why the vector pipeline exists alongside the prompts.

1. **Sample the colours.** Open the file, pick the background, the body, and any accent. They must match `--ground`, `--pastel-green`, and `--accent` from `tokens.css`. Generators drift; a plausible-looking green is not the green.
2. **Check for texture.** Zoom to 400%. Any grain, hatching, stipple, or introduced gradient means discard. This is the failure that survives casual review and it is a grade-A accessibility problem, not a taste one.
3. **Cover the face.** Does the asset still say what it is for? If not, it needs a label.
4. **Greyscale it.** Does every distinction survive?
5. **Composite the labels in vector.** Nunito, minimum size per `tokens.css`, sentence case, correct Spanish accents, left aligned.
6. **Write the alt text.** Every asset ships with it. Every word rendered in the image appears in the alt text.
7. **Video only:** scrub for flashes. Nothing above 3Hz. Confirm the loop point does not create a jump that reads as a flash.

Steps 1, 2 and 7 are the ones that get skipped and they are the ones that matter. Steps 3 to 6 are cheap.

## 7. What not to prompt for

- The mascot expressing surprise, worry, confusion, or excitement. The expression set is closed; see `CORE.md` §5.5.
- Confetti, sparkles, bursts, celebration particles, trophies, stars, medals.
- Streak imagery: flames, chains, calendars with crosses, counters.
- Puzzle pieces, brain imagery, lightbulbs, tangled-to-tidy transformations, colour-spectrum brains.
- Anything that depicts the user as struggling, overwhelmed, or behind.
- Real people, real brands, real app interfaces other than this one.
- Text of any kind. Composite it.
