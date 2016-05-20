import rospy


class NodeFuncs:

  def __init__(self, namespace, name):
    self.namespace = namespace
    self.name = name
    self.services = []

  def get_name(self, name):
    path = self.namespace
    if name[0] == '/': return name
    if name[0] == '~': 
      path += '%s/' % self.name
      name = name[1:]
    if len(name) == 0: return path
    return '%s%s/' % (path, name)

  def get_srv(self, name, srv):
    name = self.get_name(name)
    rospy.wait_for_service(name)
    return rospy.ServiceProxy(name, srv)

  def get_param(self, key):
    key = self.get_name(key)
    return rospy.get_param(key)

  def add_srv(self, name, srv, cb):
    name = self.get_name(name)
    service = rospy.Service(name, srv, cb)
    self.services.append(service)
    return service

  def set_param(self, key, value):
    key = self.get_name(key)
    return rospy.set_param(key, value)
