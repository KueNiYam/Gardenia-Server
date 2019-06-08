/* Function */
function makeErrorJsonString(error, message) {
    // Error list:
    //  {"NoTypeError", }

    return JSON.stringify({
        "type": "error",
        "error": error,
        "message": error + ": " + message + "\n"
    })
    
}

/* Export */
exports.makeErrorJsonString = makeErrorJsonString;
