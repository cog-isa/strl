config ={
  'config': {
    'name': 'NodeManager',
    'create_world': 'create_world',
    'destroy_world': 'destroy_world',
  },

  'root': 'src',
  'robots': {
    'root': 'robots',
    'runner': 'runner.py',
    'env': 'env.py',

    'config': 'config.xml',
    'launch': ['r', 's', 't'],
    'rate': {
      'r': 5,
      's': 15,
      't': 3
    }
  }
}
