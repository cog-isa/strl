#!/usr/bin/env python

import rospy
import node_manager
from config import config

from std_msgs.msg import String

def run():
  rospy.init_node('world_runner')
  pub = rospy.Publisher(config['config']['create_world'], String, queue_size=10)
  rate = rospy.Rate(0.1);
  while not rospy.is_shutdown():
    pub.publish('1')
    rate.sleep()

run()
