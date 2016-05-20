# generated from genmsg/cmake/pkg-genmsg.cmake.em

message(STATUS "node_manager: 3 messages, 4 services")

set(MSG_I_FLAGS "-Inode_manager:/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg;-Istd_msgs:/opt/ros/indigo/share/std_msgs/cmake/../msg;-Igeometry_msgs:/opt/ros/indigo/share/geometry_msgs/cmake/../msg")

# Find all generators
find_package(gencpp REQUIRED)
find_package(genlisp REQUIRED)
find_package(genpy REQUIRED)

add_custom_target(node_manager_generate_messages ALL)

# verify that message/service dependencies have not changed since configure



get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv" "node_manager/Position:node_manager/Properties"
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg" ""
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv" "node_manager/Position:node_manager/Properties:node_manager/Reaction"
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv" ""
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg" "node_manager/Position"
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg" ""
)

get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv" NAME_WE)
add_custom_target(_node_manager_generate_messages_check_deps_${_filename}
  COMMAND ${CATKIN_ENV} ${PYTHON_EXECUTABLE} ${GENMSG_CHECK_DEPS_SCRIPT} "node_manager" "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv" "node_manager/Reaction"
)

#
#  langs = gencpp;genlisp;genpy
#

### Section generating for lang: gencpp
### Generating Messages
_generate_msg_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)
_generate_msg_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)
_generate_msg_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)

### Generating Services
_generate_srv_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)
_generate_srv_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)
_generate_srv_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)
_generate_srv_cpp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
)

### Generating Module File
_generate_module_cpp(node_manager
  ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
  "${ALL_GEN_OUTPUT_FILES_cpp}"
)

add_custom_target(node_manager_generate_messages_cpp
  DEPENDS ${ALL_GEN_OUTPUT_FILES_cpp}
)
add_dependencies(node_manager_generate_messages node_manager_generate_messages_cpp)

# add dependencies to all check dependencies targets
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_cpp _node_manager_generate_messages_check_deps_${_filename})

# target for backward compatibility
add_custom_target(node_manager_gencpp)
add_dependencies(node_manager_gencpp node_manager_generate_messages_cpp)

# register target for catkin_package(EXPORTED_TARGETS)
list(APPEND ${PROJECT_NAME}_EXPORTED_TARGETS node_manager_generate_messages_cpp)

### Section generating for lang: genlisp
### Generating Messages
_generate_msg_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)
_generate_msg_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)
_generate_msg_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)

### Generating Services
_generate_srv_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)
_generate_srv_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)
_generate_srv_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)
_generate_srv_lisp(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
)

### Generating Module File
_generate_module_lisp(node_manager
  ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
  "${ALL_GEN_OUTPUT_FILES_lisp}"
)

add_custom_target(node_manager_generate_messages_lisp
  DEPENDS ${ALL_GEN_OUTPUT_FILES_lisp}
)
add_dependencies(node_manager_generate_messages node_manager_generate_messages_lisp)

# add dependencies to all check dependencies targets
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_lisp _node_manager_generate_messages_check_deps_${_filename})

# target for backward compatibility
add_custom_target(node_manager_genlisp)
add_dependencies(node_manager_genlisp node_manager_generate_messages_lisp)

# register target for catkin_package(EXPORTED_TARGETS)
list(APPEND ${PROJECT_NAME}_EXPORTED_TARGETS node_manager_generate_messages_lisp)

### Section generating for lang: genpy
### Generating Messages
_generate_msg_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)
_generate_msg_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)
_generate_msg_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg"
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)

### Generating Services
_generate_srv_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg"
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)
_generate_srv_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg;/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)
_generate_srv_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv"
  "${MSG_I_FLAGS}"
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg"
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)
_generate_srv_py(node_manager
  "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv"
  "${MSG_I_FLAGS}"
  ""
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
)

### Generating Module File
_generate_module_py(node_manager
  ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
  "${ALL_GEN_OUTPUT_FILES_py}"
)

add_custom_target(node_manager_generate_messages_py
  DEPENDS ${ALL_GEN_OUTPUT_FILES_py}
)
add_dependencies(node_manager_generate_messages node_manager_generate_messages_py)

# add dependencies to all check dependencies targets
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldProperties.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Position.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/EnvExecute.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/WorldIds.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Properties.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/msg/Reaction.msg" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})
get_filename_component(_filename "/home/artsobes/Documents/Development/ROS/catkin_ws/src/node_manager/srv/RNode.srv" NAME_WE)
add_dependencies(node_manager_generate_messages_py _node_manager_generate_messages_check_deps_${_filename})

# target for backward compatibility
add_custom_target(node_manager_genpy)
add_dependencies(node_manager_genpy node_manager_generate_messages_py)

# register target for catkin_package(EXPORTED_TARGETS)
list(APPEND ${PROJECT_NAME}_EXPORTED_TARGETS node_manager_generate_messages_py)



if(gencpp_INSTALL_DIR AND EXISTS ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager)
  # install generated code
  install(
    DIRECTORY ${CATKIN_DEVEL_PREFIX}/${gencpp_INSTALL_DIR}/node_manager
    DESTINATION ${gencpp_INSTALL_DIR}
  )
endif()
add_dependencies(node_manager_generate_messages_cpp std_msgs_generate_messages_cpp)
add_dependencies(node_manager_generate_messages_cpp geometry_msgs_generate_messages_cpp)

if(genlisp_INSTALL_DIR AND EXISTS ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager)
  # install generated code
  install(
    DIRECTORY ${CATKIN_DEVEL_PREFIX}/${genlisp_INSTALL_DIR}/node_manager
    DESTINATION ${genlisp_INSTALL_DIR}
  )
endif()
add_dependencies(node_manager_generate_messages_lisp std_msgs_generate_messages_lisp)
add_dependencies(node_manager_generate_messages_lisp geometry_msgs_generate_messages_lisp)

if(genpy_INSTALL_DIR AND EXISTS ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager)
  install(CODE "execute_process(COMMAND \"/usr/bin/python\" -m compileall \"${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager\")")
  # install generated code
  install(
    DIRECTORY ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
    DESTINATION ${genpy_INSTALL_DIR}
    # skip all init files
    PATTERN "__init__.py" EXCLUDE
    PATTERN "__init__.pyc" EXCLUDE
  )
  # install init files which are not in the root folder of the generated code
  install(
    DIRECTORY ${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager
    DESTINATION ${genpy_INSTALL_DIR}
    FILES_MATCHING
    REGEX "${CATKIN_DEVEL_PREFIX}/${genpy_INSTALL_DIR}/node_manager/.+/__init__.pyc?$"
  )
endif()
add_dependencies(node_manager_generate_messages_py std_msgs_generate_messages_py)
add_dependencies(node_manager_generate_messages_py geometry_msgs_generate_messages_py)
