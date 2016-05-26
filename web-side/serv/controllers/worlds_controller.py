from flask import request, render_template
from app import socketio
from models import *
import ros


def route(app):

    @app.route('/worlds/<world_id>', methods=['GET'])
    def show(world_id):
        world = World.get(World.id==world_id)
        return render_template('worlds/show.jade', world=world)


    @socketio.on('object:index')
    def object_index(data):
        if 'time' not in data: data['time'] = int(1e+9)
        objects = ros.get_data_by_time(data['execution'], data['time'])['objects']
        for obj in objects: 
            object = Object.get(Object.id==obj['id'])
            socketio.emit('object:update', object._data)


    @socketio.on('object:get')
    def object_get(json):
        object = Object.get(Object.id==json['id'])
        socketio.emit('object:update', object._data)
        

    @socketio.on('execution:index')
    def execution_index(data):
        executions = Execution.select().where(Execution.world_id==data['world'])
        for execute in executions: socketio.emit('execution:update', execute._data)
