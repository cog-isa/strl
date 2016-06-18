# -*- coding: utf-8 -*-

import rospy

from robots import sensors
from robots import actuators

# sensors
# описывает функции, имитирующие обращение к сенсорам
#
# Формат вызова:
#     sensors.<сенсор>(<параметры>), где
#     <сенсор> - наименование вызываемого сенсора
#     <параметры> - данные для сенсора
#
# Пример: 
#     sensors.gps() - вернет данные о местоположении робота


# actuators
# описывает функции, имитирующие обращение к актуаторам
#
# Формат вызова:
#     actuators.<актуатор>(<параметры>), где 
#     <актуатор> - наименование актуатора
#     <параметры> - данные для актуатора 
#
# Пример:
#     actuators.accelerator(10) - актуатор ускорения,
#     принимает на вход желаемое ускорение робота

import math

def run():
    rate = rospy.Rate(10)

    delta, collision = 1, False
    while not rospy.is_shutdown():
        velocity = sensors.velocity()
        if sensors.collision() and not collision: delta *= -1
        collision = sensors.collision()

        acceleration = delta * 5 - velocity
        angle = delta * math.pi / 64
        
        actuators.accelerator(acceleration)
        actuators.wheel(angle)
        rate.sleep()
