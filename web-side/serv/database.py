# -*- coding: utf-8 -*-

import datetime
from peewee import *
from flask_peewee.db import Database
from app import app
from playhouse.postgres_ext import *


DATABASE = {'name': 'postgres', 'engine': 'peewee.PostgresqlDatabase',
            'user': 'postgres', 'password': '12353217', 'host': 'localhost', 'port': 5433}

app.config.from_object(__name__)
db = Database(app)

# MODEL
M = db.Model
print M


class User(M):
    user_name = CharField(max_length=200)


class World(M):
    date = DateTimeField(default=datetime.datetime.now)
    name = CharField(max_length=200)
    user_id = ForeignKeyField(User, null=True)


class Execution(M):
    date = DateTimeField(default=datetime.datetime.now)
    name = CharField(max_length=200)
    user_id = ForeignKeyField(User, null=False)
    world_id = ForeignKeyField(World, null=False)


class Program(M):
    name = CharField(max_length=100)


class Object(M):
    shape_name = CharField(max_length=20)
    activity = BooleanField()

    program_id = ForeignKeyField(Program, null=True)#ссылка на словарь - модель поведения агентов на RST-уровнях
    world_id = ForeignKeyField(World, null=False)


class Properties (M):
    execution_id = ForeignKeyField (Execution, null=True)
    object_id =ForeignKeyField(Object, null=False)

    time = IntegerField()#discret time
    json = JSONField()
