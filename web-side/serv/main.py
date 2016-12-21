# -*- coding: utf-8 -*-

import sys

from flask_peewee.rest import RestAPI, RestResource

from app import app #, socketio
import views
from models import *
import controllers


# controllers.route(app)


def recreate_db():
    for model in models:
        model.drop_table(cascade=True, fail_silently=True)
        model.create_table(fail_silently=False)

    for ot_name in 'Робот', 'Стена', 'Маркер':
        ObjectType.create(name=ot_name)

    """
    world = World.create(name='hello')
    execution = Execution.create(world=world, base=True)
    Object.create(execution=execution, properties={
        "active": True,
        "program": "2",
        "name": "2",
        "geometry": {
            "type": "circle",
            "position": {"x": 0, "y": 200},
            "radius": 25
        }
    })

    Object.create(execution=execution, properties={
        "active": False,
        "name": "target",
        "geometry": {
            "type": "circle2",
            "position": {"x": 250, "y": 300},
            "radius": 25
        }
    })

    xy = [0, 175,  100, 350,  200, 300,  100, 100,  200, -50,  150, 50,  300, 150,  200, 100,  250, 250]
    wh = [1, 350,  200, 1,    1,   100,  1,   300,  200,  1,   100, 1,   1,   400,  1,   100,  100, 1]

    dx, dy = 100, 300

    for i in range(len(xy)): 
        if i % 2 > 0: xy[i] += dy
        else: xy[i] += dx

    for i in range(0, len(xy)/2):
        print(i<<1, len(xy))
        Object.create(execution=execution, properties={
            "active": False, "name": "wall%i"%i,
            "geometry": {
                "type": "rectangle",
                "position": {"x": xy[(i<<1)], "y": xy[(i<<1)+1]},
                "width": wh[(i<<1)], "height": wh[(i<<1)+1]

            }
        })

    Object.update(object=Object.id).execute()
    """


def run_server():
    views.route(app)
    app.run(host='0.0.0.0')


if __name__ == '__main__':
    if len(sys.argv) == 1:
        run_server()
        app.run(host='0.0.0.0')
    else:
        if sys.argv[1] == 'recreatedb':
            recreate_db()
        else:
            print('unknown argument')

    #createTables()

    #api = RestAPI(app)
    #for model in models:
    #    api.register(model)
    #api.setup()


    # socketio.run(app, host='0.0.0.0')
