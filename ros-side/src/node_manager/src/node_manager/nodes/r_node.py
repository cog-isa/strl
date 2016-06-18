from node_manager.config import config
from node_manager import srv

from node import *
from node_manager.helpers import json_helper


class RNode(Node):

  def __init__(self, *args, **kwargs):
    Node.__init__(self, *args, **kwargs)

    self.tick_count = config['robots']['rate']['r']
    self.tick = 0


  def run(self):
    world = self.object.world
    if self.tick * world.tick_count >= world.tick * self.tick_count: return

    self.tick += 1
    print world.tick, world.time, self.tick, self.tick_count

    env = world.env.node
    reac = self.get_srv('~get_data', srv.JSON)()
    reac.robot_id = self.object.id
    print reac
    prop = env.get_srv('~execute', srv.JSON)(reac)
    self.object.properties['geometry'] = json_helper.obj2dict(prop)
    print self.object.properties
    #self.object.update_properties()
    #print prop

    if self.tick == self.tick_count: self.tick = 0
