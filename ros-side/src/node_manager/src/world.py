from roslaunch.scriptapi import ROSLaunch
from threading import Thread

#from objects.object import *
from objects.robot import *
from helpers.node_funcs import *

from environment import Environment
import bridge, time

from node_manager import srv, msg
import rospy


class World(NodeFuncs):

    def __init__(self, ID):
      json = bridge.request_world(ID)

      self.__destroy = False
      self.__launch = ROSLaunch()
      self.objects = []

      self.tick_count = 0
      self.tick = 0
      rospy.loginfo(json)
      self.time = json['time']

      self.__init_by_json(json)
      self.__start()

      self.thread = Thread(target=self.loop)
      self.thread.start()


    def __init_by_json(self, json):
      NodeFuncs.__init__(self, namespace='/worlds/', name=json['id'])

      self.id = json['id']
      for obj in json['objects']:
        self.__init_object(obj)

      self.env = Environment(world=self)


    def __init_object(self, json):
      if json['properties']['active']: 
        obj = Robot(json=json, world=self)
        tick_count = max(map(lambda n: n.tick_count, obj.nodes)) 
        self.tick_count = max(self.tick_count, tick_count)
        self.objects.append(obj)
      else:
        self.objects.append(Object(json=json, world=self))


    def __start_services(self):
      self.add_srv('~get_ids', srv.WorldIds, self.get_ids)
      self.add_srv('~get_properties', srv.WorldProperties, self.get_properties)
      

    def __start(self):
      self.__start_services()
      self.__launch.start()
      for obj in self.objects:
        for node in obj.nodes:
          self.__launch.launch(node)
      self.__launch.launch(self.env.node)

    def __stop(self): 
      self.__launch.stop()
      for srv in self.services:
        srv.shutdown()


    def run(self):
      self.tick += 1

      for obj in self.objects:
        if obj.properties['active']:
          for node in obj.nodes: node.run()

      if self.tick == self.tick_count:
          self.tick = 0; self.time += 1
          data = self.__prepare_data()
          bridge.set_data(data)

      time.sleep(0.5)


    def loop(self):
      while not self.__destroy and not rospy.is_shutdown(): self.run()
      self.__stop()

    def destroy(self): self.__destroy = True
    def destroy_synch(self): self.destroy(); self.thread.join()


    def get_properties(self, req):
      for obj in self.objects: 
        if obj.id != req.id: continue
        prop = Struct(**obj.properties['geometry'])
        prop = msg.Properties(**prop.__dict__)
        return srv.WorldPropertiesResponse(prop)

    def get_ids(self, req):
      ids = []
      for obj in self.objects:
        ids.append(obj.id)
      return srv.WorldIdsResponse(ids)


    def __prepare_data(self):
        data = {
            'id': self.id,
            'time': self.time,
            'objects': [o.data for o in self.objects]
        }
        return data


class Struct(object):

    def __init__(self, **entries):
      for key in entries:
        if isinstance(entries[key], dict):
          entries[key] = Struct(**entries[key])

      self.__dict__.update(entries)
