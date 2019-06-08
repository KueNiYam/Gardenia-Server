// For WebSocket
const http = require('http')
const WebSocketServer = require('websocket').server;

// For Google-Vision
const Vision = require('./routes/vision.js');
let vision = new Vision();

// For Error handling
const RouteError = require('./routes/error.js');

// For Parse
const Parse = require('./routes/parse.js');

/* Google-Vision Example Code */
let image = './images/IU.jpg'
let fs = require('fs');
fs.readFile(image, function (err, data) {
    vision.detect(data).then((json) => {
        console.log(json);
    });
});
/* -------------------------------------------------------------------- */

const server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404); // response.writeHead(status_code, header_json)
    response.end();
});

server.listen(5000, function () {
    console.log((new Date()) + ' Server is listening on port 5000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it. 
    // 즉, 보안상 문제로 autoAcceptConnections은 false로 지정해야한다.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    // 인증 관련 정의
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    // request.accept(protocol, 프로토콜이 맞다면 연결을 지원하는 함수)
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            let data = '';
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);

            // 데이터 파싱
            try {
                data = Parse.msgToJson(message.utf8Data).message;
            } catch (error) {
                connection.sendUTF(Parse.suitToSend(RouteError.makeErrorJsonString("InvalidDataError", "Received data is invalid")));
                console.log("error: " + error.message);
                return;
            }

            // 적절한 데이터인지 확인
            if (typeof (data) != "object") {
                connection.sendUTF(Parse.suitToSend(RouteError.makeErrorJsonString("NoJsonError", "The request is not JSON")));
                return;
            }
            if (!("type" in data)) {
                connection.sendUTF(Parse.suitToSend(RouteError.makeErrorJsonString("NoTypeError", "The request dosen't contain type key")));
                return;
            }

            // 각 데이터에 따라 처리
            if (data["type"] == "face") {
                if (!("image" in data))
                    connection.sendUTF(Parse.suitToSend(RouteError.makeErrorJsonString("NoImageError", "The request dosen't contain image key")));
                else {
                    if ("timestamp" in data) {
                        vision.detect(Buffer.from(data["image"], 'base64')).then((json) => {
                            connection.sendUTF(Parse.suitToSend(JSON.stringify({
                                "type": "imageAnalysis",
                                "expression": json,
                                "timestamp": data["timestamp"]
                            })));
                        })
                    }
                    else {
                        vision.detect(Buffer.from(data["image"], 'base64')).then((json) => {
                            connection.sendUTF(Parse.suitToSend(JSON.stringify({
                                "type": "imageAnalysis",
                                "expressions": json
                            })));
                        })
                    }
                }
            }
            else if (data["type"] == "test") {
                connection.sendUTF(Parse.suitToSend(JSON.stringify({
                    "type": "test",
                    "message": "we received test message",
                    "data": data
                })));
                console.log(JSON.stringify({
                    "type": "test",
                    "message": "we received test message",
                    "data": data
                }));
            }
        }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }

    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});