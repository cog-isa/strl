define(['/static/libs/aplib.js'], function(aplib) {

    ap.jsdesc['object'] = {
        fields: {},
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
            } }
        }
    }

    funcs = {
        update: function(data) {
            var o = ap.walk.getObject2('object', data['object']);
            o.data = data;

            if (_scope.objects.indexOf(o) == -1)
                _scope.objects.push(o);

            _scope.$scan();
            o.update_canvas();

            console.log(data);
        },
    }


    return {
        init: function(scope) {
            _scope = scope;

            if (scope.objects == undefined)
                scope.objects = [];

            socket.on('object:update', funcs.update);
            socket.emit('object:index', data);
        },
    }
})
