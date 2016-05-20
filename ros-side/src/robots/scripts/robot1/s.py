import rospy, os
from std_msgs.msg import String
from node_manager.srv import Num

def run():
  pub = rospy.Publisher('chatter2', String, queue_size=10)
  rate = rospy.Rate(1) # 10hz
  while not rospy.is_shutdown():
    hello_str = "hello world %s" % rospy.get_time()
    hello_str = rospy.get_namespace()
    rospy.loginfo(os.getcwd())
    pub.publish(os.getcwd())
    rate.sleep()

    rospy.loginfo(Num)
