import os, requests
from config import config
import rospy


def request_world(id):
    url = config['url']['get_data'] % id
    r = requests.get(url)
    return r.json()
