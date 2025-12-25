# CHAOS – Controlled Heuristic Adaptive Outcome System

**Current Version 0.9.3** | Made by **Javadevil**

**CHAOS** is an invisible dice-rolling system for AI Dungeon that adds structured, attribute-based resolution mechanics to player actions without requiring any commands or explicit dice notation.

---

## What is CHAOS?

Traditional text-based AI adventures often feel arbitrary — success and failure depend purely on what the AI decides to narrate. CHAOS fixes this by introducing a hidden layer of mechanical fairness:

- **Automatic attribute detection** from player actions (e.g., "push the door" → Strength check)
- **W100 dice rolls** using character stats (1–10) or **disabled state** for impossible actions (v0.9.3+)
- **Natural outcome integration** where the AI narrates results based on roll classification
- **Zero player interaction** — no commands, no visible dice, just seamless storytelling
- **Optional result display** to show roll outcomes to the player (v0.9.1+)

The system operates entirely behind the scenes, maintaining immersion while ensuring consistent and fair outcomes.

---

## How It Works

### 1. Attribute System

Each character has **five core attributes** rated from **1 to 10** or **disabled**:

| Attribute | Examples |
|-----------|----------|
| **Strength** | lift, push, throw, break, carry, wrestle |
| **Dexterity** | dodge, climb, balance, catch, sneak, aim |
| **Intelligence** | analyze, solve, calculate, research, investigate |
| **Charisma** | persuade, seduce, negotiate, charm, intimidate |
| **Perception** | notice, spot, hear, discover, search, track |

Each attribute includes an extensive trigger word list (both single words and multi-word phrases) that the system uses to automatically detect which stat should be tested.

You can modify attribute trigger words or add own attributes in your copy of the library source code (search for `static getDefaultAttributes()`). Therefore, it is not necessary to use the 5 default attributes.

#### Disabled Attributes (NEW in v0.9.3)

CHAOS supports a special **disabled state** for attributes that are fundamentally impossible for a character:

- **Keywords**: Use `unavailable`, `disabled`, `impossible`, `forbidden`, or `inaccessible` in place of a numeric value
- **Internal representation**: Stored as `-1` (constant `ATTRIBUTE_DISABLED`)
- **Behavior**: No dice roll occurs; the attribute automatically results in **Critical Failure**
- **Display**: Shown as `disabled` in story cards and as `(disabled)` in result markers

**When to use disabled attributes:**

- A race that cannot use magic (e.g., "Magic: disabled")
- A character with a missing limb (e.g., "Dexterity: disabled")
- A mute character (e.g., "Charisma: disabled" for verbal interactions)
- Any inherent, unchangeable inability

**Example: Magic Attribute**

If you add a custom "Magic" attribute and want certain races to be unable to cast spells:

**Warrior Class Card** (base values):
```
Attributes:
- Strength: 8
- Magic: 3
```

**Dwarf Race Card** (modifiers):
```
Attribute-Modifiers:
- Strength: +1
- Magic: disabled
```

**Result**: A Dwarf Warrior's final Magic attribute is `disabled`. Any magic-related action automatically fails critically, and the player sees:
```
[AIDCHAOS Magic (disabled): Critical Failure]
```

This clarifies to the player that failure is due to character limitations, not bad luck.

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
- Attribute disabled → Automatic Critical Failure (no roll)

### 4. Outcome Classification

| Result Type | Condition | Attr = 1 (Base 25) | Attr = 5 (Base 45) | Attr = 10 (Base 70) |
|-------------|-----------|--------------------:|--------------------:|---------------------:|
| Critical Success | Roll = 1 OR Roll ≤ (Base × 0.1) | ≈ 2% | ≈ 4% | ≈ 7% |
| Success | Roll ≤ Base | ≈ 23% | ≈ 41% | ≈ 63% |
| Partial Success | Roll ≤ (Base + 15) | 15% | 15% | 15% |
| Failure | Roll ≤ (90 + Base × 0.1) | ≈ 52% | ≈ 34% | ≈ 12% |
| Critical Failure | Roll > (90 + Base × 0.1) | ≈  8% | ≈ 6% | ≈ 3% |
| Critical Failure | Attribute = disabled | 100% | 100% | 100% |

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

The system ensures that even low-stat characters have a reasonable chance of success, while high-stat characters feel powerful without being infallible. **Disabled attributes always fail critically without rolling**, making inherent limitations clear.

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

Valid values are **1 to 10** or **disabled**. Higher numeric values = higher success chance. Disabled attributes automatically produce Critical Failure.

**Using Disabled Attributes:**

Instead of a number, use any of these keywords (case-insensitive):
- `disabled`
- `unavailable`
- `impossible`
- `forbidden`
- `inaccessible`

**Example with custom Magic attribute:**
```
Attributes:
- Strength: 7
- Dexterity: 7
- Intelligence: 3
- Charisma: 4
- Perception: 6
- Magic: disabled
```

When the player attempts a magic-related action, they see:
```
[AIDCHAOS Magic (disabled): Critical Failure]
```

### Inheritance Processed (NEW in v0.9.2)

```
Inheritance processed: false
```

This internal flag tracks whether CHAOS has already attempted to load attribute values from Class and Race story cards. Once set to `true`, CHAOS will not attempt inheritance again, even if the card is edited.

**When to reset this flag:**
- Set to `false` if you want CHAOS to re-read attributes from Class/Race cards on the next action
- This is useful if you've updated your Class or Race cards and want to apply new values
- After resetting, CHAOS will derive values again and set it back to `true`

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
Inheritance processed: true

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
Inheritance processed: true

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

#### Option C: Automatic Inheritance from Class and Race Cards (NEW in v0.9.2)

CHAOS can automatically derive attribute values from **Class** and **Race** story cards. This is ideal for scenarios with predefined character classes and races, providing a seamless RPG experience without manual configuration.

##### How It Works

When the **"AidChaos Configuration"** card does not exist, or exists but has no valid attribute values and `Inheritance processed` is `false`, CHAOS will:

1. **Load base values from a Class card**: Searches the Plot Essentials (memory) for a line like `Class: Warrior`, then finds the story card of type `Class` with title `Warrior` and reads its `Attributes:` section.

2. **Apply modifiers from Race cards**: Searches for `Race: Elf` in Plot Essentials, finds the `Race` type card titled `Elf`, and applies `Attribute-Modifiers:` (like `+2` or `-1`).

3. **Create/update the configuration card**: After calculating final values (clamped to 1-10), creates or updates the `"AidChaos Configuration"` card and sets `Inheritance processed: true`.

4. **Clean up source cards**: Removes the `Attributes:` and `Attribute-Modifiers:` sections from Class and Race cards to prevent AI confusion.

##### Setting Up Class Cards

Create story cards with type **"Class"** (set in the card's Type field). Example for a "Warrior" class:

**Story Card Settings:**
- **Type**: `Class`
- **Title**: `Warrior`

**Entry Content:**
```
A fierce combatant skilled in martial warfare. Warriors excel in physical confrontations and can endure significant punishment.

Attributes:
- Strength: 8
- Dexterity: 5
- Intelligence: 3
- Charisma: 4
- Perception: 5
```

##### Setting Up Race Cards

Create story cards with type **"Race"**. Example for an "Elf" race:

**Story Card Settings:**
- **Type**: `Race`
- **Title**: `Elf`

**Entry Content:**
```
Graceful and long-lived, elves possess keen senses and natural agility. They are often wise but physically less robust than other races.

Attribute-Modifiers:
- Strength: -1
- Dexterity: +2
- Perception: +1
```

**Example with disabled attribute (Dwarf race cannot use magic):**

**Story Card Settings:**
- **Type**: `Race`
- **Title**: `Dwarf`

**Entry Content:**
```
Sturdy and resilient, dwarves are master craftsmen and warriors. Their innate resistance to magic makes them unable to cast spells themselves.

Attribute-Modifiers:
- Strength: +2
- Dexterity: -1
- Magic: disabled
```

**Important**: If either the base value OR any modifier is disabled, the final attribute will be disabled. This ensures that racial or class restrictions are properly enforced.

##### Plot Essentials Format

In your scenario's **Plot Essentials** (memory), include lines that specify the character's class and race:

```
Character: Aelindra
Class: Warrior
Race: Elf
```

**Note:** The format is simply `Type: Name` (e.g., `Class: Warrior`). CHAOS searches for lines starting with the configured type name followed by a colon.

##### Example Calculation

With the above setup:
- **Warrior base values**: Strength 8, Dexterity 5, Intelligence 3, Charisma 4, Perception 5
- **Elf modifiers**: Strength -1, Dexterity +2, Perception +1
- **Final values**: Strength 7, Dexterity 7, Intelligence 3, Charisma 4, Perception 6

The generated **"AidChaos Configuration"** card will contain:
```
AidChaos enabled: true
Result Output enabled: false
Inheritance processed: true

Attributes:
- Strength: 7
- Dexterity: 7
- Intelligence: 3
- Charisma: 4
- Perception: 6
```

**Example with disabled attribute (Dwarf Warrior with no magic):**
- **Warrior base values**: Strength 8, Magic 3
- **Dwarf modifiers**: Strength +2, Magic disabled
- **Final values**: Strength 10, Magic disabled

Generated card:
```
Attributes:
- Strength: 10
- Magic: disabled
```

##### Important Notes for Scenario Authors

1. **One-time processing**: The inheritance only happens when `"AidChaos Configuration"` doesn't exist or has no valid attribute values. Once created/updated, subsequent loads use only that card.

2. **Automatic cleanup**: After reading attribute values, CHAOS removes the `Attributes:` and `Attribute-Modifiers:` blocks from the source cards. This prevents the AI from seeing raw numbers and ensures narrative immersion.

3. **Fallback to defaults**: If a Class or Race card is not found, or if specific attributes are not defined, CHAOS uses the default value of 5.

4. **Value clamping**: All final numeric values are clamped to the range 1-10. Disabled attributes remain disabled.

5. **Disabled inheritance**: If a base attribute OR any modifier is disabled, the final value is disabled. This ensures restrictions are properly enforced.

6. **Optional feature**: If you don't create Class/Race cards with attribute sections, CHAOS simply uses default values (all 5s).

---

## Roadmap & Future Features

Currently implemented (v0.9.3):
- ✅ Automatic attribute detection (explicit mentions + trigger keywords)
- ✅ W100 roll formula with 5-tier outcome classification
- ✅ Context injection with guidance text
- ✅ Auto-generated, editable configuration card
- ✅ Phrase-aware trigger matching (multi-word support)
- ✅ Multiple attribute detection in single actions
- ✅ Optional result output display (v0.9.1)
- ✅ Compatibility with Auto-Cards script (v0.9.1)
- ✅ Support for the Character Creator mode (v0.9.2)
- ✅ Automatic inheritance of attributes from Class and Race cards (v0.9.2)
- ✅ Disabled attribute state with automatic critical failure (v0.9.3)

Not yet implemented (planned):
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

**v0.9.3** (Current)
- Added disabled attribute state for fundamentally impossible actions
- Disabled attributes automatically produce Critical Failure without rolling
- Support for keywords: `unavailable`, `disabled`, `impossible`, `forbidden`, `inaccessible`
- Display improvements: `(disabled)` marker in result output, `disabled` text in story cards
- Disabled state propagates through inheritance: if base OR modifier is disabled, result is disabled

**v0.9.2**
- Support for the Character Creator mode
- Added automatic inheritance of attributes from Class and Race cards
- Added `Inheritance processed` flag to prevent repeated inheritance attempts
- Inheritance now also works when configuration card exists but has no valid attributes

**v0.9.1** 
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

