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
