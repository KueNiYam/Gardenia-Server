const ErrorModule = require('./error.js');

function _arrayStringToJson(arrayString) {
    // console.log("arrayString: " + arrayString);

    let firstParse = JSON.parse(arrayString);
    let processedJSON = {};
    processedJSON[firstParse[0]] = firstParse[1];
    
    return processedJSON;
}

function msgToJson(string) {
    // string ex) '42["message",{"key":"values","key2":"value2"}]'
    // if invalid, return null

    let startIndex = string.indexOf('[');
    let endIndex = string.length - 1;

    if (startIndex == -1 || string[endIndex] != ']')
    {
        throw Error(ErrorModule.makeErrorJsonString("MessageParseError", "The string can't be parsed"))
    }

    return _arrayStringToJson(string.substring(startIndex, endIndex + 1));
}

function suitToSend(message) {
    return '42["message",' + message + "]"
}

/* Export */
exports.msgToJson = msgToJson;
exports.suitToSend = suitToSend;