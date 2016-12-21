from models import *


class Project(Model):
	name = CharField(max_length=200)

	class Meta:
		db_table = 'projects'
