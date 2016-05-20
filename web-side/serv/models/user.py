from models import *


class User(Model):
    user_name = CharField(max_length=200)
