# -*- coding: utf-8 -*-

from flask import jsonify, request, session
#from flask.ext import setup
from playhouse.shortcuts import model_to_dict
from models import *
from app import native_db as db
import ujson

from py4j.java_gateway import JavaGateway


def route(app):

	# --------------------   Project   -------------------------

	@app.route('/api/projects', methods=['GET'])
	def projects_get():
		projects = Project.select()
		"""
		world_dcs = []
		for world in worlds:
			world_dc = model_to_dict(world, recurse=False)
			world_dc['project_id'] = world_dc['project']
			world_dc.pop('project')
			world_dcs.append(world_dc)
		"""
		return jsonify([model_to_dict(project) for project in projects])

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

	@app.route('/api/projects/<project_id>/worlds', methods=['GET'])
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
	def world_get(id):
		world = World.get(World.id == id)
		world_dc = model_to_dict(world, recurse=False)
		world_dc['project_id'] = world_dc['project']
		world_dc.pop('project')
		return jsonify(world_dc)

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

	"""
	@app.route('/api/object_types/<id>', methods=['GET'])
	def object_type_get(id):
		try: object_type = ObjectType.get(ObjectType.id == id)
		except ObjectType.DoesNotExist:
			return '', 404
		return jsonify(model_to_dict(object_type))
	"""

	@app.route('/api/object_types', methods=['GET'])
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
	def object_remove(id):
		effected_row_cnt = Object.delete().where(Object.id == id).execute()
		if effected_row_cnt == 0:
			return '', 404
		else:
			return '', 204

	# --------------------   Experiment   -------------------------

	@app.route('/api/worlds/<world_id>/experiment/start', methods=['POST'])
	def experiment_start(world_id):
		world = World.get(id=world_id)

		if 'start_time' not in session['start_time']:
			session['start_time'] = {}

		time = request.args.get('time')
		if time is not None:
			session['start_time'][world.id] = int(time)

		gateway = JavaGateway()
		bridge = gateway.entry_point
		bridge.publish('/create_world', 'std_msgs/String',
					   # json.dumps({"data": str(data['execution'])}, ensure_ascii=False))
					   json.dumps({"data": str(world.id)}, ensure_ascii=False))
		return '', 200

	@app.route('/api/worlds/<world_id>/experiment/stop', methods=['POST'])
	def experiment_stop(world_id):
		world = World.get(id=world_id)
		gateway = JavaGateway()
		bridge = gateway.entry_point
		bridge.publish('/destroy_world', 'std_msgs/String',
					   # json.dumps({"data": str(data['execution'])}, ensure_ascii=False))
					   json.dumps({"data": str(world.id)}, ensure_ascii=False))
		return '', 200

	# Эндпоинты для ros'a:

	@app.route('/executions/<world_id>/get_data', methods=['GET'])
	def ros_get_data(world_id):
		# data = get_data_by_time(execution=world_id)

		time = session['start_time'].pop(int(world_id), None)

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
					'name': obj.name,
					# TODO: Переделать на эньюм
					'active':  obj.id == 1,		#если false, то - стена
					'geometry': {
						'type': 'rectangle',
						'position': {
							'x': props.pop('left'),
							'y': props.pop('top')
						},
						'width': props.pop('width'),
						'height': props.pop('height'),
					}
				}
			}
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

		session['start_time'].pop([int(world_id)])

		return jsonify(**data)

	@app.route('/executions/<world_id>/set_data', methods=['POST'])
	def ros_set_data(world_id):
		data = ujson.loads(request.get_data())
		ret_data = {
			time: data['time'],
			objects: []
		}
		with db.atomic() as txn:
			for obj_dc in data['objects']:
				props_dc = obj_dc['properties']
				kv_args = {
					'object_id': obj_dc['object'],
					'time': data['time'],
					'name': obj_dc['name']
				}
				'position': {('top', props_dc['position']['y'],
								'x': props.pop('left'),
								'y': props.pop('top')
							},
				'width': props.pop('width'),
				'height': props.pop('height'),

				props_dc2 = {
					'left': props_dc['geometry']['position']['x'],
				 	'top': props_dc['geometry']['position']['y'],
				 	'width': props_dc['geometry']['width'],
				 	'height': props_dc['geometry']['height']
				}
				props_dc.pop('active', None)
				props_dc.pop('name', None)
				props_dc.pop('geometry', None)
				props.update(props_dc)

				for key, val in props_dc2.items():
					PropertyInTime.create(**dict(kv_args.items() + {key: val}))

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

		return ''

