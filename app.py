from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/ping')
def ping():
    socketio.emit('ping event', {'msg': 'pong'})
    return 'pong' 

if __name__ == '__main__':
    socketio.run(app)
