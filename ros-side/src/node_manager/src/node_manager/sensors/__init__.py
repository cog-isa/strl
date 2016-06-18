from node_manager.helpers import imports
import os


modules = ['gps', 'collision', 'distance', 'accelerometer', 'gyroscope', 'velocity']
classes = imports.import_classes_from_modules(modules, os.path.dirname(__file__))
for klass in classes: globals()[klass.__name__] = klass
