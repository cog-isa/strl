import json as JSON
from argparse import Namespace


def json2dict(json): return JSON.loads(json)
def json2obj(json): print type(json); return JSON.loads(json, object_hook=lambda d: Namespace(**d))

def dict2json(dict): return JSON.dumps(dict)
def dict2obj(dict): return json2obj(dict2json(dict))

def obj2dict(obj): return obj.__dict__
def obj2json(obj): return dict2json(obj2dict(obj))
