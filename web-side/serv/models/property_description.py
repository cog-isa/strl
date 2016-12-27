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


class PropertyDescription(Model):
	name = CharField(max_length=200)



