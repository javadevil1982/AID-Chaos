// =====================================================================
// AidChaosAttributes: Default RPG attributes and trigger word definitions
// Purpose: Centralized definition of all attributes, triggers, and guidance texts
// =====================================================================
class AidChaosAttributes {
    constructor() {
        // Initialize with default attributes
        this.attributes = AidChaosAttributes.getDefaults();
        this._normalizedCache = null;
    }

    // Returns the default attributes with triggers and guidance texts
    // Each attribute includes:
    // - triggers: array of words/phrases that activate this attribute
    // - guidance_text_*: AI guidance for each outcome type
    static getDefaults() {
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

            // Perception: noticing, sensing, detecting
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

    // Returns array of attribute names (e.g., ['Strength', 'Dexterity', ...])
    getAttributeNames() {
        return Object.keys(this.attributes);
    }

    // Returns the attribute data for a given name, or null if not found
    getAttribute(name) {
        return this.attributes[name] || null;
    }

    // Returns the guidance text for a given attribute and result type
    // resultType: 'critical_success', 'success', 'partial_success', 'failure', 'critical_failure'
    getGuidanceText(attrName, resultType) {
        const attr = this.attributes[attrName];
        if (!attr) return null;
        const key = 'guidance_text_' + resultType;
        return attr[key] || null;
    }

    // Build normalized trigger sets for efficient matching
    // Returns { attrName: { singles: Set, phrases: [] } }
    getNormalizedTriggers() {
        if (this._normalizedCache) {
            return this._normalizedCache;
        }

        const normalized = {};
        for (const [attr, attrData] of Object.entries(this.attributes)) {
            const singles = new Set();
            const phrases = [];
            const triggers = attrData.triggers || [];
            
            for (const raw of triggers) {
                if (typeof raw !== 'string') continue;
                const trig = raw.toLowerCase().trim();
                if (!trig) continue;
                
                if (/\s/.test(trig)) {
                    // Multi-word phrase
                    phrases.push(trig);
                } else {
                    // Single word
                    singles.add(trig);
                }
            }
            normalized[attr] = { singles, phrases };
        }
        
        this._normalizedCache = normalized;
        return normalized;
    }
}


// =====================================================================
// AidChaosStoryCards: Story card management (find, create, update)
// Purpose: Encapsulates all interactions with the global storyCards array
// =====================================================================
class AidChaosStoryCards {
    constructor(logDebug) {
        this.logDebug = logDebug;
    }

    // Find a story card by its exact title
    // Returns the card object reference if found, otherwise null
    findStoryCard(title) {
        this.logDebug('findStoryCard - start', title);
        try {
            if (typeof storyCards === 'undefined' || !Array.isArray(storyCards)) {
                this.logDebug('findStoryCard - storyCards not available');
                return null;
            }
            
            for (const card of storyCards) {
                if (!card || typeof card.title !== 'string') continue;
                if (card.title === title) {
                    this.logDebug('findStoryCard - found', title);
                    return card;
                }
            }
            
            this.logDebug('findStoryCard - not found', title);
            return null;
        } catch (err) {
            this.logDebug('findStoryCard - error', err);
            return null;
        }
    }

    // Create a new story card or update an existing one
    // Returns the card object reference
    createOrUpdateStoryCard(title, entryText, cardType) {
        this.logDebug('createOrUpdateStoryCard - start', title);
        try {
            // Ensure storyCards exists
            if (typeof storyCards === 'undefined' || !Array.isArray(storyCards)) {
                this.logDebug('createOrUpdateStoryCard - creating storyCards array');
                globalThis.storyCards = [];
            }
            
            const existing = this.findStoryCard(title);
            if (existing) {
                this.logDebug('createOrUpdateStoryCard - updating existing card');
                existing.entry = entryText;
                existing.updatedAt = new Date().toISOString();
                return existing;
            }
            
            // Create new card
            const card = {
                type: cardType,
                title: title,
                keys: title,
                entry: entryText,
                description: '',
                updatedAt: new Date().toISOString()
            };
            storyCards.push(card);
            this.logDebug('createOrUpdateStoryCard - created new card', title);
            return card;
        } catch (err) {
            this.logDebug('createOrUpdateStoryCard - error', err);
            return null;
        }
    }
}


// =====================================================================
// AidChaosConfiguration: Configuration loading and management
// Purpose: Load, parse, and normalize the AidChaos Configuration story card
// =====================================================================
class AidChaosConfiguration {
    constructor(logDebug, storyCardsManager, attributesManager) {
        this.logDebug = logDebug;
        this.storyCards = storyCardsManager;
        this.attributes = attributesManager;
    }

    // Load configuration from the "AidChaos Configuration" story card
    // Returns { enabled: boolean, resultOutput: boolean, attributes: {<Name>: number} }
    load() {
        this.logDebug('AidChaosConfiguration.load - start');
        try {
            const cfgTitle = 'AidChaos Configuration';
            const defaultAttrKeys = this.attributes.getAttributeNames();

            // Default settings
            const defaults = { 
                enabled: true, 
                resultOutput: false, 
                attributes: {} 
            };
            for (const k of defaultAttrKeys) {
                defaults.attributes[k] = 5;
            }

            // Start with defaults
            const settings = JSON.parse(JSON.stringify(defaults));
            const card = this.storyCards.findStoryCard(cfgTitle);

            if (!card) {
                // No card exists: create one with defaults
                this.logDebug('AidChaosConfiguration.load - card not found, creating');
                const newText = this._buildCardText(settings.enabled, settings.resultOutput, settings.attributes);
                this.storyCards.createOrUpdateStoryCard(cfgTitle, newText, 'settings');
                return settings;
            }

            // Parse existing card
            const raw = (card.entry || '').toString();
            this._parseCard(raw, settings, defaultAttrKeys);

            // Ensure all default keys exist and are clamped to 1..10
            for (const k of defaultAttrKeys) {
                if (!(k in settings.attributes)) {
                    settings.attributes[k] = 5;
                } else {
                    settings.attributes[k] = Math.min(10, Math.max(1, Math.floor(settings.attributes[k])));
                }
            }

            // Update card if content changed after normalization
            const normalizedText = this._buildCardText(settings.enabled, settings.resultOutput, settings.attributes);
            if ((card.entry || '') !== normalizedText) {
                this.logDebug('AidChaosConfiguration.load - updating card');
                this.storyCards.createOrUpdateStoryCard(cfgTitle, normalizedText, 'settings');
            }

            this.logDebug('AidChaosConfiguration.load - end', settings);
            return settings;
        } catch (err) {
            this.logDebug('AidChaosConfiguration.load - error', err);
            return this._getFallbackSettings();
        }
    }

    // Build the canonical card text format
    _buildCardText(enabled, resultOutput, attributes) {
        const lines = [];
        lines.push('AidChaos enabled: ' + (enabled ? 'true' : 'false'));
        lines.push('Result Output enabled: ' + (resultOutput ? 'true' : 'false'));
        lines.push('');
        lines.push('Attributes:');
        for (const key of Object.keys(attributes)) {
            lines.push('- ' + key + ': ' + attributes[key]);
        }
        return lines.join('\n');
    }

    // Parse card content into settings object
    _parseCard(raw, settings, defaultAttrKeys) {
        // Parse enabled flag
        const enabledMatch = raw.match(/(?:^|\n)\s*>?\s*AidChaos\s+enabled\s*:\s*(true|false)/i);
        if (enabledMatch) {
            settings.enabled = /^true$/i.test(enabledMatch[1]);
            this.logDebug('AidChaosConfiguration - parsed enabled', settings.enabled);
        }

        // Parse resultOutput flag
        const resultOutputMatch = raw.match(/(?:^|\n)\s*>?\s*Result\s+Output\s+enabled\s*:\s*(true|false)/i);
        if (resultOutputMatch) {
            settings.resultOutput = /^true$/i.test(resultOutputMatch[1]);
            this.logDebug('AidChaosConfiguration - parsed resultOutput', settings.resultOutput);
        }

        // Parse Attributes section
        const attrSectionMatch = raw.match(/Attributes\s*:\s*([\s\S]*?)$/i);
        if (attrSectionMatch) {
            const attrLines = attrSectionMatch[1].split(/\n/);
            for (const line of attrLines) {
                const m = line.match(/(?:^|\s|>)*\s*-?\s*([A-Za-z][A-Za-z0-9 _'\-]+)\s*:\s*(-?\d+)/);
                if (m) {
                    const rawKey = m[1].trim();
                    const val = Number(m[2]);
                    const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase()) || rawKey;
                    if (Number.isFinite(val)) {
                        settings.attributes[matchKey] = Math.min(10, Math.max(1, Math.floor(val)));
                    }
                }
            }
        }
    }

    // Returns fallback settings when an error occurs
    _getFallbackSettings() {
        const fallback = { enabled: true, resultOutput: false, attributes: {} };
        const defaultAttrKeys = this.attributes.getAttributeNames();
        for (const k of defaultAttrKeys) {
            fallback.attributes[k] = 5;
        }
        return fallback;
    }
}


// =====================================================================
// AidChaosDetection: AutoCards detection and marker cleaning
// Purpose: Detect external script activity and clean output markers
// =====================================================================
class AidChaosDetection {
    constructor(logDebug) {
        this.logDebug = logDebug;
    }

    // Check if text contains AutoCards activity markers
    // Returns true if AutoCards is active and CHAOS should skip processing
    isAutoCardsActivity(text) {
        this.logDebug('isAutoCardsActivity - start');
        if (typeof text !== 'string') return false;
        
        // AutoCards command patterns
        const patterns = [
            /\/\s*A\s*C/i,                                    // "/ac" commands
            /CONFIRM\s*DELETE/i,                              // Delete confirmations
            />>>\s*please\s*select\s*"continue"/i,            // Continue prompts
            /{title:\s*[\s\S]*?}/i,                           // Card title headers
            />>>\s*[\s\S]*?<<</,                              // AutoCards system messages
            /summariz(ing|ed)\s+.*\s+memories/i,              // Memory operations
            /Auto(?:-|\s*)Cards\s+(?:has\s+been|will)/i       // AutoCards status messages
        ];

        for (const pattern of patterns) {
            if (pattern.test(text)) {
                this.logDebug('isAutoCardsActivity - matched pattern', pattern.source);
                return true;
            }
        }

        // Lines starting with '/' or '{' are likely commands
        if (/^[\s\n]*[\/\{]/.test(text)) {
            this.logDebug('isAutoCardsActivity - matched command marker');
            return true;
        }

        this.logDebug('isAutoCardsActivity - no match');
        return false;
    }

    // Remove all [AIDCHAOS ...] markers from text
    // Purpose: Clean output markers to prevent AI/script confusion
    cleanAidChaosMarkers(text) {
        this.logDebug('cleanAidChaosMarkers - start');
        if (typeof text !== 'string') return text;

        const cleaned = text.replace(/^\[AIDCHAOS\s+[^\]]*\]\s*/gm, '');
        
        if (cleaned !== text) {
            this.logDebug('cleanAidChaosMarkers - removed markers');
        }
        
        return cleaned;
    }
}


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


// =====================================================================
// AidChaosRoller: W100 dice rolling and outcome classification
// Purpose: Perform attribute rolls and determine success/failure outcomes
// =====================================================================
class AidChaosRoller {
    constructor(logDebug, attributesManager) {
        this.logDebug = logDebug;
        this.attributes = attributesManager;
    }

    // Perform a W100 roll for an attribute and classify the outcome
    // attrName: attribute name (e.g., 'Strength')
    // attrValue: attribute value (1-10)
    // Returns { roll, base, resultType, humanMessage, guidanceText }
    roll(attrName, attrValue) {
        this.logDebug('roll - start', attrName, attrValue);
        
        try {
            // Roll 1-100
            const roll = Math.floor(Math.random() * 100) + 1;
            
            // Calculate thresholds based on attribute value
            const base = 20 + (Number(attrValue) * 5);
            const critThreshold = Math.max(1, Math.floor(base * 0.1));
            const partialThreshold = base + 15;
            const failThreshold = 90 + Math.floor(base * 0.1);

            // Classify the outcome
            let resultType, humanMessage, guidanceKey;

            if (roll === 1 || roll <= critThreshold) {
                resultType = 'Critical Success';
                humanMessage = 'Outstanding success. The action succeeds spectacularly.';
                guidanceKey = 'critical_success';
            } else if (roll <= base) {
                resultType = 'Success';
                humanMessage = 'Normal success. The action succeeds.';
                guidanceKey = 'success';
            } else if (roll <= partialThreshold) {
                resultType = 'Partial Success';
                humanMessage = 'Partial success. The action succeeds with a drawback.';
                guidanceKey = 'partial_success';
            } else if (roll <= failThreshold) {
                resultType = 'Failure';
                humanMessage = 'Failure. The action fails.';
                guidanceKey = 'failure';
            } else {
                resultType = 'Critical Failure';
                humanMessage = 'Critical failure. Catastrophic result.';
                guidanceKey = 'critical_failure';
            }

            // Get custom guidance text for this attribute
            const guidanceText = this.attributes.getGuidanceText(attrName, guidanceKey) || humanMessage;

            const result = { 
                roll, 
                base, 
                resultType, 
                humanMessage, 
                guidanceText,
                attribute: attrName
            };
            
            this.logDebug('roll - result', result);
            return result;
        } catch (e) {
            this.logDebug('roll - error', e);
            return {
                roll: 1,
                base: 0,
                resultType: 'Critical Success',
                humanMessage: 'Defaulted to critical success on error.',
                guidanceText: 'Defaulted to critical success on error.',
                attribute: attrName
            };
        }
    }

    // Check if a result is a failure type
    isFailure(resultType) {
        return resultType === 'Failure' || resultType === 'Critical Failure';
    }

    // Build the CHAOS context message from roll results
    // rollResults: array of roll result objects
    // Returns formatted string to inject into context
    buildContextMessage(rollResults) {
        this.logDebug('buildContextMessage - start');
        
        const lines = ['['];
        let hasFailure = false;

        for (const result of rollResults) {
            lines.push('The part of the action that depended on ' + result.attribute + ' was a ' + result.resultType.toUpperCase() + '.');
            if (result.guidanceText) {
                lines.push('Guidance: ' + result.guidanceText);
            }
            lines.push('');
            
            if (this.isFailure(result.resultType)) {
                hasFailure = true;
            }
        }

        // Add causality rule if any failure occurred
        if (hasFailure) {
            lines.push('Causality rule');
            lines.push('The declared action may include several parts. If an earlier part fails in a way that makes later parts impossible, do not narrate those later parts as actually happening. You may show the character\'s intention, frustration, or delayed opportunities, but the impossible actions themselves do not occur in this scene.');
            lines.push('');
        }

        // Add narration rule
        lines.push('Narration rule');
        lines.push('Use these outcomes when continuing the story.');
        lines.push('Show the consequences naturally in the scene.');
        lines.push('Do not mention dice, rolls, or attribute names directly.');
        lines.push(']');

        return lines.join('\n');
    }

    // Build the result output marker for display
    // rollResults: array of roll result objects
    // Returns formatted marker string (e.g., "[AIDCHAOS Strength (45/70): Success]")
    buildResultMarker(rollResults) {
        const parts = [];
        for (const result of rollResults) {
            parts.push(result.attribute + ' (' + result.roll + '/' + result.base + '): ' + result.resultType);
        }
        return '[AIDCHAOS ' + parts.join(', ') + ']\n';
    }
}


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


// =====================================================================
// AidChaosHandlers: Hook handlers for input, context, and output
// Purpose: Orchestrate all CHAOS processing for each hook type
// =====================================================================
class AidChaosHandlers {
    constructor(logDebug, detection, history, configuration, parser, roller) {
        this.logDebug = logDebug;
        this.detection = detection;
        this.history = history;
        this.configuration = configuration;
        this.parser = parser;
        this.roller = roller;
    }

    // Handle input hook: clean markers and detect AutoCards
    handleInput(text) {
        this.logDebug('handleInput - start');
        
        // Clean any existing CHAOS markers
        let cleaned = this.detection.cleanAidChaosMarkers(text);
        
        // Skip if AutoCards is active
        if (this.detection.isAutoCardsActivity(cleaned)) {
            this.logDebug('handleInput - AutoCards detected, passing through');
            return cleaned;
        }
        
        this.logDebug('handleInput - end');
        return cleaned;
    }

    // Handle context hook: perform rolls and inject guidance
    // Returns [text, stopFlag]
    handleContext(text, stopFlag) {
        this.logDebug('handleContext - start');
        
        // Clean markers
        let cleaned = this.detection.cleanAidChaosMarkers(text);
        
        // Skip if AutoCards is active
        if (this.detection.isAutoCardsActivity(cleaned)) {
            this.logDebug('handleContext - AutoCards detected, skipping');
            return [cleaned, stopFlag === true];
        }

        // Only process 'do' actions
        const actionType = this.history.getActionType(0, cleaned);
        this.logDebug('handleContext - actionType', actionType);
        
        if (actionType !== 'do') {
            this.logDebug('handleContext - not a do action, skipping');
            return [cleaned, stopFlag === true];
        }

        try {
            // Load configuration
            const settings = this.configuration.load();
            
            // Persist to state for output hook
            try {
                state.AidChaosConfig = settings;
            } catch (e) {
                this.logDebug('handleContext - failed to persist config');
            }

            // Check if disabled
            if (settings.enabled === false) {
                this.logDebug('handleContext - CHAOS disabled');
                return [cleaned, stopFlag === true];
            }

            // Get last action text
            const lastAction = this.history.readPastAction(0);
            const lastText = (lastAction.text || '').toString();
            this.logDebug('handleContext - lastAction text length', lastText.length);

            // Detect attributes
            const detectedAttrs = this.parser.detectAllAttributes(lastText);
            
            if (detectedAttrs.length === 0) {
                this.logDebug('handleContext - no attributes detected');
                return [cleaned, stopFlag === true];
            }

            this.logDebug('handleContext - detected attributes', detectedAttrs);

            // Roll for each attribute
            const rollResults = [];
            const attrNames = this.parser.attributes.getAttributeNames();

            for (const detectedAttr of detectedAttrs) {
                // Match to canonical attribute name
                const matchKey = attrNames.find(k => k.toLowerCase() === detectedAttr.toLowerCase()) || detectedAttr;
                const attrValue = Number(settings.attributes?.[matchKey] ?? 5) || 5;
                
                this.logDebug('handleContext - rolling', matchKey, attrValue);
                const result = this.roller.roll(matchKey, attrValue);
                rollResults.push(result);
            }

            // Store results for output hook
            try {
                state.AidChaosLastRoll = rollResults;
            } catch (e) {
                this.logDebug('handleContext - failed to store roll results');
            }

            // Build and append context message
            const chaosMessage = this.roller.buildContextMessage(rollResults);
            const modified = cleaned + '\n' + chaosMessage;
            
            this.logDebug('handleContext - end with CHAOS message');
            return [modified, stopFlag === true];

        } catch (err) {
            this.logDebug('handleContext - error', err);
            return [cleaned, stopFlag === true];
        }
    }

    // Handle output hook: optionally prepend roll results
    handleOutput(text) {
        this.logDebug('handleOutput - start');
        
        // Clean markers
        let cleaned = this.detection.cleanAidChaosMarkers(text);
        
        // Skip if AutoCards is active
        if (this.detection.isAutoCardsActivity(cleaned)) {
            this.logDebug('handleOutput - AutoCards detected, passing through');
            return cleaned;
        }

        try {
            // Get settings
            let settings;
            try {
                settings = state.AidChaosConfig || this.configuration.load();
            } catch (e) {
                settings = this.configuration.load();
            }
            
            // Check if result output is enabled
            if (!settings.resultOutput) {
                this.logDebug('handleOutput - result output disabled');
                return cleaned;
            }

            // Get roll results
            let rollResults;
            try {
                rollResults = state.AidChaosLastRoll;
            } catch (e) {
                rollResults = null;
            }
            
            if (!rollResults || !Array.isArray(rollResults) || rollResults.length === 0) {
                this.logDebug('handleOutput - no roll results');
                return cleaned;
            }

            // Build result marker
            const resultMarker = this.roller.buildResultMarker(rollResults);
            
            // Clear stored results
            try {
                delete state.AidChaosLastRoll;
            } catch (e) {
                // Ignore
            }

            const modified = resultMarker + cleaned;
            this.logDebug('handleOutput - prepended result marker');
            return modified;

        } catch (err) {
            this.logDebug('handleOutput - error', err);
            return cleaned;
        }
    }
}


// =====================================================================
// AidChaosMain: Main entry point and orchestrator
// Purpose: Initialize all components and route hook calls
// =====================================================================

/*
AidChaos - Controlled Heuristic Adaptive Outcome System v0.9.1
Made by Javadevil - December 2024

This AI Dungeon script automatically adds invisible dice-based resolution mechanics to player actions.
It detects attribute-related keywords and explicit attribute mentions in player input, then performs 
appropriate W100 rolls using character stats (1-10) to determine success/failure outcomes.

The AI receives outcome guidance through context injection, allowing it to narrate results naturally
without exposing the underlying mechanics to the player.

Free and open-source for anyone to use within your own scenarios or scripts!

For the Installation Guide, advanced usage, customization options, and technical details, see:
https://github.com/javadevil1982/AID-Chaos
*/

function AidChaos(hook, inText, inStop) {
    "use strict";

    const STOP = inStop === true;

    // Enable verbose debug output when true
    // Toggle to `false` to silence internal debug logging
    const showDebugOutput = false;

    // Centralized debug logging helper
    function logDebug(...args) {
        try {
            if (showDebugOutput) console.log('[AidChaos]', ...args);
        } catch (e) {
            // Ignore logging errors in restricted environments
        }
    }

    logDebug('Entering AidChaos, hook:', hook);

    // Initialize global stop if needed
    if (!hook) {
        globalThis.stop ??= false;
    }

    // Initialize all components
    const attributes = new AidChaosAttributes();
    const storyCards = new AidChaosStoryCards(logDebug);
    const configuration = new AidChaosConfiguration(logDebug, storyCards, attributes);
    const detection = new AidChaosDetection(logDebug);
    const parser = new AidChaosParser(logDebug, attributes);
    const roller = new AidChaosRoller(logDebug, attributes);
    const history = new AidChaosHistory(logDebug);
    const handlers = new AidChaosHandlers(logDebug, detection, history, configuration, parser, roller);

    // Route to appropriate handler
    if (hook === 'input') {
        logDebug('Routing to handleInput');
        const result = handlers.handleInput(inText);
        logDebug('Exiting AidChaos (input)');
        return result;
    }

    if (hook === 'context') {
        logDebug('Routing to handleContext');
        const result = handlers.handleContext(inText, STOP);
        logDebug('Exiting AidChaos (context)');
        return result;
    }

    if (hook === 'output') {
        logDebug('Routing to handleOutput');
        const result = handlers.handleOutput(inText);
        logDebug('Exiting AidChaos (output)');
        return result;
    }

    // Default: return unchanged
    logDebug('Exiting AidChaos (default)');
    return inText;
}

// Perform one-time initialization; ignore errors in restricted environments
try { AidChaos(null); } catch (e) { /* ignore */ }
