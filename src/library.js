function AidChaos(hook, inText, inStop) {
    "use strict";

/*
AidChaos - Controlled Heuristic Adaptive Outcome System v0.9
Made by Javadevil - December 2024

This AI Dungeon script automatically adds invisible dice-based resolution mechanics to player actions.
It detects attribute-related keywords and explicit attribute mentions in player input, then performs 
appropriate W100 rolls using character stats (1-10) to determine success/failure outcomes.

The AI receives outcome guidance through context injection, allowing it to narrate results naturally
without exposing the underlying mechanics to the player.

Free and open-source for anyone to use within their own scenarios or scripts!

Usage:
- Simply play naturally! The system detects action keywords like "push", "climb", "persuade", etc.
- Explicit attribute mentions (e.g., "using my strength") always trigger that specific attribute
- All mechanics are invisible to the player; the AI narrates outcomes based on roll results
- Configure attributes via the auto-generated story card (values 1-10, default is 5 for all)

For the Installation Guide, advanced usage, customization options, and technical details, see the README.md file in the project repository:
https://github.com/javadevil1982/AID-Chaos
*/

    const STOP = inStop === true;

    // Purpose: Top-level entry point for AidChaos. Handles the three possible
    // hook types: 'input', 'context', and 'output'. Returns either a string
    // (modified text) or a tuple [text, stop] when appropriate.

    logDebug?.('Entering AidChaos');

    // Enable verbose debug output when true. Used by logDebug inside this function.
    // Toggle to `false` to silence internal debug logging.
    const showDebugOutput = false;

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

            // Initialize attribute trigger map with default RPG attributes and triggers.
            // Purpose: Provide a clear, editable mapping from attribute names to the
            // associated trigger words that CHAOS will look for in player input.
            // Keep this structure compact and easy to edit for scenario authors.
            this.attributes = AidChaosLib.getDefaultAttributes();
        }

        // Return the default attributes mapping.
        // Purpose: Centralizes the default attribute definitions so they can be
        // inspected or overridden by scenario code before runtime.
        // Each attribute now includes:
        // - triggers: array of trigger words/phrases
        // - guidance_text_critical_success: optional guidance for critical success
        // - guidance_text_success: optional guidance for success
        // - guidance_text_partial_success: optional guidance for partial success
        // - guidance_text_failure: optional guidance for failure
        // - guidance_text_critical_failure: optional guidance for critical failure
        static getDefaultAttributes() {
            // Note: Use lowercased trigger words for simple matching later.
            return {
                // Strength: physical force, lifting, pushing, breaking
                Strength: {
                    triggers: [
                        'lift', 'push', 'pull', 'break', 'carry', 'shove', 'throw', 'crush', 'pry', 'wrestle',
                        'smash', 'bash', 'strike', 'hit', 'punch', 'kick', 'slam', 'haul', 'drag', 'tackle',
                        'rip', 'tear', 'bend', 'heave', 'ram', 'force', 'grapple', 'press', 'burst', 'knock',
                        'overpower', 'pound', 'shatter', 'thrust', 'brace', 'strain', 'snap'
                    ],
                    guidance_text_critical_success: 'The character greatly exceeds normal physical limits and gains an impressive advantage.',
                    guidance_text_success: 'The character succeeds at the physical task in a solid and believable way.',
                    guidance_text_partial_success: 'The character makes progress, but the physical outcome is incomplete or costly.',
                    guidance_text_failure: 'The physical attempt does not succeed and the obstacle remains in place.',
                    guidance_text_critical_failure: 'The character badly misjudges their physical power and suffers a setback or harm.'
                },

                // Dexterity: fine motor tasks, balancing, dodging, climbing
                Dexterity: {
                    triggers: [
                        'dodge', 'climb', 'balance', 'catch', 'sneak', 'pickpocket', 'acrobat', 'jump', 'steal', 'parry',
                        'roll', 'flip', 'vault', 'evade', 'weave', 'sidestep', 'crawl', 'slide', 'duck', 'twist',
                        'maneuver', 'aim', 'draw', 'fire', 'reload', 'dance', 'juggle', 'lockpick',
                        'tie', 'untie', 'disarm', 'feint', 'backflip', 'tiptoe', 'land', 'react', 'grab', 'snatch', 'silent'
                    ],
                    guidance_text_critical_success: 'The character executes the precise movement with extraordinary grace and speed, achieving an optimal result.',
                    guidance_text_success: 'The character performs the agile or precise action competently and effectively.',
                    guidance_text_partial_success: 'The character manages the delicate task, but the execution is flawed or draws unwanted attention.',
                    guidance_text_failure: 'The character cannot execute the fine motor or agile maneuver as intended.',
                    guidance_text_critical_failure: 'The character loses control, stumbles badly, or creates a loud commotion that worsens the situation.'
                },

                // Intelligence: solving, analyzing, figuring out
                Intelligence: {
                    triggers: [
                        'analyze', 'solve', 'calculate', 'deduce', 'research', 'study', 'investigate', 'learn', 'plan',
                        'think', 'remember', 'reason', 'strategize', 'inspect', 'examine', 'read', 'interpret', 'translate', 'decipher',
                        'invent', 'design', 'engineer', 'craft', 'create', 'synthesize', 'formulate', 'compare', 'predict', 'diagnose',
                        'recall', 'evaluate', 'categorize', 'compile', 'crosscheck', 'hypothesize', 'experiment',
                        'teach', 'educate', 'program', 'estimate', 'map'
                    ],
                    guidance_text_critical_success: 'The character gains a brilliant insight or solves the problem in a remarkably efficient and creative way.',
                    guidance_text_success: 'The character figures out the puzzle, recalls the information, or completes the intellectual task successfully.',
                    guidance_text_partial_success: 'The character grasps part of the solution or finds a clue, but key details remain unclear or require more effort.',
                    guidance_text_failure: 'The character cannot solve the problem, recall the fact, or understand the mechanism at this time.',
                    guidance_text_critical_failure: 'The character draws a dangerously wrong conclusion or forgets crucial information, leading to a significant mistake.'
                },

                // Charisma: persuasion, negotiation, intimidation, seduction
                Charisma: {
                    triggers: [
                        'persuade', 'convince', 'seduce', 'negotiate', 'charm', 'intimidate', 'flatter', 'lie', 'beguile',
                        'encourage', 'inspire', 'motivate', 'cheer', 'taunt', 'mock', 'deceive', 'perform', 'entertain', 'comfort',
                        'lead', 'command', 'manipulate', 'coerce', 'rally', 'boast', 'compliment', 'impress', 'debate', 'argue',
                        'question', 'beg', 'plead', 'befriend', 'threaten', 'scold', 'praise', 'propose', 'flirt', 'sing', 'act', 'bluff', 'story'
                    ],
                    guidance_text_critical_success: 'The character wins over the other party completely, forming a strong positive impression or gaining exceptional cooperation.',
                    guidance_text_success: 'The character succeeds in the social interaction; the target is inclined to react positively and be more open toward them.',
                    guidance_text_partial_success: 'The character makes some headway socially, but the target remains guarded or asks for something in return.',
                    guidance_text_failure: 'The social attempt falls flat; the target is unmoved, skeptical, or uninterested.',
                    guidance_text_critical_failure: 'The character offends, alienates, or provokes the target, making the situation significantly worse.'
                },

                // Perception (alias of wisdom for many systems) kept separate for clarity
                Perception: {
                    triggers: [
                        'see', 'spot', 'hear', 'listen', 'discover', 'detect', 'observe', 'scan', 'search',
                        'notice', 'smell', 'sense', 'feel', 'peek', 'survey', 'inspect',
                        'track', 'follow', 'glimpse', 'watch', 'recognize', 'identify', 'perceive',
                        'overhear', 'taste', 'sniff', 'discern', 'clue'
                    ],
                    guidance_text_critical_success: 'The character notices hidden or subtle details that reveal important secrets or give a decisive advantage.',
                    guidance_text_success: 'The character perceives the relevant details, clues, or dangers in the environment clearly.',
                    guidance_text_partial_success: 'The character picks up on something, but the information is incomplete or ambiguous.',
                    guidance_text_failure: 'The character fails to notice the important detail, clue, or threat.',
                    guidance_text_critical_failure: 'The character misinterprets what they sense, leading to a false assumption or walking into danger.'
                }
            };
        }

        // Build normalized attribute trigger sets (single word vs phrase) for faster matching.
        // Filters out any empty strings and trims spaces. Called lazily before first use.
        buildNormalizedAttributes() {
            this.logDebug('buildNormalizedAttributes - start');
            if (this._normalized) return this._normalized; // cache
            const normalized = {};
            for (const [attr, attrData] of Object.entries(this.attributes)) {
                const singles = new Set();
                const phrases = [];
                const triggers = attrData.triggers || [];
                for (let raw of triggers) {
                    if (typeof raw !== 'string') continue;
                    const trig = raw.toLowerCase().trim();
                    if (!trig) continue;
                    if (/\s/.test(trig)) {
                        // phrase trigger -> store for substring search
                        phrases.push(trig);
                    } else {
                        singles.add(trig);
                    }
                }
                normalized[attr] = { singles, phrases, data: attrData };
            }
            this._normalized = normalized;
            this.logDebug('buildNormalizedAttributes - end', normalized);
            return normalized;
        }

        // Load, parse, normalize and (if needed) create/update the configuration
        // story card named "AidChaos Configuration". Returns the resulting
        // settings object with structure { enabled: boolean, attributes: {<Name>: number} }.
        // This version uses only the human-readable card format (no JSON tail) and
        // follows AutoCards-style parsing for resilience.
        loadConfiguration() {
            this.logDebug('loadConfiguration - start');
            try {
                const cfgTitle = 'AidChaos Configuration';

                // Default settings: enabled true, default attributes set to 5
                const defaults = { enabled: true, attributes: {} };
                const defaultAttrKeys = Object.keys(AidChaosLib.getDefaultAttributes());
                for (const k of defaultAttrKeys) defaults.attributes[k] = 5;

                // Helper: build canonical card text (human readable only)
                const buildCardText = (enabled, attributes) => {
                    const lines = [];
                    lines.push('AidChaos enabled: ' + (enabled ? 'true' : 'false'));
                    lines.push('');
                    lines.push('Attributes:');
                    for (const key of Object.keys(attributes)) {
                        lines.push('- ' + key + ': ' + attributes[key]);
                    }
                    return lines.join('\n');
                };

                // Start with defaults
                const settings = JSON.parse(JSON.stringify(defaults));
                const card = this.findStoryCard(cfgTitle);

                if (!card) {
                    // No card: create one with normalized defaults and return settings
                    this.logDebug('loadConfiguration - card not found, creating with defaults');
                    const newText = buildCardText(settings.enabled, settings.attributes);
                    this.createOrUpdateStoryCard(cfgTitle, newText, 'settings');
                    this.logDebug('loadConfiguration - created card with defaults');
                    this.logDebug('loadConfiguration - end', settings);
                    return settings;
                }

                // Card exists: parse human-readable content
                const raw = (card.entry || '').toString();

                // 1) Parse enabled flag. Accept variations like leading '>' or whitespace.
                const enabledMatch = raw.match(/(?:^|\n)\s*>?\s*AidChaos\s*enabled\s*:\s*(true|false)/i);
                if (enabledMatch) {
                    settings.enabled = /^true$/i.test(enabledMatch[1]);
                    this.logDebug('loadConfiguration - parsed enabled flag', { enabled: settings.enabled });
                }

                // 2) Parse Attributes section. Capture text after the Attributes: header.
                const attrSectionMatch = raw.match(/Attributes\s*:\s*([\s\S]*?)$/i);
                if (attrSectionMatch) {
                    const attrLines = attrSectionMatch[1].split(/\n/);
                    for (const line of attrLines) {
                        // Match lines like "- Strength: 5" or "Strength: 5" optionally prefixed by '>' or whitespace
                        const m = line.match(/(?:^|\s|>)*\s*-?\s*([A-Za-z][A-Za-z0-9 _'\-]+)\s*:\s*(-?\d+)/);
                        if (m) {
                            const rawKey = m[1].trim();
                            const val = Number(m[2]);
                            // Map key case-insensitively to default keys
                            const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase()) || rawKey;
                            if (Number.isFinite(val)) {
                                settings.attributes[matchKey] = Math.min(10, Math.max(1, Math.floor(val)));
                                this.logDebug('loadConfiguration - parsed attribute', { key: matchKey, value: settings.attributes[matchKey] });
                            }
                        }
                    }
                }

                // Ensure all default keys exist and are clamped to 1..10
                for (const k of defaultAttrKeys) {
                    if (!(k in settings.attributes)) settings.attributes[k] = 5;
                    else settings.attributes[k] = Math.min(10, Math.max(1, Math.floor(settings.attributes[k])));
                }

                // Build normalized card text and update if differing
                const normalizedText = buildCardText(settings.enabled, settings.attributes);
                if ((card.entry || '') !== normalizedText) {
                    this.logDebug('loadConfiguration - normalized differs, updating card');
                    this.createOrUpdateStoryCard(cfgTitle, normalizedText, 'settings');
                } else {
                    this.logDebug('loadConfiguration - card already normalized');
                }

                this.logDebug('loadConfiguration - end', settings);
                return settings;
            } catch (err) {
                this.logDebug('loadConfiguration - error', err);
                // On error, fallback to basic defaults
                const fallback = { enabled: true, attributes: {} };
                const defaultAttrKeys = Object.keys(AidChaosLib.getDefaultAttributes());
                for (const k of defaultAttrKeys) fallback.attributes[k] = 5;
                this.logDebug('loadConfiguration - end with fallback', fallback);
                return fallback;
            }
        }

        // Provide a convenient accessor for attribute triggers.
        // Purpose: Return the attribute name whose trigger list contains any
        // of the words present in the given lowercased token array.
        // tokens: array of lowercased words extracted from an input string.
        getAttributeFromTokens(tokens) {
            this.logDebug('getAttributeFromTokens - start', { tokens });
            // Iterate attributes and their triggers to find the first match
            for (const [attr, attrData] of Object.entries(this.attributes)) {
                const triggers = attrData.triggers || [];
                for (const trig of triggers) {
                    if (tokens.includes(trig)) {
                        this.logDebug('getAttributeFromTokens - matched', { attr, trig });
                        return attr;
                    }
                }
            }
            this.logDebug('getAttributeFromTokens - no match');
            return null;
        }

        // Determine ALL attributes that match triggers in the given tokens and raw text.
        // Returns an array of attribute names (can be empty).
        // Priority: phrase triggers first, then single tokens.
        getAllMatchingAttributes(tokens, rawText) {
            this.logDebug('getAllMatchingAttributes - start', { tokens });
            const matched = new Set();
            try {
                const norm = this.buildNormalizedAttributes();
                const lowerText = (rawText || '').toLowerCase();

                // Phrase scan first
                for (const [attr, sets] of Object.entries(norm)) {
                    for (const phrase of sets.phrases) {
                        if (lowerText.includes(phrase)) {
                            this.logDebug('getAllMatchingAttributes - matched phrase', { attr, phrase });
                            matched.add(attr);
                            break; // found one trigger for this attribute, move to next attribute
                        }
                    }
                }

                // Single token scan
                for (const [attr, sets] of Object.entries(norm)) {
                    for (const token of sets.singles) {
                        if (tokens.includes(token)) {
                            this.logDebug('getAllMatchingAttributes - matched token', { attr, token });
                            matched.add(attr);
                            break; // found one trigger for this attribute, move to next attribute
                        }
                    }
                }
            } catch (e) {
                this.logDebug('getAllMatchingAttributes - error', e);
            }
            const result = Array.from(matched);
            this.logDebug('getAllMatchingAttributes - result', result);
            return result;
        }

        // Determine attribute from tokens + raw text. Priority: phrase triggers first then single tokens.
        getAttributeFromTriggers(tokens, rawText) {
            this.logDebug('getAttributeFromTriggers - start', { tokens });
            try {
                const norm = this.buildNormalizedAttributes();
                const lowerText = (rawText || '').toLowerCase();
                // Phrase scan first
                for (const [attr, sets] of Object.entries(norm)) {
                    for (const phrase of sets.phrases) {
                        if (lowerText.includes(phrase)) {
                            this.logDebug('getAttributeFromTriggers - matched phrase', { attr, phrase });
                            return attr;
                        }
                    }
                }
                // Single token scan
                for (const [attr, sets] of Object.entries(norm)) {
                    for (const token of sets.singles) {
                        if (tokens.includes(token)) {
                            this.logDebug('getAttributeFromTriggers - matched token', { attr, token });
                            return attr;
                        }
                    }
                }
            } catch (e) {
                this.logDebug('getAttributeFromTriggers - error', e);
            }
            this.logDebug('getAttributeFromTriggers - no match');
            return null;
        }

        // Tokenize an input string into lowercase words for simple matching.
        // Returns an array of tokens. Splits on non-word characters and filters empties.
        tokenize(text) {
            this.logDebug('tokenize - start', { text });
            try {
                if (typeof text !== 'string') return [];
                const tokens = text
                    .toLowerCase()
                    .replace(/[“”‘’"<>\[\]{}()]/g, ' ')
                    .split(/[^a-z0-9']+/i)
                    .map(t => t.trim())
                    .filter(t => t.length > 0);
                this.logDebug('tokenize - tokens', tokens);
                return tokens;
            } catch (e) {
                this.logDebug('tokenize - error', e);
                return [];
            }
        }

        // Detect whether an attribute name is explicitly mentioned in the given text.
        // Returns an array of all explicitly mentioned attribute names (matching default key casing).
        attributeMentionsInText(text) {
            this.logDebug('attributeMentionsInText - start', { text });
            const mentioned = [];
            try {
                if (typeof text !== 'string') return mentioned;
                const defaultAttrKeys = Object.keys(AidChaosLib.getDefaultAttributes());
                const lower = text.toLowerCase();
                for (const key of defaultAttrKeys) {
                    // Match whole word occurrences of the attribute name (case-insensitive)
                    const pattern = new RegExp('\\b' + key.toLowerCase() + '\\b', 'i');
                    if (pattern.test(lower)) {
                        this.logDebug('attributeMentionsInText - matched', { key });
                        mentioned.push(key);
                    }
                }
                this.logDebug('attributeMentionsInText - result', mentioned);
                return mentioned;
            } catch (e) {
                this.logDebug('attributeMentionsInText - error', e);
                return mentioned;
            }
        }

        // Detect whether an attribute name is explicitly mentioned in the given text.
        // Returns the attribute key (matching default key casing) or null.
        // DEPRECATED: Use attributeMentionsInText for multi-attribute support.
        attributeMentionInText(text) {
            this.logDebug('attributeMentionInText - start', { text });
            const mentioned = this.attributeMentionsInText(text);
            const result = mentioned.length > 0 ? mentioned[0] : null;
            this.logDebug('attributeMentionInText - result', result);
            return result;
        }

        // Perform a W100 roll using the attribute value and classify the outcome
        // according to the README's rules. Returns { roll, base, resultType, humanMessage, guidanceText }.
        // attrName: the attribute name
        // attrValue: the attribute value (1-10)
        performAttributeRoll(attrName, attrValue) {
            this.logDebug('performAttributeRoll - start', { attrName, attrValue });
            try {
                const roll = Math.floor(Math.random() * 100) + 1; // 1..100
                const base = 20 + (Number(attrValue) * 5);
                const critThreshold = Math.max(1, Math.floor(base * 0.1));
                const partialThreshold = base + 15;
                const failThreshold = 90 + Math.floor(base * 0.1);

                let resultType = 'Failure';
                let humanMessage = '';
                let guidanceKey = 'guidance_text_failure';

                if (roll === 1 || roll <= critThreshold) {
                    resultType = 'Critical Success';
                    humanMessage = 'Outstanding success. The action succeeds spectacularly.';
                    guidanceKey = 'guidance_text_critical_success';
                } else if (roll <= base) {
                    resultType = 'Success';
                    humanMessage = 'Normal success. The action succeeds.';
                    guidanceKey = 'guidance_text_success';
                } else if (roll <= partialThreshold) {
                    resultType = 'Partial Success';
                    humanMessage = 'Partial success. The action succeeds with a drawback.';
                    guidanceKey = 'guidance_text_partial_success';
                } else if (roll <= failThreshold) {
                    resultType = 'Failure';
                    humanMessage = 'Failure. The action fails.';
                    guidanceKey = 'guidance_text_failure';
                } else {
                    resultType = 'Critical Failure';
                    humanMessage = 'Critical failure. Catastrophic result.';
                    guidanceKey = 'guidance_text_critical_failure';
                }

                // Retrieve the custom guidance text for this attribute and result type
                const attrData = this.attributes[attrName] || {};
                const guidanceText = attrData[guidanceKey] || humanMessage;

                const result = { roll, base, resultType, humanMessage, guidanceText };
                this.logDebug('performAttributeRoll - end', result);
                return result;
            } catch (e) {
                this.logDebug('performAttributeRoll - error', e);
                return {
                    roll: 1,
                    base: 0,
                    resultType: 'Critical Success',
                    humanMessage: 'Defaulted to critical success on error.',
                    guidanceText: 'Defaulted to critical success on error.'
                };
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
        createOrUpdateStoryCard(title, entryText, cardtype) {
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
                    type: cardtype,
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

        // Determine whether a type string represents a Do action
        // Accepts strings like 'do' and returns boolean.
        isDo(type) {
            // Simple helper to centralize Do checks
            return (type === 'do');
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

        // Handle input hook
        handleInput(text) {
            this.logDebug('handleInput - text unchanged');
            return text;
        }

        // Handle context hook: return the expected tuple [text, stopFlag].
        // This accepts the stop flag explicitly rather than reading it from the constructor.
        handleContext(text, stopFlag) {
            this.logDebug('handleContext - start', { stopFlag });

            // Use the reusable getActionType helper. Provide the current input as a fallback text
            // so the helper can apply a secondary heuristic if history is unavailable or ambiguous.
            const actionType = this.getActionType(0, text);

            this.logDebug('handleContext - detected actionType:', actionType);

            // If the action is not a do action, return immediately with the original text
            if (actionType !== 'do') {
                this.logDebug('handleContext - action not do, returning original text');
                this.logDebug('handleContext - end');
                return [text, stopFlag === true];
            }

            // Load configuration from the "AidChaos Configuration" story card.
            // The logic for loading, parsing and normalizing the card has been
            // moved into loadConfiguration(). Call it here and persist the
            // resulting settings to state for later use.
            try {
                this.logDebug('handleContext - invoking loadConfiguration');
                const settings = this.loadConfiguration();
                // Persist to state so other hooks can use the current settings
                try {
                    state.AidChaosConfig = settings;
                } catch (e) {
                    // Non-fatal: if state is unavailable or read-only, continue
                    this.logDebug('handleContext - failed to persist settings to state', e);
                }
                this.logDebug('handleContext - loaded settings', settings);

                // If the system is explicitly disabled, skip CHAOS processing
                if (settings.enabled === false) {
                    this.logDebug('handleContext - CHAOS disabled in settings, skipping');
                    return [text, stopFlag === true];
                }

                // Determine whether the most recent user action (history) mentions an attribute
                // or contains trigger keywords. We check the last history entry, not the current
                // `text` parameter. If no attribute is detected, do nothing.
                const lastAction = this.readPastAction(0);
                const lastText = (lastAction.text || "").toString();
                this.logDebug('handleContext - lastAction text', { lastText });

                // 1) Detect all explicitly mentioned attributes in the raw history text
                const explicitAttrs = this.attributeMentionsInText(lastText);

                // 2) Detect all attributes via trigger-word detection via tokenization
                const tokens = this.tokenize(lastText);
                const triggerAttrs = this.getAllMatchingAttributes(tokens, lastText);

                // 3) Combine both lists (use Set to avoid duplicates)
                const allDetectedAttrs = new Set([...explicitAttrs, ...triggerAttrs]);
                const detectedAttrsList = Array.from(allDetectedAttrs);

                // If no attributes detected, leave context unchanged
                if (detectedAttrsList.length === 0) {
                    this.logDebug('handleContext - no attributes detected, exiting');
                    return [text, stopFlag === true];
                }

                this.logDebug('handleContext - detected attributes', detectedAttrsList);

                // Normalize detected attribute keys to the case used in settings (case-insensitive match)
                const defaultAttrKeys = Object.keys(AidChaosLib.getDefaultAttributes());

                // Roll for each detected attribute and collect results
                const rollResults = [];
                let hasFailure = false;

                for (const detectedAttr of detectedAttrsList) {
                    const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === detectedAttr.toLowerCase()) || detectedAttr;
                    const attrValue = Number(settings.attributes?.[matchKey] ?? 5) || 5;
                    this.logDebug('handleContext - rolling for attribute', { matchKey, attrValue });

                    // Perform the roll and compute the outcome
                    const rollResult = this.performAttributeRoll(matchKey, attrValue);
                    this.logDebug('handleContext - rollResult', rollResult);

                    // Track if any roll resulted in failure or critical failure
                    if (rollResult.resultType === 'Failure' || rollResult.resultType === 'Critical Failure') {
                        hasFailure = true;
                    }

                    rollResults.push({
                        attribute: matchKey,
                        ...rollResult
                    });
                }

                // Build a comprehensive human-readable CHAOS result string to append to the context
                const chaosLines = ['['];

                for (const result of rollResults) {
                    chaosLines.push('The part of the action that depended on ' + result.attribute + ' was a ' + result.resultType.toUpperCase() + '.');
                    if (result.guidanceText)
                        chaosLines.push('Guidance: ' + result.guidanceText);
                    chaosLines.push('');
                }

                // Add causality rule if any failure occurred
                if (hasFailure) {
                    chaosLines.push('Causality rule');
                    chaosLines.push('The declared action may include several parts. If an earlier part fails in a way that makes later parts impossible, do not narrate those later parts as actually happening. You may show the character\'s intention, frustration, or delayed opportunities, but the impossible actions themselves do not occur in this scene.');
                    chaosLines.push('');
                }

                // Add narration rule
                chaosLines.push('Narration rule');
                chaosLines.push('Use these outcomes when continuing the story.');
                chaosLines.push('Show the consequences naturally in the scene.');
                chaosLines.push('Do not mention dice, rolls, or attribute names directly.');
                chaosLines.push(']');

                const chaosMessage = chaosLines.join('\n');

                // Append the CHAOS result to the outgoing context text and return
                const modified = text + '\n' + chaosMessage;
                this.logDebug('handleContext - returning modified context with CHAOS message', { modified });
                this.logDebug('handleContext - end');
                return [modified, stopFlag === true];

            } catch (err) {
                this.logDebug('handleContext - error during CHAOS processing', err);
                // On error, return original text unchanged
                this.logDebug('handleContext - end (error fallback)');
                return [text, stopFlag === true];
            }
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

        // Read a past action from the global history array in a safe manner.
        // lookBack: 0 = most recent action. Returns a frozen object { text, type }.
        readPastAction(lookBack) {
            this.logDebug('readPastAction - start', { lookBack });
            try {
                let action = {};
                if (Array.isArray(history) && history.length > 0) {
                    // Compute an index with bounds checking similar to Auto-Cards
                    // Use indexing scheme: history[history.length - 1 - abs(lookBack)]
                    const index = Math.max(0, history.length - 1 - Math.abs(lookBack || 0));
                    action = history[index] ?? {};
                }
                const result = Object.freeze({
                    text: action?.text ?? action?.rawText ?? "",
                    type: action?.type ?? "unknown"
                });
                this.logDebug('readPastAction - end', result);
                return result;
            } catch (err) {
                this.logDebug('readPastAction - error', err);
                return Object.freeze({ text: "", type: "unknown" });
            }
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
