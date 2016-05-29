import json as JSON
from argparse import Namespace


def json2dict(json): return JSON.loads(json)
def json2obj(json): return JSON.loads(json, object_hook=lambda d: Namespace(**d))

def dict2json(dict): return JSON.dumps(dict, default=lambda o: o.__dict__, indent=4)
def dict2obj(dict): return json2obj(dict2json(dict))

def obj2dict(obj): return json2dict(obj2json(obj))
def obj2json(obj): return JSON.dumps(obj, default=lambda o: o.__dict__, indent=4)
