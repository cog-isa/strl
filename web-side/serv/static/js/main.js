require(["/bower/jquery/dist/jquery.min.js"], function(_jquery) {
    require(
        [
        '/static/libs/js/jquery-ui.js',
        '/static/libs/alight.debug.js',
        '/static/libs/js/lib/bootstrap/js/bootstrap.min.js',
        '/static/libs/js/lib/bootstrap-editable/js/bootstrap-editable.min.js',
        '/static/libs/js/lib/simpletip/jquery.simpletip-1.3.1.pack.js',

        '/static/libs/agent.js'
        ],
        
        function() {
            // CONFIGURE SCOPE AND BIND to BODY
            var tag = document.querySelector('body');
            var scope = alight.Scope();
            // init scope
            //var go = document.getElementById("Start");
            //if (){}
            //    wall.wall_app(scope);
            //    agent.agent_app(scope);
            
            alight.applyBindings(scope, tag);
        }
    );

    require(['/bower/socket.io-client/socket.io.js'], function(io) {
        socket = io.connect();
        socket.on('update_properties', update_properties);

        $('select#obj').on('change', function() {
            socket.emit('get_object_properties', {id: this.value});
        });
    });

});

function update_properties(data) {
    object = data['object']
    props = data['props']
    var tbody = $('#tbody'); tbody.empty();
    for (var p in props) {
        var td, tr = $('<tr/>');
        td = $('<td/>', {text: p}); tr.append(td);
        td = $('<td/>', {text: props[p]}); tr.append(td);
        tbody.append(tr);
    }
    draw_object($('canvas[object='+object+']').first().get(0), props);
}

function draw_object(canvas, props) {
    ctx = canvas.getContext('2d');
    
    x = props['geometry']['position']['x'];
    y = props['geometry']['position']['y'];
        
    console.log(props['geometry']['type']);
    if (props['geometry']['type'] == 'circle') {
        radius = props['geometry']['radius'];
        canvas.width = 2*radius;
        canvas.height = 2 * radius;

        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
}
