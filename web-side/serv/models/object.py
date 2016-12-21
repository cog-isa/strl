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


class Object(Model):
	name = CharField(max_length=200)
	type = ForeignKeyField(ObjectType)
	world = ForeignKeyField(World, on_update='CASCADE', on_delete='CASCADE')

	class Meta:
		db_table = 'objects'

	@staticmethod
	def get_by_id(id):
		object = Object.get(Object.id == id)
		props = Property.select().where(Property.object == object).execute()
		props


