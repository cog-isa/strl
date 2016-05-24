// old /static/js/lib/_alight.debug.js
// new /static/js/lib/alight_0.8.last.debug.js

var magicField = '__walkJS__modificationFlag'

define(["/static/libs/js/lib/alight.debug.js"], function(_al){
		if(!alight)
			alight = _al;
		
		// helper function clone http://stackoverflow.com/questions/1833588/javascript-clone-a-function
		Function.prototype.clone = function() {
			var that = this;
			var temp = function temporary() { return that.apply(this, arguments); };
			for(var key in this) {
				if (this.hasOwnProperty(key)) {
					temp[key] = this[key];
				}
			}
			return temp;
		};
		Array.prototype.clone = function() {
			return this.slice(0);
		};
		function cloneObj(obj) {
			if (null == obj || "object" != typeof obj) return obj;
			var copy = obj.constructor();
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = cloneObj(obj[attr]);
			}
			return copy;
		}
		
		// define GLOBAL
		ap = {};
		ap.walk = {};
		ap.walk.jslabels = {
			objid :{
				classname :function(o){
					var a = $(o).attr('objid');
					return a.split('_')[0];
				}, 
				id : function(o){
					var a = $(o).attr('objid');
					return a.split('_')[1];
				}
			}
		}
		ap.fn = {};
		ap.jsdesc ={ /*classname:{
									fields:{
										fileld1 : {},
										fileld2 : {},
									},
									methods: {
										my_method2:{
											code: function(aasxasx){asasas}, ] 
											event:'method2',
											params:[ 'eventField1', 'eventField2' ],
											result: 'eventFieldResult'
										},
                           }" 
			                     }*/ };
		ap.walk.jsobjects = {/*list: []*/};
		ap.walk.class = {/*classname: { id: { list: [], obj: {original} } }*/};
		
		// DEPRECATED
		ap.walk.walkJS = function( o, isNeedRefreshFields ){
			if(isNeedRefreshFields==undefined) isNeedRefreshFields=true;
			
			if(typeof(o)=='string' || typeof(o)=='boolean' || typeof(o)=='number' || o==null || o===undefined ) return ;
			var queueForModification = [];
			if(alight.f$.isObject(o)){
				// есть ли о у него метка ? 
				for(var label in ap.walk.jslabels){
					if(o.hasOwnProperty(label)){
						// наш объект , есть ли он в реестре  ? 
						//var value = o[label];
						var cname = ap.walk.jslabels[label].classname(o);
						var id    = ap.walk.jslabels[label].id(o);
						
						if(!(cname in ap.walk.class)) ap.walk.class[cname] = {};
						
						if(!(id in ap.walk.class[cname])){
							ap.walk.class[cname][id] = { /*list: []*/ }; // см ниже
						}
						// TODO наверное не нужно хранить все прокси объекты, иначе их сборщик мусора никогда не соберет
						/*
						var objlist = ap.walk.class[cname][id].list;
						var inlist = false;
						for(var i in objlist){
							if(objlist[i]===o){
								inlist = true;
								break;
							}
						}
						if(!inlist){
							ap.walk.class[cname][id].list.push(o)
							// раз уж он не в реестре то видимо он не обернут по описанию своего типа  
							queueForModification.push({o:o, cname:cname, id:id})
							//ap.walk.replaceFildsByDesc(o);
						}
						*/
						// проверим факт модификации по другому, нужно просто прокси пометить внутри каким-то полем "магическим ключем"
						if( !o.hasOwnProperty(magicField) ){
							queueForModification.push({o:o, cname:cname, id:id});
							o[magicField] = true;
						}
					}
				}
				// обойдем все поля в этом объекте
				for(var name in o){
					var v = o[name];
					ap.walk.walkJS(v);
				}
				// модифицируем все, что в очереди
				for(var i in queueForModification){
					ap.walk.replaceFildsByDesc(queueForModification[i].o, queueForModification[i].cname, queueForModification[i].id, isNeedRefreshFields);
				}
			}// isObject
			if(alight.f$.isArray(o)){
				// пройдемся по итемам
				for(var i in o){
					var v = o[i];
					ap.walk.walkJS(v);
				}
			}
		}
		// DEPRECATED
		ap.walk.setField = function(classname, id, field, value){
			ap.walk.class[classname][id][field] = value;
		}
		// DEPRECATED
		ap.walk.replaceFildsByDesc = function(o, cname, id, needReplace) {
			//needReplace = needReplace || true;
			if(!(cname in ap.jsdesc)) // нет информации и типе - уходим
				return ; 
				
			if(!ap.walk.class[cname][id].hasOwnProperty('obj')){
				var mcopy = {};
				ap.walk.class[cname][id].obj = mcopy;
				// сделаем ГЛАВНАЯ КОПИЯ, заполним полями и методами
				if(ap.jsdesc[cname].hasOwnProperty('fields'))
					for(var name in ap.jsdesc[cname].fields){
						// todo заполнять по уму: значения по умолчанию или из объекта
						//mcopy[name] = ''; 
						// мы делаем прокси объект из чего-то, 
						if(o[name] && needReplace)
							mcopy[name] = o[name];// в объекте поле есть и надо значения брать в главную копию
						else{
							// у разных объектов свойства-объекты должны быть разные
							// пишем в главную копию значение по умолчанию. 
							if(typeof(ap.jsdesc[cname].fields[name])=='object' && ap.jsdesc[cname].fields[name] && ap.jsdesc[cname].fields[name].constructor.name=='Array')
								mcopy[name] = ap.jsdesc[cname].fields[name].clone(); // массив
							else if(typeof(ap.jsdesc[cname].fields[name])=='object')
								mcopy[name] = cloneObj(ap.jsdesc[cname].fields[name]); 
							else if(typeof(ap.jsdesc[cname].fields[name])=='function')
								mcopy[name] = ap.jsdesc[cname].fields[name].clone(); // not tested
							else 
								mcopy[name] = ap.jsdesc[cname].fields[name]; // just simple type field
						}
					}
				
				// в описании методов может быт не только поле @code@ но и другие модификаторы, они все вместе выстраиваются в цепочку, которая обрабатывает и дополняет результат
				// их общие результаты сливаются в итоговый словарь-результат
				var wrap = function(fold, fnew){ // "сейчас не используется" - это вранье
					var fold_ = fold, fnew_=fnew; // замыкания
					var wrapper = function(p1,p2,p3,p4,p5,p6,p7,p8,p9){
						var o_ = o;
						var r1 = fold_.apply(o_, [p1,p2,p3,p4,p5,p6,p7,p8,p9]) || {}; // надо возвращать объект, иначе их не слить
						var r2 = fnew_.apply(o_, [p1,p2,p3,p4,p5,p6,p7,p8,p9]) || {};
						for (var attrname in r2) { r1[attrname] = r2[attrname]; }  // слияние результатов НЕСКОЛЬКИХ расширений библиотеки
						return r1;
					}
					return wrapper;
				}
				var getMethodByName = function(cname, mname){
					return ap.jsdesc[cname].methods[mname].code; // function
				}
				if(ap.jsdesc[cname].hasOwnProperty('methods'))
					for(var name in ap.jsdesc[cname].methods){
						mcopy[name] = function(){}; 
						if(ap.jsdesc[cname].methods[name].hasOwnProperty('code')){
							var code = getMethodByName(cname,name);
							mcopy[name] = wrap(mcopy[name], code); // code // TODO wrap
						}
					}
				// сохраним полученную главную копию в реестре
				if(! ap.walk.class[cname])
					ap.walk.class[cname] = [];
				ap.walk.class[cname][id] = { obj: mcopy };
			}
			// получиме ее же , но ЯВНО, чтобы верняк
			var maincopy = ap.walk.class[cname][id].obj;
			
			// если в объекте есть значения и надо их записать - то сделаем это 
			/*for(var name in ap.jsdesc[cname].fields){
				if(o.hasOwnProperty(name)){
					maincopy[name] = o[name];
				}
			}*/				
			// переопределим в объекте поля гетерами и сетерами ПОЛЯ
			if(ap.jsdesc[cname].hasOwnProperty('fields')){
				for(var name in ap.jsdesc[cname].fields){
					var v = null;	// значение , чтобы не перезатереть
					if(o.hasOwnProperty(name))
						v=o[name];
					// сохраним свойство если в оригинале была не пустота
					if(o[name] && needReplace)
						maincopy[name] = v;
					// Гетер , но посмотрим может он там уже есть ? 
					if(! o.__lookupGetter__(name)){
						var makeit = function(){
							var name_ = name; 
							var maincopy_ = maincopy;
							o.__defineGetter__(name_, function(){
								//console.log(maincopy);
								return maincopy_[name_];
							});
						};
						makeit();
					}
					// Сеттер, а может он уже есть ...
					if(! o.__lookupSetter__(name)){
						var makeit = function(){
							var maincopy_ = maincopy;
							var name_ = name;
							o.__defineSetter__(name_, function(value){
								maincopy_[name_] = value;
							});
						}
						makeit();
					}
				}
			}
			// переопределим в объекте поля гетерами и сетерами МЕТОДЫ
			if(ap.jsdesc[cname].hasOwnProperty('methods')){
				for(var name in ap.jsdesc[cname].methods){
					//var v = null;	// значение , чтобы не перезатереть
					//if(o.hasOwnProperty(name))
					//	v=o[name];
					// Гетер , но посмотрим может он там уже есть ? // TODO wrap it
					if(! o.__lookupGetter__(name)){
						var makeit = function(){
							var maincopy_ = maincopy, name_ = name;
							o.__defineGetter__(name_, function(){
								return maincopy_[name_];
							});
						}
						makeit();
					}
					// Сеттер, а может он уже есть ...
					if(! o.__lookupSetter__(name)){
						var makeit = function(){
							var name_=name, maincopy_=maincopy;
							o.__defineSetter__(name_, function(value){
								maincopy_[name_] = value;
							});
						}
						makeit();
					}
				}
			}
		

		}//ap.walk.replaceFildsByDesc 
		// DEPRECATED
		// создает контроллер для объекта по имени класса и по ид
		ap.walk.getObject = function(classname, id){
			var obj = {};
			obj.objid=classname+'_'+id;
			ap.walk.walkJS(obj, false);
			return obj;
		}

		// DEPRECATED
		// просто дополнить инфой (для рекурсивных объектов) - 
		// НО для структур не подходит с объектами не подходит. 
		// он НЕ будет обходить структуру, а модифицирует только один объект.
		ap.walk.fixObject = function(obj, classname, id){
			
			if(!ap.walk.class.node[id])
				ap.walk.class.node[id]={};
			if(!obj.hasOwnProperty(magicField))
				ap.walk.replaceFildsByDesc(obj, classname, id, false);
			return obj
		}

		// быстрый вариант, который не протаскивает объект-результат через цепочку обработчиков
		// методы перезжают только те, которые описаны как  "code"
		//быстрее getObject в 20 раз.
		ap.walk.getObject2 = function(classname, id){
			if(!ap.walk.class[classname])
				ap.walk.class[classname] = {};
			if(!ap.walk.class[classname][id] )
				ap.walk.class[classname][id] = {};
				
			if(!ap.walk.class[classname][id].obj){
				ap.walk.class[classname][id].obj={};
				// $.extend(ap.walk.class[classname][id].obj, ap.jsdesc[classname].fields); // НЕ СРАБОТАЛ
				var mcopy = ap.walk.class[classname][id].obj;
				for(var name in ap.jsdesc[classname].fields){
							var cname = classname;
							if(typeof(ap.jsdesc[cname].fields[name])=='object' && ap.jsdesc[cname].fields[name] && ap.jsdesc[cname].fields[name].constructor.name=='Array')
								mcopy[name] = ap.jsdesc[cname].fields[name].clone(); // массив
							else if(typeof(ap.jsdesc[cname].fields[name])=='object')
								mcopy[name] = cloneObj(ap.jsdesc[cname].fields[name]); 
							else if(typeof(ap.jsdesc[cname].fields[name])=='function')
								mcopy[name] = ap.jsdesc[cname].fields[name].clone(); // not tested
							else 
								mcopy[name] = ap.jsdesc[cname].fields[name]; // just simple type field
				}
			}
			var base  = ap.walk.class[classname][id].obj;
			if(!base.hasOwnProperty(magicField)){
				for(var methodName in ap.jsdesc[classname].methods){
					var m = ap.jsdesc[classname].methods[methodName];
					base[methodName] = m.code.clone();
				}
				base.objid = classname+'_'+id; // чтобы работал метод getid
				base[magicField] = true;
			}
			return base;
		}

		// нативно дополнить объект dst всеми полями из объекта src
		// rewriteIfExist by default true
		ap.walk.extend = function( dst, src, rewriteIfExist ){
			rewriteIfExist = rewriteIfExist || true;
			for(var k in src){
				if(rewriteIfExist && dst.hasOwnProperty(k))
					dst[k] = src[k];
			}
		}
		//////////////////////////  directives    //////////////////
		alight.directives.ap = {};
		
		// зависимости 
		// http://tarruda.github.com/bootstrap-datetimepicker/assets/css/bootstrap-datetimepicker.min.css
		// http://tarruda.github.com/bootstrap-datetimepicker/assets/js/bootstrap-datetimepicker.min.js
		// usage <div al-datetime="somescopesubfield" data-datetime-callback="somesomescopefield()"></div>
		var datetime_tpl = '<div class="input-append date">\n<input type="text"></input>\n<span class="add-on">\n  <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>\n</span>\n</div>';
		alight.directives.ap.datetime = function(element, name, scope) {
			var callback = $(element).attr('data-datetime-callback');
			var el = $(datetime_tpl);		// TODO добавить прослушку аттрибутов 
			$(element).append(el);
			var applying = false;
			el.datetimepicker({ format: 'dd/MM/yyyy hh:mm:ss' });
			el.on('changeDate', function(e) {
				applying = true;
				scope.$setValue(name, e.localDate)
				scope.$scan(function() {
					applying = false;
					if(callback)
						scope.$eval(callback)
				})
				
			});
			var picker = el.data('datetimepicker');
			var setter = function(value) {
				if(applying) return;
				
				picker.setLocalDate();	// reset
				if( value!='' )
					picker.setLocalDate( new Date(value) );
			}
			w = scope.$watch(name, setter);
			setter(w.value)
			return { owner:true }
		};
		
		// аттрибут будет если выполнится условие, пример ap-optionalAttr="disabled:!connected"
		alight.directives.ap.optionalattr = function(element, cfg, scope) {
			var attrs=cfg.split(',');
			for(var ai in attrs){
				var a = attrs[ai];
				var tmp=a.split(':');
				scope.$watch(tmp[1],function(v){
					if(v)
						$(element).attr(tmp[0], v.toString() );
					else
						$(element).removeAttr(tmp[0]);
				}, {init:true, readOnly:true} );
			}
		}
		
		/*
		 * TODO ap-window="{isOpen:scopevar}"
		 * 
		 */
		alight.directives.ap.window = function(element, cfg, scope){
			cfg = JSON.parse(cfg);
			var isOpenName = cfg.isOpen;
			var title = cfg.title || '';
			var dialog = $( element ).dialog({
			  autoOpen: false,
			  title: title, 
			  height: 'auto',
			  width: 'auto',
			  modal: true,
			  /*buttons: {
				"OK": function(){
				},
				Cancel: function() {
				  dialog.dialog( "close" );
				}
			  }, */
			  close: function() {
				//form[ 0 ].reset();
				//allFields.removeClass( "ui-state-error" );
				scope.$setValue(isOpenName, false );
				scope.$scan();
			  }, 
			  open:function(){
				  scope.$setValue(isOpenName, true );
				  scope.$scan();
			  },
			});
			scope.$watch(isOpenName, function(v){
				if(v)
					dialog.dialog('open');
				else
					dialog.dialog('close');
			});
		};
		/*
		 * ap-jeditable="{value:'server.address', callback: on_server_edit_address }"  -- real example
		 * 		where 	callback : // type = function(enteredText) -> some
		 * 				value  : "some position" in scope // type = STRING
		 * attr value принимает установленное значение до вызова callback
		 *
		 * dependency
		 * 	<!--  jeditable -->
		 *	<script src="js/lib/jquery.jeditable.mini.js"></script>
		 *
		 * https://github.com/tuupola/jquery_jeditable/tree/master
		 * http://www.appelsiini.net/projects/jeditable
		 *
		 * сделать через x-editable мне все время мешала
		 * 1) обработка событий клика внутри этой либы,
		 * 		почему то конфликтует с al-click
		 * 2) отрисовка странная у компонента была - не как на картинке
		 * 3) $(el).editable - одинаковый метод у всех библиотек -
		 * 		они мешают друг другу
		 * 4) трудно заставить работать без отсыла ajax, хотят чтобы
		 * 		в url была функция возвращающая jquery Deferred...
		 * 5) сильно интегрирована с jquery ui, bootstrap2, bootstrap3
		 * 		и плагинами к ним - но все же ХОЧЕТСЯ Е ПОПРОБОВАТЬ - позже
		 *
		 * пробовал google edit in place - тоже не очень штуковина,
		 * в прошлый раз я ее использовал в проекте
		 * @Каталог кондиционеров@ - были проблемы и глюки
		 *
		 * */
		alight.directives.ap.jeditable = function(element, cfg, scope){
			cfg = scope.$compile(cfg)();
			var f;
			if(! cfg.callback)
				cfg.callback=function(){};
			var _callback = function(vv){
				$(element).attr('value', vv);
				cfg.callback(vv);
			}
			$(element).editable(function(value, settings) {
					console.log(this);
					console.log(value);
					console.log(settings);
					//cfg.callback(value);
					_callback(value);
					if(cfg.value){
						scope.$setValue(cfg.value, value);
						scope.$scan();
					};

					return(value);
				}, {
					type    : 'text',
					submit  : 'OK',
				}
			);
			/*
			$(element).editable({
				type: 'text', // Can be text|textarea|select|date|checklist and more
				title: 'Enter value',
				mode: 'inline', // popup | inline
				pk:'1',
				
				value: scope.$getValue(cfg.value),
				url: function( params ){

					var deferredObj = new $.Deferred();

					function save(callback) {
						//alert('saved, yo.');
						setTimeout(callback, 1000);
					}

					save(function() {
						//alert('resolved, yo.');
						deferredObj.resolve();
					});

					
					//
					cfg.callback(params.value);
					if(cfg.value){
						scope.$setValue(cfg.value, params.value);
						scope.$scan();
						//$(element).editable('setValue',params.value);
					}
					//

					//return deferredObj.promise();
					return true;

				}
			});
			*/
			
			/*  оно же но проще
			$(element).editable({
				url:  function(params){
					console.log('params', params)
				},
				pk: 1, 
				name: 'field',   
				title: 'Enter value'
			});
			* */
			
			
			/*
			$(element).editInPlace({
				callback: 	function(unused, enteredText) { 
								f(enteredText);
								if(cfg.value)
									scope.$setValue(cfg.value, enteredText);
								return enteredText; 
							},
				 url: "#",
				//field_type: "select",
				//select_options: "Change me to this, No way:no"
			});
			* */
		}
		
		// позволяет событиям проходить внутрь элемента а не останавливает их на конкретном элементе
		// быват нужно когда кнопка внутри строки которую щелчком можно выделить - чтобы шелчок по кнопке доходил до нее. а не выделял строку, например
		alight.directives.ap.click=function (element, name, scope) {
			var callback = scope.$compile(name, { no_return: true });
			var doCallback = function(e) {
			  //e.preventDefault();				// пропустим события до блока внутрь
			  //e.stopPropagation();			// по сути тоже, я просто не знаю на хзахват или всплытие внутри ставят листенер
			  if (f$.attr(element, 'disabled')) {
				return;
			  }
			  callback();
			  return scope.$scan();
			}
			f$.on(element, 'click', doCallback);
		};
		
			/* список строк, комбобокс, с выбиралкой 
			 * 
			пример использования "вслепую"
			  <select ap-select="dpp">
			  </select>
			пример использования "кастом"
			  <select ap-select="dpp">
				<option> бла бла бла{{_val}}</option>
			  </select>
			  при выборе опции меняется поле контекста "<name>_selected"
			 */
			alight.directives.ap.select = function(e, name, scope){
				var list=scope.$getValue(name);
				var sc = scope.$new();
				sc._vals=[];
				var oc = $(e).find('option')[0];
				if(oc){
					$(oc).attr('al-repeat', "_val in _vals");
				}else{
					$(e).append('<option al-repeat="_val in _vals">{{_val}}</option>');
					//oc = $(e).find('option')[0];
				}
				//$(e).empty();
				alight.applyBindings(sc, e, {skip_top:true} )
				scope.$watch(name, function(newlist){
					sc._vals = newlist;
					setTimeout(function(){ sc.$scan(); }, 0);
					
					/*
					$(e).empty();
					for(var i in newlist){
						var v = newlist[i];
						$(e).append('<option>'+v+'</option>');
					}
					*/
				}, { isArray:true, init:true} );
				$(e).on('change', function(e){
					scope.$setValue(name+'_selected', e.target.value);
					setTimeout(function(){scope.$scan();}, 0);
				})
			}

			/* reapeat не через watchText, а через иную хрень, чтобы не было infinite loop
			 * пример : ap-repeat="internalVar in listVar"
			 * важно, чтобы разделялось ОДНИМ ПРОБЕЛОМ = ONE SPACE
			 * НЕ ДОПИСАНО
			 * */
			alight.directives.ap.repeat = function(e, name, scope){
				var sc = scope.$new();

				var n    = name.split(' ')[0];
				//var _in  = name.split(' ')[1];
				var list = name.split(' ')[2];
				var list=scope.$getValue(list);
				sc[n]=list;
				
				var childrens = $(e).children();
				/*
				if(oc){
					$(oc).attr('al-repeat', "_val in _vals");
				}else{
					$(e).append('<option al-repeat="_val in _vals">{{_val}}</option>');
					//oc = $(e).find('option')[0];
				}
				*/
				
				alight.applyBindings(sc, e, {skip_top:true} )
				scope.$watch(list, function(newlist){
					sc[name] = newlist;
					setTimeout(function(){ sc.$scan(); }, 0);
					
					/*
					$(e).empty();
					for(var i in newlist){
						var v = newlist[i];
						$(e).append('<option>'+v+'</option>');
					}
					*/
				}, { isArray:true, init:true} );
				$(e).on('change', function(e){
					scope.$setValue(name+'_selected', e.target.value);
					setTimeout(function(){scope.$scan();}, 0);
				})
			}		
		
	return ap;
		
		// test 
		/*
		a = [{objid:'update_3', name:'Обновление 3', 
					servers:[
							{objid:'server_1', name:'Сервер1', address:'127.0.0.1:8881'},
							{objid:'server_1', name:'Сервер1', address:'127.0.0.1:8881'}
						]
				}, 
			 {objid:'update_3', name:'Обновление 4'}
			];
		ap.walk.walkJS(a);
		*/
});
