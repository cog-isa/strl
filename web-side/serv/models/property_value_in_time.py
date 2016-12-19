# -*- coding: utf-8 -*-

from models import *


class PropertyValueInTime(Model):
	object = ForeignKeyField(Object, null=False)
	property = ForeignKeyField(PropertyDescription, null=False)
	# Какой-то отсчет времени; пока неясно, что там будет приходить от ROS
	time = IntegerField(null=False)
	value = JSONField(null=False, default='null')

	class Meta:
		primary_key = CompositeKey('object', 'property')


