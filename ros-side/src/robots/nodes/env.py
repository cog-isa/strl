#!/usr/bin/env python

import rospy, copy, math
from node_manager.srv import *
from node_manager.msg import *


def get_srv(name, srv):
  name = '%s/%s' % (rospy.get_param('~world_namespace'), name)
  rospy.wait_for_service(name)
  return rospy.ServiceProxy(name, srv)


def apply_reaction(prop, reaction):
  obj = copy.deepcopy(prop)
  obj.position.x += reaction.vx
  return obj


def check_collisions(p1, p2):
  if p1.type == 'circle' and p2.type == 'circle':
    return math.hypot(
        p1.position.x - p2.position.x,
        p1.position.y - p2.position.y) < p1.radius + p2.radius

  return False


def execute(req):
  old_prop = get_srv('get_properties', WorldProperties)(req.robot_id).properties
  ids = get_srv('get_ids', WorldIds)().ids
  prop = apply_reaction(old_prop, req.reaction)

  for id in ids:
    if id == req.robot_id: continue
    p = get_srv('get_properties', WorldProperties)(id).properties
    if check_collisions(prop, p): return EnvExecuteResponse(old_prop)

  return EnvExecuteResponse(prop)


rospy.init_node('env')

rospy.Service('~execute', EnvExecute, execute)

rospy.spin()
