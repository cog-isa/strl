import os


def request_world(ID):
  import converter
  name = os.path.abspath(__file__)
  name = os.path.dirname(name)
  name = os.path.join(name, 'world.json')
  json = converter.load(name)
  return json
