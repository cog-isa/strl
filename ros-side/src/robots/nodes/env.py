#!/usr/bin/env python 
import rospy, copy, math
from node_manager.srv import *
from node_manager.helpers import wrappers


@wrappers.service_request
def get_srv(name, srv):
    name = '%s/%s' % (rospy.get_param('~world_namespace'), name)
    rospy.wait_for_service(name)
    return rospy.ServiceProxy(name, srv)


def apply_reaction(prop, reaction):
    obj = copy.deepcopy(prop)
    obj.position.x += reaction.vx
    return obj


def accelerator(object, acceleration):
    if not hasattr(object, 'a'): object.a = 0.0
    object.a = (acceleration - object.a) / 2.0


def wheel(object, phi):
    if not hasattr(object, 'phi'): object.phi = 0.0
    object.phi = (phi - object.phi) / 2.0


def robot(object):
    import math
    if not hasattr(object, 'v'): object.v = 0.0
    if not hasattr(object, 'angle'): object.angle = 0.0
    object.v += object.a
    object.angle += object.v * math.tan(object.phi)
    object.position.x += object.v * math.cos(object.angle)
    object.position.y += object.v * math.sin(object.angle)


def check_collisions(p1, p2):
    if p1.type == 'circle' and p2.type == 'circle':
        return math.hypot(
            p1.position.x - p2.position.x,
            p1.position.y - p2.position.y) < p1.radius + p2.radius

    return False


@wrappers.service_json
def execute(req):
    old_prop = get_srv('get_properties', JSON)(req.robot_id)
    old_prop.collide = False
    ids = get_srv('get_ids', JSON)().ids
    #prop = apply_reaction(old_prop, req)
    prop = copy.deepcopy(old_prop)
    accelerator(prop, req.a) 
    wheel(prop, req.phi)
    robot(prop)

    for id in ids:
        if id == req.robot_id: continue
        p = get_srv('get_properties', JSON)(id=id)
        if check_collisions(prop, p): 
            old_prop.collide = True
            return old_prop

    rospy.loginfo(prop)
    return prop


rospy.init_node('env')
rospy.Service('~execute', JSON, execute)
rospy.spin()
