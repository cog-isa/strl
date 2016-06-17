from roslaunch.scriptapi import ROSLaunch
from threading import Thread

from objects import *
from environment import Environment

from helpers.node_funcs import *
from helpers import wrappers
from helpers import bridge

from node_manager import srv
import rospy, time


class World(NodeFuncs):

    def __init__(self, id):
      self.__destroy = False
      self.__launch = ROSLaunch()
      self.objects = []

      json = bridge.request_world(id)

      self.tick_count, self.tick = 0, 0
      self.time = json['time']

      self.__init(json)
      self.__start()

      self.thread = Thread(target=self.__loop)
      self.thread.start()


    def __init(self, json):
        NodeFuncs.__init__(self, namespace='/worlds/', name=json['id'])
        self.env = Environment(world=self)

        self.id = json['id']
        for obj in json['objects']:
            self.__init_object(obj)


    def __init_object(self, json):
      if json['properties']['active']:
        obj = Robot(json=json, world=self)
        tick_count = max(map(lambda n: n.tick_count, obj.nodes))
        self.tick_count = max(self.tick_count, tick_count)
        self.objects.append(obj)
      else:
        self.objects.append(Object(json=json, world=self))


    def __start_services(self):
      self.add_srv('~get_ids', srv.JSON, self.get_ids)
      self.add_srv('~get_properties', srv.JSON, self.get_properties)


    def __start(self):
      self.__start_services()
      self.__launch.start()
      for obj in self.objects:
        for node in obj.nodes:
          self.__launch.launch(node)
      self.__launch.launch(self.env.node)


    def __stop(self):
      self.__launch.stop()
      self.__launch.spin()
      rospy.loginfo('stop')
      for srv in self.services:
        srv.shutdown()
      for obj in self.objects:
          for srv in obj.services:
              srv.shutdown()


    def __call__(self):
      self.tick += 1

      for obj in self.objects:
        if obj.properties['active']:
          for node in obj.nodes: node.run()

      if self.tick == self.tick_count:
          self.tick = 0; self.time += 1
          data = self.__prepare_data()
          bridge.set_data(data)

      time.sleep(0.5)


    def __loop(self):
      while (not self.__destroy and
          not rospy.is_shutdown()): self()
      self.__stop()


    def destroy(self): self.__destroy = True
    def destroy_synch(self): self.destroy(); self.thread.join()


    @wrappers.service_json
    def get_properties(self, id):
      for obj in self.objects:
        if obj.id != id: continue
        prop = obj.properties['geometry']
        print prop
        return prop


    @wrappers.service_json
    def get_ids(self):
        ids = []
        for obj in self.objects:
            ids.append(obj.id)
        return {'ids': ids}


    def __prepare_data(self):
        data = {
            'id': self.id, 'time': self.time,
            'objects': [o.data for o in self.objects]
        }
        return data
