import requests, json
from config import config


def request_world(id):
    url = config['url']['get_data'] % id
    r = requests.get(url)
    return r.json()


def set_data(data):
    print data
    url = config['url']['set_data'] % data['id']
    r = requests.post(url, data=json.dumps(data))
    print r.text
