from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect', namespace='/mynamespace')
def connect(message):
    print('connected: ' + message)
    send(message, namespace='/mynamespace')

@socketio.on('disconnect', namespace='/mynamespace')
def disconnect():
    print('Disconnected.')

@socketio.on('message', namespace='/mynamespace')
def message(message):
    print('message: ' + message)

if __name__ == '__main__':
    socketio.run(app)