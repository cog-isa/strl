# -*- coding: utf-8 -*-

from flask import jsonify, request
#from flask.ext import setup
from playhouse.shortcuts import model_to_dict
from models import *
import ujson


def route(app):

	# --------------------   Project   -------------------------

	@app.route('/api/projects/<id>', methods=['GET'])
	def project_get(id):
		project = Project.get(Project.id == id)
		return jsonify(model_to_dict(project))

	@app.route('/api/projects', methods=['POST'])
	def project_create():
		name = request.json['name']
		project = Project.create(name=name)
		return ujson.dumps(model_to_dict(project)), 201, {'Content-Type': 'application/json'}

	@app.route('/api/projects/<id>', methods=['PATCH'])
	def project_update(id):
		data = request.json
		effected_row_cnt = Project.update(name=data['name']).where(Project.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200

	@app.route('/api/projects/<id>', methods=['DELETE'])
	def project_remove(id):
		effected_row_cnt = Project.delete().where(Project.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204

	# --------------------   World   -------------------------

	@app.route('/api/worlds/<id>', methods=['GET'])
	def world_get(id):
		world = World.get(World.id == id)
		return jsonify(model_to_dict(world))

	@app.route('/api/worlds', methods=['POST'])
	def world_create():
		data = request.json
		name = data['name']
		project_id = data['project_id']
		world = World.create(name=name, project_id=project_id)
		return ujson.dumps(model_to_dict(world)), 201, {'Content-Type': 'application/json'}

	@app.route('/api/worlds/<id>', methods=['PATCH'])
	def world_update(id):
		data = request.json
		effected_row_cnt = World.update(name=data['name']).where(World.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200

	@app.route('/api/worlds/<id>', methods=['DELETE'])
	def world_remove(id):
		effected_row_cnt = World.delete().where(World.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204




