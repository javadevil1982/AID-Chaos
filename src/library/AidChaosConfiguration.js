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
