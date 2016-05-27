from flask import request, render_template
from flask_socketio import emit
from app import socketio
from models import *
import ros


def route(app):

    @app.route('/worlds/<world_id>', methods=['GET'])
    def show(world_id):
        world = World.get(World.id==world_id)
        return render_template('worlds/show.jade', world=world)


    @socketio.on('objects:index')
    def object_index(data):
        data = ros.get_data_by_time(data['execution'], data['time'])
        emit('objects:index', data)


    @socketio.on('objects:get')
    def object_get(json):
        object = Object.get(Object.id==json['id'])
        emit('objects:update', object._data)
        

    @socketio.on('executions:index')
    def execution_index(data):
        executions = Execution.select().where(Execution.world_id==data['world'])
        data = {'id': data['world'], 'executions': [e._data for e in executions]}
        emit('executions:index', data)
