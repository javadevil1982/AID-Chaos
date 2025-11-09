# CHAOS – Controlled Heuristic Adaptive Outcome System

**CHAOS** is a modular scripting system designed to bring structured randomness and adaptive narrative outcomes to AI Dungeon.

Traditional AI-driven adventures often become predictable or lack mechanical feedback for player actions. CHAOS aims to fix this by adding an invisible, automated layer of dice-based logic that reacts to player text naturally — without requiring commands or explicit rolls.

---

## Base Concept

CHAOS links player actions to character **attributes** and triggers automatic dice rolls when specific **keywords** or **explicit attribute mentions** appear in the player's input.  

Example:

| Attribute | Trigger Keywords |
|------------|------------------|
| Strength | lift, push, throw, break, carry |
| Dexterity | dodge, climb, balance, catch |
| Charisma | persuade, seduce, negotiate |
| Intelligence | analyze, solve, calculate |
| Perception | notice, discover, listen, investigate |

When a player writes an action like  
> *You try to push the heavy door open.*

CHAOS detects the keyword **push**, links it to **Strength**, and performs a roll for that attribute automatically.

If a player explicitly references the attribute —  
> *You use your strength to break the door open.*  
— CHAOS always rolls based on that attribute, regardless of trigger keywords.

---

## Attribute System

Each character has a set of attributes rated from **1 to 10**.  
These values represent natural capability and determine how likely a player is to succeed in relevant actions.

### Base Formula
```
Base Value = 20 + (Attribute × 5)
Roll = 1–100 (W100)
```

### Outcome Ranges
| Result Type | Condition | Description |
|--------------|------------|--------------|
| **Critical Success** | ≤ (Base × 0.1) or roll = 1 | Outstanding success |
| **Success** | > Critical and ≤ Base | Normal success |
| **Partial Success** | > Base and ≤ (Base + 15) | Limited success, with drawbacks |
| **Failure** | > (Base + 15) and ≤ (90 + (Base × 0.1)) | Action fails |
| **Critical Failure** | > (90 + (Base × 0.1)) | Catastrophic failure |

---

## Example Outcomes

**Attribute 1**
- Base = 25 
- Critical success ≈ 2%   
- Success ≈ 23%  
- Partial success ≈ 15%  
- Failure ≈ 52%
- Critical failure ≈ 8%

**Attribute 10**
- Base = 70  
- Critical success ≈ 7%   
- Success ≈ 60%  
- Partial success ≈ 15%  
- Failure ≈ 12%
- Critical failure ≈ 3%

This ensures that even at low levels, players still have a fair chance, while high attributes feel powerful but not infallible.

---

## Design Goals

- **Invisible mechanics:** The player never needs to type a command. CHAOS reacts to natural language input.
- **Dynamic narrative feedback:** The AI adapts story outcomes to dice results automatically.
- **Balanced fairness:** Success feels rewarding; failure adds drama without frustration.
- **Configurable foundation:** The base value and scaling can be easily adjusted for different game styles.

---

## Example Workflow

1. The player writes an action:  
   *You try to climb the crumbling wall.*

2. CHAOS detects **climb** → Dexterity.  
3. It rolls a W100 using the player's Dexterity score.  
4. Based on the result, CHAOS appends outcome metadata for the AI to interpret:  
   ```
   [CHAOS Result: Partial Success – You barely manage to hold on to the wall...]
   ```

5. The AI generates a fitting narrative response based on that result.

---

## Current Implementation Status (Technical)

The current code in `src/library.js` implements a minimal, deterministic core of CHAOS:

Implemented:
- Configuration story card `AidChaos Configuration` (auto-created if missing) with:
  - Enabled flag
  - Attribute numeric values (1..10) auto-normalized
- Extended internal trigger lists for each attribute (more than the short examples above) including both single words and multi-word phrases.
- Context hook (`handleContext`) logic only; rolls are performed only for recent user Do/Say actions.
- Explicit attribute name detection has priority over trigger matching.
- Phrase-aware trigger matching (phrases searched in raw text, single tokens matched via tokenization).
- Single attribute resolution (first match wins; no combined or contested checks).
- Dice formula and outcome classification exactly as documented.
- Result injection appended to context as:
  - `[Treat the action as <ResultType> (<Short Explanation>)]`

Internal utilities:
- Tokenization helper for robust lowercase splitting.
- Normalization/caching of trigger sets for performance.
- Safe history access (`readPastAction`).

Notably adjusted from README examples:
- The injected bracket text format currently differs from the example (`[Treat the action as ...]` vs `[CHAOS Result: ...]`).
- Input hook does not modify actions; only context applies CHAOS.

## Not Yet Implemented (Planned / Future Scope)

The following features are described conceptually or implied by design goals but are **not yet implemented** in the current code:

Planned / Missing:
- Output modifier adaptation: dynamically shaping AI output text based on the roll (currently only metadata appended to context, output unchanged).
- Configurable roll formula (base scaling factors hard-coded; no per-scenario overrides yet).
- Multi-attribute / contested checks (e.g. Strength vs Dexterity resolution or best-of system).
- More expressive contextual result injection (e.g. including roll number, base value, and guidance for narrative tone) using the `[CHAOS Result: ...]` format.
- Player-facing or scenario-author management of trigger words (currently fixed in code; not editable through the configuration card).
- Attribute advancement, progression, or temporary modifiers (buffs/debuffs).
- Outcome-driven side effects (injury flags, advantage/disadvantage, chained follow-up rolls).
- Localization / alternate language result messages.
- Retry/Continue specific handling (currently the same logic path; no suppression of duplicate re-rolls on immediate retries).
- Statistical logging or history of past rolls inside `state` or a dedicated story card.
- Separation of short and long trigger sets (and weighting) to reduce false positives.
- Configurable enabling/disabling of phrase vs token trigger detection.

## Roadmap Suggestions

Near-Term:
- Align result message format with README example (`[CHAOS Result: ...]`).
- Add roll details: `Roll: X / Base: Y` for improved downstream prompt clarity.
- Provide optional configuration for formula factors and message style.

Mid-Term:
- Implement output modifier transformation to integrate roll outcome into narrative automatically.
- Allow dynamic trigger customization via the config card (comma-separated lists per attribute).
- Introduce temporary modifiers and status effects.

Long-Term:
- Multi-attribute contested mechanics and advantage/disadvantage systems.
- Memory / progression: leveling attributes based on usage frequency.
- Card-based logging of past roll outcomes and statistics.

---

## Editing & Contribution Notes

When extending the system:
- Update this README with any newly implemented features (move items from "Not Yet Implemented" to "Implemented").
- Keep comments in code clear and concise (English only, ASCII) per project standards.
- Ensure configuration parsing remains resilient (attribute validation, clamping, graceful fallback).

---

## Summary

CHAOS currently provides a lightweight attribute-driven resolution layer with automatic detection and roll classification. It is intentionally minimal and designed for incremental expansion toward richer narrative integration and greater configurability.

