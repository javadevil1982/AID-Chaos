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
