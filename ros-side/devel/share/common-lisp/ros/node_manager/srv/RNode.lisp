; Auto-generated. Do not edit!


(cl:in-package node_manager-srv)


;//! \htmlinclude RNode-request.msg.html

(cl:defclass <RNode-request> (roslisp-msg-protocol:ros-message)
  ()
)

(cl:defclass RNode-request (<RNode-request>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <RNode-request>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'RNode-request)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<RNode-request> is deprecated: use node_manager-srv:RNode-request instead.")))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <RNode-request>) ostream)
  "Serializes a message object of type '<RNode-request>"
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <RNode-request>) istream)
  "Deserializes a message object of type '<RNode-request>"
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<RNode-request>)))
  "Returns string type for a service object of type '<RNode-request>"
  "node_manager/RNodeRequest")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'RNode-request)))
  "Returns string type for a service object of type 'RNode-request"
  "node_manager/RNodeRequest")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<RNode-request>)))
  "Returns md5sum for a message object of type '<RNode-request>"
  "09fd118bc15393e954239c8a0eb51ac3")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'RNode-request)))
  "Returns md5sum for a message object of type 'RNode-request"
  "09fd118bc15393e954239c8a0eb51ac3")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<RNode-request>)))
  "Returns full string definition for message of type '<RNode-request>"
  (cl:format cl:nil "~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'RNode-request)))
  "Returns full string definition for message of type 'RNode-request"
  (cl:format cl:nil "~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <RNode-request>))
  (cl:+ 0
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <RNode-request>))
  "Converts a ROS message object to a list"
  (cl:list 'RNode-request
))
;//! \htmlinclude RNode-response.msg.html

(cl:defclass <RNode-response> (roslisp-msg-protocol:ros-message)
  ((reaction
    :reader reaction
    :initarg :reaction
    :type node_manager-msg:Reaction
    :initform (cl:make-instance 'node_manager-msg:Reaction)))
)

(cl:defclass RNode-response (<RNode-response>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <RNode-response>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'RNode-response)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<RNode-response> is deprecated: use node_manager-srv:RNode-response instead.")))

(cl:ensure-generic-function 'reaction-val :lambda-list '(m))
(cl:defmethod reaction-val ((m <RNode-response>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:reaction-val is deprecated.  Use node_manager-srv:reaction instead.")
  (reaction m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <RNode-response>) ostream)
  "Serializes a message object of type '<RNode-response>"
  (roslisp-msg-protocol:serialize (cl:slot-value msg 'reaction) ostream)
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <RNode-response>) istream)
  "Deserializes a message object of type '<RNode-response>"
  (roslisp-msg-protocol:deserialize (cl:slot-value msg 'reaction) istream)
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<RNode-response>)))
  "Returns string type for a service object of type '<RNode-response>"
  "node_manager/RNodeResponse")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'RNode-response)))
  "Returns string type for a service object of type 'RNode-response"
  "node_manager/RNodeResponse")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<RNode-response>)))
  "Returns md5sum for a message object of type '<RNode-response>"
  "09fd118bc15393e954239c8a0eb51ac3")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'RNode-response)))
  "Returns md5sum for a message object of type 'RNode-response"
  "09fd118bc15393e954239c8a0eb51ac3")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<RNode-response>)))
  "Returns full string definition for message of type '<RNode-response>"
  (cl:format cl:nil "Reaction reaction~%~%~%================================================================================~%MSG: node_manager/Reaction~%int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'RNode-response)))
  "Returns full string definition for message of type 'RNode-response"
  (cl:format cl:nil "Reaction reaction~%~%~%================================================================================~%MSG: node_manager/Reaction~%int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <RNode-response>))
  (cl:+ 0
     (roslisp-msg-protocol:serialization-length (cl:slot-value msg 'reaction))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <RNode-response>))
  "Converts a ROS message object to a list"
  (cl:list 'RNode-response
    (cl:cons ':reaction (reaction msg))
))
(cl:defmethod roslisp-msg-protocol:service-request-type ((msg (cl:eql 'RNode)))
  'RNode-request)
(cl:defmethod roslisp-msg-protocol:service-response-type ((msg (cl:eql 'RNode)))
  'RNode-response)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'RNode)))
  "Returns string type for a service object of type '<RNode>"
  "node_manager/RNode")