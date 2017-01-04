# -*- coding: utf-8 -*-

import rospy

from robots import sensors
from robots import actuators

import math
from Queue import Queue

tx, ty = 250, 110

x1, x2 = -10, 55
y1, y2 = -10, 55
sw, sh = 10, 10


def get_node(x, y): return (x / sw, y / sh)


def get_pos((x, y)): return x * sw, y * sh


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
	rospy.loginfo(start)
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
		x, y = start;
		f = False
		for next in neighbors(start):
			if not f or came_from[(x, y)] > came_from[next]:
				x, y = next

		return x - start[0], y - start[1]

	return (came_from[start][0] - start[0], came_from[start][1] - start[1])


def rem(x, y):
	rad = 25
	x1, x2 = x - rad, x + rad
	y1, y2 = y - rad, y + rad

	remove([x / sw, y / sh])


def remove(a):
	if a in all_nodes:
		all_nodes.remove(a)



olddist=0
oldphi=0
step=0

def run():
	global olddist
	global oldphi
	global step

	rate = rospy.Rate(10)

	while not rospy.is_shutdown():
		#data, pos, mdist = sensors.velocity(), sensors.gps(), sensors.markerdist()
		#pos.x, pos.y = int(round(pos.x)), int(round(pos.y))

		phi = 0
		acceleration = 1

		if (step<30):
			phi = 45
		else:
			acceleration = 0
			if (step < 57) and (step > 50):
				phi = -45
			else:
				if (step < 135) and (step > 130):
					phi = -45
					if (step < 185) and (step > 180):
						phi = -45
					else:
						phi = 0

		step+=1

		#if sensors.collision():
		#	acceleration = 0 #data.v/10
		#	phi=0
		#else:
		#	acceleration = 4 - data.v

		##if(mdist):
		##	phi = mdist[1]-oldphi
		##	oldphi = mdist[1]
		#	if (mdist[0] - olddist) < 1:
		#		acceleration = 0
		#	olddist = mdist[0]


		actuators.accelerator(acceleration)
		actuators.wheel(phi)

		rate.sleep()
