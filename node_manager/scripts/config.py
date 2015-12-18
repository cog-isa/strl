import os.path

config = {
  'rate': 1,
  'root': '../..',

  'pkg': {
    'robots': 'robots'
   },
  
  'server': {
    'url': 'localhost:8888',
    'worldById': '/world'
  },

  'robots': 'robots',
  'robotConfig': 'robots/config.xml',
  'robotNodes': ['r', 's', 't']
}

exception = ['root', 'rate', 'pkg', 'robotNodes', 'server']

config['root'] = os.path.abspath(os.path.join(os.path.dirname(__file__), config['root']))
for x in config:
  if not x in exception:
    config[x] = os.path.join(config['root'], config[x])

