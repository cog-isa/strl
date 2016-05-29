from node_manager.helpers import wrappers
from node_manager.helpers.service import Service
from node_manager.srv import JSON


class GPS(Service):

    def __init__(self, owner):
        Service.__init__(self, owner, '~sensors/gps', JSON)


    @wrappers.service_json
    def __call__(self): return self.owner.properties['geometry']['position']
