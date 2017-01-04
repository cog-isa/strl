#!/usr/bin/env python
# -*- coding: utf-8 -*-

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
from std_msgs.msg import String

import node_manager
from node_manager.config import config
from node_manager.world import World


worlds = {}
create_ids = []
destroy_ids = []


def create_world(id):
    if id.data in worlds: destroy_world(id)
    rospy.loginfo("create: %s", id.data)
    worlds[id.data] = World(id=id.data)


def destroy_world(id):
    if id.data not in worlds: return
    rospy.loginfo("destroy: %s", id.data)
    worlds[id.data].destroy_synch()
    del worlds[id.data]


def create(id): create_ids.append(id)
def destroy(id): destroy_ids.append(id)


def run():
    rospy.init_node(config['config']['name'], anonymous=True)
    rospy.Subscriber(config['config']['create_world'], String, create)
    rospy.Subscriber(config['config']['destroy_world'], String, destroy)

    rate = rospy.Rate(config['config']['rate'])
    while not rospy.is_shutdown():
      for id in create_ids: create_world(id)
      for id in destroy_ids: destroy_world(id)
      del create_ids[:], destroy_ids[:]
      rate.sleep()


if __name__ == '__main__': run()
