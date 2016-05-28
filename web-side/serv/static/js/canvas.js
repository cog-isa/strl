define([], function() {

    function draw_circle(obj, canvas, ctx) {
        x = obj.get_geom('position.x');
        y = obj.get_geom('position.y');

        radius = obj.get_geom('radius');
        canvas.width = 2*radius;
        canvas.height = 2*radius;

        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

    return {
        draw: function(obj) {
            canvas = $('canvas[object="'+obj.get('object')+'"]').first().get(0);
            if (!canvas) return; ctx = canvas.getContext('2d');

            if (obj.get_geom('type') == 'circle') draw_circle(obj, canvas, ctx);
        }
    }

});
