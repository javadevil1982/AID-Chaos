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
