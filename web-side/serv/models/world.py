from models import *


class World(Model):
    date = DateTimeField(default=datetime.datetime.now)
    name = CharField(max_length=200)

    user = ForeignKeyField(User, null=True)
