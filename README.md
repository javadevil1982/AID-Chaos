# CHAOS – Controlled Heuristic Adaptive Outcome System

**Current Version 0.9.1** | Made by **Javadevil**

**CHAOS** is an invisible dice-rolling system for AI Dungeon that adds structured, attribute-based resolution mechanics to player actions without requiring any commands or explicit dice notation.

---

## What is CHAOS?

Traditional text-based AI adventures often feel arbitrary — success and failure depend purely on what the AI decides to narrate. CHAOS fixes this by introducing a hidden layer of mechanical fairness:

- **Automatic attribute detection** from player actions (e.g., "push the door" → Strength check)
- **W100 dice rolls** using character stats (1–10)
- **Natural outcome integration** where the AI narrates results based on roll classification
- **Zero player interaction** — no commands, no visible dice, just seamless storytelling
- **Optional result display** to show roll outcomes to the player (v0.9.1+)

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

You can modify attribute trigger words or add own attributes in your copy of the library source code (search for `static getDefaultAttributes()`). Therefore, it is not necessary to use the 5 default attributes.

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

Follow these steps to integrate CHAOS into your AI Dungeon scenario.

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

### Result Output (NEW in v0.9.1)

```
Result Output enabled: false
```

Set to `true` to display dice roll results at the beginning of each AI output. When enabled, results appear in this format:

```
[AIDCHAOS Strength (45/70): Success]
```

Or with multiple attributes:

```
[AIDCHAOS Strength (45/70): Success, Dexterity (12/65): Critical Success]
```

The format shows: `Attribute (Roll/Base): Result Type`

- **Roll**: The actual W100 dice roll (1-100)
- **Base**: The base value from the formula (20 + Attribute × 5)
- **Result Type**: Critical Success, Success, Partial Success, Failure, or Critical Failure

This setting is useful for players who want transparency about the mechanics, or for debugging/testing scenarios.

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
Result Output enabled: false

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
Result Output enabled: false

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

### General Compatibility

CHAOS is designed to work alongside other AI Dungeon scripts. It follows best practices:

- **Hook-based architecture** (input/context/output modifiers)
- **State preservation** through `state.AidChaosConfig`
- **Minimal global namespace pollution**
- **Graceful error handling**
- **Auto-detection and skipping** of other script activity

### Compatibility with Auto-Cards (v0.9.1+)

CHAOS is now fully compatible with the **Auto-Cards** script. Both scripts can coexist in the same scenario without conflicts.

#### How Compatibility Works

CHAOS includes automatic detection of Auto-Cards activity:

- **Recognizes Auto-Cards patterns**: `/ac` commands, `CONFIRM DELETE`, `>>> please select "continue"`, `{title: ...}` headers, and memory operations
- **Skips CHAOS processing**: When Auto-Cards is detected, CHAOS passes the text through unchanged
- **Cleans markers**: Both scripts automatically remove each other's output markers to prevent interference

#### Setting Up Both Scripts Together

**Execution Order in Modifiers:**

The proper hook order ensures both scripts work correctly:

**Input Modifier:**
```javascript
// Your "Input" tab with both CHAOS and Auto-Cards
const modifier = (text) => {
    // CHAOS first to clean Auto-Cards markers
    text = AidChaos("input", text);
    // Then Auto-Cards processes input
    text = AutoCards("input", text);
    return { text };
};
modifier(text);
```

**Context Modifier:**
```javascript
// Your "Context" tab with both CHAOS and Auto-Cards
const modifier = (text) => {
    // CHAOS first to perform attribute rolls
    [text, stop] = AidChaos("context", text, stop);
    // Then Auto-Cards processes context and injects card information
    text = AutoCards("context", text, stop);
    return { text, stop };
};
modifier(text);
```

**Output Modifier:**
```javascript
// Your "Output" tab with both CHAOS and Auto-Cards
const modifier = (text) => {
    // Auto-Cards first to process card generation messages
    text = AutoCards("output", text);
    // Then CHAOS adds roll result markers (if enabled)
    text = AidChaos("output", text);
    return { text };
};
modifier(text);
```

#### Key Points

1. **Input & Context**: CHAOS runs first, then Auto-Cards
   - CHAOS cleans any leftover markers and performs rolls
   - Auto-Cards injects card information and memory updates
   - No interference because CHAOS skips when it detects Auto-Cards activity

2. **Output**: Auto-Cards runs first, then CHAOS
   - Auto-Cards handles card generation messages
   - CHAOS appends roll result markers (if Result Output is enabled)
   - Results appear at the start of the AI response without disrupting Auto-Cards messages

3. **Separate Configuration Cards**
   - CHAOS uses: `"AidChaos Configuration"` story card
   - Auto-Cards uses: `"Configure Auto-Cards"` story card
   - No overlap or conflicts

4. **State Management**
   - CHAOS stores data in: `state.AidChaosConfig` and `state.AidChaosLastRoll`
   - Auto-Cards stores data in: `state.AutoCards` and `state.LSIv2`
   - Both use different keys and don't interfere

#### Example Scenario Setup

If you want to use both CHAOS and Auto-Cards in the same scenario:

1. Follow CHAOS installation steps (copy library to Library tab)
2. Install Auto-Cards normally (add AutoCards to Library tab, call in hooks)
3. Update your Input, Context, and Output hooks as shown above
4. Create the configuration card `"AidChaos Configuration"` (for CHAOS settings) if you want.
5. Save and play!

#### Testing Compatibility

To verify both scripts are working correctly:

- **CHAOS**: Check the `"AidChaos Configuration"` card exists and updates
- **Auto-Cards**: Check that auto-generated plot cards are created as expected
- **Result Output**: If enabled, roll results appear before AI responses without disrupting story
- **No conflicts**: Both scripts' functionality should work independently

If you encounter issues, ensure the hook order is correct and that both scripts are up to date.

---

## Roadmap & Future Features

Currently implemented (v0.9.1):
- ✅ Automatic attribute detection (explicit mentions + trigger keywords)
- ✅ W100 roll formula with 5-tier outcome classification
- ✅ Context injection with guidance text
- ✅ Auto-generated, editable configuration card
- ✅ Phrase-aware trigger matching (multi-word support)
- ✅ Multiple attribute detection in single actions
- ✅ Optional result output display (NEW in v0.9.1)
- ✅ Compatibility with Auto-Cards script (NEW in v0.9.1)

Not yet implemented (planned):
- ⬜ Support for the Character Creator mode
- ⬜ Attribute Templates for different genres (fantasy, sci-fi, etc.)
- ⬜ Further tests to optimize trigger word lists and guidance texts
- ⬜ Compatibility with other popular scripts (LotRD, etc.)

---

## Technical Notes

### Modular Source Structure

The `library.js` file is generated from multiple self-contained class files for better maintainability. The source modules are located in `src/library/`:

| File | Class | Purpose |
|------|-------|---------|
| `AidChaosAttributes.js` | `AidChaosAttributes` | Default RPG attributes, triggers, guidance texts |
| `AidChaosStoryCards.js` | `AidChaosStoryCards` | Story card CRUD operations |
| `AidChaosConfiguration.js` | `AidChaosConfiguration` | Configuration loading and parsing |
| `AidChaosDetection.js` | `AidChaosDetection` | AutoCards detection, marker cleaning |
| `AidChaosParser.js` | `AidChaosParser` | Tokenization, attribute detection |
| `AidChaosRoller.js` | `AidChaosRoller` | W100 dice rolling mechanics |
| `AidChaosHistory.js` | `AidChaosHistory` | Action type detection, history reading |
| `AidChaosHandlers.js` | `AidChaosHandlers` | Hook handlers (input, context, output) |
| `AidChaosMain.js` | - | Entry point `AidChaos()` function |

Each file is a complete, syntactically valid JavaScript file containing one class. This makes editing, testing, and understanding individual components much easier.

### Building library.js

After modifying any source file in `src/library/`, run the build script to regenerate `src/library.js`:

```powershell
# Simple build
.\build.ps1

# Verbose build (shows each file being added)
.\build.ps1 -Verbose

# Watch mode (auto-rebuild on file changes)
.\build.ps1 -Watch
```

**Important:** Do not edit `src/library.js` directly! Always edit the source files in `src/library/` and rebuild.

### Debugging

Set `showDebugOutput = true` in `library.js` (around line 27) to enable console logging. This will output in the AI Dungeon Script Editor:
- Which attributes were detected
- Roll results and base values
- Outcome classifications
- Auto-Cards activity detection
- Errors/warnings

### Version History

**v0.9.1** (Current)
- Added `Result Output enabled` configuration option
- Added Auto-Cards compatibility detection and safe pass-through
- Added marker cleaning for better multi-script support
- Added result display formatting in output hook

**v0.9** (Initial Release)
- Core attribute detection system
- W100 roll mechanics
- Context injection with guidance text
- Auto-configuration card generation

---

**Happy adventuring! May the dice be ever in your favor.** 🎲

