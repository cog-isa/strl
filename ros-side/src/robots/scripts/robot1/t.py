import rospy
from std_msgs.msg import String

def run():
  pub = rospy.Publisher('chatter1', String, queue_size=10)
  rate = rospy.Rate(10) # 10hz
  while not rospy.is_shutdown():
    hello_str = "hello world %s" % rospy.get_time()
    hello_str = rospy.get_namespace()
    pub.publish(hello_str)
    rate.sleep()
