from models import *


class Object(Model):
    time = IntegerField(default=0)

    execution = ForeignKeyField(Execution, null=False)
    object = ForeignKeyField('self', null=True)
    program = ForeignKeyField(Program, null=True)

    properties = JSONField()
