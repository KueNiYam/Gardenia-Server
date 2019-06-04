import websocket

ws = websocket.WebSocket()
ws.connect("ws://127.0.0.1:5000/echo")
ws.send("hello world")
ws.recv()