from node_manager.helpers import wrappers
from node_manager.helpers.service import Service
from node_manager.srv import JSON


class Collision(Service):

    def __init__(self, owner):
        Service.__init__(self, owner, '~sensors/collision', JSON)


    @wrappers.service_json
    def __call__(self):
        try: return self.owner.properties['geometry']['collide']
        except: return False
        return self.owner.properties['geometry']['position']
