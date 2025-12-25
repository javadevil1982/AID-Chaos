# AI Dungeon Scripting API Overview

This document provides a complete overview of the AI Dungeon Scripting API, designed for developers and AI systems (e.g., Copilot) to understand and use the scripting framework without online references.

---

## 1. Introduction

AI Dungeon allows creators to extend and control the game logic through **Scripts** written in JavaScript.  
Scripts can intercept player input, modify the story context, or adjust the generated output.  
They operate inside a controlled sandbox environment and are stored per scenario or shared publicly.

Scripts enable developers to:
- Add **custom mechanics** (skills, stats, inventory, etc.)
- Influence AI behavior dynamically
- Trigger **automated events**
- Persist and recall data across turns

---

## 2. Script Architecture

Each script defines one or more **hooks** that execute during the story generation cycle.

### Hook Types

| Hook | Description | Typical Use |
|------|--------------|-------------|
| `inputModifier` | Runs after the player submits an action, before AI generation. | Preprocess input, detect keywords, modify or block actions for *explicit* new user inputs. Note: depending on platform flow, `inputModifier` may not be executed for retry/continue internal flows. |
| `contextModifier` | Runs after input modification but before sending to the AI model. | Add or change context (world info, state, memory). This hook is the only reliable place to read action metadata from `history` (such as `action.type`) and to run logic that must execute for retries/continues. |
| `outputModifier` | Runs after AI generation, before displaying the output. | Postprocess text, inject results, or censor. |
| `library` | Provides reusable functions for other scripts. | Shared utilities, dice systems, stat calculators. |

### Hook Structure

Each modifier hook exports an object with the corresponding key:

```javascript
// Example structure
const modifier = {
  inputModifier: (text) => { ... },
  contextModifier: (context) => { ... },
  outputModifier: (output) => { ... }
};

export default modifier;
```

Each function receives and returns a **string** or **object** depending on the type of modifier.

---

## 3. Global Objects and Variables

### `state`
A persistent object that stores data during the entire session.

```javascript
state.playerHealth = 100;
state.gold += 10;
```

- Data in `state` persists between turns.
- Ideal for tracking stats, items, flags, or quest progress.

### `memory`
A short text string automatically injected into the context each turn.

```javascript
memory.text = "You are a wandering knight cursed with immortality.";
```

- Persistent between turns.
- Used to maintain core character knowledge.

### `worldInfo`
Array of dynamic entries influencing AI context.

```javascript
worldInfo.push({
  keys: ["dragon", "wyrm"],
  entry: "Dragons in this world are intelligent ancient beings."
});
```

- Each entry is visible to the AI whenever matching keywords appear in the story.

### `history`
An object containing the recent input/output history of the story. Useful for advanced logic.

```javascript
let lastTurn = history[history.length - 1];
console.log(lastTurn.text);
```

- `history` holds recent actions (inputs and outputs). Implementations may truncate `history`; do not assume unbounded length.
- Use helper access patterns (see below) rather than indexing blindly.

---

## 4. Hook Execution Order

```
Player Input → inputModifier → contextModifier → AI Model → outputModifier → Display Output
```

This order ensures deterministic and modular script behavior.

---

## Hinweis zur Ausführungsreihenfolge (Wichtig für Entwickler)

- Beobachtung: In manchen Implementationen bzw. in dieser Codebasis werden die `input`-Hooks (z. B. `src/input.js` mit dem Aufruf `AidChaos("input", text)` bzw. `inputModifier`) offenbar nur bei direkten Benutzereingaben ausgeführt.
- Bei Bedienaktionen wie `Retry`, `Continue` oder ähnlichen internen Steuerbefehlen wird dagegen oft nur der Context-Flow ausgeführt (z. B. `src/context.js` mit `AutoCards("context", text, stop)` bzw. `contextModifier`).

Auswirkung und Empfehlungen:

- Wenn Logik bei allen Spieleraktionen ausgeführt werden soll (inkl. `Retry`/`Continue`), muss sie im Context-Flow (`contextModifier` / `src/context.js`) platziert werden. In der `contextModifier`-Phase ist Zugriff auf `history` und auf bereinigte `action`-Metadaten (z. B. `action.type`) am zuverlässigsten.
- Wenn Logik nur bei neuen, expliziten Benutzerbefehlen laufen soll, ist der Input-Flow (`inputModifier` / `src/input.js`) der richtige Ort. Bedenke jedoch, dass `inputModifier` nicht in allen internen control-flows ausgeführt wird.
- Dokumentiere Änderungen an diesem Verhalten, falls sich die Ausführungswege später ändern, damit Entwickler wissen, wo sie ihre Logik platzieren müssen.

---

## 4.1 Action types & recognition (additional details)

Praktische Skripte (z. B. `AutoCards`) verwenden explizit Action‑Typen und Hilfschecks. Das ist wichtig für robuste Verarbeitung von `history`, Retry/Continue und für Titel‑Erkennung.

**Wichtig:** Action-Metadaten wie `action.type` und die volle, bereinigte `history` sind in vielen Implementierungen erst während der `contextModifier`-Phase verlässlich verfügbar. Skripte, die auf `action.type` (z. B. `do`, `say`, `story`, `continue`) angewiesen sind, sollten diese Erkennung in `contextModifier` implementieren. Logic in `inputModifier` darf heuristisch prüfen die Eingabe, ist aber nicht die verlässliche Quelle für `action.type` bei Retry/Continue/Erase-Workflows.

- Bekannte/gebrauche `action.type`‑Werte:
  - `"do"`, `"say"`, `"story"` — normale Benutzereingaben
  - `"see"` — typischerweise nur zur Ansicht, wird oft übersprungen
  - `"continue"` — KI‑Continue/Ausgabe (oft in `history`)
  - `"start"` — initiale Spiel‑Start/Prompt
  - `"unknown"` — unklassifizierte Aktionen

- Hilfsfunktionen, die in Beispielskripten nützlich sind (implementiere diese in `contextModifier` wenn sie action-type-abhängig sind):
  - `isDoSay(type)` → true für `do` oder `say`.
  - `isDoSayStory(type)` → true für `do`/`say`/`story`.
  - `readPastAction(n)` → sichere Lese‑Funktion für `history` (liefert `{ text, type }`), behandelt Truncation und negative Indices. Verwende diese Funktion aus dem `contextModifier`, weil `history` ist dort konsistent und umfasst retry/continue events.
  - `getTurn()` → verlässlichere Messung der aktuellen Aktionsanzahl (z. B. `info.actionCount`) — wichtig, weil `history.length` gekürzt werden kann.

Empfehlung: nutze `readPastAction` / `getTurn` innerhalb deiner `contextModifier`-Logik statt direkt `history[...]` zu indexieren; das macht dein Script robuster gegen gekürzte Verlaufsdaten und gegenüber Retry/Continue-Flows.

---

## 4.2 Retry / Erase / Continue detection

Praktische Skripte erkennen Retries/Erases, indem sie Hashes und Textvergleiche verwenden:

- Ansatz: Hash der zuletzt geparsten Aktions‑Texte speichern (z. B. `lastTextHash`). Neue Aktionen werden gehasht und mit dem letzten Hash verglichen.
  - Übereinstimmungen deuten oft auf `retry`/`erase`/kein Fortschritt hin; darauf reagieren Skripte mit speziellen Flags (z. B. `recheckRetryOrErase`) und einer sicheren Reparse‑Logik.
- Continue‑Prompts: UI‑Continue‑Hinweise haben typische Formate wie `>>> please select "continue" (...) <<<`. Skripte fassen mehrere Continue‑Prompts zu Platzhaltern zusammen (z. B. `%@%`) und entscheiden später, ob sie die Ausgabe ersetzen.
  - Beim Ersetzen von Output ist ein Similarity‑Check (Textähnlichkeit) sinnvoll, um nicht unbeabsichtigt andere Skripte zu stören.

Konsequenz: Wenn dein Script auf in‑game Confirmation/Continue reagieren muss, baue Hash‑/Vergleichslogik ein oder nutze existierende Hilfsfunktionen, um doppelte/rekursive Aktionen zu erkennen. Platziere diese Logik in `contextModifier`, damit sie auch bei internen UI-Aktionen zuverlässig ausgeführt wird.

---

## 4.3 Title / named‑entity detection (heuristics)

Automatisch erkannte Titel und Namen (für Karten, Memory‑Buckets u.ä.) werden typischerweise mit heuristischen Regeln extrahiert:

- Basisidee: normalize → tokenize → apply capitalization rules.
  - Entferne ungewöhnliche Zeichen, Korrigiere Em‑Dashes, vereinheitliche Quotes, entferne Honorifics/Abkürzungen vor dem Tokenizing.
  - Erkenne Titel als Folge von Wörtern, die mit Großbuchstaben beginnen, erlaube wenige "minor words" (`the`, `of`, `le`, `la`, `&`, ...).
- Sonderlisten:
  - `honorifics` (z. B. `mr.`, `ms.`, `dr.`) und `abbreviations` behandelt man speziell.
  - `peerage` (Sir/Lord/King/…) wird in Schlüsselbildung ausgefiltert.
  - `entities` listet generische/unanwendbare Begriffe (Tage, Monate, Länder, Firmen etc.), die man als nicht‑generierbare Karten bannen sollte.
- Konfigurationen, die beeinflussen das Verhalten:
  - `ignoreAllCapsTitles` — verhindert, dass ALL‑CAPS Wörter als Titel erkannt werden.
  - `readFromInputs` — steuert, ob Spieler‑Eingaben (`do`/`say`) bei der Titel‑Erkennung berücksichtigt werden (nützlich bei schlechter Groß‑/Kleinschreibung in Inputs).
  - `minimumLookBackDistance` — wie viele Aktionen zurückgeschaut wird, bevor ein Kandidat in Betracht kommt.

Hinweis: Die Heuristik ist nicht perfekt, daher empfehlen Script‑Autoren, Kandidaten zu sammeln und mit Relevanz‑/Recency‑Gewichtung zu sortieren (wie in AutoCards implementiert).

---

## 4.4 Memory deduplication & similarity

Wenn Scripts Memories oder Notizen aus Kontext extrahieren, sind folgende Punkte wichtig:

- Near‑duplicate Detection: Ein Hash‑Set (z. B. `StringsHashed`) hilft, bereits gesehene Memory‑Passagen effizient zu erkennen und Duplikate zu vermeiden.
- Similarity Metric: Eine Levenshtein‑basierte `similarityScore` (0..1) ist ein praktischer Weg, Sätze/Textblöcke zu vergleichen; häufig verwendete Schwellen: 0.75–0.8 um Duplikate auszuschließen.
- Beschränkung: Merke nur eine begrenzte Anzahl von Hashes (z. B. 2000), um Speicherverbrauch zu begrenzen.

---

## 5. Example Scripts

### Example 1: Simple Dice Roll

```javascript
const modifier = {
  inputModifier: (text) => {
    if (text.includes("/roll")) {
      const roll = Math.floor(Math.random() * 100) + 1;
      return `You roll the dice... (${roll})`;
    }
    return text;
  }
};

export default modifier;
```

### Example 2: Stat System (Persistent State)

```javascript
const modifier = {
  inputModifier: (text) => {
    if (!state.stats) state.stats = { strength: 5, dexterity: 3 };

    if (text.includes("train strength")) {
      state.stats.strength += 1;
      return "You train hard. Your strength increases!";
    }
    return text;
  }
};

export default modifier;
```

### Example 3: Postprocessing Output

```javascript
const modifier = {
  outputModifier: (text) => {
    // Add dramatic flair
    return text + "\n\n[The world trembles in anticipation.]";
  }
};

export default modifier;
```

### Example 4: Shared Utility Library

```javascript
export const rollD100 = () => Math.floor(Math.random() * 100) + 1;
export const chance = (percent) => Math.random() * 100 < percent;
```

---

## 6. API Constraints

- Only **JavaScript ES6+** syntax is supported.
- Scripts execute in a **sandboxed environment**.
- Access to external APIs, network calls, and file I/O is **blocked**.
- `console.log()` works for local debugging.
- Execution time is limited (usually < 100ms per hook).


---

## 6.1 AutoCards external API (example)

The AutoCards example script exposes a useful external API (accessible when the script returns an API object). This is an example of what scripts can provide to other scripts or to LSIv2:

Common functions (summary):
- `postponeEvents(turns)` — postpone internal processing for `turns` turns
- `emergencyHalt(bool)` — emergency stop/resume
- `suppressMessages(bool)` — toggle script posting to `state.message`
- `debugLog(...args)` — log debug information to an in‑game debug card
- `toggle(toggleType)` — toggle script behavior on/off (accepts boolean/null/undefined)
- `generateCard(request, extra1, extra2)` — start an AI‑driven generation task (example's domain-specific)
- `redoCard(request, useOldInfo, newInfo)` — regenerate existing content
- `setCardAsAuto(targetCard, bool)` — mark/unmark a card as managed by the script
- `addCardMemory(targetCard, newMemory)` — append memory to a managed card
- `eraseAllAutoCards()` — remove all generated artifacts
- `getUsedTitles()`, `getBannedTitles()`, `setBannedTitles()` — various metadata accessors
- `buildCard()` / `getCard()` / `eraseCard()` — story card CRUD helpers

Hinweis: Diese Liste ist exemplarisch; die genaue Form, Parameter und Rückgabewerte hängen vom jeweiligen Script ab. AutoCards implementiert defensive argument‑validation and state persistence details that are instructive when designing your own API.

---

## 7. Best Practices

- Always return the **modified** value from each modifier.
- Use **namespaces** inside `state` to avoid collisions with other scripts.
- Keep `memory.text` concise (< 200 characters).
- Avoid infinite loops or heavy computation.
- Use libraries for reusable mechanics (dice, inventory, combat).
- Prefer implementing logic that must run on Retry/Continue inside `contextModifier` because some platforms only call input hooks for direct user inputs.
- When responding to Continue/Retry, consider storing a short hash of the last parsed action and comparing the new action's hash. This reduces duplicate processing and makes your script resilient to UI retry flows.

---

## 8. Example Lifecycle

```
Player: "Attack the dragon"
↓
inputModifier detects "attack" → modifies to include roll
↓
contextModifier adds relevant memory or stats
↓
AI generates result
↓
outputModifier appends combat summary
↓
Displayed to player
```

---

## 9. Suggested Structure for Multi-Module Systems

For complex projects, organize scripts as modular layers:

```
/scripts/
  core.js          → Base systems (dice, logging)
  combat.js        → Input + output modification
  stats.js         → State management
  world.js         → Context expansion
  library_utils.js → Reusable functions
```

Each file can `import` shared libraries and export its own modifiers.

---

## 10. Debugging and Testing

- Use **Preview Mode** in the AI Dungeon script editor.
- Test each hook separately.
- Use `console.log()` to verify logic.
- Avoid circular dependencies between scripts.

---

## 11. References

- Official documentation: https://help.aidungeon.com/scripting
- Script installation: https://help.aidungeon.com/what-are-scripts-and-how-do-you-install-them
- Community scripts (archived): https://github.com/latitudegames/Scripting

---

## 12. Summary

The AI Dungeon Scripting API is a modular, event-driven JavaScript system allowing real-time control over story generation.  
By using modifiers, developers can shape gameplay mechanics, control narrative structure, and build fully custom experiences.

---
