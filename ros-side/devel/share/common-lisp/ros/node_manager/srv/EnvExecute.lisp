; Auto-generated. Do not edit!


(cl:in-package node_manager-srv)


;//! \htmlinclude EnvExecute-request.msg.html

(cl:defclass <EnvExecute-request> (roslisp-msg-protocol:ros-message)
  ((reaction
    :reader reaction
    :initarg :reaction
    :type node_manager-msg:Reaction
    :initform (cl:make-instance 'node_manager-msg:Reaction))
   (robot_id
    :reader robot_id
    :initarg :robot_id
    :type cl:string
    :initform ""))
)

(cl:defclass EnvExecute-request (<EnvExecute-request>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <EnvExecute-request>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'EnvExecute-request)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<EnvExecute-request> is deprecated: use node_manager-srv:EnvExecute-request instead.")))

(cl:ensure-generic-function 'reaction-val :lambda-list '(m))
(cl:defmethod reaction-val ((m <EnvExecute-request>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:reaction-val is deprecated.  Use node_manager-srv:reaction instead.")
  (reaction m))

(cl:ensure-generic-function 'robot_id-val :lambda-list '(m))
(cl:defmethod robot_id-val ((m <EnvExecute-request>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:robot_id-val is deprecated.  Use node_manager-srv:robot_id instead.")
  (robot_id m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <EnvExecute-request>) ostream)
  "Serializes a message object of type '<EnvExecute-request>"
  (roslisp-msg-protocol:serialize (cl:slot-value msg 'reaction) ostream)
  (cl:let ((__ros_str_len (cl:length (cl:slot-value msg 'robot_id))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) __ros_str_len) ostream))
  (cl:map cl:nil #'(cl:lambda (c) (cl:write-byte (cl:char-code c) ostream)) (cl:slot-value msg 'robot_id))
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <EnvExecute-request>) istream)
  "Deserializes a message object of type '<EnvExecute-request>"
  (roslisp-msg-protocol:deserialize (cl:slot-value msg 'reaction) istream)
    (cl:let ((__ros_str_len 0))
      (cl:setf (cl:ldb (cl:byte 8 0) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:slot-value msg 'robot_id) (cl:make-string __ros_str_len))
      (cl:dotimes (__ros_str_idx __ros_str_len msg)
        (cl:setf (cl:char (cl:slot-value msg 'robot_id) __ros_str_idx) (cl:code-char (cl:read-byte istream)))))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<EnvExecute-request>)))
  "Returns string type for a service object of type '<EnvExecute-request>"
  "node_manager/EnvExecuteRequest")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'EnvExecute-request)))
  "Returns string type for a service object of type 'EnvExecute-request"
  "node_manager/EnvExecuteRequest")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<EnvExecute-request>)))
  "Returns md5sum for a message object of type '<EnvExecute-request>"
  "57894eb0b15cbedc08e6487c6e2e5c4d")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'EnvExecute-request)))
  "Returns md5sum for a message object of type 'EnvExecute-request"
  "57894eb0b15cbedc08e6487c6e2e5c4d")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<EnvExecute-request>)))
  "Returns full string definition for message of type '<EnvExecute-request>"
  (cl:format cl:nil "Reaction reaction~%string robot_id~%~%================================================================================~%MSG: node_manager/Reaction~%int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'EnvExecute-request)))
  "Returns full string definition for message of type 'EnvExecute-request"
  (cl:format cl:nil "Reaction reaction~%string robot_id~%~%================================================================================~%MSG: node_manager/Reaction~%int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <EnvExecute-request>))
  (cl:+ 0
     (roslisp-msg-protocol:serialization-length (cl:slot-value msg 'reaction))
     4 (cl:length (cl:slot-value msg 'robot_id))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <EnvExecute-request>))
  "Converts a ROS message object to a list"
  (cl:list 'EnvExecute-request
    (cl:cons ':reaction (reaction msg))
    (cl:cons ':robot_id (robot_id msg))
))
;//! \htmlinclude EnvExecute-response.msg.html

(cl:defclass <EnvExecute-response> (roslisp-msg-protocol:ros-message)
  ((properties
    :reader properties
    :initarg :properties
    :type node_manager-msg:Properties
    :initform (cl:make-instance 'node_manager-msg:Properties)))
)

(cl:defclass EnvExecute-response (<EnvExecute-response>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <EnvExecute-response>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'EnvExecute-response)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<EnvExecute-response> is deprecated: use node_manager-srv:EnvExecute-response instead.")))

(cl:ensure-generic-function 'properties-val :lambda-list '(m))
(cl:defmethod properties-val ((m <EnvExecute-response>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:properties-val is deprecated.  Use node_manager-srv:properties instead.")
  (properties m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <EnvExecute-response>) ostream)
  "Serializes a message object of type '<EnvExecute-response>"
  (roslisp-msg-protocol:serialize (cl:slot-value msg 'properties) ostream)
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <EnvExecute-response>) istream)
  "Deserializes a message object of type '<EnvExecute-response>"
  (roslisp-msg-protocol:deserialize (cl:slot-value msg 'properties) istream)
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<EnvExecute-response>)))
  "Returns string type for a service object of type '<EnvExecute-response>"
  "node_manager/EnvExecuteResponse")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'EnvExecute-response)))
  "Returns string type for a service object of type 'EnvExecute-response"
  "node_manager/EnvExecuteResponse")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<EnvExecute-response>)))
  "Returns md5sum for a message object of type '<EnvExecute-response>"
  "57894eb0b15cbedc08e6487c6e2e5c4d")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'EnvExecute-response)))
  "Returns md5sum for a message object of type 'EnvExecute-response"
  "57894eb0b15cbedc08e6487c6e2e5c4d")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<EnvExecute-response>)))
  "Returns full string definition for message of type '<EnvExecute-response>"
  (cl:format cl:nil "Properties properties~%~%~%================================================================================~%MSG: node_manager/Properties~%Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'EnvExecute-response)))
  "Returns full string definition for message of type 'EnvExecute-response"
  (cl:format cl:nil "Properties properties~%~%~%================================================================================~%MSG: node_manager/Properties~%Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <EnvExecute-response>))
  (cl:+ 0
     (roslisp-msg-protocol:serialization-length (cl:slot-value msg 'properties))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <EnvExecute-response>))
  "Converts a ROS message object to a list"
  (cl:list 'EnvExecute-response
    (cl:cons ':properties (properties msg))
))
(cl:defmethod roslisp-msg-protocol:service-request-type ((msg (cl:eql 'EnvExecute)))
  'EnvExecute-request)
(cl:defmethod roslisp-msg-protocol:service-response-type ((msg (cl:eql 'EnvExecute)))
  'EnvExecute-response)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'EnvExecute)))
  "Returns string type for a service object of type '<EnvExecute>"
  "node_manager/EnvExecute")