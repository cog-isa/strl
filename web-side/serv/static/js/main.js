require(["/bower/jquery/dist/jquery.min.js"], function(_jquery) {
    require(
        [
        '/bower/socket.io-client/socket.io.js',

        '/static/js/object.js',
        '/static/js/execution.js',
        
        '/static/libs/js/jquery-ui.js',
        '/static/libs/alight.debug.js',

        '/static/libs/js/lib/bootstrap/js/bootstrap.min.js',
        '/static/libs/js/lib/bootstrap-editable/js/bootstrap-editable.min.js',
        '/static/libs/js/lib/simpletip/jquery.simpletip-1.3.1.pack.js',
        ],
        
        function(io, _object, _execution) {
            // CONFIGURE SCOPE AND BIND to BODY
            var tag = document.querySelector('body');
            var scope = alight.Scope();

            socket = io.connect();

            _object.init(scope);
            _execution.init(scope);

            // init scope
            //var go = document.getElementById("Start");
            //if (){}
            //    wall.wall_app(scope);
            //    agent.agent_app(scope);
            alight.directives.al.getElement = function(element, key, scope) { scope[key] = element; };
            alight.directives.al.attrIf = function(element, key, scope) { 
                console.log(arguments);
            }
            
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
