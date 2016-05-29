import roslaunch.core, rospy
from node_manager.config import config
from node_manager.helpers.node_funcs import *


class Node(roslaunch.core.Node, NodeFuncs):

  def __init__(self, obj, name, node_type):

    self.object = obj

    namespace = self.object.get_name('~')

    roslaunch.core.Node.__init__(self,
        package=config['robots']['root'],
        node_type=config['robots'][node_type],
        name=name, namespace=namespace)

    NodeFuncs.__init__(self, namespace=self.namespace, name=self.name)
