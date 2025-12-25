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

    // Find a story card by its exact title (case-insensitive)
    // Returns the card object reference if found, otherwise null
    findStoryCard(title) {
        this.logDebug('findStoryCard - start', title);
        try {
            if (typeof storyCards === 'undefined' || !Array.isArray(storyCards)) {
                this.logDebug('findStoryCard - storyCards not available');
                return null;
            }
            
            const lowerTitle = (title || '').toLowerCase();
            for (const card of storyCards) {
                if (!card || typeof card.title !== 'string') continue;
                if (card.title.toLowerCase() === lowerTitle) {
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

    // Find a story card by type and title (both case-insensitive)
    // Returns the card object reference if found, otherwise null
    findStoryCardByType(cardType, title) {
        this.logDebug('findStoryCardByType - start', cardType, title);
        try {
            if (typeof storyCards === 'undefined' || !Array.isArray(storyCards)) {
                this.logDebug('findStoryCardByType - storyCards not available');
                return null;
            }
            
            const lowerType = (cardType || '').toLowerCase();
            const lowerTitle = (title || '').toLowerCase();
            for (const card of storyCards) {
                if (!card || typeof card.type !== 'string' || typeof card.title !== 'string') continue;
                if (card.type.toLowerCase() === lowerType && card.title.toLowerCase() === lowerTitle) {
                    this.logDebug('findStoryCardByType - found', cardType, title);
                    return card;
                }
            }
            
            this.logDebug('findStoryCardByType - not found', cardType, title);
            return null;
        } catch (err) {
            this.logDebug('findStoryCardByType - error', err);
            return null;
        }
    }

    // Find all story cards of a given type (case-insensitive)
    // Returns array of card objects
    findStoryCardsByType(cardType) {
        this.logDebug('findStoryCardsByType - start', cardType);
        try {
            if (typeof storyCards === 'undefined' || !Array.isArray(storyCards)) {
                this.logDebug('findStoryCardsByType - storyCards not available');
                return [];
            }
            
            const lowerType = (cardType || '').toLowerCase();
            const result = [];
            for (const card of storyCards) {
                if (!card || typeof card.type !== 'string') continue;
                if (card.type.toLowerCase() === lowerType) {
                    result.push(card);
                }
            }
            
            this.logDebug('findStoryCardsByType - found', result.length);
            return result;
        } catch (err) {
            this.logDebug('findStoryCardsByType - error', err);
            return [];
        }
    }

    // Update the entry text of an existing story card
    // Returns true if successful, false otherwise
    updateStoryCardEntry(card, newEntry) {
        this.logDebug('updateStoryCardEntry - start');
        try {
            if (!card) {
                this.logDebug('updateStoryCardEntry - no card provided');
                return false;
            }
            
            card.entry = newEntry;
            card.updatedAt = new Date().toISOString();
            this.logDebug('updateStoryCardEntry - updated');
            return true;
        } catch (err) {
            this.logDebug('updateStoryCardEntry - error', err);
            return false;
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
// Supports automatic attribute inheritance from Class and Race story cards
// =====================================================================

// Constant for disabled attributes - triggers automatic critical failure
const ATTRIBUTE_DISABLED = -1;

// Keywords that mark an attribute as disabled (case-insensitive)
const DISABLED_KEYWORDS = ['unavailable', 'disabled', 'impossible', 'forbidden', 'inaccessible'];

class AidChaosConfiguration {
    constructor(logDebug, storyCardsManager, attributesManager, baseValuesType, modValuesTypes) {
        this.logDebug = logDebug;
        this.storyCards = storyCardsManager;
        this.attributes = attributesManager;
        // Store configuration for inheritance types
        this.baseValuesType = baseValuesType || "Class";
        this.modValuesTypes = modValuesTypes || ["Race"];
    }

    // Load configuration from the "AidChaos Configuration" story card
    // If card does not exist or has no attributes, derives values from Class/Race cards
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
                inheritanceProcessed: false,
                attributes: {} 
            };
            for (const k of defaultAttrKeys) {
                defaults.attributes[k] = 5;
            }

            // Start with defaults
            const settings = JSON.parse(JSON.stringify(defaults));
            const card = this.storyCards.findStoryCard(cfgTitle);

            if (!card) {
                // No card exists: derive values from Class/Race cards, then create
                this.logDebug('AidChaosConfiguration.load - card not found, deriving from story cards');
                
                // Apply base values from Class card
                this._applyBaseValuesFromCard(settings, defaultAttrKeys);
                
                // Apply modifiers from Race cards
                this._applyModifiersFromCards(settings, defaultAttrKeys);
                
                // Clamp all values to 1-10
                this._clampAttributeValues(settings, defaultAttrKeys);
                
                // Mark inheritance as processed
                settings.inheritanceProcessed = true;
                
                // Create the configuration card
                const newText = this._buildCardText(settings.enabled, settings.resultOutput, settings.inheritanceProcessed, settings.attributes);
                this.storyCards.createOrUpdateStoryCard(cfgTitle, newText, 'settings');
                
                // Clean attribute blocks from all Class and Race cards
                this._cleanAttributeBlocksFromCards();
                
                return settings;
            }

            // Parse existing card
            const raw = (card.entry || '').toString();
            this._parseCard(raw, settings, defaultAttrKeys);

            // Check if card already has valid attribute values
            const hasAnyAttributes = this._cardHasAttributeValues(raw, defaultAttrKeys);
            
            if (hasAnyAttributes) {
                // Card has attributes - mark as processed if not already
                if (!settings.inheritanceProcessed) {
                    this.logDebug('AidChaosConfiguration.load - card has attributes, marking inheritance as processed');
                    settings.inheritanceProcessed = true;
                }
            } else if (!settings.inheritanceProcessed) {
                // Card exists but has no attributes and not yet processed - derive from Class/Race
                this.logDebug('AidChaosConfiguration.load - card has no attributes, deriving from story cards');
                
                // Apply base values from Class card
                this._applyBaseValuesFromCard(settings, defaultAttrKeys);
                
                // Apply modifiers from Race cards
                this._applyModifiersFromCards(settings, defaultAttrKeys);
                
                // Clamp all values to 1-10
                this._clampAttributeValues(settings, defaultAttrKeys);
                
                // Mark inheritance as processed
                settings.inheritanceProcessed = true;
                
                // Update the configuration card with derived values
                const newText = this._buildCardText(settings.enabled, settings.resultOutput, settings.inheritanceProcessed, settings.attributes);
                this.storyCards.createOrUpdateStoryCard(cfgTitle, newText, 'settings');
                
                // Clean attribute blocks from all Class and Race cards
                this._cleanAttributeBlocksFromCards();
                
                return settings;
            }

            // Ensure all default keys exist and are clamped to 1..10
            this._clampAttributeValues(settings, defaultAttrKeys);

            // Update card if content changed after normalization
            const normalizedText = this._buildCardText(settings.enabled, settings.resultOutput, settings.inheritanceProcessed, settings.attributes);
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

    // Check if a value represents a disabled attribute
    // Returns true for ATTRIBUTE_DISABLED (-1) or disabled keyword strings
    _isDisabledValue(value) {
        if (value === ATTRIBUTE_DISABLED) return true;
        if (typeof value === 'string') {
            return DISABLED_KEYWORDS.includes(value.toLowerCase().trim());
        }
        return false;
    }

    // Parse a single attribute value from text
    // Returns ATTRIBUTE_DISABLED for disabled keywords, or the numeric value
    _parseAttributeValue(valueStr) {
        const trimmed = valueStr.trim().toLowerCase();
        if (DISABLED_KEYWORDS.includes(trimmed)) {
            return ATTRIBUTE_DISABLED;
        }
        const num = Number(valueStr);
        return Number.isFinite(num) ? num : null;
    }

    // Check if card text contains any valid attribute values
    // Returns true if at least one attribute with a numeric value or disabled keyword is found
    _cardHasAttributeValues(raw, defaultAttrKeys) {
        this.logDebug('_cardHasAttributeValues - start');
        
        // Check for "Attributes:" section with at least one valid value
        const attrSectionMatch = raw.match(/Attributes\s*:\s*([\s\S]*?)$/i);
        if (!attrSectionMatch) {
            this.logDebug('_cardHasAttributeValues - no Attributes section');
            return false;
        }
        
        const attrLines = attrSectionMatch[1].split(/\n/);
        for (const line of attrLines) {
            // Match lines like "- Strength: 5" or "- Magic: disabled"
            const m = line.match(/^\s*-?\s*([A-Za-z][A-Za-z0-9 _'\-]*)\s*:\s*(\S+)\s*$/);
            if (m) {
                const rawKey = m[1].trim();
                const rawValue = m[2].trim();
                // Check if it's a known attribute with a valid value
                const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase());
                if (matchKey) {
                    const val = this._parseAttributeValue(rawValue);
                    // Valid if it's a number in range 1-10 or disabled
                    if (val === ATTRIBUTE_DISABLED || (Number.isFinite(val) && val >= 1 && val <= 10)) {
                        this.logDebug('_cardHasAttributeValues - found valid attribute', matchKey, val);
                        return true;
                    }
                }
            }
        }
        
        this.logDebug('_cardHasAttributeValues - no valid attributes found');
        return false;
    }

    // Apply base attribute values from a Class story card
    // Searches memory for "Class: ClassName" and loads attributes from that card
    _applyBaseValuesFromCard(settings, defaultAttrKeys) {
        this.logDebug('_applyBaseValuesFromCard - start');
        try {
            // Get memory content (Plot Essentials)
            const memoryContent = this._getMemoryContent();
            if (!memoryContent) {
                this.logDebug('_applyBaseValuesFromCard - no memory content');
                return;
            }
            
            // Search for line starting with "Class: " (using baseValuesType, without leading "- ")
            const pattern = new RegExp('^\\s*' + this.baseValuesType + '\\s*:\\s*(.+)$', 'im');
            const match = memoryContent.match(pattern);
            
            if (!match) {
                this.logDebug('_applyBaseValuesFromCard - no ' + this.baseValuesType + ' found in memory');
                return;
            }
            
            const cardName = match[1].trim();
            this.logDebug('_applyBaseValuesFromCard - found ' + this.baseValuesType + ':', cardName);
            
            // Find the story card with type baseValuesType and matching title
            const card = this.storyCards.findStoryCardByType(this.baseValuesType, cardName);
            if (!card) {
                this.logDebug('_applyBaseValuesFromCard - story card not found');
                return;
            }
            
            // Parse "Attributes:" section from card entry
            const entry = (card.entry || '').toString();
            const attrValues = this._parseAttributesSection(entry, defaultAttrKeys);
            
            // Apply parsed values to settings
            for (const [key, value] of Object.entries(attrValues)) {
                settings.attributes[key] = value;
                this.logDebug('_applyBaseValuesFromCard - set', key, value);
            }
            
        } catch (err) {
            this.logDebug('_applyBaseValuesFromCard - error', err);
        }
    }

    // Apply attribute modifiers from Race (and other modValuesTypes) story cards
    // Searches memory for each type and applies +/- modifiers
    // If either base or modifier is ATTRIBUTE_DISABLED, result is ATTRIBUTE_DISABLED
    _applyModifiersFromCards(settings, defaultAttrKeys) {
        this.logDebug('_applyModifiersFromCards - start');
        try {
            // Get memory content (Plot Essentials)
            const memoryContent = this._getMemoryContent();
            if (!memoryContent) {
                this.logDebug('_applyModifiersFromCards - no memory content');
                return;
            }
            
            // Process each modifier type
            for (const modType of this.modValuesTypes) {
                this.logDebug('_applyModifiersFromCards - processing type', modType);
                
                // Search for line starting with "Race: " (or other modType, without leading "- ")
                const pattern = new RegExp('^\\s*' + modType + '\\s*:\\s*(.+)$', 'im');
                const match = memoryContent.match(pattern);
                
                if (!match) {
                    this.logDebug('_applyModifiersFromCards - no ' + modType + ' found in memory');
                    continue;
                }
                
                const cardName = match[1].trim();
                this.logDebug('_applyModifiersFromCards - found ' + modType + ':', cardName);
                
                // Find the story card with type modType and matching title
                const card = this.storyCards.findStoryCardByType(modType, cardName);
                if (!card) {
                    this.logDebug('_applyModifiersFromCards - story card not found for', modType, cardName);
                    continue;
                }
                
                // Parse "Attribute-Modifiers:" section from card entry
                const entry = (card.entry || '').toString();
                const modifiers = this._parseModifiersSection(entry, defaultAttrKeys);
                
                // Apply modifiers to settings
                for (const [key, modifier] of Object.entries(modifiers)) {
                    const oldValue = settings.attributes[key] || 5;
                    
                    // If either base or modifier is disabled, result is disabled
                    if (oldValue === ATTRIBUTE_DISABLED || modifier === ATTRIBUTE_DISABLED) {
                        settings.attributes[key] = ATTRIBUTE_DISABLED;
                        this.logDebug('_applyModifiersFromCards - disabled', key);
                    } else {
                        settings.attributes[key] = oldValue + modifier;
                        this.logDebug('_applyModifiersFromCards - modified', key, oldValue, '+', modifier, '=', settings.attributes[key]);
                    }
                }
            }
            
        } catch (err) {
            this.logDebug('_applyModifiersFromCards - error', err);
        }
    }

    // Get the memory content (Plot Essentials) from state
    _getMemoryContent() {
        try {
            // state.memory.context contains the Plot Essentials in AI Dungeon
            if (typeof state !== 'undefined' && state.memory && typeof state.memory.context === 'string') {
                return state.memory.context;
            }
            // Fallback: check memory global
            if (typeof memory !== 'undefined' && typeof memory === 'string') {
                return memory;
            }
            return null;
        } catch (err) {
            this.logDebug('_getMemoryContent - error', err);
            return null;
        }
    }

    // Parse "Attributes:" section from card entry text
    // Returns { AttrName: value } for found attributes
    // Values can be numbers (1-10) or ATTRIBUTE_DISABLED (-1)
    _parseAttributesSection(entry, defaultAttrKeys) {
        this.logDebug('_parseAttributesSection - start');
        const result = {};
        
        try {
            // Find "Attributes:" section
            const attrSectionMatch = entry.match(/Attributes\s*:\s*([\s\S]*?)(?:$|(?=\n\s*\n)|\n(?=[A-Z]))/i);
            if (!attrSectionMatch) {
                this.logDebug('_parseAttributesSection - no Attributes section found');
                return result;
            }
            
            const attrLines = attrSectionMatch[1].split(/\n/);
            for (const line of attrLines) {
                // Match lines like "- Strength: 5" or "- Magic: disabled"
                const m = line.match(/^\s*-\s*([A-Za-z][A-Za-z0-9 _'\-]*)\s*:\s*(\S+)/);
                if (m) {
                    const rawKey = m[1].trim();
                    const rawValue = m[2].trim();
                    // Match to canonical attribute name
                    const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase()) || rawKey;
                    const val = this._parseAttributeValue(rawValue);
                    if (val !== null) {
                        result[matchKey] = val;
                    }
                }
            }
        } catch (err) {
            this.logDebug('_parseAttributesSection - error', err);
        }
        
        return result;
    }

    // Parse "Attribute-Modifiers:" section from card entry text
    // Returns { AttrName: modifier } where modifier is a signed integer or ATTRIBUTE_DISABLED
    _parseModifiersSection(entry, defaultAttrKeys) {
        this.logDebug('_parseModifiersSection - start');
        const result = {};
        
        try {
            // Find "Attribute-Modifiers:" section
            const modSectionMatch = entry.match(/Attribute-Modifiers\s*:\s*([\s\S]*?)(?:$|(?=\n\s*\n)|\n(?=[A-Z]))/i);
            if (!modSectionMatch) {
                this.logDebug('_parseModifiersSection - no Attribute-Modifiers section found');
                return result;
            }
            
            const modLines = modSectionMatch[1].split(/\n/);
            for (const line of modLines) {
                // Match lines like "- Strength: +2", "- Intelligence: -1", or "- Magic: disabled"
                const m = line.match(/^\s*-\s*([A-Za-z][A-Za-z0-9 _'\-]*)\s*:\s*(\S+)/);
                if (m) {
                    const rawKey = m[1].trim();
                    const rawValue = m[2].trim();
                    // Match to canonical attribute name
                    const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase()) || rawKey;
                    const val = this._parseAttributeValue(rawValue);
                    if (val !== null) {
                        result[matchKey] = val;
                    }
                }
            }
        } catch (err) {
            this.logDebug('_parseModifiersSection - error', err);
        }
        
        return result;
    }

    // Clean attribute blocks from all Class and Race story cards
    // Removes "Attributes:" and "Attribute-Modifiers:" sections to prevent AI confusion
    _cleanAttributeBlocksFromCards() {
        this.logDebug('_cleanAttributeBlocksFromCards - start');
        try {
            const defaultAttrKeys = this.attributes.getAttributeNames();
            
            // Clean cards of type baseValuesType
            const baseCards = this.storyCards.findStoryCardsByType(this.baseValuesType);
            for (const card of baseCards) {
                this._cleanCardAttributeBlock(card, defaultAttrKeys);
            }
            
            // Clean cards of each modValuesType
            for (const modType of this.modValuesTypes) {
                const modCards = this.storyCards.findStoryCardsByType(modType);
                for (const card of modCards) {
                    this._cleanCardAttributeBlock(card, defaultAttrKeys);
                }
            }
            
            this.logDebug('_cleanAttributeBlocksFromCards - end');
        } catch (err) {
            this.logDebug('_cleanAttributeBlocksFromCards - error', err);
        }
    }

    // Clean attribute block from a single card
    // Removes "Attributes:" or "Attribute-Modifiers:" headers and all following attribute lines
    _cleanCardAttributeBlock(card, defaultAttrKeys) {
        if (!card || !card.entry) return;
        
        const originalEntry = card.entry;
        const lines = originalEntry.split('\n');
        const cleanedLines = [];
        let inAttributeBlock = false;
        
        for (const line of lines) {
            // Check if this line starts an attribute block
            if (/^\s*(Attributes|Attribute-Modifiers)\s*:\s*$/i.test(line)) {
                inAttributeBlock = true;
                this.logDebug('_cleanCardAttributeBlock - found block header', line.trim());
                continue; // Skip this line
            }
            
            // If we're in an attribute block, check if this line is an attribute line
            if (inAttributeBlock) {
                // Check if line matches "- AttributeName: value" pattern (case-insensitive for attribute names)
                const attrLineMatch = line.match(/^\s*-\s*([A-Za-z][A-Za-z0-9 _'\-]*)\s*:\s*[+\-]?\d+\s*$/);
                if (attrLineMatch) {
                    const rawKey = attrLineMatch[1].trim();
                    // Check if it's a known attribute (case-insensitive)
                    const isKnownAttr = defaultAttrKeys.some(dk => dk.toLowerCase() === rawKey.toLowerCase());
                    if (isKnownAttr) {
                        this.logDebug('_cleanCardAttributeBlock - removing attribute line', line.trim());
                        continue; // Skip this attribute line
                    }
                }
                // Line doesn't match attribute pattern - we've left the block
                inAttributeBlock = false;
            }
            
            // Keep this line
            cleanedLines.push(line);
        }
        
        let cleanedEntry = cleanedLines.join('\n');
        
        // Clean up extra blank lines that might remain
        cleanedEntry = cleanedEntry.replace(/\n{3,}/g, '\n\n').trim();
        
        if (cleanedEntry !== originalEntry) {
            this.logDebug('_cleanCardAttributeBlock - cleaned card', card.title);
            this.storyCards.updateStoryCardEntry(card, cleanedEntry);
        }
    }

    // Clamp all attribute values to 1-10, preserving ATTRIBUTE_DISABLED (-1)
    _clampAttributeValues(settings, defaultAttrKeys) {
        for (const k of defaultAttrKeys) {
            if (!(k in settings.attributes)) {
                settings.attributes[k] = 5;
            } else if (settings.attributes[k] === ATTRIBUTE_DISABLED) {
                // Keep disabled as-is
                continue;
            } else {
                settings.attributes[k] = Math.min(10, Math.max(1, Math.floor(settings.attributes[k])));
            }
        }
    }

    // Build the canonical card text format
    _buildCardText(enabled, resultOutput, inheritanceProcessed, attributes) {
        const lines = [];
        lines.push('AidChaos enabled: ' + (enabled ? 'true' : 'false'));
        lines.push('Result Output enabled: ' + (resultOutput ? 'true' : 'false'));
        lines.push('Inheritance processed: ' + (inheritanceProcessed ? 'true' : 'false'));
        lines.push('');
        lines.push('Attributes:');
        for (const key of Object.keys(attributes)) {
            // Display ATTRIBUTE_DISABLED as "disabled" for player visibility
            const value = attributes[key] === ATTRIBUTE_DISABLED ? 'disabled' : attributes[key];
            lines.push('- ' + key + ': ' + value);
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

        // Parse inheritanceProcessed flag
        const inheritanceMatch = raw.match(/(?:^|\n)\s*>?\s*Inheritance\s+processed\s*:\s*(true|false)/i);
        if (inheritanceMatch) {
            settings.inheritanceProcessed = /^true$/i.test(inheritanceMatch[1]);
            this.logDebug('AidChaosConfiguration - parsed inheritanceProcessed', settings.inheritanceProcessed);
        }

        // Parse Attributes section
        const attrSectionMatch = raw.match(/Attributes\s*:\s*([\s\S]*?)$/i);
        if (attrSectionMatch) {
            const attrLines = attrSectionMatch[1].split(/\n/);
            for (const line of attrLines) {
                // Match lines like "- Strength: 5" or "- Magic: disabled"
                const m = line.match(/(?:^|\s|>)*\s*-?\s*([A-Za-z][A-Za-z0-9 _'\-]+)\s*:\s*(\S+)/);
                if (m) {
                    const rawKey = m[1].trim();
                    const rawValue = m[2].trim();
                    const matchKey = defaultAttrKeys.find(dk => dk.toLowerCase() === rawKey.toLowerCase()) || rawKey;
                    const val = this._parseAttributeValue(rawValue);
                    if (val !== null) {
                        // Clamp numeric values, keep disabled as-is
                        if (val === ATTRIBUTE_DISABLED) {
                            settings.attributes[matchKey] = ATTRIBUTE_DISABLED;
                        } else {
                            settings.attributes[matchKey] = Math.min(10, Math.max(1, Math.floor(val)));
                        }
                    }
                }
            }
        }
    }

    // Returns fallback settings when an error occurs
    _getFallbackSettings() {
        const fallback = { enabled: true, resultOutput: false, inheritanceProcessed: false, attributes: {} };
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

// Reference to disabled attribute constant (defined in AidChaosConfiguration)
// Using same value to avoid circular dependencies
const ATTRIBUTE_DISABLED_VALUE = -1;

class AidChaosRoller {
    constructor(logDebug, attributesManager) {
        this.logDebug = logDebug;
        this.attributes = attributesManager;
    }

    // Check if an attribute value represents a disabled attribute
    isDisabledAttribute(attrValue) {
        return attrValue === ATTRIBUTE_DISABLED_VALUE;
    }

    // Perform a W100 roll for an attribute and classify the outcome
    // attrName: attribute name (e.g., 'Strength')
    // attrValue: attribute value (1-10) or ATTRIBUTE_DISABLED (-1)
    // Returns { roll, base, resultType, humanMessage, guidanceText, isDisabled }
    roll(attrName, attrValue) {
        this.logDebug('roll - start', attrName, attrValue);
        
        try {
            // Check for disabled attribute - automatic critical failure without rolling
            if (this.isDisabledAttribute(attrValue)) {
                this.logDebug('roll - attribute is disabled, automatic critical failure');
                const result = {
                    roll: null,
                    base: null,
                    resultType: 'Critical Failure',
                    humanMessage: 'This attribute is disabled. The action is impossible for this character.',
                    guidanceText: this.attributes.getGuidanceText(attrName, 'critical_failure') || 
                        'This attribute is disabled for the character. The action automatically fails in the worst possible way.',
                    attribute: attrName,
                    isDisabled: true
                };
                this.logDebug('roll - disabled result', result);
                return result;
            }

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
                attribute: attrName,
                isDisabled: false
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
                attribute: attrName,
                isDisabled: false
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
    // For disabled attributes shows "[AIDCHAOS Magic (disabled): Critical Failure]"
    buildResultMarker(rollResults) {
        const parts = [];
        for (const result of rollResults) {
            if (result.isDisabled) {
                // Show "(disabled)" instead of roll/base for disabled attributes
                parts.push(result.attribute + ' (disabled): ' + result.resultType);
            } else {
                parts.push(result.attribute + ' (' + result.roll + '/' + result.base + '): ' + result.resultType);
            }
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
AidChaos - Controlled Heuristic Adaptive Outcome System v0.9.3
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

    // =========================================================================
    // SCRIPT CONFIGURATION
    // Modify these settings to customize CHAOS behavior
    // =========================================================================

    // Enable verbose debug output when true
    // Toggle to `false` to silence internal debug logging
    const showDebugOutput = false;

    // Story card type that provides base attribute values (e.g., "Class", "Profession")
    // CHAOS will search memory for "Class: Warrior" and load attributes from that card
    const baseValuesType = "Class";

    // Story card types that provide attribute modifiers (e.g., ["Race", "Origin"])
    // CHAOS will search memory for "Race: Elf" and apply +/- modifiers from that card
    const modValuesTypes = ["Race"];

    // =========================================================================
    // END OF CONFIGURATION
    // =========================================================================

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
    const configuration = new AidChaosConfiguration(logDebug, storyCards, attributes, baseValuesType, modValuesTypes);
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
