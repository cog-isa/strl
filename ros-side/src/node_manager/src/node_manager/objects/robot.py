from os.path import join, isfile
from node_manager.config import config

from node_manager.nodes import *

from node_manager.sensors import *
from node_manager.helpers import file_loader
from object import Object



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

        GPS(self)
        Collision(self)
        Velocity(self)


    @staticmethod
    def by_program(program):
        xml = file_loader.load(join(config['root'],
            config['robots']['root'], config['robots']['config']))
        for robot in xml['robot']:
            if robot.get('program') == program: return robot
