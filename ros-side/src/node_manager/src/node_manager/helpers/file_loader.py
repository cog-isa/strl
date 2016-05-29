from lxml import objectify
import os.path, json

def convertXMLToObject(data): return objectify.fromstring(data)
def convertJSONToObject(data): return json.loads(data)

def load(name):
  file = open(name, 'r'); data = file.read()
  fileName, fileExtension = os.path.splitext(name)
  return {
    '.json': lambda data: convertJSONToObject(data),
    '.xml': lambda data: convertXMLToObject(data)
  }.get(fileExtension, lambda name: {})(data)
