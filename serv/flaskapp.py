__author__ = 'pavlov_volkov'

from flask import Flask, request
import model_tree
app = Flask(__name__)
app.debug = True # не забыть убрать


@app.route('/tree/newmodel/<modelid>')
def new_modeling ():
	model_root = TreeObject()# id создастся. см. model_tree 
	#считать с файла для задания настроек моделирования
	#считать с интерфейса, если все будет *летать*

	model = Modeling('''СЧИТАННЫЕ ПАРАМЕТРЫ''')


#def new_object():


def new_launch():
	with tree() as transaction:
		#ищем среди существующих объектов 
		#get_nodes_by_property_dict - не ищет среди наследованных
		s = transaction.get_nodes_by_property_dict({'object_model': Object._type })
		result = []
		print(s)
		#for n in s: #поиск по найденным
	#return id или еще что-то? очередного объекта


@app.route('/tree/model/<launchid>')
def newlaunch(mapid):


@app.route('/flask<p1>')
def hello_world(p1):
	return 'This comes from Flask ^_^'+str(request)+p1

# for Flask DEBUG
#app.run()