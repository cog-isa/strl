# -*- coding: utf-8 -*-

import rospy

from robots import sensors
from robots import actuators

import math
from Queue import Queue


tx, ty = 250, 300

x1, x2 = -5, 60
y1, y2 = 15, 80 
sw, sh = 9, 9

def get_node(x, y): return (x / sw, y / sh)
def get_pos((x, y)): return x*sw, y*sh

dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]

all_nodes = []
for x in range(x1, x2):
    for y in range(y1, y2):
        all_nodes.append([x, y])


def neighbors(node):
    result = []
    for dir in dirs:
        neighbor = (node[0] + dir[0], node[1] + dir[1])
        if [neighbor[0], neighbor[1]] in all_nodes: result.append(neighbor)
    return result


def build_path(start):
    frontier = Queue()
    frontier.put(start)

    came_from = {}
    came_from[start] = start

    while not frontier.empty():
        current = frontier.get()
        for next in neighbors(current):
            if next not in came_from:
                frontier.put(next)
                came_from[next] = current

    return came_from


def find_tar(x, y):
    start = get_node(x, y)
    came_from = build_path(get_node(tx, ty))
    if start not in came_from:
        x, y = start; f = False
        for next in neighbors(start):
            if not f or came_from[(x, y)] > came_from[next]:
                x, y = next

        return x - start[0], y - start[1]
            
    return (came_from[start][0] - start[0], came_from[start][1] - start[1])


def rem(x, y): 
    rad = 25
    x1, x2 = (x-rad)/sw, (x+rad)/sw
    y1, y2 = (y-rad)/sh, (y+rad)/sh

    for xx in range(x1, x2+1):
        for yy in range(y1, y2+1):
            remove([xx, yy])

def remove(a): 
    if a in all_nodes:
        all_nodes.remove(a)


def run():
    while not rospy.is_shutdown():
        data, pos = sensors.velocity(), sensors.gps()
        pos.x, pos.y = int(round(pos.x)), int(round(pos.y))
        dist = data.dist

        rem(pos.x, int(dist.u))
        rem(pos.x, int(dist.d))
        rem(int(dist.l), pos.y)
        rem(int(dist.r), pos.y)

        tx, ty = find_tar(pos.x, pos.y)
        tx += pos.x; ty += pos.y
        rospy.loginfo((tx, ty, pos))
        rospy.loginfo(get_node(tx+sw, ty) in all_nodes)

        angle = math.atan2(ty-pos.y, tx-pos.x)
        phi = angle - data.angle
        phi = math.atan2(math.sin(phi), math.cos(phi))

        acceleration = 3 - data.v
    
        actuators.accelerator(acceleration)
        actuators.wheel(phi)
