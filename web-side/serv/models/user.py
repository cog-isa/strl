from models import *


'''
class User(Model):
	user_name = CharField(max_length=200)
'''


class User(Model):
	login = CharField(max_length=200)
	password = CharField(max_length=200)
	auth_token = CharField(max_length=300, null=True)

	class Meta:
		db_table = 'users'
