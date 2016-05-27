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
                'al-change': 'field.update(field)'
            },
            html: {
                tag: '<option/>',
                attrs: {
                    'al-repeat': 'val in [true, false]',
                    value: '{< val >}', text: '{< val >}'
                }
            }
        }
    }

    return {
        funcs: funcs
    }
})
