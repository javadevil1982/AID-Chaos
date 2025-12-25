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
