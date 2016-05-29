def check_collision_circle_circle(c1, c2):
    pass

def check_collision_circle_polygon(circle, poly):
    pass

def check_collision_polygon_polygon(p1, p2):
    pass


def check_collision(fig1, fig2):
    if fig1.type == 'circle' and fig2.type == 'circle': return check_collision_circle_circle(fig1, fig2)
    if fig1.type == 'circle' and fig2.type != 'circle': return check_collision_circle_polygon(fig1, fig2)
    if fig1.type != 'circle' and fig2.type == 'circle': return check_collision_circle_polygon(fig2, fig1)
    if fig1.type != 'circle' and fig2.type != 'circle': return check_collision_polygon_polygon(fig1, fig2)
