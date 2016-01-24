#!/usr/bin/env python

from lxml import objectify 
import os.path, json, httplib

from roslaunch.scriptapi import ROSLaunch
from roslaunch.core import Node
from std_msgs.msg import String
import rospy

from config import config


def convertXMLToObject(data): return objectify.fromstring(data)
def convertJSONToObject(data): return json.loads(data)

def loadObjectFromFile(name):
  file = open(name, 'r'); data = file.read()
  fileName, fileExtension = os.path.splitext(name)
  return {
    '.json': lambda data: convertJSONToObject(data),
    '.xml': lambda data: convertXMLToObject(data)
  }.get(fileExtension, lambda name: {})(data)


robotConfig = loadObjectFromFile(config['robotConfig'])

worldIDsToStart = []
worldIDsToStop = []
launchFile = {}


def getWorldById(id):
  return loadObjectFromFile(config['root']+'/node_manager/scripts/world.json')
  conn = httplib.HTTPConnection(config['server']['url'])
  conn.request("GET", "%s?id=%i"%(config['server']['worldById'], id))
  response = conn.getresponse()
  data = response.read()
  conn.close()
 

def startWorldById(id):
  global launch, launchId, nodeId

  launch = ROSLaunch()
  launchFile[id] = launch
  nodeId, launchId = 0, id
  launch.start()
  
  data = getWorldById(id)
  parseWorld(data)


def stopWorldById(id):
  if not id in launchFile: return
  launchFile[id].stop()
  del launchFile[id]


def parseWorld(data):
  for robot in data['robot']:
    parseRobot(robot)


def parseRobot(robot):
  name = robot['name']
  src = getRobotSrcByName(name)
  path = os.path.join(config['robots'], src)
  launchRobotBySrc(path, src, attr)


def getRobotSrcByName(name):
  for robot in robotConfig['robot']:
    if robot.get('name') == name: return robot.get('src')


def launchRobotBySrc(path, src):
  global nodeId; nodeId += 1
  for name in config['robotNodes']:
    file = os.path.join(src, name)
    if os.path.isfile(os.path.join(path, name+'.py')):
      launch.launch(Node(config['pkg']['robots'], name+'.py', 
        namespace=launchId, name="%s_%i"%(name, nodeId), filename=file+'.py'))
    if os.path.isfile(os.path.join(path, name+'.cpp')):
      launch.launch(Node(config['pkg']['robots'], name+'.cpp', 
        namespace=launchId, name="%s_%i"%(name, nodeId), filename=file+'.cpp'))


def startWorld(data):
  rospy.loginfo(data.data)
  worldIDsToStart.append(data.data)


def stopWorld(data):
  rospy.loginfo(data.data)
  wolrdIDsToStop.append(data.data)


def run():
  rospy.init_node('node_manager', anonymous=True)
  rospy.Subscriber('node_manager_start', String, startWorld)
  rospy.Subscriber('node_manager_stop', String, stopWorld)
  rate = rospy.Rate(config['rate'])
  while not rospy.is_shutdown():
    for id in worldIDsToStart: startWorldById(id)
    for id in worldIDsToStop: stopWorldById(id)

    del worldIDsToStart[:]
    del worldIDsToStop[:]

    rate.sleep()


if __name__ == '__main__': run()
