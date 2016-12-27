# -*- coding: utf-8 -*-
from flask import Flask
from flask_peewee.db import Database
from flask.ext.bower import Bower
from flask_socketio import SocketIO
from flask_sockets import Sockets
from peewee import PostgresqlDatabase


# DATABASE = {'name': 'strl', 'engine': 'peewee.PostgresqlDatabase',
#             'user': 'postgres', 'password': 'postgres', 'host': 'localhost', 'port': 5432}
DEBUG = True
SECRET_KEY = 'ssshhhh'

app = Flask(__name__, static_folder='../gui/static')
app.config.from_object(__name__)
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
app.jinja_env.autoescape = False

native_db = PostgresqlDatabase(
    'strl',  # Required by Peewee.
    user='postgres',  # Will be passed directly to psycopg2.
    password='postgres',  # Ditto.
    host='localhost',  # Ditto.
)

db = Database(app, native_db)
# bower = Bower(app)
# socketio = SocketIO(app)

