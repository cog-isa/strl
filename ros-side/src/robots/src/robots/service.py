import rospy

from node_manager.srv import JSON
from node_manager.helpers.wrappers import *


@service_request
def get_service(name, srv):
    rospy.loginfo(name)
    rospy.wait_for_service(name)
    return rospy.ServiceProxy(name, srv)


def get_sensor(name): return get_service('%s%s%s' % (rospy.get_namespace(), 'sensors/', name), JSON)
