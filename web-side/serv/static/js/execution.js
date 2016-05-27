define(['/static/libs/aplib.js'], function(aplib) {

    ap.jsdesc['execution'] = {
        fields: {},
        methods: {
            get: { code: function(name) {
                var arr = name.split('.');
                var value = this.data;
                for (var i=0; i<arr.length; i++)
                    value = value[arr[i]];
                return value;
            } },
        }
    }

    var funcs = {
        update: function(data) {
            if (data['world'] != scope.data.world) return;
            var o = ap.walk.getObject2('execution', data['id']);
            o.data = data;

            if (scope.executions.indexOf(o) == -1) {
                scope.executions.push(o);
                scope.data.execution = null;
            }
            if (!scope.data.execution) scope.data.execution = o.get('id');

            scope.$scan();
        },

        index: function(data) {
            if (data['id'] != scope.data.world) return;
            scope.executions = [];
            for (var ind in data['executions'])
                funcs.update(data['executions'][ind]);
            scope.$scan();
        }
    }

    return {
        funcs: funcs,
        init: function() {
            scope.executions = [];

            scope.$watch('data.execution', scope.funcs.objects.emit_index);

            socket.on('executions:update', funcs.update);
            socket.on('executions:index', funcs.index);
            socket.emit('executions:index', data);
        },
    }
})
