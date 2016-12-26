from models import *


class Experiment(Model):
	world = ForeignKeyField(World)
	start_time = IntegerField(null=True)

	class Meta:
		db_table = 'experiments'

