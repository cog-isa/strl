from app import socketio
from flask_socketio import emit

from flask import request
from models import *
import os, flask, json, helpers
import ros

from py4j.java_gateway import JavaGateway


def get_data_by_time(execution, time=None):
    if not time: time = Object.select(fn.Max(Object.time)).where(Object.execution_id==execution).scalar()
    groups = Object.select(fn.Max(Object.id)).where(Object.execution_id==execution, Object.time<=time).group_by(Object.object)
    objects = Object.select().where(Object.id << groups)

    data = {
        'id': execution, 'time': time,
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

        data['objects'] = [o._data for o in objects]
        socketio.emit('objects:index', data)
        return 'Ok!'


    @socketio.on('destroy_world')
    def destroy_world(data):
        gateway = JavaGateway()
        bridge = gateway.entry_point
        bridge.publish('/destroy_world', 'std_msgs/String',
                json.dumps({"data": str(data['execution'])}, ensure_ascii=False))


    @socketio.on('create_world')
    def create_world(data):
        gateway = JavaGateway()
        bridge = gateway.entry_point
        bridge.publish('/create_world', 'std_msgs/String', 
                json.dumps({"data": str(data['execution'])}, ensure_ascii=False))


    @socketio.on('rewrite_data')
    def rewrite_data(data, objects):
        execution = Execution.get(Execution.id==data['execution'])
        Object.delete().where(Object.execution==execution, Object.time>=data['time']).execute()
        for obj in objects:
            del obj['data']['id']
            obj['data']['time'] = data['time']
            obj['data']['execution'] = execution
            Object.create(**obj['data'])

        socketio.emit('objects:index', ros.get_data_by_time(execution.id))


    @socketio.on('clone_data')
    def clone_data(data, objects):
        base_execution = Execution.get(Execution.id==data['execution'])
        base_objects = Object.select().where(Object.execution==base_execution, Object.time<data['time']).execute()

        time = data['time']
        data = base_execution._data; del data['id']
        execution = Execution.create(**data)
        for obj in base_objects:
            data = obj._data; del data['id']
            data['execution'] = execution
            obj = Object.create(**data)

        for obj in objects:
            data = obj['data']; del data['id']
            data['execution'] = execution
            data['time'] = time
            Object.create(**data)
        
        emit('executions:update', execution._data)

