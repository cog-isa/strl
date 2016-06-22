from node_manager.helpers import wrappers
from node_manager.helpers.service import Service
from node_manager.srv import JSON

import rospy


class Velocity(Service):

    def __init__(self, owner):
        Service.__init__(self, owner, '~sensors/velocity', JSON)


    def dist(self):
        x = self.owner.properties['geometry']['position']['x']
        y = self.owner.properties['geometry']['position']['y']
        r = self.owner.properties['geometry']['radius']

        res = {'l': -1000, 'r': 1000, 
               'u': -1000, 'd': 1000}

        x, y = round(x), round(y)
        for o in self.owner.world.objects:
            if o.id == self.owner.id: continue
            if o.properties['geometry']['type'] != 'rectangle': continue
            ox = o.properties['geometry']['position']['x']
            oy = o.properties['geometry']['position']['y']
            w = o.properties['geometry']['width'] / 2
            h = o.properties['geometry']['height'] / 2

            x1, y1 = ox - w, oy - h
            x2, y2 = ox + w, oy + h

            if x1 <= x and x <= x2 and y >= y1: res['u'] = max(res['u'], y1)
            if x1 <= x and x <= x2 and y >= y2: res['u'] = max(res['u'], y2)

            if x1 <= x and x <= x2 and y <= y1: res['d'] = min(res['d'], y1)
            if x1 <= x and x <= x2 and y <= y2: res['d'] = min(res['d'], y2)


            if y1 <= y and y <= y2 and x <= x1: res['r'] = min(res['r'], x1)
            if y1 <= y and y <= y2 and x <= x2: res['r'] = min(res['r'], x2)

            if y1 <= y and y <= y2 and x >= x1: res['l'] = max(res['l'], x1)
            if y1 <= y and y <= y2 and x >= x2: res['l'] = max(res['l'], x2)

        return res



    @wrappers.service_json
    def __call__(self): 
        try:
            v = self.owner.properties['geometry']['v']
            a = self.owner.properties['geometry']['angle']
        except: 
            v = 0
            a = 0

        return {'v': v, 'angle': a, 'dist': self.dist()}
