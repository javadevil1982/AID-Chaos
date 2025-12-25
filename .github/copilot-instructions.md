# Copilot Instructions

## Project Context and File References

This project focuses on scripting for AI Dungeon. To help Copilot understand the structure and goals, please refer to the following files:

- General project goals and current implementation status are described in  
  `#file:'E:\Programmierung\AID-Chaos\README.md'`

- API usage and scripting guidelines are outlined in  
  `#file:'E:\Programmierung\AID-Chaos\AI_Dungeon_Scripting_API_Overview.md'`

### Core Working Files

**IMPORTANT:** The project uses a modular architecture. The source files are located in `src/library/` and are built into `src/library.js`.

**Source Files (Edit these):**
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosAttributes.js'` - Attribute definitions and triggers
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosStoryCards.js'` - Story card management
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosConfiguration.js'` - Configuration loading
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosDetection.js'` - AutoCards detection
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosParser.js'` - Text parsing and tokenization
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosRoller.js'` - Dice rolling mechanics
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosHistory.js'` - Action history management
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosHandlers.js'` - Hook handlers
- `#file:'E:\Programmierung\AID-Chaos\src\library\AidChaosMain.js'` - Entry point function

**Hook Files:**
- `#file:'E:\Programmierung\AID-Chaos\src\context.js'`  
- `#file:'E:\Programmierung\AID-Chaos\src\input.js'`  
- `#file:'E:\Programmierung\AID-Chaos\src\output.js'`

**Generated File (DO NOT EDIT DIRECTLY):**
- `#file:'E:\Programmierung\AID-Chaos\src\library.js'` - Generated from source files via `build.ps1`

**Build Script:**
- `#file:'E:\Programmierung\AID-Chaos\build.ps1'` - Concatenates source files into library.js

### Reference Implementation

For a more advanced example of an AI Dungeon script, see:

- `#file:'E:\Programmierung\AID-Chaos\AutoCards\context.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\input.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\library.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\output.js'`

## Development Workflow

### When Making Changes to AidChaos Logic:

1. **Never edit `src/library.js` directly** - it is auto-generated
2. **Always edit the source files** in `src/library/` (e.g., `AidChaosAttributes.js`)
3. **Run the build script** after changes:
   ```powershell
   .\build.ps1
   ```
4. **Test the generated** `src/library.js` in AI Dungeon

### Modular Architecture Guidelines:

- Each class in `src/library/` is self-contained and complete
- Classes use dependency injection (constructors receive dependencies)
- Follow Single Responsibility Principle - each class has one clear purpose
- All classes are documented with English comments
- Use `logDebug()` at function entry/exit points

### File Order (Dependencies):

When adding new classes, maintain this dependency order in `build.ps1`:
1. Core classes (no dependencies): Attributes, StoryCards, Detection, History
2. Dependent classes: Configuration (needs StoryCards, Attributes), Parser (needs Attributes), Roller (needs Attributes)
3. Orchestrator: Handlers (needs all above)
4. Entry point: Main (initializes all components)

## Maintenance Guidelines

Whenever new logic or features are introduced:

1. **Update the appropriate source file** in `src/library/`
2. **Run `build.ps1`** to regenerate `library.js`
3. **Update** `#file:'E:\Programmierung\AID-Chaos\README.md'` to reflect changes
4. **Update version number** if releasing a new version

The README should always contain:
- The overall project vision
- Planned features and logic
- Which parts are implemented and which are pending
- Documentation of the modular architecture

## JavaScript Coding Guidelines

### General Rules:
- Use `"use strict";` in all JavaScript files
- Write all comments in **English**
- Use only basic Latin characters (no Unicode in comments)
- Follow existing code style and naming conventions

### Comment Requirements:
- Every function must begin with a comment summarizing its purpose
- Inside each function, add comments before logical blocks
- Comments should be concise and informative
- Avoid redundant comments (e.g., `// increment i by 1` for `i++`)
- Explain the **intent** behind the logic, not just what it does

### Debug Logging:
- Use `logDebug()` at the start and end of functions
- Use `logDebug()` at important decision points
- Format: `this.logDebug('methodName - description', data)`

### Example:

```javascript
// Calculates the total price including tax
function calculateTotal(price, taxRate) {
  logDebug('calculateTotal - start', { price, taxRate });
  
  // Check if the input price is valid
  if (price < 0) {
    logDebug('calculateTotal - invalid price, returning 0');
    return 0;
  }

  // Compute the tax amount
  const tax = price * taxRate;

  // Return the final total
  const total = price + tax;
  logDebug('calculateTotal - end', { total });
  return total;
}
```

### Class Structure:
- Use ES6 classes with proper constructors
- Document all public methods
- Use private methods (prefixed with `_`) for internal logic
- Each class should be in its own file in `src/library/`

## Common Tasks

### Adding a New Attribute:
1. Edit `src/library/AidChaosAttributes.js`
2. Add to the `getDefaults()` method
3. Include triggers array and guidance texts
4. Run `build.ps1`

### Modifying Roll Mechanics:
1. Edit `src/library/AidChaosRoller.js`
2. Update `roll()` method or thresholds
3. Run `build.ps1`

### Adding Detection Patterns:
1. Edit `src/library/AidChaosDetection.js`
2. Add patterns to `isAutoCardsActivity()`
3. Run `build.ps1`

### Changing Configuration Format:
1. Edit `src/library/AidChaosConfiguration.js`
2. Update `_buildCardText()` and `_parseCard()`
3. Run `build.ps1`

## Testing

Before committing changes:
1. Run `build.ps1` to ensure no syntax errors
2. Check that `src/library.js` uses CRLF line endings (Windows)
3. Verify the file size is reasonable (~40-50 KB)
4. Test in AI Dungeon Script Editor
5. Verify AutoCards compatibility if applicable
