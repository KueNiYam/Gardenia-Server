$(document).ready(function() {
    const ws = new WebSocket("ws://127.0.0.1:5000");

    ws.onopen = function (event) {
        ws.send('42["message",{"type":"test","testMessage":"test message"}]');
        console.log('Socket connected.')
    };

    ws.onmessage = function (message) {
        console.log('Message: ' + message.data);
    };

    ws.onerror = function (event) {
        console.log('Error: ' + event)
    };

    ws.onclose = function (event) {
        console.log('Socket disconnected.')
    };

});
