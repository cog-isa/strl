from nodes.node import *
from helpers.node_funcs import *


class Environment(NodeFuncs):

  def __init__(self, world):

    NodeFuncs.__init__(self, namespace=world.get_name('~'), name='env')

    self.world = world
    self.node = Node(obj=self, name='env', node_type='env')
    self.node.set_param('~world_namespace', self.world.get_name('~'))
