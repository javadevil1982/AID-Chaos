// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

// Your "Context" tab should look like this
const modifier = (text) => {
    // Your other context modifier scripts go here (preferred)
    [text, stop] = AidChaos("context", text, stop);
    // Your other context modifier scripts go here (alternative)
    return { text, stop };
};
modifier(text);
