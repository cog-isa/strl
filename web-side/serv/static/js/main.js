require(["/bower/jquery/dist/jquery.min.js"], function(_jquery) {
    require(
        [
        '/static/js/object.js',
        '/bower/socket.io-client/socket.io.js',
        
        '/static/libs/js/jquery-ui.js',
        '/static/libs/alight.debug.js',

        '/static/libs/js/lib/bootstrap/js/bootstrap.min.js',
        '/static/libs/js/lib/bootstrap-editable/js/bootstrap-editable.min.js',
        '/static/libs/js/lib/simpletip/jquery.simpletip-1.3.1.pack.js',
        ],
        
        function(_object, io) {
            // CONFIGURE SCOPE AND BIND to BODY
            var tag = document.querySelector('body');
            var scope = alight.Scope();

            socket = io.connect();

            obj = _object;
            obj.init(scope);

            // init scope
            //var go = document.getElementById("Start");
            //if (){}
            //    wall.wall_app(scope);
            //    agent.agent_app(scope);
            
            alight.applyBindings(scope, tag);
            alight.utilits.pars_start_tag = '{<';
            alight.utilits.pars_finish_tag = '>}';
    });

    /*
    require(['/bower/socket.io-client/socket.io.js'], function(io) {
        socket = io.connect();
        socket.on('update_properties', update_properties);

        $('select#obj').on('change', function() {
            socket.emit('get_object_properties', {id: this.value});
        });
    });
    */
});
