import rospy


class Service:

    def __init__(self, owner, name, srv):
        self.owner = owner
        owner.add_srv(name, srv, self)

    def __call__(self, *args, **kwargs): pass
