# Copilot Instructions

## Project Context and File References

This project focuses on scripting for AI Dungeon. To help Copilot understand the structure and goals, please refer to the following files:

- General project goals and current implementation status are described in  
  `#file:'E:\Programmierung\AID-Chaos\README.md'`

- API usage and scripting guidelines are outlined in  
  `#file:'E:\Programmierung\AID-Chaos\AI_Dungeon_Scripting_API_Overview.md'`

### Core Working Files

We actively work with the following source files:

- `#file:'E:\Programmierung\AID-Chaos\src\context.js'`  
- `#file:'E:\Programmierung\AID-Chaos\src\input.js'`  
- `#file:'E:\Programmierung\AID-Chaos\src\library.js'`  
- `#file:'E:\Programmierung\AID-Chaos\src\output.js'`

### Reference Implementation

For a more advanced example of an AI Dungeon script, see:

- `#file:'E:\Programmierung\AID-Chaos\AutoCards\context.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\input.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\library.js'`  
- `#file:'E:\Programmierung\AID-Chaos\AutoCards\output.js'`

## Maintenance Guidelines

Whenever new logic or features are introduced, update  
`#file:'E:\Programmierung\AID-Chaos\README.md'`  
to reflect the current project scope and roadmap. This file should always contain:

- The overall project vision
- Planned features and logic
- Which parts are implemented and which are pending

## JavaScript Commenting Guidelines

When generating or editing JavaScript code, always include **English-language comments** that clearly describe the purpose and behavior of each function and logical block within a function.

### Requirements:
- Every function must begin with a comment summarizing its purpose.
- Inside each function, add comments before or within logical blocks (e.g., conditionals, loops, data transformations) explaining what the code does.
- Comments should be concise, informative, and written in natural English.
- Avoid redundant or obvious comments (e.g., `// increment i by 1` for `i++`), but do explain the intent behind the logic.

### Example:

```javascript
// Calculates the total price including tax
function calculateTotal(price, taxRate) {
  // Check if the input price is valid
  if (price < 0) {
    return 0;
  }

  // Compute the tax amount
  const tax = price * taxRate;

  // Return the final total
  return price + tax;
}
```

Also use at the start and end of a functions inside of AidChaos, and at importent positions the logDebug-funtion to write debug-log-messages.

Avoid using unicode characters in the comments. Use only basic Latin characters to ensure compatibility across different systems and editors.
