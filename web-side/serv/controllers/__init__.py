def route(app):
    import ros
    import worlds_controller

    ros.route(app)
    worlds_controller.route(app)
