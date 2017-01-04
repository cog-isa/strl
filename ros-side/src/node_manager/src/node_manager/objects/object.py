from node_manager.helpers.node_funcs import *


class Object(NodeFuncs):

  def __init__(self, world, json):
    self.world = world

    self.data = json
    self.properties = self.data['properties']

    self.id = self.properties['name']
    self.nodes = []
    self.markerdist = []

    NodeFuncs.__init__(self, namespace=self.world.get_name('~'), name=self.properties['name'])


  #def update_properties(self):
  #  for node in self.nodes:
  #    node.set_param('~properties', self.properties)
