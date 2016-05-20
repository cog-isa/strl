#!/usr/bin/env python

import rospy
import imp, os

from node_manager.srv import *
from node_manager.msg import *


def ready(req):
  r = Reaction()
  r.vx = -7

  return RNodeResponse(r)


def init():
  rospy.init_node('runner')
  rospy.loginfo(os.getcwd())

  service = rospy.Service('~get_data', RNode, ready)


init()

filename = rospy.get_param('~module')
rospy.delete_param('~module')

(directory, _) = os.path.split(__file__)
filename = os.path.join(directory, '..', filename)

(path, name) = os.path.split(filename)
(name, ext) = os.path.splitext(name)
(file, filename, data) = imp.find_module(name, [path])
module = imp.load_module(name, file, filename, data)

module.run()
