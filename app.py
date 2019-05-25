from flask import Flask
#from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
#socketio = SocketIO(app)

@app.route('/ping')
def ping():
    return 'ping'

if __name__ == '__main__':
    app.run('0.0.0.0')
