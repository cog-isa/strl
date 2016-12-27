from models import *


class Experiment(Model):
	world = ForeignKeyField(World, on_update='CASCADE', on_delete='CASCADE')
	start_time = IntegerField(null=True)

	class Meta:
		db_table = 'experiments'

