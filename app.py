from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('message')
def handle_message(json):
    print('received message: ' + json['data'])

@socketio.on('connect')
def test_connect():
    socketio.emit('response', {'data': 'Connected'})
    print('connected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')