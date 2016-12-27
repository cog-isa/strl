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


class Property(Model):
	object = ForeignKeyField(Object, on_update='CASCADE', on_delete='CASCADE')
	name = CharField(max_length=200)
	value = JSONField(default='null')

	class Meta:
		db_table = 'properties'
		primary_key = CompositeKey('object', 'name')

