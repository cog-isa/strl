from models import *


'''
class Object(Model):
    time = IntegerField(default=0)
    object = IntegerField(null=True)

    execution = ForeignKeyField(Execution, null=False)
    #object = ForeignKeyField('self', null=True)
    program = ForeignKeyField(Program, null=True)

    properties = JSONField()
'''


class ObjectToProperty(Model):
	object = ForeignKeyField(Object, null=False)
	property = ForeignKeyField(ObjectProperty, null=False)

	class Meta:
		primary_key = CompositeKey('object', 'property')


