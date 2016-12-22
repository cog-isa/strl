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

    # Создаем типы объектов
    position = 0
    for ot_name in 'Робот', 'Стена', 'Маркер':
        ObjectType.create(name=ot_name, position=position)
        position += 1
    robot_ot = ObjectType.get(name='Робот')
    position = 0
    for ot_name in 'Робот, умеющий разрушать препятствия', 'Робот, неумеющий разрушать препятствия':
        ObjectType.create(name=ot_name, parent=robot_ot, position=position)
        position += 1

    # Создаем тестовый проект
    project = Project.create(name='Проект1')

    # Создаем тестовый мир
    world = World.create(name='Мир1', project=project)

    """
    world = World.create(name='hello')
    execution = Execution.create(world=world, base=True)
    """

    # Создаем объект - разрушающий робот
    obj = Object.create(name='Разруш. робот 1', type_id=4, world_id=1)
    Property.create(object=obj, name='position_x', value=20)
    Property.create(object=obj, name='position_y', value=30)
    Property.create(object=obj, name='width', value=10)
    Property.create(object=obj, name='height', value=7)
    Property.create(object=obj, name='color', value='#cccccc')

    # Создаем объект - стена
    obj = Object.create(name='Стена 1', type_id=2, world_id=1)
    Property.create(object=obj, name='position_x', value=16)
    Property.create(object=obj, name='position_y', value=9)
    Property.create(object=obj, name='width', value=5)
    Property.create(object=obj, name='height', value=21)
    Property.create(object=obj, name='color', value='#eeeeee')


    """
    {
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
