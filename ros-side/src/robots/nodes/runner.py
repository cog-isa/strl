#!/usr/bin/env python

import rospy
import imp, os

from node_manager.srv import *
from node_manager.helpers import wrappers
from node_manager.helpers import imports


@wrappers.service_json
def ready(*args, **kwargs):
    from robots import actuators
    return {'a': actuators.a_value,
            'phi': actuators.phi_value}


def init():
  rospy.init_node('runner')
  rospy.loginfo(os.getcwd())

  service = rospy.Service('~get_data', JSON, ready)


init()

filename = rospy.get_param('~module')
rospy.delete_param('~module')

directory = os.path.dirname(__file__)
filename = os.path.join(directory, '..', filename)

module = imports.import_file(filename)
module.run()
