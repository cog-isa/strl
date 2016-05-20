# -*- coding: utf-8 -*-
from flask import Flask
from flask_peewee.db import Database


DATABASE = {'name': 'postgres', 'engine': 'peewee.PostgresqlDatabase',
            'user': 'postgres', 'password': '123123123', 'host': 'localhost', 'port': 5432}
DEBUG = True
SECRET_KEY = 'ssshhhh'

app = Flask(__name__)
app.config.from_object(__name__)

db = Database(app)
