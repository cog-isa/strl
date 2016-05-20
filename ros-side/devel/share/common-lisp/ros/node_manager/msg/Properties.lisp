; Auto-generated. Do not edit!


(cl:in-package node_manager-msg)


;//! \htmlinclude Properties.msg.html

(cl:defclass <Properties> (roslisp-msg-protocol:ros-message)
  ((position
    :reader position
    :initarg :position
    :type node_manager-msg:Position
    :initform (cl:make-instance 'node_manager-msg:Position))
   (radius
    :reader radius
    :initarg :radius
    :type cl:float
    :initform 0.0)
   (type
    :reader type
    :initarg :type
    :type cl:string
    :initform ""))
)

(cl:defclass Properties (<Properties>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <Properties>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'Properties)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-msg:<Properties> is deprecated: use node_manager-msg:Properties instead.")))

(cl:ensure-generic-function 'position-val :lambda-list '(m))
(cl:defmethod position-val ((m <Properties>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-msg:position-val is deprecated.  Use node_manager-msg:position instead.")
  (position m))

(cl:ensure-generic-function 'radius-val :lambda-list '(m))
(cl:defmethod radius-val ((m <Properties>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-msg:radius-val is deprecated.  Use node_manager-msg:radius instead.")
  (radius m))

(cl:ensure-generic-function 'type-val :lambda-list '(m))
(cl:defmethod type-val ((m <Properties>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-msg:type-val is deprecated.  Use node_manager-msg:type instead.")
  (type m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <Properties>) ostream)
  "Serializes a message object of type '<Properties>"
  (roslisp-msg-protocol:serialize (cl:slot-value msg 'position) ostream)
  (cl:let ((bits (roslisp-utils:encode-single-float-bits (cl:slot-value msg 'radius))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) bits) ostream))
  (cl:let ((__ros_str_len (cl:length (cl:slot-value msg 'type))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) __ros_str_len) ostream))
  (cl:map cl:nil #'(cl:lambda (c) (cl:write-byte (cl:char-code c) ostream)) (cl:slot-value msg 'type))
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <Properties>) istream)
  "Deserializes a message object of type '<Properties>"
  (roslisp-msg-protocol:deserialize (cl:slot-value msg 'position) istream)
    (cl:let ((bits 0))
      (cl:setf (cl:ldb (cl:byte 8 0) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) bits) (cl:read-byte istream))
    (cl:setf (cl:slot-value msg 'radius) (roslisp-utils:decode-single-float-bits bits)))
    (cl:let ((__ros_str_len 0))
      (cl:setf (cl:ldb (cl:byte 8 0) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:slot-value msg 'type) (cl:make-string __ros_str_len))
      (cl:dotimes (__ros_str_idx __ros_str_len msg)
        (cl:setf (cl:char (cl:slot-value msg 'type) __ros_str_idx) (cl:code-char (cl:read-byte istream)))))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<Properties>)))
  "Returns string type for a message object of type '<Properties>"
  "node_manager/Properties")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'Properties)))
  "Returns string type for a message object of type 'Properties"
  "node_manager/Properties")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<Properties>)))
  "Returns md5sum for a message object of type '<Properties>"
  "4c07079f3a4d9b76313d2b3866666f99")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'Properties)))
  "Returns md5sum for a message object of type 'Properties"
  "4c07079f3a4d9b76313d2b3866666f99")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<Properties>)))
  "Returns full string definition for message of type '<Properties>"
  (cl:format cl:nil "Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'Properties)))
  "Returns full string definition for message of type 'Properties"
  (cl:format cl:nil "Position position~%float32 radius~%string type~%~%================================================================================~%MSG: node_manager/Position~%float32 x~%float32 y~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <Properties>))
  (cl:+ 0
     (roslisp-msg-protocol:serialization-length (cl:slot-value msg 'position))
     4
     4 (cl:length (cl:slot-value msg 'type))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <Properties>))
  "Converts a ROS message object to a list"
  (cl:list 'Properties
    (cl:cons ':position (position msg))
    (cl:cons ':radius (radius msg))
    (cl:cons ':type (type msg))
))
