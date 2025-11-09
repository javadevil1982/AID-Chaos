// AidChaos shared library - minimal skeleton
// This file has been simplified to a minimal, well-documented scaffold
// so we can rebuild functionality step-by-step without side effects.

// Main exported entry point for the AidChaos library
function AidChaos(hook, inText, inStop) {
    "use strict";

    const STOP = inStop === true;

    // Purpose: Top-level entry point for AidChaos. Handles the three possible
    // hook types: 'input', 'context', and 'output'. Returns either a string
    // (modified text) or a tuple [text, stop] when appropriate.

    logDebug?.('Entering AidChaos');

    // Enable verbose debug output when true. Used by logDebug inside this function.
    // Toggle to `false` to silence internal debug logging.
    const showDebugOutput = true;

    // logDebug: centralized debug logging helper used throughout AidChaos.
    // This avoids scattered console.log checks and is safe in restricted envs.
    function logDebug(...args) {
        try {
            if (showDebugOutput) console.log('[AidChaos]', ...args);
        } catch (e) {
            // Ignore logging errors in restricted environments
        }
    }

    logDebug('The hook is: ' + hook);
    if (!hook) {
        // this way stop is available in context.js and can be used there directly
        globalThis.stop ??= false;
    }

    // AidChaosLib: class that encapsulates the library logic for all hooks.
    // All logic (helpers and handlers) should live inside this class so the
    // outer function only performs initial dispatch.
    class AidChaosLib {
        // Constructor: initialize the instance with debug settings and persistent state
        // options: { showDebug: boolean }
        constructor(options = {}) {
            // Use a simple boolean to enable/disable internal debug logging
            this.showDebug = options.showDebug === true;

            // Bind a lightweight instance-level logger to avoid referencing
            // outer-scope variables repeatedly. This logger mirrors the
            // semantics of the outer logDebug but is scoped to the class.
            this.logDebug = (...args) => {
                try {
                    if (this.showDebug) console.log('[AidChaosLib]', ...args);
                } catch (e) {
                    // Ignore logging errors in restricted environments
                }
            };

            this.logDebug('AidChaosLib initialized', { showDebug: this.showDebug });
        }

        // Read a past action from the global history array in a safe manner.
        // lookBack: 0 = most recent action. Returns a frozen object { text, type }.
        readPastAction(lookBack) {
            // Log entry for debugging
            this.logDebug('readPastAction - start', { lookBack });
            try {
                // Default empty action
                let action = {};
                if (Array.isArray(history) && history.length > 0) {
                    // Compute an index with bounds checking similar to Auto-Cards
                    // Use the same indexing scheme: history[history.length - 1 - abs(lookBack)]
                    const index = Math.max(0, history.length - 1 - Math.abs(lookBack || 0));
                    action = history[index] ?? {};
                }
                // Normalize returned properties: prefer 'text' then 'rawText', default to empty string
                const result = Object.freeze({
                    text: action?.text ?? action?.rawText ?? "",
                    type: action?.type ?? "unknown"
                });
                this.logDebug('readPastAction - end', result);
                return result;
            } catch (err) {
                // On any error, return a safe default
                this.logDebug('readPastAction - error', err);
                return Object.freeze({ text: "", type: "unknown" });
            }
        }

        // Find a story card by its exact title.
        // Returns the card object reference if found, otherwise null.
        findStoryCard(title) {
            this.logDebug('findStoryCard - start', { title });
            try {
                if (!Array.isArray(storyCards)) {
                    this.logDebug('findStoryCard - storyCards not available');
                    return null;
                }
                for (const card of storyCards) {
                    // Defensive check: skip invalid entries
                    if (!card || typeof card.title !== 'string') continue;
                    if (card.title === title) {
                        this.logDebug('findStoryCard - found', { title });
                        // Return the live card reference (not a copy) so callers can modify it
                        return card;
                    }
                }
                this.logDebug('findStoryCard - not found', { title });
                return null;
            } catch (err) {
                this.logDebug('findStoryCard - error', err);
                return null;
            }
        }

        // Create a new story card or update an existing one by title.
        // If a card with the given title exists, its 'entry' is overwritten.
        // If not, a new card object is appended to the global 'storyCards' array.
        // Returns the card object reference.
        createOrUpdateStoryCard(title, entryText) {
            this.logDebug('createOrUpdateStoryCard - start', { title, entryText });
            try {
                if (!Array.isArray(storyCards)) {
                    // If storyCards is missing, create it on globalThis for compatibility
                    this.logDebug('createOrUpdateStoryCard - storyCards missing, creating array');
                    globalThis.storyCards = [];
                }
                const existing = this.findStoryCard(title);
                if (existing) {
                    // Update the entry and timestamp
                    this.logDebug('createOrUpdateStoryCard - updating existing card');
                    existing.entry = entryText;
                    existing.updatedAt = new Date().toISOString();
                    return existing;
                }
                // Construct a minimal story card object and append it
                const card = {
                    type: 'class',
                    title: title,
                    keys: title,
                    entry: entryText,
                    description: '',
                    updatedAt: new Date().toISOString()
                };
                storyCards.push(card);
                this.logDebug('createOrUpdateStoryCard - created new card', card);
                return card;
            } catch (err) {
                this.logDebug('createOrUpdateStoryCard - error', err);
                return null;
            }
        }

        // Determine whether a type string represents a Do or Say action
        // Accepts strings like 'do', 'say' and returns boolean.
        isDoSay(type) {
            // Simple helper to centralize Do/Say checks
            return (type === 'do' || type === 'say');
        }

        // Determine the action type for a recent history entry in a robust,
        // reusable way. Returns strings like 'do', 'say', 'story', 'continue', or 'unknown'.
        // lookBack: 0 = most recent action. fallbackText is optional and used for heuristics.
        getActionType(lookBack = 0, fallbackText) {
            this.logDebug('getActionType - start', { lookBack });
            try {
                // First attempt: read the past action from history
                const action = this.readPastAction(lookBack);
                let type = action.type ?? "unknown";

                // If the action type is present and informative, return it immediately
                if (type && (type !== 'unknown')) {
                    this.logDebug('getActionType - found explicit type', { type });
                    return type;
                }

                // If the action type is missing or unknown, apply conservative heuristics
                const text = (action.text || "").toString();
                const trimmed = text.trim();

                // Heuristic 1: formatted Do actions in AI Dungeon often begin with ">" or "\n>"
                if (/^\s*>/.test(text) || /^>/.test(trimmed)) {
                    this.logDebug('getActionType - heuristic matched: leading > => do');
                    return 'do';
                }

                // Heuristic 2: quoted speech or the verbs said/says often indicate 'say'
                if (/\b(says?|said)\b/.test(text) && /"/.test(text)) {
                    this.logDebug('getActionType - heuristic matched: contains said/says + quotes => say');
                    return 'say';
                }

                // Heuristic 3: explicit continue prompt markers in the text indicate a 'continue' output
                if (/please select\s*"continue"/i.test(text) || />>>\s*please select "continue"/i.test(text)) {
                    this.logDebug('getActionType - heuristic matched: continue prompt => continue');
                    return 'continue';
                }

                // Heuristic 4: when fallbackText is supplied (current input), attempt a simple regex-based detection
                if (typeof fallbackText === 'string' && /^\s*>/.test(fallbackText)) {
                    this.logDebug('getActionType - fallbackText heuristic matched => do');
                    return 'do';
                }

                // Default fallback
                this.logDebug('getActionType - end => unknown');
                return 'unknown';
            } catch (err) {
                // On any error, fall back to a simple regex-based detection from fallbackText
                this.logDebug('getActionType - error', err);
                if (typeof fallbackText === 'string' && /^\s*>/.test(fallbackText)) {
                    this.logDebug('getActionType - fallback regex matched, returning do');
                    return 'do';
                }
                return 'unknown';
            }
        }

        // Handle input hook: determine whether the incoming user action is a Do/Say action.
        // If the action is not a 'do' or 'say', return the original text immediately.
        // If the action is 'do' or 'say', append a newline and the test suffix for verification.
        // This implementation delegates action-type detection to getActionType for reuse.
        handleInput(text) {
            // Log entry
            this.logDebug('handleInput - start', { text });

            // Use our robust detection to determine the action type; provide the input text as a fallback
            const actionType = this.getActionType(0, text);
            this.logDebug('handleInput - detected actionType', { actionType });

            // If the action is not a 'do' or 'say', leave the input unchanged
            if (!this.isDoSay(actionType)) {
                this.logDebug('handleInput - action not do/say, returning original text');
                this.logDebug('handleInput - end');
                return text;
            }

            // For testing: append a newline and the given test suffix
            const modified = text + '\n' + '[Write the Responce as childish as possible]';
            this.logDebug('handleInput - action is do/say, returning modified text', { modified });
            this.logDebug('handleInput - end');
            return modified;
        }

        // Handle context hook: return the expected tuple [text, stopFlag].
        // This accepts the stop flag explicitly rather than reading it from the constructor.
        handleContext(text, stopFlag) {
            this.logDebug('handleContext - start', { stopFlag });

            // Use the reusable getActionType helper. Provide the current input as a fallback text
            // so the helper can apply a secondary heuristic if history is unavailable or ambiguous.
            const actionType = this.getActionType(0, text);

            this.logDebug('handleContext - detected actionType:', actionType);

            // If the action is not a do/say action, return immediately with the original text
            if (actionType !== 'do' && actionType !== 'say') {
                this.logDebug('handleContext - action not do/say, returning original text');
                this.logDebug('handleContext - end');
                return [text, stopFlag === true];
            }

            //CheckStoryCard
            // Ensure a story card named "AidChaos Configuration" exists.
            // If it does not exist, create it with entry text "HalloWelt".
            // If it exists, overwrite its entry with "HalloWelt2".
            try {
                this.logDebug('handleContext - CheckStoryCard - start');
                const cfgTitle = 'AidChaos Configuration';
                const existing = this.findStoryCard(cfgTitle);
                if (!existing) {
                    this.logDebug('handleContext - CheckStoryCard - not found, creating');
                    this.createOrUpdateStoryCard(cfgTitle, 'HalloWelt');
                } else {
                    this.logDebug('handleContext - CheckStoryCard - found, updating');
                    this.createOrUpdateStoryCard(cfgTitle, 'HalloWelt2');
                }
                this.logDebug('handleContext - CheckStoryCard - end');
            } catch (err) {
                this.logDebug('handleContext - CheckStoryCard - error', err);
            }

            //CheckStoryCard end

            // For testing: append a newline and the given test suffix
            this.logDebug('handleContext - action is do/say, appending test suffix');
            const modified = text + '\n' + '[Write the Responce as childish as possible]';

            // Return the text alongside the explicit stop flag. This keeps the API
            // flexible and avoids tying the stored STOP value to the instance.
            const result = [modified, stopFlag === true];
            this.logDebug('handleContext - prepared result', result);
            this.logDebug('handleContext - end');
            return result;
        }

        // Handle output hook: return the text unchanged for now.
        // This is the place to implement output transformations or postprocessing.
        handleOutput(text) {
            this.logDebug('handleOutput - text unchanged');
            return text;
        }

        // Default handler: called when hook is unrecognized. Returns the
        // original text unchanged to keep the script side-effect free.
        handleDefault(text) {
            this.logDebug('handleDefault - text unchanged');
            return text;
        }
    }

    // Create an instance of AidChaosLib and delegate handling to it.
    // Pass the persistent `state` object when available so the library may persist data.
    const lib = new AidChaosLib({ showDebug: showDebugOutput });

    // Input hook: return the original text unchanged (or modified by AidChaosLib.handleInput)
    if (hook === 'input') {
        logDebug('Input hook - delegating to AidChaosLib.handleInput');
        const result = lib.handleInput(inText);
        logDebug('Exiting AidChaos (input)');
        return result;
    }

    // Context hook: return the expected tuple [text, STOP]
    if (hook === 'context') {
        logDebug('Context hook - delegating to AidChaosLib.handleContext');
        return lib.handleContext(inText, STOP);
    }

    if (hook === 'output') {
        logDebug('Output hook - delegating to AidChaosLib.handleOutput');
        const result = lib.handleOutput(inText);
        logDebug('Exiting AidChaos (output)');
        return result;
    }

    // Default: return the text unchanged. This ensures the script is side-effect free.
    logDebug('Default return - delegating to AidChaosLib.handleDefault');
    logDebug('Exiting AidChaos (default)');
    return lib.handleDefault(inText);
}

// Perform one-time initialization like AutoCards does; ignore errors in restricted envs
try { AidChaos(null); } catch (e) { /* ignore errors during initialization */ }
