import requests
from node_manager.config import config
from json_helper import *


def request_world(id):
    url = config['url']['get_data'] % id
    r = requests.get(url)
    return r.json()


def set_data(data):
    url = config['url']['set_data'] % data['id']
    r = requests.post(url, data=dict2json(data))
