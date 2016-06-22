define([], function() {

    var getTag = function(field) {
        var tag = tags[field.type];
        if (!tag) tag = tags.default;
        return buildTag(tag);
    }

    var buildTag = function(tag) {
        var res = $(tag.tag, tag.attrs);
        if (tag.html) res.append(buildTag(tag.html));
        return res;  
    }

    var funcs = {
        clone: function() { socket.emit('clone_data', scope.data, scope.objects); },
        rewrite: function() { socket.emit('rewrite_data', scope.data, scope.objects); },
        launch: function() { socket.emit('create_world', scope.data); },
        stop: function() { socket.emit('destroy_world', scope.data); },
	record: function() { 
		function tt() { 
		    scope.data.time = +scope.data.time+1;
		    $(scope['&time']).val(scope.data.time);
		    $(scope['&time']).change();
		    scope.funcs.objects.emit_index();
		    scope.$scan();
	       	};
		my_interval = setInterval(tt, 200);
	},
	stop_record: function() { clearInterval(my_interval); },

        get_field_tag: getTag
    }

    var tags = {
        default: {
            tag: '<input/>',
            attrs: {
                type: '{< field.type >}',
                'al-value': 'field.value',
                'al-change': 'field.update(field)'
            },
        },

        boolean: {
            tag: '<select/>',
            attrs: {
                'al-value': 'field.value',
                'al-element': 'field.element',
                'al-change': 'field.update(field)'
            },
            html: {
                tag: '<option/>',
                attrs: {
                    'al-repeat': 'val in [true, false]',
                    value: '{< val >}', text: '{< val >}',
                    'al-selected': 'field.value == val'
                }
            }
        },

        program: {
            tag: '<select/>',
            attrs: {
                'al-value': 'field.value',
                'al-element': 'field.element',
                'al-change': 'field.update(field)'
            },
            html: {
                tag: '<option/>',
                attrs: {
                    'al-repeat': 'prog in programs',
                    value: '{< prog.data.name >}', text: '{< prog.data.name >}',
                    'al-selected': 'field.value == prog.data.name'
                }
            }
        }
    }

    return {
        funcs: funcs
    }
})
