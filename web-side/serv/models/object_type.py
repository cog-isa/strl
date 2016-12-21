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


class ObjectType(Model):
	name = CharField(max_length=200)
	parent = ForeignKeyField('self', null=True)
	position = SmallIntegerField()

	class Meta:
		db_table = 'object_types'
