import rospy

from robots import sensors
from std_msgs.msg import String


def run():
  pub = rospy.Publisher('chatter1', String, queue_size=10)
  rate = rospy.Rate(10) # 10hz
  while not rospy.is_shutdown():
    hello_str = sensors.gps()
    rospy.loginfo(hello_str)
    rate.sleep()
