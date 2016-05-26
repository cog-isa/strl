#!/bin/bash
xterm -e 'roscore;bash' &
sleep 3
xterm -e 'source ros-side/devel/setup.bash;rosrun node_manager manager.py;bash' &
sleep 3
xterm -e 'roslaunch rosbridge_server rosbridge_websocket.launch;bash' &
sleep 3
xterm -e 'java -jar ROSBridge/out/artifacts/ROSBridge_jar/ROSBridge.jar;bash' &
sleep 3
xterm -e 'python web-side/serv/main.py;bash'
