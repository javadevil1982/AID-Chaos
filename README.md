# CHAOS – Controlled Heuristic Adaptive Outcome System

**Current Version 0.9** | Made by **Javadevil**

**CHAOS** is an invisible dice-rolling system for AI Dungeon that adds structured, attribute-based resolution mechanics to player actions without requiring any commands or explicit dice notation.

---

## What is CHAOS?

Traditional text-based AI adventures often feel arbitrary — success and failure depend purely on what the AI decides to narrate. CHAOS fixes this by introducing a hidden layer of mechanical fairness:

- **Automatic attribute detection** from player actions (e.g., "push the door" → Strength check)
- **W100 dice rolls** using character stats (1–10)
- **Natural outcome integration** where the AI narrates results based on roll classification
- **Zero player interaction** — no commands, no visible dice, just seamless storytelling

The system operates entirely behind the scenes, maintaining immersion while ensuring consistent and fair outcomes.

---

## How It Works

### 1. Attribute System

Each character has **five core attributes** rated from **1 to 10**:

| Attribute | Examples |
|-----------|----------|
| **Strength** | lift, push, throw, break, carry, wrestle |
| **Dexterity** | dodge, climb, balance, catch, sneak, aim |
| **Intelligence** | analyze, solve, calculate, research, investigate |
| **Charisma** | persuade, seduce, negotiate, charm, intimidate |
| **Perception** | notice, spot, hear, discover, search, track |

Each attribute includes an extensive trigger word list (both single words and multi-word phrases) that the system uses to automatically detect which stat should be tested.

You can attribute trigger words or add own attributes in your copy of the library souce code (search for ```static getDefaultAttributes()```). Therefore, it is not necessary to use the 5 default attributes.

### 2. Detection Logic

CHAOS monitors player Do actions and applies the following priority:

1. **Explicit attribute mention** (highest priority)  
   - If the player writes "using my strength" or "with my charisma", that attribute is always used
   
2. **Multi-word phrase triggers**  
   - Phrases like "pick a lock" or "hold your breath" are checked first for accuracy
   
3. **Single-word triggers**  
   - Individual keywords like "climb", "persuade", or "notice"

### 3. The Roll Formula

When an attribute is detected, CHAOS performs a W100 roll (1–100) and compares it against a **base value**:

```
Base Value = 20 + (Attribute × 5)
```

**Example:**  
- Attribute 1 → Base 25  
- Attribute 5 → Base 45  
- Attribute 10 → Base 70

### 4. Outcome Classification

| Result Type | Condition | Attr = 1 (Base 25) | Attr = 5 (Base 45) | Attr = 10 (Base 70) |
|-------------|-----------|--------------------:|--------------------:|---------------------:|
| Critical Success | Roll = 1 OR Roll ≤ (Base × 0.1) | ≈ 2% | ≈ 4% | ≈ 7% |
| Success | Roll ≤ Base | ≈ 23% | ≈ 41% | ≈ 63% |
| Partial Success | Roll ≤ (Base + 15) | 15% | 15% | 15% |
| Failure | Roll ≤ (90 + Base × 0.1) | ≈ 52% | ≈ 34% | ≈ 12% |
| Critical Failure | Roll > (90 + Base × 0.1) | ≈  8% | ≈ 6% | ≈ 3% |

To make the differences clearer, here are approximate probability breakdowns for three representative attribute values (computed from the formula above):

- Attribute = 1 (Base = 25):
  - Critical Success ≈ 2% (rolls ≤ 2)
  - Success ≈ 23% (rolls 3..25)
  - Partial Success = 15% (rolls 26..40)
  - Failure ≈ 52% (rolls 41..92)
  - Critical Failure ≈ 8% (rolls 93..100)

- Attribute = 5 (Base = 45):
  - Critical Success ≈ 4% (rolls ≤ 4)
  - Success ≈ 41% (rolls 5..45)
  - Partial Success = 15% (rolls 46..60)
  - Failure ≈ 34% (rolls 61..94)
  - Critical Failure ≈ 6% (rolls 95..100)

- Attribute = 10 (Base = 70):
  - Critical Success ≈ 7% (rolls ≤ 7)
  - Success ≈ 63% (rolls 8..70)
  - Partial Success = 15% (rolls 71..85)
  - Failure ≈ 12% (rolls 86..97)
  - Critical Failure ≈ 3% (rolls 98..100)

The system ensures that even low-stat characters have a reasonable chance of success, while high-stat characters feel powerful without being infallible.

### 5. Context Injection

After rolling, CHAOS appends guidance to the context that the AI receives:

```
[
The part of the action that depended on Strength was a SUCCESS.
Guidance: The character succeeds at the physical task in a solid and believable way.

Narration rule
Use these outcomes when continuing the story.
Show the consequences naturally in the scene.
Do not mention dice, rolls, or attribute names directly.
]
```

The AI then narrates the outcome naturally based on this hidden instruction.

If different attributes are recognized in an action, separate sections with the respective results and instructions are inserted into the context for each attribute.

And if one of the attributes fails, the AI is also notified of a causality rule.

Example action: You push against the door with all your strength to break it open, and then you flirt with the princess.

```
[
The part of the action that depended on Strength was a FAILURE.
Guidance: The physical attempt does not succeed and the obstacle remains in place.

The part of the action that depended on Charisma was a SUCCESS.
Guidance: The character succeeds in the social interaction; the target is inclined to react positively and be more open toward them.

Causality rule
The declared action may include several parts. If an earlier part fails in a way that makes later parts impossible, do not narrate those later parts as actually happening. You may show the character's intention, frustration, or delayed opportunities, but the impossible actions themselves do not occur in this scene.

Narration rule
Use these outcomes when continuing the story.
Show the consequences naturally in the scene.
Do not mention dice, rolls, or attribute names directly.
]
```


---

## Permission
You may use CHAOS without restriction in your own scenarios or scripts, including published works; use, reproduction, and adaptation are permitted by me.


## Installation Guide

Follow these steps to integrate CHAOS into your AI Dungeon scenario. This guide assumes you only uses this script alone. 

If you want to combine this script with other scripts, I would currently recommend running this one in the hooks first and then the other scripts. I will add later further information to the **Compatibility** section below about combining this script with other popular scripts, 
as soon as I have performed further compatibility tests.

### Step 1: Copy the Library

1. Open your AI Dungeon scenario in **Edit Mode**
2. Go to **DETAILS → EDIT SCRIPTS**
3. Select the **Library** tab
4. Delete all existing code
5. Copy the entire contents of `src/library.js` ([Library code](./src/library.js)) and paste it into the Library tab


### Step 2: Set Up the Hook Files

Use the following code in each respective tab:

**Input Modifier:**
```javascript
// Your "Input" tab should look like this
const modifier = (text) => {
    // Your other input modifier scripts go here (preferred)
    text = AidChaos("input", text);
    // Your other input modifier scripts go here (alternative)
    return { text };
};
modifier(text);
```

**Context Modifier:**
```javascript
// Your "Context" tab should look like this
const modifier = (text) => {
    // Your other context modifier scripts go here (preferred)
    [text, stop] = AidChaos("context", text, stop);
    // Your other context modifier scripts go here (alternative)
    return { text, stop };
};
modifier(text);
```

**Output Modifier:**
```javascript
// Your "Output" tab should look like this
const modifier = (text) => {
    // Your other output modifier scripts go here (preferred)
    text = AidChaos("output", text);
    // Your other output modifier scripts go here (alternative)
    return { text };
};
modifier(text);
```

### Step 3: Save and Play

1. Click the **SAVE** button in the scenario editor
2. Start playing! On your first Do action, CHAOS will auto-create an **"AidChaos Configuration"** story card if it doesn't already exist.
3. Edit that card to adjust attribute values and settings

---

## Configuration

When you first play a CHAOS-enabled scenario, a story card titled **"AidChaos Configuration"** is automatically created. This card contains:

### Enabled Flag

```
AidChaos enabled: true
```

Set to `false` to disable the system entirely.

### Attributes

```
Attributes:
- Strength: 5
- Dexterity: 5
- Intelligence: 5
- Charisma: 5
- Perception: 5
```

Valid values are **1 to 10**. Higher values = higher success chance.

---

### Pre-Creating the Configuration Card

You can optionally **create the "AidChaos Configuration" story card manually** before players start playing. This is useful if you want to:

1. **Set specific default values** different from 5
2. **Ask players for their attribute values** using AI Dungeon placeholders
3. **Ensure consistent initial setup** across multiple playthroughs

#### Option A: Fixed Values (Default Setup)

Create a story card titled **"AidChaos Configuration"** with this content:

```
AidChaos enabled: true

Attributes:
- Strength: 5
- Dexterity: 5
- Intelligence: 5
- Charisma: 5
- Perception: 5
```

#### Option B: Interactive Setup with Placeholders

If your scenario supports player input (recommended for non-Character-Creator scenarios), create a story card titled **"AidChaos Configuration"** with AI Dungeon placeholders:

```
AidChaos enabled: true

Attributes:
- Strength: ${Your Strength (1-10)}
- Dexterity: ${Your Dexterity (1-10)}
- Intelligence: ${Your Intelligence (1-10)}
- Charisma: ${Your Charisma (1-10)}
- Perception: ${Your Perception (1-10)}
```

**Important Notes:**

- The placeholders will be replaced by player input during scenario initialization
- Players should enter **only numeric values from 1 to 10**
- If invalid values are entered, CHAOS will automatically clamp them to the valid range (1-10)
- Once replaced, the card will contain the final numeric values for the session

---

## Design Philosophy

### Why CHAOS?

1. **Fairness without breaking immersion**  
   Players get mechanical consistency without needing to type commands or see dice rolls.

2. **Natural language integration**  
   Works with how people already write actions ("I try to lift the gate" instead of "/roll strength").

3. **AI-friendly guidance**  
   Instead of forcing the AI to improvise outcomes, CHAOS provides structured results that the AI can interpret narratively.

4. **Extensible foundation**  
   The base system is intentionally minimal — easy to understand, modify, and build upon.

---

## Advanced Customization

### Trigger Words

The default trigger lists are extensive (30+ words per attribute). Advanced users can modify these in the `getDefaultAttributes()` method within `library.js`.

### Guidance Text

Each attribute has **five outcome-specific guidance messages** (critical success, success, partial success, failure, critical failure). These are also customizable in the attribute definitions.

Example for Strength:
```javascript
guidance_text_critical_success: 'The character greatly exceeds normal physical limits and gains an impressive advantage.'
guidance_text_success: 'The character succeeds at the physical task in a solid and believable way.'
// ...etc
```

---

## Compatibility

CHAOS is designed to work alongside other AI Dungeon scripts. It follows best practices:

- **Hook-based architecture** (input/context/output modifiers)
- **State preservation** through `state.AidChaosConfig`
- **Minimal global namespace pollution**
- **Graceful error handling**

I will try to ensure compatibility with popular scripts, but conflicts may arise if multiple scripts modify the same hooks heavily. I recommend testing in isolated scenarios first.

Once I have performed further compatibility tests with other popular scripts, I will add this information here.

---

## Roadmap & Future Features

Currently implemented (v0.9):
- ✅ Automatic attribute detection (explicit mentions + trigger keywords)
- ✅ W100 roll formula with 5-tier outcome classification
- ✅ Context injection with guidance text
- ✅ Auto-generated, editable configuration card
- ✅ Phrase-aware trigger matching (multi-word support)
- ✅ Multiple attribute detection in single actions

Not yet implemented (planned):
- ⬜ Display of dice results in the game (optionally visible to players)
- ⬜ Compatibility with popular other scripts (e.g., Auto-Cards)
- ⬜ Support for the Charakter Creator mode
- ⬜ Attribute Templates for different genres (fantasy, sci-fi, etc.)
- ⬜ Further tests to optimize trigger word lists and guidance texts

---

## Technical Notes

### Debugging

Set `showDebugOutput = true` in `library.js` (around line 27) to enable console logging. This will output in the AI Dungeon Script Editor:
- Which attributes were detected
- Roll results and base values
- Outcome classifications
- Errors/warnings

---

**Happy adventuring! May the dice be ever in your favor.** 🎲

