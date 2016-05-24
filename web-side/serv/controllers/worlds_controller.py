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

    @socketio.on('get_object_properties')
    def get_object_properties(json):
        object = Object.get(Object.id==json['id'])
        socketio.emit('update_properties', {'object': object.object, 'props': object.properties})
