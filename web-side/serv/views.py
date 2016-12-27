# -*- coding: utf-8 -*-

import hashlib
import math
import os
from functools import wraps

from flask import jsonify, request, session
#from flask.ext import setup
from flask import send_from_directory
from playhouse.shortcuts import model_to_dict
from models import *
from app import native_db as db
import ujson

from py4j.java_gateway import JavaGateway


ws = None


def route(app, sockets):

	# --------------------   Сервим статические файлы   -------------------------

	@app.route('/login')
	@app.route('/login.html')
	def serve_login():
		return send_from_directory('../gui', 'login.html')

	@app.route('/listofproj')
	@app.route('/listofproj.html')
	def serve_listofproj():
		return send_from_directory('../gui', 'listofproj.html')

	@app.route('/worldeditor')
	@app.route('/worldeditor.html')
	def serve_worldeditor():
		return send_from_directory('../gui', 'worldeditor.html')

	@app.route('/modeling')
	@app.route('/modeling.html')
	def serve_modeling():
		return send_from_directory('../gui', 'modeling.html')

	# --------------------   User   -------------------------

	def is_autherized(fn):
		@wraps(fn)
		def decorator(*args, **kv):
			auth_token = session.get('auth_token')
			if not auth_token:
				return 'Unauthorized', 401
			try: User.get(auth_token=auth_token)
			except User.DoesNotExist:
				return 'Unauthorized', 401
			return fn(*args, **kv)
		return decorator

	@app.route('/api/login', methods=['POST'])
	def login():
		#auth_token = session.get('auth_token')
		#if auth_token:
		#	return 'Already logged in', 400
		args = request.json
		login_ = args['login']
		password = args['password']
		try: user = User.get(login=login_, password=password)
		except User.DoesNotExist:
			return 'Invalid login or password', 400

		auth_token = hashlib.sha1(os.urandom(128)).hexdigest()
		with db.atomic() as txn:
			User.update(auth_token=auth_token).where(User.id == user.id).execute()
			session['auth_token'] = auth_token
		return ''

	@app.route('/api/logout', methods=['POST'])
	@is_autherized
	def logout():
		with db.atomic() as txn:
			User.update(auth_token=None).where(User.auth_token == session['auth_token']).execute()
			del session['auth_token']
		return ''

	# --------------------   Project   -------------------------

	@app.route('/api/projects', methods=['GET'])
	@is_autherized
	def projects_get():
		projects = Project.select()
		return jsonify([model_to_dict(project) for project in projects])

	@app.route('/api/projects/<id>', methods=['GET'])
	@is_autherized
	def project_get(id):
		project = Project.get(Project.id == id)
		return jsonify(model_to_dict(project))

	@app.route('/api/projects', methods=['POST'])
	@is_autherized
	def project_create():
		# TODO: Проверка на недублирование имени

		name = request.json['name']
		project = Project.create(name=name)
		return ujson.dumps(model_to_dict(project)), 201, {'Content-Type': 'application/json'}

	@app.route('/api/projects/<id>', methods=['PATCH'])
	@is_autherized
	def project_update(id):
		data = request.json
		effected_row_cnt = Project.update(name=data['name']).where(Project.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200

	@app.route('/api/projects/<id>', methods=['DELETE'])
	@is_autherized
	def project_remove(id):
		effected_row_cnt = Project.delete().where(Project.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204

	# --------------------   World   -------------------------

	@app.route('/api/projects/<project_id>/worlds', methods=['GET'])
	@is_autherized
	def worlds_get(project_id):
		worlds = World.select().where(World.project_id == project_id)
		world_dcs = []
		for world in worlds:
			world_dc = model_to_dict(world, recurse=False)
			world_dc['project_id'] = world_dc['project']
			world_dc.pop('project')
			world_dcs.append(world_dc)
		return jsonify(world_dcs)

	@app.route('/api/worlds/<id>', methods=['GET'])
	@is_autherized
	def world_get(id):
		world = World.get(World.id == id)
		world_dc = model_to_dict(world, recurse=False)
		world_dc['project_id'] = world_dc['project']
		world_dc.pop('project')
		return jsonify(world_dc)

	@app.route('/api/worlds', methods=['POST'])
	@is_autherized
	def world_create():
		#TODO: Проверка на недублирование имени
		data = request.json
		name = data['name']
		project_id = data['project_id']
		with db.atomic() as txn:
			world = World.create(name=name, project_id=project_id)
			Experiment.create(world=world)
		world_dc = model_to_dict(world, recurse=False)
		world_dc.pop('project')
		world_dc['project_id'] = world.project_id
		return ujson.dumps(world_dc), 201, {'Content-Type': 'application/json'}

	@app.route('/api/worlds/<id>', methods=['PATCH'])
	@is_autherized
	def world_update(id):
		data = request.json
		effected_row_cnt = World.update(name=data['name']).where(World.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200

	@app.route('/api/worlds/<id>', methods=['DELETE'])
	@is_autherized
	def world_remove(id):
		effected_row_cnt = World.delete().where(World.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204



	# --------------------   ObjectType   -------------------------

	"""
	@app.route('/api/object_types/<id>', methods=['GET'])
	def object_type_get(id):
		try: object_type = ObjectType.get(ObjectType.id == id)
		except ObjectType.DoesNotExist:
			return '', 404
		return jsonify(model_to_dict(object_type))
	"""

	@app.route('/api/object_types', methods=['GET'])
	@is_autherized
	def object_types_get():
		"""Возвращает дерево типов."""
		object_types = ObjectType.select()
		ots_dc = {}
		children_dc = {}
		for ot in object_types:
			ot_dc = model_to_dict(ot, recurse=False)
			ot_dc['parent_id'] = ot.parent_id
			ot_dc.pop('parent')
			ots_dc[ot.id] = ot_dc
			if  ot.parent_id not in children_dc:
				children_dc[ot.parent_id] = []
			children_dc[ot.parent_id].append(ot_dc)
		for id, ot_dc in ots_dc.items():
			children = children_dc.get(ot_dc['id'])
			if children:
				children.sort(key=lambda child_dc: child_dc['position'])
			else:
				children = []
			ot_dc['children'] = children
		return jsonify(children_dc[None])

	# --------------------   Object   -------------------------

	@app.route('/api/worlds/<world_id>/objects', methods=['GET'])
	@is_autherized
	def objects_get(world_id):
		# TODO: Сделать через prefetch
		objs = Object.select().where(Object.world_id == world_id)
		obj_dcs = []
		for obj in objs:
			props = Property.select().where(Property.object == obj)
			obj_dc = model_to_dict(obj, recurse=False)
			obj_dc['type_id'] = obj.type_id
			obj_dc['world_id'] = obj.world_id
			obj_dc.pop('type')
			obj_dc.pop('world')
			obj_dc['properties'] = {prop.name: prop.value for prop in props}
			obj_dcs.append(obj_dc)
		return jsonify(obj_dcs)

	@app.route('/api/objects/<id>', methods=['GET'])
	@is_autherized
	def object_get(id):
		obj = Object.get(Object.id == id)
		props = Property.select().where(Property.object == obj).execute()
		obj_dc = model_to_dict(obj)
		obj_dc['type_id'] = obj.type_id
		obj_dc['world_id'] = obj.world_id
		obj_dc.pop('type')
		obj_dc.pop('world')
		obj_dc['properties'] = {prop.name: prop.value for prop in props}
		return jsonify(obj_dc)

	@app.route('/api/objects', methods=['POST'])
	@is_autherized
	def object_create():
		data = request.json
		props_dc = data.pop('properties', {})
		with db.atomic() as txn:
			object = Object.create(**data)
			for key, val in props_dc.items():
				prop = Property.create(object=object, name=key, value=val)
		obj_dc = model_to_dict(object)
		obj_dc['type_id'] = object.type_id
		obj_dc['world_id'] = object.world_id
		obj_dc.pop('type')
		obj_dc.pop('world')
		obj_dc['properties'] = props_dc
		return ujson.dumps(obj_dc), 201, {'Content-Type': 'application/json'}

	@app.route('/api/objects/<id>', methods=['PATCH'])
	@is_autherized
	def object_update(id):
		# TODO: Доделать
		data = request.json
		props_dc = data.pop('properties', {})
		if 'type_id' in data:
			data['type'] = data['type_id']
			data.pop('type_id')
		with db.atomic() as txn:
			if data:
				effected_row_cnt = Object.update(**data).where(Object.id == id).execute()
			else:
				effected_row_cnt = None
			for key, val in props_dc.items():
				eff_cnt = Property.update(value=val).where((Property.object_id == id) & (Property.name == key)).execute()
				if eff_cnt == 0:
					Property.create(object_id=id, name=key, value=val)
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 200

	@app.route('/api/objects/<id>', methods=['DELETE'])
	@is_autherized
	def object_remove(id):
		effected_row_cnt = Object.delete().where(Object.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204

	# --------------------   Experiment   -------------------------

	@app.route('/api/worlds/<world_id>/experiment/start', methods=['POST'])
	@is_autherized
	def experiment_start(world_id):
		world = World.get(id=world_id)

		#if 'start_time' not in session:
		#	session['start_time'] = {}

		time = request.args.get('time')
		# if time is not None:
			# session['start_time'][world.id] = int(time)
		time = None if time is None else int(time)

		with db.atomic() as txn:
			Experiment.update(start_time=time).where(Experiment.world_id == world_id).execute()
			# Удаляем всю историю после заданного времени
			objs = Object.select(Object.id).where(Object.world_id == world_id)
			arg_time = time or -1
			effected_row_cnt = PropertyInTime.delete().where((PropertyInTime.object_id << objs) & (PropertyInTime.time > arg_time)).execute()

		gateway = JavaGateway()
		bridge = gateway.entry_point
		bridge.publish('/create_world', 'std_msgs/String',
					   # json.dumps({"data": str(data['execution'])}, ensure_ascii=False))
					   ujson.dumps({"data": str(world.id)}, ensure_ascii=False))
		return '', 200

	@app.route('/api/worlds/<world_id>/experiment/stop', methods=['POST'])
	@is_autherized
	def experiment_stop(world_id):
		world = World.get(id=world_id)
		gateway = JavaGateway()
		bridge = gateway.entry_point
		bridge.publish('/destroy_world', 'std_msgs/String',
					   # json.dumps({"data": str(data['execution'])}, ensure_ascii=False))
					   ujson.dumps({"data": str(world.id)}, ensure_ascii=False))
		return '', 200

	# Эндпоинты для ros'a:

	@app.route('/executions/<world_id>/get_data', methods=['GET'])
	def ros_get_data(world_id):
		# data = get_data_by_time(execution=world_id)

		#time = session['start_time'].pop(int(world_id), None)
		time = Experiment.get(world_id=world_id).start_time

		# TODO: Сделать через prefetch
		objs = Object.select().where(Object.world_id == world_id)
		obj_dcs = []
		for obj in objs:
			if time is None:
				props = Property.select().where(Property.object == obj)
			else:
				props = PropertyInTime.select().where((PropertyInTime.object == obj) & (PropertyInTime.time == time))
			props = {prop.name: prop.value for prop in props}
			obj_dc = {
				'object': obj.id,
				'program': None,
				'time': time or 0,
				'execution': world_id,
				'properties': {
					# 'program': obj.name,	# программа робота
					'name': obj.name,
					# TODO: Переделать на эньюм
					'active':  obj.type_id in (4, 5),		#если false, то - стена
					'geometry': {
						'type': 'rectangle',
						'position': {
							'x': float(props.pop('left')),
							'y': float(props.pop('top'))
						},
						'width': float(props['width']),
						'height': float(props['height'])
					}
				}
			}
			# Если объект - робот
			if obj.type_id in (4, 5):
				if obj.type_id == 4:
					obj_dc['properties']['program'] = 'active_robot'
				elif obj.type_id == 5:
					obj_dc['properties']['program'] = 'passive_robot'
				else:
					obj_dc['properties']['program'] = None

			# Радиус описанной окружности
			obj_dc['properties']['geometry']['radius'] =\
				math.sqrt(obj_dc['properties']['geometry']['width'] ** 2 + obj_dc['properties']['geometry']['height'] ** 2) / 2
			obj_dc['properties'].update(props)
			obj_dcs.append(obj_dc)

		data = {
			# Идентификатор моделируемого мира
			'id': world_id,
			# Время начала моделирования
			'time': time or 0,
			'objects': obj_dcs
		}

		"""
		def get_data_by_time(execution, time=None):
			if not time: time = Object.select(fn.Max(Object.time)).where(Object.execution == execution).scalar()
			groups = Object.select(fn.Max(Object.id)).where(Object.execution == execution,
															Object.time <= time).group_by(Object.object)
			objects = Object.select().where(Object.id << groups).order_by(-Object.id)

			data = {
				'id': execution, 'time': time,
				'objects': [o._data for o in objects]
			}

			return data
		"""

		#session['start_time'].pop([int(world_id)])

		return jsonify(**data)

	@app.route('/executions/<world_id>/set_data', methods=['POST'])
	def ros_set_data(world_id):
		data = ujson.loads(request.get_data())
		ret_data = {
			'time': data['time'],
			'objects': []
		}
		with db.atomic() as txn:
			for obj_dc in data['objects']:
				props_dc = obj_dc['properties']
				"""
				'position': {('top', props_dc['position']['y'],
								'x': props.pop('left'),
								'y': props.pop('top')
							},
				'width': props.pop('width'),
				'height': props.pop('height'),
				"""
				props_dc2 = {
					'left': props_dc['geometry']['position']['x'],
				 	'top': props_dc['geometry']['position']['y'],
				 	'width': props_dc['geometry']['width'],
				 	'height': props_dc['geometry']['height']
				}
				props_dc.pop('active', None)
				props_dc.pop('name', None)
				props_dc.pop('geometry', None)
				props_dc2.update(props_dc)

				for key, val in props_dc2.items():
					# PropertyInTime.create(**dict(kv_args.items() + {key: val}))
					PropertyInTime.create(object_id=obj_dc['object'], time=data['time'], name=key, value=val)

				ret_data['objects'].append({
					'id': obj_dc['object'],
					'properties': props_dc2
				})

		"""
		objects = [Object.create(
			time=data['time'],

			execution_id=data['id'],
			object=obj['object'],

			program_id=obj['program'],
			properties=obj['properties'])
				   for obj in data['objects']]

		data['objects'] = [o._data for o in objects]
		"""

		# TODO: Отправить в web-сокет
		# socketio.emit('objects:index', data)

		print(ret_data)

		ws.send(ujson.dumps(ret_data))

		return ''

	@sockets.route('/experiment-data')
	def experiment_data(ws_):
		global ws
		ws = ws_
		while not ws.closed:
			message = ws.receive()
			#ws.send(message)

