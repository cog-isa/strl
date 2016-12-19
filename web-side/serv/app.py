# -*- coding: utf-8 -*-
from flask import Flask
from flask_peewee.db import Database
from flask.ext.bower import Bower
from flask_socketio import SocketIO


DATABASE = {'name': 'strl', 'engine': 'peewee.PostgresqlDatabase',
            'user': 'postgres', 'password': 'postgres', 'host': 'localhost', 'port': 5432}
DEBUG = True
SECRET_KEY = 'ssshhhh'

app = Flask(__name__)
app.config.from_object(__name__)
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
app.jinja_env.autoescape = False

db = Database(app)
# bower = Bower(app)
# socketio = SocketIO(app)
