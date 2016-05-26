define(['/static/libs/aplib.js'], function(aplib) {

    ap.jsdesc['object'] = {
        fields: { 
            data: { properties: {
                geometry: {
                    position: {x:0, y:0},
                    type: 'circle', 
                    radius: 10
                },
                active: false,
            },
            id: 0
        } },
        methods: {
            get: { code: function(name) {
                var arr = name.split('.');
                var value = this.data;
                for (var i=0; i<arr.length; i++)
                    value = value[arr[i]];
                return value;
            } },

            get_prop: { code: function(name) { return this.get('properties.'+name); } },
            get_geom: { code: function(name) { return this.get_prop('geometry.'+name); } },
                        
            update_canvas: { code: function() {
                canvas = $('canvas[object="'+this.get('object')+'"]').first().get(0);
                if (!canvas) return;
                ctx = canvas.getContext('2d');

                x = this.get_geom('position.x');
                y = this.get_geom('position.y');

                if (this.get_geom('type') == 'circle') {
                    radius = this.get_geom('radius');
                    canvas.width = 2*radius;
                    canvas.height = 2*radius;

                    ctx.beginPath();
                    ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            } },

            get_array: { code: function(name) { 
                if (name == undefined) name = 'properties';
                array = [];
                for (var key in this.get(name)) {
                    field = name + '.' + key;
                    if (this.get(field) instanceof Object) {
                        array = array.concat(this.get_array(field)); 
                    } else {
                        var type = typeof this.get(field);
                        var constructor = this.get(field).constructor;
                        array.push({key: key, name: field, link: this.get(name), 
                            type: type, constructor: constructor, object: this,
                            value: this.get(field)});
                    }
                }
                return array;
            } }        
        }
    }

    var funcs = {
        update: function(data) {
            if (data['execution'] != _scope.data.execution) return;
            var o = ap.walk.getObject2('object', data['object']);
            o.data = data;

            console.log(data);
            if (_scope.objects.indexOf(o) == -1) _scope.objects.push(o);
            if (_scope.data.selected_object == o) _scope.data.fields = o.get_array();
            _scope.data.time = Math.max(o.get('time'), _scope.data.time);

            _scope.$scan();
            o.update_canvas();
        },
    }


    return {
        init: function(scope) {
            _scope = scope;

            if (scope.objects == undefined) scope.objects = [];
            if (scope.data == undefined) scope.data = {};
            scope.$watch('data.selected', function(value) { 
                object = ap.walk.getObject2('object', value);
                _scope.data.fields = object.get_array();
                _scope.data.selected_object = object;
                _scope.$scan();
                console.log(_scope.data.fields)
            });

            scope.data.fields = [];
            socket.on('object:update', funcs.update);
        },
    }
})
