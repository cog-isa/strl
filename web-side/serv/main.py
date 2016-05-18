# -*- coding: utf-8 -*-
from flask_peewee.rest import RestAPI, RestResource
from flask import Flask
from flask import jsonify
import json
from app import app

#auth = Auth(app, db)x
#auth.User.create_table(fail_silently=True)

import sys, database, inspect
from database import *


def createTables():
    classes = [name for name, obj in inspect.getmembers(database, inspect.isclass) if obj.__module__ == 'database']
    for name in classes:
        klass = getattr(database, name)
        klass.drop_table(cascade=True)
        klass.create_table(fail_silently=False)


def Create_Model(name2):
    temp = Modeling.select(Modeling.name == name2)
    if not temp:
        Modeling.create(name=name2)
        Modeling.create(name='Вася')


if __name__ == '__main__':


    createTables()

    #http://docs.peewee-orm.com/en/latest/peewee/quickstart.html
    #with db.atomic() as txn:  # classic
    with db.database.transaction() as txn: # flask peewee way
        #m = Modeling.get(Modeling.name == 'наше первое моделирование')
        ms = World.select().where(World.name == 'наше первое моделирование')
        if not ms.first() :
            m = World.create(name='наше первое моделирование')
            print('сделали моделирование', m)



    def minitest():
        m = Modeling.select().where(Modeling.name == 'наше первое моделирование').first()
        o = Object.select().limit(1).first()

        if not o :
            o= Object.create(time=0, type=1, shape="bla", activity=False, tranparency=12, life=100, material='steel',
                              temperature=12, reflecion=50, fuelvalue=30, sensors= 'scan', x=10, y=10)


        #если нет, то создать "потомка"

        #print(dir(m), ' !!!! we have back link')
        #print(list(m.objects))

        #o2= Object.create(time=0, type=1, shape="ro", coordinate_x=[150,160,80], coordinate_y=[10,110,80], activity=False, tranparency=32, life=100, material='wood',
        #o2= Object.create(time=0, type=1, shape="ro", activity=False, tranparency=32, life=100, material='wood',
        #                 temperature=12, reflecion=50, fuelvalue=30, sensors= 'scan', x=10, y=10)
        for o in m.objects:
            print(o)

        # ищем имя моделирования у которого температура = 12
        #print( Modeling.select().join(Object).where(Object.temperature == 12).first() )

        testRout()

    #minitest()


    # ПОДКЛЮЧИМ REST
    # http://docs.peewee-orm.com/projects/flask-peewee/en/latest/getting-started.html#exposing-content-using-a-rest-api
    # create a RestAPI container
    #определеим ресурсы, чтобы включать вложенные объекты
    #class ObjectResource(RestResource):
    #    filter_fields = ('modeling','execution', 'type')

    api = RestAPI(app)
    api.register(World)

    # теперь curl -v http://127.0.0.1:5000/api/object/?modeling=1
    # показывает только объекты первого моделирования т.к. ObjectResource filter_fields
    #api.register(LogEntry)

    api.setup()
    # now curl http://127.0.0.1:5000/api/modeling/ - все
    # http://127.0.0.1:5000/api/modeling/1/   - первый


    # how to manage data throuth HTTP  ?? answers:
    # http://docs.peewee-orm.com/projects/flask-peewee/en/latest/rest-api.html#rest-api

    app.run(host='127.0.0.1', port='5000')

