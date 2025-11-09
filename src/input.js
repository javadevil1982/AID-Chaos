// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

// Your "Input" tab should look like this
const modifier = (text) => {
    // Your other input modifier scripts go here (preferred)
    text = AidChaos("input", text);
    // Your other input modifier scripts go here (alternative)
    return { text };
};
modifier(text);