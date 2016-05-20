; Auto-generated. Do not edit!


(cl:in-package node_manager-msg)


;//! \htmlinclude Reaction.msg.html

(cl:defclass <Reaction> (roslisp-msg-protocol:ros-message)
  ((vx
    :reader vx
    :initarg :vx
    :type cl:integer
    :initform 0))
)

(cl:defclass Reaction (<Reaction>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <Reaction>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'Reaction)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-msg:<Reaction> is deprecated: use node_manager-msg:Reaction instead.")))

(cl:ensure-generic-function 'vx-val :lambda-list '(m))
(cl:defmethod vx-val ((m <Reaction>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-msg:vx-val is deprecated.  Use node_manager-msg:vx instead.")
  (vx m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <Reaction>) ostream)
  "Serializes a message object of type '<Reaction>"
  (cl:let* ((signed (cl:slot-value msg 'vx)) (unsigned (cl:if (cl:< signed 0) (cl:+ signed 18446744073709551616) signed)))
    (cl:write-byte (cl:ldb (cl:byte 8 0) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 32) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 40) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 48) unsigned) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 56) unsigned) ostream)
    )
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <Reaction>) istream)
  "Deserializes a message object of type '<Reaction>"
    (cl:let ((unsigned 0))
      (cl:setf (cl:ldb (cl:byte 8 0) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 32) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 40) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 48) unsigned) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 56) unsigned) (cl:read-byte istream))
      (cl:setf (cl:slot-value msg 'vx) (cl:if (cl:< unsigned 9223372036854775808) unsigned (cl:- unsigned 18446744073709551616))))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<Reaction>)))
  "Returns string type for a message object of type '<Reaction>"
  "node_manager/Reaction")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'Reaction)))
  "Returns string type for a message object of type 'Reaction"
  "node_manager/Reaction")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<Reaction>)))
  "Returns md5sum for a message object of type '<Reaction>"
  "7167721f8ece6d6a060283246087ac5b")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'Reaction)))
  "Returns md5sum for a message object of type 'Reaction"
  "7167721f8ece6d6a060283246087ac5b")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<Reaction>)))
  "Returns full string definition for message of type '<Reaction>"
  (cl:format cl:nil "int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'Reaction)))
  "Returns full string definition for message of type 'Reaction"
  (cl:format cl:nil "int64 vx~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <Reaction>))
  (cl:+ 0
     8
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <Reaction>))
  "Converts a ROS message object to a list"
  (cl:list 'Reaction
    (cl:cons ':vx (vx msg))
))
