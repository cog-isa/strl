import datetime
from peewee import *
from flask_peewee.db import Database
from app import app 

DATABASE = {
    'name': 'ros.db',
    'engine': 'peewee.SqliteDatabase',
}
app.config.from_object(__name__)
db = Database(app)


# MODEL 
M = db.Model

class Modeling(M):
	date = DateTimeField(default=datetime.datetime.now)
	name = CharField(max_length = 200)
	# objects
	# executions
#	class Meta:
#		database = db
	
class Execution(M):
	date = DateTimeField(default=datetime.datetime.now)
	name = CharField(max_length = 200)
	modeling = ForeignKeyField(Modeling, null=True, related_name='executions') 
	# objects with settings
	# logs = list of LogEntrys
	
class Object(M):
	type = IntegerField()
	shape = CharField(max_length = 20)
	activity = BooleanField()
	tranparency = IntegerField() # 0-100
	life = IntegerField()
	material = CharField(max_length = 50);
	tempriche = FloatField()
	reflecion = FloatField()
	fuelvalue = FloatField()
	
	x = FloatField()
	y = FloatField()
	
	modeling 	= ForeignKeyField(Modeling,  null=True, related_name='objects') 
	execution 	= ForeignKeyField(Execution, null=True, related_name='executions') 
#	class Meta:
#		database = db
	
class LogEntry(M):
	message = TextField()
	execution = ForeignKeyField(Execution, null=False, related_name='logs') 
#	class Meta:
#		database = db
		
