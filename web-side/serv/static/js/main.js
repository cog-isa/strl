require(["/bower/jquery/dist/jquery.min.js"], function(_jquery) {
    require(
        [
        '/bower/socket.io-client/socket.io.js',

        '/static/js/object.js',
        '/static/js/execution.js',
        '/static/js/global.js',
        
        '/static/libs/js/jquery-ui.js',
        '/static/libs/alight.debug.js',

        '/static/libs/js/lib/bootstrap/js/bootstrap.min.js',
        '/static/libs/js/lib/bootstrap-editable/js/bootstrap-editable.min.js',
        '/static/libs/js/lib/simpletip/jquery.simpletip-1.3.1.pack.js',
        ],
        
        function(io, object, execution, global) {
            var tag = document.querySelector('body');

            socket = io.connect();
            scope = alight.Scope();

            scope.data = data;
            scope.funcs = {
                executions: execution.funcs,
                objects: object.funcs,
                globals: global.funcs
            };
            scope.programs = [
            {data:{name: ''}},
            {data:{name:'2'}},
            {data:{name:'3'}}
            ];

            object.init();
            execution.init();

            alight.directives.al.element = function(element, key, scope) { scope.$setValue(key, element); };
            alight.directives.al.selected = function(element, key, scope) { 
                if (scope.$compile(key)()) $(element).attr('selected', '');
            }

            alight.directives.al.appendTag = function(element, key, scope) {
                var fn = scope.$compile(key);
                $(element).append(fn());
            }
            
            alight.utilits.pars_start_tag = '{<';
            alight.utilits.pars_finish_tag = '>}';
            alight.applyBindings(scope, tag);
    });
});
