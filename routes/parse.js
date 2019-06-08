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
    let endIndex = string.indexOf(']') + 1;

    if (startIndex == -1 || endIndex == 0)
    {
        throw Error(ErrorModule.makeErrorJsonString("MessageParseError", "The string can't be parsed"))
    }

    return _arrayStringToJson(string.substring(startIndex, endIndex));
}

/* Export */
exports.msgToJson = msgToJson;