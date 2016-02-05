# -*- coding: utf-8 -*-
from flask_peewee.rest import RestAPI
from app import app
from database import db, Object,Modeling, LogEntry, Execution

#auth = Auth(app, db)
#auth.User.create_table(fail_silently=True)

#print(dir(db.Model))


def createTables():
	Object.create_table(fail_silently=True)
	Modeling.create_table(fail_silently=True)
	LogEntry.create_table(fail_silently=True)
	Execution.create_table(fail_silently=True)

if __name__ == '__main__':
	createTables()

	# играемся
	#http://docs.peewee-orm.com/en/latest/peewee/quickstart.html
	#with db.atomic() as txn:  # classic 
	with db.database.transaction() as txn: # flask peewee way 
		#m = Modeling.get(Modeling.name == 'наше первое моделирование')
		ms = Modeling.select().where(Modeling.name == 'наше первое моделирование')
		#print(dir(ms), ms.first())
		if not ms.first() :
			m = Modeling.create(name ='наше первое моделирование')
			print('сделали моделирование', m)
	# ПОДКЛЮЧИМ REST	
	# http://docs.peewee-orm.com/projects/flask-peewee/en/latest/getting-started.html#exposing-content-using-a-rest-api
	# create a RestAPI container
	api = RestAPI(app)
	api.register(Modeling)
	api.setup()
	# now curl http://127.0.0.1:5000/api/modeling/ - все	
	# http://127.0.0.1:5000/api/modeling/1/   - первый
	#
	# how to manage data throuth HTTP  ?? answers:
	# http://docs.peewee-orm.com/projects/flask-peewee/en/latest/rest-api.html#rest-api
	
	app.run()
