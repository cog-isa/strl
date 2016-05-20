from app import app
from flask import request
from models import *
import os, flask


@app.route('/executions/<id>/get_data', methods=['GET'])
def get_data(id):
    execution = Execution.get(Execution.id==id)
    objects = Object.select().where(Object.execution==execution).order_by(+Object.time)

    data = {
        'id': id,
        'objects': [o._data for o in objects]
    }

    return flask.jsonify(**data)


@app.route('/executions/<id>/set_data', methods=['POST'])
def set_data(id):
    data = request.get_json()
    print data

    objects = [Object.create(
        time=data['time'],

        execution_id=data['id'],
        object_id=obj['id'],

        program_id=obj['program'],
        properties=obj['properties'])
            for obj in data['objects']]

    return 'Ok!'


@app.route('/worlds/<id>/execute', methods=['GET'])
def create_world(id):
    world = World.get(World.id==id)

    base_execution = Execution.get(Execution.world==world, Execution.base==True)
    base_objects = Object.select().where(Object.execution==base_execution)

    execution = Execution.create(world=world) 
    objects = [Object.create(
        execution=execution,
        program=base_object.program,
        properties=base_object.properties)
            for base_object in base_objects]

    os.system('java -jar ~/Documents/Development/Diploma/strl/ROSBridge/out/artifacts/ROSBridge_jar/ROSBridge.jar')
    return id
