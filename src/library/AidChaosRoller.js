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
