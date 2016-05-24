from flask import request
from models import *
import os, flask, json

from py4j.java_gateway import JavaGateway


def get_data_by_time(execution, time=int(1e+9)):
    groups = Object.select(fn.Max(Object.id)).where(Object.execution_id==execution, Object.time<=time).group_by(Object.object)
    objects = Object.select().where(Object.id << groups)

    data = {
        'id': execution,
        'objects': [o._data for o in objects]
    }

    return data


def route(app):
    @app.route('/executions/<id>/get_data', methods=['GET'])
    def get_data(id):
        data = get_data_by_time(execution=id)
        return flask.jsonify(**data)


    @app.route('/executions/<id>/set_data', methods=['POST'])
    def set_data(id):
        data = json.loads(request.get_data())

        objects = [Object.create(
            time=data['time'],

            execution_id=data['id'],
            object=obj['object'],

            program_id=obj['program'],
            properties=obj['properties'])
                for obj in data['objects']]

        return 'Ok!'


    @app.route('/executions/<id>/destroy_world', methods=['GET'])
    def destroy_world(id):
        gateway = JavaGateway()
        bridge = gateway.entry_point
        bridge.publish('/destroy_world', 'std_msgs/String',
                json.dumps({"data": id}, ensure_ascii=False))
        return 'Ok!'


    @app.route('/worlds/<id>/execute', methods=['GET'])
    def create_world(id):
        world = World.get(World.id==id)

        base_execution = Execution.get(Execution.world==world, Execution.base==True)
        base_objects = Object.select().where(Object.execution==base_execution)

        execution = Execution.create(world=world) 
        objects = [Object.create(
            execution=execution,
            object=base_object.object,
            program=base_object.program,
            properties=base_object.properties)
                for base_object in base_objects]

        gateway = JavaGateway()
        bridge = gateway.entry_point
        bridge.publish('/create_world', 'std_msgs/String', 
                json.dumps({"data": str(execution.id)}, ensure_ascii=False))

        return str(execution.id)
