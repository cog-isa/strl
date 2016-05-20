#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
from std_msgs.msg import String

import node_manager
from config import config
from world import World


worlds = {}
create_ids = []
destroy_ids = []


def create_world(ID):
  if ID.data in worlds: destroy_world(ID)
  rospy.loginfo("create: %s", ID.data)
  worlds[ID.data] = World(ID=ID.data)


def destroy_world(ID):
  if ID.data not in worlds: return
  rospy.loginfo("destroy: %s", ID.data)
  worlds[ID.data].destroy_synch()
  del worlds[ID.data]


def create(ID): create_ids.append(ID)
def destroy(ID): destroy_ids.append(ID)


def run():
  rospy.init_node(config['config']['name'], anonymous=True)
  rospy.Subscriber(config['config']['create_world'], String, create)
  rospy.Subscriber(config['config']['destroy_world'], String, destroy)

  rate = rospy.Rate(1)
  while not rospy.is_shutdown():
    for id in create_ids: create_world(id)
    for id in destroy_ids: destroy_world(id)
    del create_ids[:], destroy_ids[:]
    rate.sleep()


if __name__ == '__main__': run()
