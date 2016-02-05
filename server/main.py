# -*- coding: utf-8 -*-
from flask_peewee.rest import RestAPI, RestResource
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
	def minitest():
		m = Modeling.select().where(Modeling.name == 'наше первое моделирование').first()
		o = Object.select().limit(1).first()
		if not o :
			o = Object.create(type=1, shape="bla", activity=False, tranparency=12, life=100, material='steel', \
				tempriche=12, reflecion=50, fuelvalue=30, modeling=m, x=1,y=1)
		print(dir(m), ' !!!! we have objects back link')
		print(list(m.objects))
		for o in m.objects:
			print(o)
		# ищем имя моделирование у которого температура = 12
		print( Modeling.select().join(Object).where(Object.tempriche == 12).first().name )
	minitest()

	# ПОДКЛЮЧИМ REST	
	# http://docs.peewee-orm.com/projects/flask-peewee/en/latest/getting-started.html#exposing-content-using-a-rest-api
	# create a RestAPI container
	#	определеим ресурсы, чтобы включать вложенные объекты
	class ObjectResource(RestResource):
			filter_fields = ('modeling','execution', 'type')
	api = RestAPI(app)
	api.register(Modeling) #, ModelingResource)
	api.register(Object, ObjectResource)
	# теперь curl -v http://127.0.0.1:5000/api/object/modeling=1 
	# показывает только объекты первого моделирования т.к. ObjectResource filter_fields
	api.register(LogEntry)
	api.register(Execution)
	api.setup()
	# now curl http://127.0.0.1:5000/api/modeling/ - все	
	# http://127.0.0.1:5000/api/modeling/1/   - первый
	#
	# how to manage data throuth HTTP  ?? answers:
	# http://docs.peewee-orm.com/projects/flask-peewee/en/latest/rest-api.html#rest-api
	
	app.run()
