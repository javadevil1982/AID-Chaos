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
