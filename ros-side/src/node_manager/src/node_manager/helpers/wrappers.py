from json_helper import *
from node_manager.srv import *

import rospy


def service_json(callback):
    def wrapper(*a):
        json, self = json2obj(a[-1].json), a[0]
        args, kwargs = json.args, json.kwargs.__dict__
        if len(a) > 1: args.insert(0, self)
        data = callback(*args, **kwargs)
        if type(data) == dict: json = dict2json(data)
        elif type(data) != str: json = obj2json(data)
        return JSONResponse(json);

    return wrapper


def service_request(callback):
    def wrapper(*args, **kwargs):
        srv = kwargs['srv'] if 'srv' in kwargs else args[-1]
        service = callback(*args, **kwargs)
        if srv == JSON: return JSONRequest(service)
        return service

    return wrapper


class JSONRequest:
    def __init__(self, service):
        self.service = service


    def __call__(self, *args, **kwargs):
        data = {'args': args, 'kwargs': kwargs}
        data = dict2json(data)
        json = self.service(data).json
        if not json: return None
        return json2obj(json)
