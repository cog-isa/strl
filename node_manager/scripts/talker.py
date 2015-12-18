#!/usr/bin/env python

import rospy
from std_msgs.msg import String

def talker():
  pub = rospy.Publisher('node_manager_start', String, queue_size=10)
  rospy.init_node('talk', anonymous=True)
  rate = rospy.Rate(0.1)
  while not rospy.is_shutdown():
    rospy.loginfo('1')
    pub.publish('1')
    rate.sleep()

if __name__ == '__main__':
  talker()
