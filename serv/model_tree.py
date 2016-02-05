#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from libtree import Tree, core
# docs https://libtree.readthedocs.org/en/latest/
import psycopg2
from datetime import datetime
import uuid
connection = psycopg2.connect("dbname=sup user=postgres password=12353217 port=5433")
tree = Tree(connection)


print(datetime.utcnow())

class TreeObject:
	_fields = ['id']
	_type = 'object'
	def _save(self):
		props = self.n.properties
		for f in self._fields:
			props[f]=str(self.__dict__[f])
		self.n.set_properties(props)
	def _read(self):
		props = self.n.properties
		for f in self._fields:
			self.__dict__[f] = props[f]
	
	def __getitem__(self, n):
		return self[n]

	def fieldDefaults():
		self._fields = ['id']
		#self.name='somename', date=datetime.now()

	def __init__(self, **kwargs): #todo **kwarg
		id = kwargs.id if 'id' in kwargs else None
		for key in kwargs:
			self.__dict__[key] = kwargs[key]
		with tree() as transaction:
			if not id:
				self.id = uuid.uuid1()
				self.n  = transaction.get_root_node().insert_child({'type': self._type, 'id':id})
				self._save()
			else:
				self.n = transaction.get_nodes_by_property_dict({'type': self._type, 'id':id})
				if not self.n: 
					# todo exception
					pass
				else:
					self._read()

class Modeling(TreeObject):
	_fields = ['id', 'name', 'date']
	_type = 'modeling'
	def fieldDefaults():
		#self._fields = ['id', '']
		self.name='somename'
		self.date=datetime.now()


class Object(Modeling):
	_fields = ['id', 'type_obj', 'props_obj', 'pos']
	_type = 'object_model' 

	def get_pos(self):
		x = []
		x= self._fields.pos
		return x

	def fieldDefaults():
		#self._fields = ['id', '']
		self.name='somename'	
		self.type_obj = 'sometype' 
		self.props_obj = props_obj
		self.pos = pos

	def _delete(self):
		temp = self._fields[0]
		delete(temp)
		# делитим узел и предков по id 


class Launch(Modeling):
	_fields = ['id', 'name', 'options', 'logs']
	_type = 'launch'
	def fieldDefaults():
		#self._fields = ['id', '']
		self.name='somename'
		self.options='someoptions'	
		self.logs = 'somelog' #TODO logs


#tests
to = TreeObject()
m = Modeling(name = 'm1', date=datetime.now())
print(m)

m1 = Modeling(name = 'm2', date=datetime.now())
print(m1)

material = ['iron', 'wood', 'plastic']
prop_o = ['circl', 1, 40, 1, 50, material[2], 30, 0, 40]
obj = Object(type_obj = 'agent', props_obj = prop_o, pos = [10, 16])

log = [1,2,3,4,5]
zap1 = Launch(name = 'запуск1', options = '1', logs = log)


#obj.__getitem__(pos) проверить
print(obj._fields.__getitem__(3)) #выводит название поля
print(obj.get_pos) #выводит что-то. проверить что
# необходимо получить координаты в матрице, что бы реализовать перемещение объекта