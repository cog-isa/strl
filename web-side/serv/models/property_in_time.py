# -*- coding: utf-8 -*-

from models import *


class PropertyInTime(Model):
	object = ForeignKeyField(Object, on_update='CASCADE', on_delete='CASCADE')
	# Какой-то отсчет времени; пока неясно, что там будет приходить от ROS
	time = IntegerField()
	name = CharField(max_length=200)
	value = JSONField(default='null')

	class Meta:
		db_table = 'properties_in_time'
		primary_key = CompositeKey('time', 'object', 'name')


