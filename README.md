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

