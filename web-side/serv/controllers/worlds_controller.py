from flask import request, render_template
from app import socketio
from models import *
import ros

def route(app):

    @app.route('/worlds/<id>/<exec_id>', methods=['GET'])
    def show(id, exec_id):
        world = World.get(World.id==id)
        execution = Execution.get(Execution.id==exec_id)
        objects = ros.get_data_by_time(execution.id)['objects']
        return render_template('worlds/show.jade', 
                world=world, execution=execution, objects=objects)


    @socketio.on('object:index')
    def object_index(data):
        if 'time' not in data: data['time'] = int(1e+9)
        objects = ros.get_data_by_time(data['execution'], data['time'])['objects']
        for obj in objects: 
            object = Object.get(Object.id==obj['id'])
            socketio.emit('object:update', object._data)

    @socketio.on('object:get')
    def get_object_properties(json):
        object = Object.get(Object.id==json['id'])
        socketio.emit('object:update', object._data)
