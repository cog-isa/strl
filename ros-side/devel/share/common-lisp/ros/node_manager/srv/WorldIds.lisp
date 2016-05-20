; Auto-generated. Do not edit!


(cl:in-package node_manager-srv)


;//! \htmlinclude WorldIds-request.msg.html

(cl:defclass <WorldIds-request> (roslisp-msg-protocol:ros-message)
  ()
)

(cl:defclass WorldIds-request (<WorldIds-request>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <WorldIds-request>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'WorldIds-request)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<WorldIds-request> is deprecated: use node_manager-srv:WorldIds-request instead.")))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <WorldIds-request>) ostream)
  "Serializes a message object of type '<WorldIds-request>"
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <WorldIds-request>) istream)
  "Deserializes a message object of type '<WorldIds-request>"
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<WorldIds-request>)))
  "Returns string type for a service object of type '<WorldIds-request>"
  "node_manager/WorldIdsRequest")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldIds-request)))
  "Returns string type for a service object of type 'WorldIds-request"
  "node_manager/WorldIdsRequest")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<WorldIds-request>)))
  "Returns md5sum for a message object of type '<WorldIds-request>"
  "31314a1125a2ca69ddc92cdc117c989c")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'WorldIds-request)))
  "Returns md5sum for a message object of type 'WorldIds-request"
  "31314a1125a2ca69ddc92cdc117c989c")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<WorldIds-request>)))
  "Returns full string definition for message of type '<WorldIds-request>"
  (cl:format cl:nil "~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'WorldIds-request)))
  "Returns full string definition for message of type 'WorldIds-request"
  (cl:format cl:nil "~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <WorldIds-request>))
  (cl:+ 0
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <WorldIds-request>))
  "Converts a ROS message object to a list"
  (cl:list 'WorldIds-request
))
;//! \htmlinclude WorldIds-response.msg.html

(cl:defclass <WorldIds-response> (roslisp-msg-protocol:ros-message)
  ((ids
    :reader ids
    :initarg :ids
    :type (cl:vector cl:string)
   :initform (cl:make-array 0 :element-type 'cl:string :initial-element "")))
)

(cl:defclass WorldIds-response (<WorldIds-response>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <WorldIds-response>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'WorldIds-response)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name node_manager-srv:<WorldIds-response> is deprecated: use node_manager-srv:WorldIds-response instead.")))

(cl:ensure-generic-function 'ids-val :lambda-list '(m))
(cl:defmethod ids-val ((m <WorldIds-response>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader node_manager-srv:ids-val is deprecated.  Use node_manager-srv:ids instead.")
  (ids m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <WorldIds-response>) ostream)
  "Serializes a message object of type '<WorldIds-response>"
  (cl:let ((__ros_arr_len (cl:length (cl:slot-value msg 'ids))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) __ros_arr_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) __ros_arr_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) __ros_arr_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) __ros_arr_len) ostream))
  (cl:map cl:nil #'(cl:lambda (ele) (cl:let ((__ros_str_len (cl:length ele)))
    (cl:write-byte (cl:ldb (cl:byte 8 0) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) __ros_str_len) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) __ros_str_len) ostream))
  (cl:map cl:nil #'(cl:lambda (c) (cl:write-byte (cl:char-code c) ostream)) ele))
   (cl:slot-value msg 'ids))
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <WorldIds-response>) istream)
  "Deserializes a message object of type '<WorldIds-response>"
  (cl:let ((__ros_arr_len 0))
    (cl:setf (cl:ldb (cl:byte 8 0) __ros_arr_len) (cl:read-byte istream))
    (cl:setf (cl:ldb (cl:byte 8 8) __ros_arr_len) (cl:read-byte istream))
    (cl:setf (cl:ldb (cl:byte 8 16) __ros_arr_len) (cl:read-byte istream))
    (cl:setf (cl:ldb (cl:byte 8 24) __ros_arr_len) (cl:read-byte istream))
  (cl:setf (cl:slot-value msg 'ids) (cl:make-array __ros_arr_len))
  (cl:let ((vals (cl:slot-value msg 'ids)))
    (cl:dotimes (i __ros_arr_len)
    (cl:let ((__ros_str_len 0))
      (cl:setf (cl:ldb (cl:byte 8 0) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) __ros_str_len) (cl:read-byte istream))
      (cl:setf (cl:aref vals i) (cl:make-string __ros_str_len))
      (cl:dotimes (__ros_str_idx __ros_str_len msg)
        (cl:setf (cl:char (cl:aref vals i) __ros_str_idx) (cl:code-char (cl:read-byte istream))))))))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<WorldIds-response>)))
  "Returns string type for a service object of type '<WorldIds-response>"
  "node_manager/WorldIdsResponse")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldIds-response)))
  "Returns string type for a service object of type 'WorldIds-response"
  "node_manager/WorldIdsResponse")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<WorldIds-response>)))
  "Returns md5sum for a message object of type '<WorldIds-response>"
  "31314a1125a2ca69ddc92cdc117c989c")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'WorldIds-response)))
  "Returns md5sum for a message object of type 'WorldIds-response"
  "31314a1125a2ca69ddc92cdc117c989c")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<WorldIds-response>)))
  "Returns full string definition for message of type '<WorldIds-response>"
  (cl:format cl:nil "string[] ids~%~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'WorldIds-response)))
  "Returns full string definition for message of type 'WorldIds-response"
  (cl:format cl:nil "string[] ids~%~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <WorldIds-response>))
  (cl:+ 0
     4 (cl:reduce #'cl:+ (cl:slot-value msg 'ids) :key #'(cl:lambda (ele) (cl:declare (cl:ignorable ele)) (cl:+ 4 (cl:length ele))))
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <WorldIds-response>))
  "Converts a ROS message object to a list"
  (cl:list 'WorldIds-response
    (cl:cons ':ids (ids msg))
))
(cl:defmethod roslisp-msg-protocol:service-request-type ((msg (cl:eql 'WorldIds)))
  'WorldIds-request)
(cl:defmethod roslisp-msg-protocol:service-response-type ((msg (cl:eql 'WorldIds)))
  'WorldIds-response)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'WorldIds)))
  "Returns string type for a service object of type '<WorldIds>"
  "node_manager/WorldIds")