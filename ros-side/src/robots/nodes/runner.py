#!/usr/bin/env python

import os
import sys

sys.path.insert(0, '/home/dmitriy/projects/strl/ros-side/devel/lib/python2.7/dist-packages')
sys.path.insert(0, '/opt/ros/kinetic/lib/python2.7/dist-packages')

os.environ["ROS_DISTRO"] = 'kinetic'
os.environ["ROSLISP_PACKAGE_DIRECTORIES"] = '/home/dmitriy/projects/strl/ros-side/devel/share/common-lisp'
os.environ["CMAKE_PREFIX_PATH"] = '/home/dmitriy/projects/strl/ros-side/devel:/opt/ros/kinetic'
os.environ["LD_LIBRARY_PATH"] = '/home/dmitriy/projects/strl/ros-side/devel/lib:/opt/ros/kinetic/lib'
os.environ['ROS_ETC_DIR'] = '/opt/ros/kinetic/etc/ros'
os.environ['ROS_ROOT'] = '/opt/ros/kinetic/share/ros'
os.environ['PKG_CONFIG_PATH'] = '/home/dmitriy/projects/strl/ros-side/devel/lib/pkgconfig:/opt/ros/kinetic/lib/pkgconfig'
os.environ['ROS_PACKAGE_PATH'] = '/home/dmitriy/projects/strl/ros-side/src:/opt/ros/kinetic/share'
os.environ['ROS_MASTER_URI'] = 'http://localhost:11311'

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
