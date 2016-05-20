from os.path import join, isfile
from config import config
import converter

#from nodes.node import *
from nodes.r_node import *

from object import *

class Robot(Object):

  def __init__(self, world, json):
    Object.__init__(self, world=world, json=json)
    self.__robot = Robot.by_program(self.properties['program'])

    for node_name in config['robots']['launch']:
      robo_path = join(config['root'], config['robots']['root'])
      src_path = join(robo_path, self.__robot.get('src'))

      file_name = node_name + '.py'
      file_path = join(self.__robot.get('src'), file_name)

      klass = Node
      if node_name == 'r': klass = RNode

      if isfile(join(src_path, file_name)):
        node = klass(obj=self, name=node_name, node_type='runner')
        node.set_param('~module', file_path)
        self.nodes.append(node)

    self.update_properties()


  @staticmethod
  def by_program(program):
    xml = converter.load(join(config['root'], 
      config['robots']['root'], config['robots']['config']))
    for robot in xml['robot']:
      if robot.get('program') == program: return robot
