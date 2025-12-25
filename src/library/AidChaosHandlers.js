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
