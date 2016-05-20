# -*- coding: utf-8 -*-
from flask_peewee.rest import RestAPI, RestResource
#from flask import Flask
#from flask import jsonify

#import json
#from app import app

#auth = Auth(app, db)x
#auth.User.create_table(fail_silently=True)

from app import app
from models import *
import controllers


controllers.route()


def createTables():
    for model in models:
        model.drop_table(cascade=True)
        model.create_table(fail_silently=False)

    world = World.create(name='hello')
    execution = Execution.create(world=world, base=True)
    Object.create(execution=execution, properties={
        "active": True,
        "program": "2",
        "name": "2",
        "geometry": {
            "type": "circle",
            "position": {"x": 100.0, "y": 0.0},
            "radius": 5
        }
    })

    Object.create(execution=execution, properties={
        "active": False,
        "name": "wall1",
        "geometry": {
            "type": "circle",
            "position": {"x": 0.0, "y": 0.0},
            "radius": 10
        }
    })

    print world.id


if __name__ == '__main__':

    createTables()

    api = RestAPI(app)
    for model in models:
        api.register(model)
    api.setup()

    app.run()
