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
            var o = ap.walk.getObject2('execution', data['id']);
            o.data = data;

            if (_scope.executions.indexOf(o) == -1) _scope.executions.push(o);
            if (!_scope.data.execution) _scope.data.execution = o.get('id');

            _scope.$scan();
        },

   }

    var global_funcs = {
        load_world: function() { _scope.funcs.emit_object_index() },
        clone: function() { socket.emit('clone_data', _scope.data, _scope.objects) },
        rewrite: function() { socket.emit('rewrite_data', _scope.data, _scope.objects) },
        launch: function() { socket.emit('create_world', _scope.data) },
        destroy: function() { socket.emit('destroy_world', _scope.data) },

        emit_object_index: function() {
            _scope.data.time = _scope['$input_time'].value;
            _scope.objects = [];
            socket.emit('object:index', _scope.data);
        },

        update_field: function(field) {
            constructor = field.constructor;
            field.link[field.key] = constructor(field.value);
            field.object.update_canvas();
            field.value = field.link[field.key];
            
            if (field.key == 'active') {
                if (field.value) field.object.get('properties')['program'] = ''
                else delete field.object.get('properties')['program'];
                _scope.data.fields = field.object.get_array();
            }
        },

        new_object: function() {
            var obj_id = 0;
            for (var i=0; i<_scope.objects.length; i++) {
                obj = _scope.objects[i];
                obj_id = Math.max(obj_id, obj.get('object'));
            }

            var o = ap.walk.getObject2('object', obj_id+1);
            o.data.object = obj_id+1;
            o.data.properties.name = 'new_object'+o.data.object;
            _scope.objects.push(o);
            _scope.$scan();
            o.update_canvas();
        },

        remove_object: function(object) {
            if (!object) object = _scope.data.selected_object;
            if (!object) return;

            index = _scope.objects.indexOf(object);
            if (index > -1) _scope.objects.splice(index, 1);
            delete ap.walk.class['object'][object.get('object')];
            _scope.$scan();
        }
    }

    return {
        init: function(scope) {
            _scope = scope;

            scope.funcs = global_funcs;

            if (scope.executions == undefined) scope.executions = [];
            if (scope.data == undefined) scope.data = {};

            scope.$watch('data.execution', global_funcs.load_world);
            //scope.$watch('data.time', global_funcs.load_world);

            scope.data.execution = 0;
            scope.data.time = 0;

            socket.on('execution:update', funcs.update);
            socket.emit('execution:index', data);
        },
    }
})
