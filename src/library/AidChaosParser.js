// =====================================================================
// AidChaosParser: Text tokenization and attribute detection
// Purpose: Parse player input and detect which attributes are relevant
// =====================================================================
class AidChaosParser {
    constructor(logDebug, attributesManager) {
        this.logDebug = logDebug;
        this.attributes = attributesManager;
    }

    // Tokenize text into lowercase words for matching
    // Returns array of tokens
    tokenize(text) {
        this.logDebug('tokenize - start');
        try {
            if (typeof text !== 'string') return [];
            
            const tokens = text
                .toLowerCase()
                .replace(/[""''"<>\[\]{}()]/g, ' ')
                .split(/[^a-z0-9']+/i)
                .map(t => t.trim())
                .filter(t => t.length > 0);
            
            this.logDebug('tokenize - result', tokens.length + ' tokens');
            return tokens;
        } catch (e) {
            this.logDebug('tokenize - error', e);
            return [];
        }
    }

    // Detect explicit attribute mentions in text (e.g., "using my strength")
    // Returns array of matched attribute names
    detectExplicitMentions(text) {
        this.logDebug('detectExplicitMentions - start');
        const mentioned = [];
        
        try {
            if (typeof text !== 'string') return mentioned;
            
            const attrNames = this.attributes.getAttributeNames();
            const lower = text.toLowerCase();
            
            for (const name of attrNames) {
                const pattern = new RegExp('\\b' + name.toLowerCase() + '\\b', 'i');
                if (pattern.test(lower)) {
                    this.logDebug('detectExplicitMentions - matched', name);
                    mentioned.push(name);
                }
            }
        } catch (e) {
            this.logDebug('detectExplicitMentions - error', e);
        }
        
        return mentioned;
    }

    // Detect all attributes matching trigger words in text
    // Returns array of matched attribute names
    detectTriggerMatches(tokens, rawText) {
        this.logDebug('detectTriggerMatches - start');
        const matched = new Set();
        
        try {
            const normalized = this.attributes.getNormalizedTriggers();
            const lowerText = (rawText || '').toLowerCase();

            // Check phrase triggers first (higher priority)
            for (const [attr, sets] of Object.entries(normalized)) {
                for (const phrase of sets.phrases) {
                    if (lowerText.includes(phrase)) {
                        this.logDebug('detectTriggerMatches - matched phrase', attr, phrase);
                        matched.add(attr);
                        break;
                    }
                }
            }

            // Check single-word triggers
            for (const [attr, sets] of Object.entries(normalized)) {
                for (const token of sets.singles) {
                    if (tokens.includes(token)) {
                        this.logDebug('detectTriggerMatches - matched token', attr, token);
                        matched.add(attr);
                        break;
                    }
                }
            }
        } catch (e) {
            this.logDebug('detectTriggerMatches - error', e);
        }
        
        return Array.from(matched);
    }

    // Detect all matching attributes from text (combines explicit + trigger detection)
    // Returns array of unique attribute names
    detectAllAttributes(text) {
        this.logDebug('detectAllAttributes - start');
        
        const explicit = this.detectExplicitMentions(text);
        const tokens = this.tokenize(text);
        const triggers = this.detectTriggerMatches(tokens, text);
        
        // Combine and deduplicate
        const all = new Set([...explicit, ...triggers]);
        const result = Array.from(all);
        
        this.logDebug('detectAllAttributes - result', result);
        return result;
    }
}
