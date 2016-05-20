
(cl:in-package :asdf)

(defsystem "node_manager-msg"
  :depends-on (:roslisp-msg-protocol :roslisp-utils )
  :components ((:file "_package")
    (:file "Position" :depends-on ("_package_Position"))
    (:file "_package_Position" :depends-on ("_package"))
    (:file "Properties" :depends-on ("_package_Properties"))
    (:file "_package_Properties" :depends-on ("_package"))
    (:file "Reaction" :depends-on ("_package_Reaction"))
    (:file "_package_Reaction" :depends-on ("_package"))
  ))