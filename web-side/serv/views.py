# -*- coding: utf-8 -*-

from flask import jsonify, request
from playhouse.shortcuts import model_to_dict
from models import *
import ujson


# ---------------   Project   --------------------

def route(app):
    @app.route('/api/projects/<id>', methods=['GET'])
    def project_get(id):
        project = Project.get(Project.id == id)
        return jsonify(project)


    @app.route('/api/projects', methods=['POST'])
    def project_create():
        name = request.json['name']
        project = Project.create(name=name)
        return ujson.dumps(model_to_dict(project)), 201, {'Content-Type': 'application/json'}


    @app.route('/api/projects/<id>', methods=['PATCH'])
    def project_update():
        data = request.json['name']
        project = Project.where(id=id).update(name=data['name'])
        return 200


    @app.route('/api/projects/<id>', methods=['DELETE'])
    def project_remove():
        project = Project.where(id=id).delete(id=id)
        return 204
