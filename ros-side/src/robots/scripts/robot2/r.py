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


def run():
    rate = rospy.Rate(10)
    while not rospy.is_shutdown():
        pos = sensors.gps()
        acceleration = (100-pos.x) / 50.0
        actuators.accelerator(acceleration)
        rate.sleep()
