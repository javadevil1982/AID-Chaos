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
