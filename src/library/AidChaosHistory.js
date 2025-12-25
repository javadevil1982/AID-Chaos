// =====================================================================
// AidChaosHistory: Action history reading and type detection
// Purpose: Read past actions and determine action types (do, say, etc.)
// =====================================================================
class AidChaosHistory {
    constructor(logDebug) {
        this.logDebug = logDebug;
    }

    // Read a past action from the global history array
    // lookBack: 0 = most recent action, 1 = previous, etc.
    // Returns { text: string, type: string }
    readPastAction(lookBack = 0) {
        this.logDebug('readPastAction - start', lookBack);
        
        try {
            let action = {};
            
            if (typeof history !== 'undefined' && Array.isArray(history) && history.length > 0) {
                const index = Math.max(0, history.length - 1 - Math.abs(lookBack || 0));
                action = history[index] || {};
            }
            
            const result = Object.freeze({
                text: action?.text || action?.rawText || '',
                type: action?.type || 'unknown'
            });
            
            this.logDebug('readPastAction - result', result.type);
            return result;
        } catch (err) {
            this.logDebug('readPastAction - error', err);
            return Object.freeze({ text: '', type: 'unknown' });
        }
    }

    // Determine the action type for a history entry
    // lookBack: 0 = most recent action
    // fallbackText: optional text for heuristic detection
    // Returns: 'do', 'say', 'story', 'continue', or 'unknown'
    getActionType(lookBack = 0, fallbackText) {
        this.logDebug('getActionType - start', lookBack);
        
        try {
            const action = this.readPastAction(lookBack);
            let type = action.type;

            // If type is known and informative, return it
            if (type && type !== 'unknown') {
                this.logDebug('getActionType - explicit type', type);
                return type;
            }

            // Apply heuristics
            const text = (action.text || '').toString();
            const trimmed = text.trim();

            // Heuristic 1: Do actions often start with ">"
            if (/^\s*>/.test(text) || /^>/.test(trimmed)) {
                this.logDebug('getActionType - heuristic: leading > => do');
                return 'do';
            }

            // Heuristic 2: Say actions contain speech patterns
            if (/\b(says?|said)\b/.test(text) && /"/.test(text)) {
                this.logDebug('getActionType - heuristic: said/says + quotes => say');
                return 'say';
            }

            // Heuristic 3: Continue prompts
            if (/please select\s*"continue"/i.test(text) || />>>\s*please select "continue"/i.test(text)) {
                this.logDebug('getActionType - heuristic: continue prompt');
                return 'continue';
            }

            // Heuristic 4: Check fallback text
            if (typeof fallbackText === 'string' && /^\s*>/.test(fallbackText)) {
                this.logDebug('getActionType - fallback heuristic => do');
                return 'do';
            }

            this.logDebug('getActionType - unknown');
            return 'unknown';
        } catch (err) {
            this.logDebug('getActionType - error', err);
            
            // Last resort fallback
            if (typeof fallbackText === 'string' && /^\s*>/.test(fallbackText)) {
                return 'do';
            }
            return 'unknown';
        }
    }

    // Check if action type is a player input action
    isPlayerAction(type) {
        return type === 'do' || type === 'say' || type === 'story';
    }
}
