
(cl:in-package :asdf)

(defsystem "node_manager-srv"
  :depends-on (:roslisp-msg-protocol :roslisp-utils :node_manager-msg
)
  :components ((:file "_package")
    (:file "WorldIds" :depends-on ("_package_WorldIds"))
    (:file "_package_WorldIds" :depends-on ("_package"))
    (:file "EnvExecute" :depends-on ("_package_EnvExecute"))
    (:file "_package_EnvExecute" :depends-on ("_package"))
    (:file "WorldProperties" :depends-on ("_package_WorldProperties"))
    (:file "_package_WorldProperties" :depends-on ("_package"))
    (:file "RNode" :depends-on ("_package_RNode"))
    (:file "_package_RNode" :depends-on ("_package"))
  ))