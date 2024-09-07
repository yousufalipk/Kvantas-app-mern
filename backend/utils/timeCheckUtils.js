// Utility function to check if 48 hours (or 10 minutes in your test case) have passed since the given date
const check48Hour = (date) => {
    const now = new Date();
    const lastClaimedDate = new Date(date); 

    if (!lastClaimedDate) {
        return true;
    }

    // 48 hours in milliseconds (adjusted to 10 minutes for testing)
    //const twoDays = 10 * 60 * 1000;  // 10 minutes in milliseconds for testing
    const twoDays = 48 * 60 * 60 * 1000; // 48 hours in milliseconds for production

    return now - lastClaimedDate >= twoDays;
};

// Utility function to check if 24 hours (or 1 minute in your test case) have passed since the given date
const check24Hour = (date) => {
    const now = new Date();
    const lastClaimedDate = new Date(date); 

    if (!lastClaimedDate) {
        return true;
    }

    // 24 hours in milliseconds (adjusted to 1 minute for testing)
    //const oneDay = 60 * 1000;  // 1 minute in milliseconds for testing
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds for production

    return now - lastClaimedDate >= oneDay;
};

module.exports = { check48Hour, check24Hour };
