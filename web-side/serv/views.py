# -*- coding: utf-8 -*-

from flask import jsonify, request
#from flask.ext import setup
from playhouse.shortcuts import model_to_dict
from models import *
from app import native_db as db
import ujson


def route(app):

	# --------------------   Project   -------------------------

	@app.route('/api/projects/<id>', methods=['GET'])
	def project_get(id):
		project = Project.get(Project.id == id)
		return jsonify(model_to_dict(project))

	@app.route('/api/projects', methods=['POST'])
	def project_create():
		# TODO: Проверка на недублирование имени

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
		#TODO: Проверка на недублирование имени

		data = request.json
		name = data['name']
		project_id = data['project_id']
		world = World.create(name=name, project_id=project_id)
		world_dc = model_to_dict(world, recurse=False)
		world_dc.pop('project')
		world_dc['project_id'] = world.project_id
		return ujson.dumps(world_dc), 201, {'Content-Type': 'application/json'}

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

	# --------------------   ObjectType   -------------------------

	@app.route('/api/object_types/<id>', methods=['GET'])
	def object_type_get(id):
		try: object_type = ObjectType.get(ObjectType.id == id)
		except ObjectType.DoesNotExist:
			return '', 404
		return jsonify(model_to_dict(object_type))

	@app.route('/api/object_types', methods=['GET'])
	def object_types_get():
		object_types = ObjectType.select()
		return jsonify([model_to_dict(ot) for ot in object_types])

	# --------------------   Object   -------------------------

	@app.route('/api/world/<world_id>/objects', methods=['GET'])
	def objects_get(world_id):
		# TODO: Сделать через prefetch
		objs = Object.select().where(Object.world_id == world_id)
		obj_dcs = []
		for obj in objs:
			props = Property.select().where(Property.object == obj)
			obj_dc = model_to_dict(obj)
			obj_dc['properties'] = {prop.name: prop.value for prop in props}
			obj_dcs.append(obj_dc)
		return jsonify(obj_dcs)

	@app.route('/api/objects/<id>', methods=['GET'])
	def object_get(id):
		object = Object.get(Object.id == id)
		props = Property.select().where(Property.object == object).execute()
		obj_dc = model_to_dict(object)
		obj_dc['properties'] = [model_to_dict(prop) for prop in props]
		return jsonify(obj_dc)

	@app.route('/api/objects', methods=['POST'])
	def object_create():
		data = request.json
		props_dc = data.pop('properties', {})
		with db.atomic() as txn:
			object = Object.create(**data)
			for key, val in props_dc.items():
				prop = Property.create(object=object, name=key, value=val)
		obj_dc = model_to_dict(object)
		obj_dc['properties'] = props_dc
		return ujson.dumps(obj_dc), 201, {'Content-Type': 'application/json'}


	@app.route('/api/objects/<id>', methods=['PATCH'])
	def object_update(id):
		data = request.json
		props_dc = data.pop('properties', None)
		effected_row_cnt = Object.update(**data).where(Object.id == id)
		for key, val in props_dc.items():
			# prop = Property.update(object=object, name=key, value=val)
			prop = Property(object_id=id, name=key, value=val)
			prop.save(force_insert=True)
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200


	@app.route('/api/objects/<id>', methods=['DELETE'])
	def object_remove(id):
		effected_row_cnt = Object.delete().where(Object.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204

