import requests
from config import config
from helpers.json_helper import *


def request_world(id):
    url = config['url']['get_data'] % id
    r = requests.get(url)
    return r.json()


def set_data(data):
    print data
    url = config['url']['set_data'] % data['id']
    r = requests.post(url, data=dict2json(data))
    print r.text
