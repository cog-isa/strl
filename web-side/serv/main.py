# -*- coding: utf-8 -*-
from flask_peewee.rest import RestAPI, RestResource

from app import app, socketio
from models import *
import controllers


controllers.route(app)


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
            "position": {"x": 200.0, "y": 100.0},
            "radius": 5
        }
    })

    Object.create(execution=execution, properties={
        "active": False,
        "name": "wall1",
        "geometry": {
            "type": "circle",
            "position": {"x": 10.0, "y": 100.0},
            "radius": 10
        }
    })

    Object.update(object=Object.id).execute()


if __name__ == '__main__':

    createTables()

    api = RestAPI(app)
    for model in models:
        api.register(model)
    api.setup()

    socketio.run(app)
