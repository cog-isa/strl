; Auto-generated. Do not edit!


(cl:in-package node_manager-srv)


;//! \htmlinclude WorldProperties-request.msg.html

(cl:defclass <WorldProperties-request> (roslisp-msg-protocol:ros-message)
  ((id
    :reader id
    :initarg :id
    :type cl:string
    :initform ""))
)

(cl:defclass WorldProperties-request (<WorldProperties-request>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <WorldProperties-request>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'WorldProperties-request)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<WorldProperties-request> is deprecated: use node_manager-srv:WorldProperties-request instead.")))

(cl:ensure-generic-function 'id-val :lambda-list '(m))
(cl:defmethod id-val ((m <WorldProperties-request>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:id-val is deprecated.  Use node_manager-srv:id instead.")
  (id m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <WorldProperties-request>) ostream)
  "Serializes a message object of type '<WorldProperties-request>"
  (cl:let ((__ros_str_len (cl:length (cl:slot-value msg 'id))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) __ros_str_len) ostream))
  (cl:map cl:nil #'(cl:lambda (c) (cl:write-byte (cl:char-code c) ostream)) (cl:slot-value msg 'id))
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <WorldProperties-request>) istream)
  "Deserializes a message object of type '<WorldProperties-request>"
    (cl:let ((__ros_str_len 0))
      (cl:setf (cl:ldb (cl:byte 8 0) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:slot-value msg 'id) (cl:make-string __ros_str_len))
      (cl:dotimes (__ros_str_idx __ros_str_len msg)
        (cl:setf (cl:char (cl:slot-value msg 'id) __ros_str_idx) (cl:code-char (cl:read-byte istream)))))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<WorldProperties-request>)))
  "Returns string type for a service object of type '<WorldProperties-request>"
  "node_manager/WorldPropertiesRequest")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldProperties-request)))
  "Returns string type for a service object of type 'WorldProperties-request"
  "node_manager/WorldPropertiesRequest")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<WorldProperties-request>)))
  "Returns md5sum for a message object of type '<WorldProperties-request>"
  "759c4fee420177dccb03972d95304e0e")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'WorldProperties-request)))
  "Returns md5sum for a message object of type 'WorldProperties-request"
  "759c4fee420177dccb03972d95304e0e")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<WorldProperties-request>)))
  "Returns full string definition for message of type '<WorldProperties-request>"
  (cl:format cl:nil "string id~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'WorldProperties-request)))
  "Returns full string definition for message of type 'WorldProperties-request"
  (cl:format cl:nil "string id~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <WorldProperties-request>))
  (cl:+ 0
     4 (cl:length (cl:slot-value msg 'id))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <WorldProperties-request>))
  "Converts a ROS message object to a list"
  (cl:list 'WorldProperties-request
    (cl:cons ':id (id msg))
))
;//! \htmlinclude WorldProperties-response.msg.html

(cl:defclass <WorldProperties-response> (roslisp-msg-protocol:ros-message)
  ((properties
    :reader properties
    :initarg :properties
    :type node_manager-msg:Properties
    :initform (cl:make-instance 'node_manager-msg:Properties)))
)

(cl:defclass WorldProperties-response (<WorldProperties-response>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <WorldProperties-response>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'WorldProperties-response)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<WorldProperties-response> is deprecated: use node_manager-srv:WorldProperties-response instead.")))

(cl:ensure-generic-function 'properties-val :lambda-list '(m))
(cl:defmethod properties-val ((m <WorldProperties-response>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:properties-val is deprecated.  Use node_manager-srv:properties instead.")
  (properties m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <WorldProperties-response>) ostream)
  "Serializes a message object of type '<WorldProperties-response>"
  (roslisp-msg-protocol:serialize (cl:slot-value msg 'properties) ostream)
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <WorldProperties-response>) istream)
  "Deserializes a message object of type '<WorldProperties-response>"
  (roslisp-msg-protocol:deserialize (cl:slot-value msg 'properties) istream)
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<WorldProperties-response>)))
  "Returns string type for a service object of type '<WorldProperties-response>"
  "node_manager/WorldPropertiesResponse")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldProperties-response)))
  "Returns string type for a service object of type 'WorldProperties-response"
  "node_manager/WorldPropertiesResponse")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<WorldProperties-response>)))
  "Returns md5sum for a message object of type '<WorldProperties-response>"
  "759c4fee420177dccb03972d95304e0e")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'WorldProperties-response)))
  "Returns md5sum for a message object of type 'WorldProperties-response"
  "759c4fee420177dccb03972d95304e0e")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<WorldProperties-response>)))
  "Returns full string definition for message of type '<WorldProperties-response>"
  (cl:format cl:nil "Properties properties~%~%~%================================================================================~%MSG: node_manager/Properties~%Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'WorldProperties-response)))
  "Returns full string definition for message of type 'WorldProperties-response"
  (cl:format cl:nil "Properties properties~%~%~%================================================================================~%MSG: node_manager/Properties~%Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <WorldProperties-response>))
  (cl:+ 0
     (roslisp-msg-protocol:serialization-length (cl:slot-value msg 'properties))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <WorldProperties-response>))
  "Converts a ROS message object to a list"
  (cl:list 'WorldProperties-response
    (cl:cons ':properties (properties msg))
))
(cl:defmethod roslisp-msg-protocol:service-request-type ((msg (cl:eql 'WorldProperties)))
  'WorldProperties-request)
(cl:defmethod roslisp-msg-protocol:service-response-type ((msg (cl:eql 'WorldProperties)))
  'WorldProperties-response)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldProperties)))
  "Returns string type for a service object of type '<WorldProperties>"
  "node_manager/WorldProperties")