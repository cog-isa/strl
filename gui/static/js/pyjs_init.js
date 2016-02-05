$pyjs = {};
$pyjs['loaded_modules'] = {};

// init the python js application

var $wnd = parent;
var $doc = $wnd['document'];
var $moduleName = "mindmap";
var $pyjs = new Object();
var $p = null, pyjslib, sys;
$pyjs['global_namespace'] = this;
$pyjs['__modules__'] = {};
$pyjs['loaded_modules'] = {};
$pyjs['options'] = new Object();
$pyjs['options']['arg_ignore'] = false;
$pyjs['options']['arg_count'] = false;
$pyjs['options']['arg_is_instance'] = false;
$pyjs['options']['arg_instance_type'] = false;
$pyjs['options']['arg_kwarg_dup'] = false;
$pyjs['options']['arg_kwarg_unexpected_keyword'] = false;
$pyjs['options']['arg_kwarg_multiple_values'] = false;
$pyjs['options']['dynamic_loading'] = false;
$pyjs['trackstack'] = [];
$pyjs['track'] = {'module':'__main__', 'lineno': 1};
$pyjs['trackstack']['push']($pyjs['track']);
$pyjs['__active_exception_stack__'] = null;
$pyjs['__last_exception_stack__'] = null;
$pyjs['__last_exception__'] = null;
$pyjs['in_try_except'] = 0;

/*
 * prepare app system vars
 */
$pyjs['platform'] = 'safari';
$pyjs['appname'] = 'mindmap';
$pyjs['loadpath'] = './';

// For google closure compiler:
window['$wnd'] = $wnd;
window['$doc'] = $doc;
window['$pyjs'] = $pyjs;
