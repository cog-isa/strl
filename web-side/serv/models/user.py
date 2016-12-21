from models import *


'''
class User(Model):
    user_name = CharField(max_length=200)
'''


class User(Model):
    name = CharField(max_length=200)

    class Meta:
        db_table = 'users'
