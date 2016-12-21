from models import *


'''
class World(Model):
	date = DateTimeField(default=datetime.datetime.now)
	name = CharField(max_length=200)

	user = ForeignKeyField(User, null=True)
'''


class World(Model):
	name = CharField(max_length=200)
	project = ForeignKeyField(Project, on_update='CASCADE', on_delete='CASCADE')

	class Meta:
		db_table = 'worlds'
