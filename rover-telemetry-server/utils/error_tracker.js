// Object to track errors
let message_stats = {
    "success_count": 0,
    "error_count": 0,
    "total_count": 0,
    "error_rate": 0
}

/**
 * This function  increments success_count if the operation was successful,
 * error_count if it failed, and always increments total_count
 *
 *  @param {boolean} success 
 */
function updateCountStats(success) {
    if (success) {
        message_stats["success_count"]++;
    } else {
        message_stats["error_count"]++;
    }
    message_stats["total_count"]++;
}

/**
 * This function prints the Success and Fail counts and the Fail rate
 */
function printCountStats() {
    console.log(`Success Count:\t${message_stats["success_count"]}`);
    console.log(`Error Count:\t${message_stats["error_count"]}`);
    message_stats["errorRate"] = message_stats["total_count"] ? (100 * message_stats["error_count"]) / message_stats["total_count"] : 0;
    console.log(`Error Rate:\t${message_stats["errorRate"].toFixed(2)}%`);
}

/**
 * This function bundles the updateCountStats() and printCountStats()
 * so they can be called together 
 * @param {boolean} success 
 */
function updateAndPrintErrors(success) {
    updateCountStats(success)
    printCountStats()
}

module.exports = {
    updateCountStats,
    printCountStats,
    updateAndPrintErrors
};
// Export function
