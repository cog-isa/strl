execute_process(COMMAND "/home/artsobes/Documents/Development/ROS/catkin_ws/build/node_manager/catkin_generated/python_distutils_install.sh" RESULT_VARIABLE res)

if(NOT res EQUAL 0)
  message(FATAL_ERROR "execute_process(/home/artsobes/Documents/Development/ROS/catkin_ws/build/node_manager/catkin_generated/python_distutils_install.sh) returned error code ")
endif()
