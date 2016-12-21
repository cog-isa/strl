import datetime
from peewee import *
from playhouse.postgres_ext import *


models = []


def run():
    from app import db
    import os, imp, inspect

    globals()['Model'] = db.Model

    dirname = os.path.dirname(__file__)
    files = ['program', 'project', 'user', 'world', 'execution',  'object_type', 'object', 'property_description',
             'property', 'property_in_time']
    files = [os.path.join(dirname, '%s.py' % _) for _ in files]

    for filename in files:
        (path, name) = os.path.split(filename)
        (name, ext) = os.path.splitext(name)
        (file, filename, data) = imp.find_module(name, [path])
        module = imp.load_module(name, file, filename, data)

        classes = [name for name, obj in inspect.getmembers(module, inspect.isclass) if obj.__module__ == module.__name__]
        for klassname in classes: 
            klass = getattr(module, klassname)
            globals()[klassname] = klass
            models.append(klass)


run()
