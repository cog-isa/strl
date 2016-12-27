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
    phi = min(phi, math.pi/36)
    phi = max(phi, -math.pi/36)

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

    if p1.type == 'circle' and p2.type == 'rectangle':
        w, h, r = p2.width / 2, p2.height / 2, p1.radius
        x1, y1 = p2.position.x - w - r, p2.position.y - h - r
        x2, y2 = p2.position.x + w + r, p2.position.y + h + r
        x, y = p1.position.x, p1.position.y
        return x1-1 <= x and x <= x2+1 and y1-1 <= y and y <= y2+1


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
            prop.collide = True
            prop.position = old_prop.position
            return prop

    rospy.loginfo(prop)
    return prop


rospy.init_node('env')
rospy.Service('~execute', JSON, execute)
rospy.spin()
