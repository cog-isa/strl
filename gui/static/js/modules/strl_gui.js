
/*
 * будем использовать только getObject2, extend и только быстрые функции
 * не будем использовать все где getters setters типа getObject, walkJS
 * */

define( [ 	"/static/js/lib/aplib.js" , "/static/js/modules/helpers.js", "/static/js/lib/finchjs/finch.js", 
			"/static/js/modules/planarizator.js"
		],  
		function( _aplib, _helpers, _finch, plnr ){

        // global dpi
        dpi = {
            v: 0,
            get: function (noCache) {
                if (noCache || dpi.v == 0) {
                    e = document.body.appendChild(document.createElement('DIV'));
                    e.style.width = '1in';
                    e.style.padding = '0';
                    dpi.v = e.offsetWidth;
                    e.parentNode.removeChild(e);
                }
                return dpi.v;
            }
        }
        dpi.get(true);

	/*class Object(Modeling) - python
	
	fields:{
		id:
		type_obj:
		props_obj:
		pos:
	}
	
	methods: {
		get_pos:{todo}
		delete:{todo}
	}
	*/		
		
	////////////////////////////////// setup our class ( aplib )
	ap.jsdesc['node'] = {
		fields:{
			// мы задаём
			id: "rnd1",
			parent: "root",
			childs: Array[2], // ids
			width: 1, //размер отображаемой картинки
			height: 0.25,
			isCollapsed: false,
			isLeft: false,
			
			// расчитаются планаризатором ..хз что
			left: 1,
			top: 1,
			isVisible: true,
			
			childs:[],
 
			// logic part
			icons: 	[
						{hint:'Агент', 			img:'/static/img/rob1.png'}, 
					],
			//parentnode: '', // ид родителя, ПОКА нужен для перетаскивания узлов - TODO сделать через метод
			
			properties: { // title, color, ... другие прочие свойства
					color:'white',
					testProp: 'somevalue' 
			}, 
			actions: ['В закладки'], 
			
			// view part
			opened: false, 
			element: null, // СТАРОЕ, используется в методе _resize, устанавливается в директиве alight.directives.sup.node
			svgpath: null, 
			
		},
		methods:{
			// ID узла получать только ТАК. это позволит раньше выявить ошибки с AP метками объектов
			_getid:{
				code : function(){
					//return { getid: ap.walk.jslabels.objid.id(this) }
					return { _getid: this.__id }; 
				}
			},
			
			/*
			// когда юзер изменил размер узла самостоятельно
			_setrect:{
				code: function(rect){
					this.width = rect[2]; 
					this.height = rect[3];
				}
			}, 
			*/
			// получить rect, лучше бы эти данные кэшировать
			_getrect: {
				code:function(){
					return { _getrect: [this.left, this.top, this.width, this.height] };
				}
			},
			// только устанавливает ТЕКУЩИЕ РАЗМЕРЫ чтобы подвинуть соседей,  они УЖЕ должны быть применены/установлены, 
			//сначала применяем ($scan) - затем пододвигаем соседей через этот метод
			_resize:{
				code:function(width, height){
					if(this.element){
						//console.log("_resize2");
						this.left =  $(this.element).position().left/dpi.get(false);
						this.top =  $(this.element).position().top/dpi.get(false);
						this.width = $(this.element).width()/dpi.get(false);
						this.height = $(this.element).height()/dpi.get(false);
						
						plnr.updatePositions(S.nodes, S.rootId);
						S.$scan();
					}else{
						console.log("_resize3");
					}
					
					// сообщим новые размеры на сервер
					/*
					var node = this;
					S.supajax( 	'resizeNode', 
								history.state.map, 
								S.userid, 
								node.getid().getid,
								function(){
									// ! updateAllEdgeOnNode(node.getid().getid);
									// S.$scan();
								}, 
								[width, height]
					);
					*/

					
				}
			}, 
			/*
			// вызывают, чтобы распахнуть узел $scan (вызывается из sup-node директивы , прослушка DOM on click)
			_expand: {
				code: function(){
					
					
					this.isCollapsed = false;
					plnr.updatePositions(S.nodes, S.rootId);
					S.$scan();
				}
			}, 
			
			
			// схлапывает узел $scan
			_collapse: {
				code: function(){

					this.isCollapsed =  true; // todo remove т.к. mmservice деллает это же
					plnr.updatePositions(S.nodes, S.rootId);
					S.$scan();
				}
			}, 
			*/
			
			// закрыть/скрыть список свойств 2x$scan
			_close:{
				code: function(){
					/*
					this.opened = false;
					S.$scan();
					this.resize();  // т.к. закрылись, надо пересчитать размеры и другие узлы подвинуть
					// ! updateAllEdgeOnNode(this.getid().getid);
					*/
					this.opened = false;
					S.$scan(); // покажем уменьшенный узел - теперь у него размеры меньше
					// скажем mmdbjs новые свои размеры
					this._resize(); // переасчитаем координаты в зависимости от его нового размера
					S.$scan();
					//S.$scan(); // todo костыль... из за watch,я не знаю где не нашел пока 
				}	
			}, 
			
			// открыть/показать список свойств 2x$scan
			_open: {
				code: function(){
					/*
					S.supajax( 	'openNode', // получение свойств
								history.state.map, 
								S.userid, 
								this.getid().getid,
								function(data){
								}
					);
					*/
					// TODO возможно надо пометить как-то что в этом узле идет сейчас подгрузка свойств
					
					this.opened = true;// откроем те свойства которые уже имеются.
					S.$scan(); // покажем увеличенный открытый узел - теперь у него размеры больше
					// скажем mmdbjs новые свои размеры
					this._resize(); // переасчитаем координаты в зависимости от его нового размера
					S.$scan(); // покажемв новых координатах
					//S.$scan(); // todo костыль... из за watch
				}
			},
			// произишел выбор этого узла, тычком мыши
			_select: {
				code: function(){
					var nodeid = this.id;
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, /*doUpdate*/true ); // #mindmap
					
					// пометим в главном S что выбрали этого !!! - плохая связь с контекстом.
					S.selectednode = this;
					// скроем инфу
					hideInfoBlocks();
					// S.$scan() // сам делается внутри обработчика тычка мыши, не фиг тут делать скан
				}
			}, 
			// установить свойство $scan
			_setProperty:{
				code: function(n,v){
					this.properties[n]=v;
					S.$scan();
					// todo отправить новое свойство на сервак
				}
			}, 
			_getTitle:{
				code:function(){
					return {_getTitle: this._getProperty('title')};
				}
			},
			_setTitle : {
				code: function(a,b,c,d,e){
					console.log(a,b,c,d,e);
				}
			},
			// получить свойство
			_getProperty: {
				code:function(n){
					return {_getProperty:this.properties[n]};
				}
			},
			// списиок ИМЕН всех свойств, кроме свойств исключений (для показа в списке сойств узле) + EDGES
			_allPropertyes:{
				code:function(){
					

					var props = Object.keys(this.properties);
					// удалим исключения
					/* todo сделать через clone и for in Или filter
					for(var i = props.length - 1; i >= 0; i--) {
						if( props[i] === 'title' ) { // props[i] === 'color' || 
						   props.splice(i, 1);
						}
					}*/
					
					return { allPropertyes: props };
				}
			},

			// вызывается в alight.directives.sup.path для отображения пути к родителю
			
			//за этими данными происходит $watch
			// TODO она вызывает ТОРМОЗА, ЕСЛИ сделать $watch результатов этой функции ... надо КЭШИРОВАТЬ	
		}
	}
	//ap.walk.class.node = {};	 // todo remove
	
	/////////////////////////// HELP FUNCTIONS
	// инициализация узла в браузере
	var positions = {};
	// сама инициализация
	
	
	
	//STRL - убрать таскание!!
	// задавать будем только позицию компонента и туда вставлять //
	
	function initNode(nodeelement, node){ // todo перенести в контекст вызова
		$(nodeelement).tooltip();
		/*********************************   перетаскивание узлов ************************/
		$(nodeelement).draggable({
				handle:'.nodetitle',
				// helper: 'clone',
				opacity: 0.5,
				//grid : [30, 30],
				start: function(event, ui){
					var childNodes = $('[parentnode="'+$(event.target).attr('id')+'"]'); // TODO надо таскать все чилдовые узлы
					positions = {};
					childNodes.map( function(key, c){
						var k= $(c).attr('id');
						positions[k] = {};
						positions[k].drg_h = $(c).outerHeight();
						positions[k].drg_w = $(c).outerWidth();
						positions[k].pos_y = $(c).offset().top + positions[k].drg_h - event.pageY;
						positions[k].pos_x = $(c).offset().left + positions[k].drg_w - event.pageX;
					} );
				},
				stop: function(event, ui){
					positions = {};
					console.log('drop node on position=', ui.position );
					// запустим событие в DOM - там его ждут
					//var iposition = {left:ui.position.left / dpi.get(false), top:ui.position.top/ dpi.get(false)}
					var iposition = {   left:   $(event.target).position().left / dpi.get(false),
										top:    $(event.target).position().top / dpi.get(false)
										};
					var e = new CustomEvent(
						"dragstop",{
							detail: {position:iposition},
							bubbles: true,
							cancelable: false,
					});
					this.dispatchEvent(e);
				},
				drag: function(event, ui){
					var id = $(event.target).attr('id');
					// ! updateEdgeOnNode(id);
					// найдем наши чилды, чтобы перерисовать линии
					var childNodes = $('[parentnode="'+$(event.target).attr('id')+'"]');
					for( child in positions){
						// ! updateEdgeOnNode(child);
						$('#'+child).offset({
							top:event.pageY + positions[child].pos_y - positions[child].drg_h,
							left:event.pageX + positions[child].pos_x - positions[child].drg_w
						});
					}
				},
		});	

		// сделаем title редактируемым
		// TODO сделать инициализацию Input значеним при показе а то пустое
		var te = $(nodeelement).find('.nodetitle');
		te.editable({
		   type:  'text',
		   send:'never',
		   //pk:    1,
		   //url:   '/fakePostEB',  
		   
		   name:  'title',
		   title: 'Enter new Title',
		   placement: 'right',
		   //enablefocus:true
		});
		te.on('update', function(e, editable) {
			//alert('new value: ' + editable.value);
			$('#workarea').focus();
		});
		node.te = te;
	};	
	
	///////////////////////////////////// directives
	alight.directives.sup={};
	alight.directives.sup.node = function(e, value, scope){
		// INFO ? т.к. al-repeat = "node in nodes" => node
		var KEY = value || 'node';
		//var node=scope.$getValue(KEY); 
		var node=scope.$parent.nodes[scope.nodeid];
		initNode(e, node); //настраиваем пеертаскивание узла итд
		// сохраним в модели элемент  узла - связжем DOM в модель (чтобы в resize узнавать СВОЙ реальный размер)
		node.element = e; 
		// прослушаем всякое от  элемента (сворачивание/разворачивание, например)
		var expandbutton = $(e).find('.nodehandle_collapse_expand');
		expandbutton.on('click', function(){
			if(!node.isCollapsed ){
				node._collapse();
			}else{
				node._expand();
			}
			return false;
		});	
		// открытие/закрытие
		var openbutton = $(e).find('.nodehandle_close_open');
		openbutton.on('click', function(){
			if(node.opened)
				node._close();
			else
				node._open();
			return false;
		});	
		
		/*
		// изменение размеров узла
		$(e).resizable({ 
			handles : 'e',
			//grid: 30,
			'start': function( event, ui ){
			},
			'stop': function(event, ui){
				// надо запустить этот код после небольшой задержки
				// когда реально изменится не только ширина но и высота по содержимому
				var f = function(){
					// установитьразмер который выбрал чувак таская "углы/маркеры"
					//node._resize( $(event.target).width()/dpi.get(false), $(event.target).height()/dpi.get(false) );
					$(e).width( $(event.target).width() );
					$(e).height( $(event.target).height() );
					node._resize(  );
					node._select(); // выделить тенью
					scope.$scan();
				};
				//setTimeout(f, 1);
				f();
			},
		});
		*/
		
		// показ информации
		var needShow = false;
		var infoBlockClicked = false;
		var showInfoBlock = function(){
			$(e).find('.info_block').show();	
		};
		
		// скрыть все инфо блоки
		/*var  глобальная функция вызовется везде*/
		hideInfoBlocks = function(){
			needShow = false;
			infoBlockClicked = false;
			
			$('.info_block').hide();	
		};
		
		// при тычке либо показать либо скрыть, по ситуации, 
		// не выделять узел (stopPropagation), т.к. при выделении узла скрываются инфо блоки
		$(e).find('.info_circle').click(function(evt){
			if(!infoBlockClicked){
				infoBlockClicked = true;
				
				//$(e).find('.info_block .focus_button').focus();
				showInfoBlock();
			}else
				hideInfoBlocks();
			
			evt.stopPropagation();
		});
		
		/*
		// показать при наведении на кружок всплывашку, убрать если по кружку не тыкали
		$(e).find('.info_circle').hover( 
			function(){
				needShow = true;
				setTimeout(function(){
					if(needShow)// если еще не покинута зона i
						showInfoBlock();
				}, 500);
			}
		,
			function(){
				needShow = false;
				
				if(! infoBlockClicked)
					hideInfoBlocks();
			}
		);
		
		// закомментированная часть
		$(e).find('.info_block .focus_button').focusout(function(){
			infoBlockClicked =false;
			hideInfoBlocks();
		});
		*/
		
		
		
		// <br/><img src="/static/img/glyphicons_free/glyphicons/png/glyphicons_445_floppy_remove.png" /></img>
		/*
		var tipapi = $(e).find('.info_circle').simpletip();
		// Perform a simple API call to update tooltip contents
		tipapi.update('New tooltip content!');
		tipapi.show();
		*/
		
		// for debug
		/*$(e).find('.info_circle').on('mousemove', function(){
			console.log('drawinfo');
		});*/
	}
	alight.directives.sup.path=function(e,name,scope){
		var node=scope.$parent.nodes[ scope[name] ];
		// ТУТ ТОРМОЗА, следить за результатами тяжелой функции - ДОРОГО, надо кешировать
		
		//scope.$watch(name+'._edgeCoord()._edgeCoord', function(c){
			//if(c[0]){
				//var v='M'+c[0]+','+c[1];
				//v+='C'+c[2]+','+c[3]+',';
				//v+=c[4]+','+c[5]+',';
				//v+=c[6]+','+c[7] ;
				//$(e).attr('d', v);
				//$(e).attr('visibility', 'visible');
				
				//$('svg').attr('width' ,(scope.nodes.reduce(function(prev, node){ return Math.max(prev, node.getRect().getRect[0]/*left*/)}, -1) +20)*dpi.get(false) );
				//$('svg').attr('height',(scope.nodes.reduce(function(prev, node){ return Math.max(prev, node.getRect().getRect[1]/*top*/)}, -1) +20)*dpi.get(false) );
			//}else{
				//$(e).attr('d', 'M0,0');
				//$(e).attr('visibility', 'hidden')
			//}
		//}, {readOnly : true, isArray : true, deep:true, init:true});
		node.svgpath = e;
		
	}

	return  {
		tree7app : function (scope){
							
				scope.mapid = 'MAPID', // ! not binded
				scope.userid = 'USERID', // ! need read logined user id? now not used
				scope.scale = 1;
				scope.viewPort = [ ]; 	// inches x,y,w,h
				
				scope.nodes = { };
				scope.helper = {
					nodesIDs : function(){
						return Object.keys(scope.nodes);
					},
					propNames : function(node){
						return Object.keys(node.properties);
					}
				}
				
				
				
				// add root
				scope.rootId = 'root';
				var r = ap.walk.getObject2('node', scope.rootId);
				r.id = scope.rootId;
				r.parent = undefined;
				scope.nodes[r.id] = r;
				
				// выбираем первыйузел в списке или ничто
				scope.selectednode = scope.rootNode;
				
				scope.newNode = function(parentNode, indexBefore){
					// todo send to server
					var id = guid();
					var n = ap.walk.getObject2('node', id);
					n.id = id;
					n.parent = parentNode.id;
					
					//parentNode.childs.splice(indexBefore, 0, id);
					
					scope.nodes[id] = n;
					
					plnr.updatePositions(scope.nodes, scope.rootId);
					scope.$scan(); // такой узел появился
					setTimeout(function(){
						n._resize();// подвинули соседей
						scope.$scan(); // такой узел появился
					},0);
					
				}
				
				/*
				 * 	**********функции - методы контекста *****************
				 */
				// функция работает с контекстом, она меняет модель в зависимости от ответа с сервера
				scope.handlesupajaxresponse = function (data){
					var nodeinnodes = function(nodeid){
						for(var ni in scope.nodes){
							if(scope.nodes[ni]._getid()._getid==nodeid)
								return true;
						}
						return false;
					}
					
					for(var i=0; i<data.length; ++i){
						var c=data[i];
						switch(c.command){
							case 'setViewPort': {
									scope.viewPort.left = c.x;
									scope.viewPort.top = c.y;
									scope.viewPort.width = c.w;
									scope.viewPort.height = c.h;
									break;
								} 
							case 'newNodeCoord': {
									var n=ap.walk.getObject('node', c.nodeid);
									//ap.walk.walkJS(n);
									n.parentnode = c.parent;
									n.setRect(c.rect);
									n.isleft = c.isleft;
									
									if( ! n.getProperty('title').getProperty )
										n.setProperty('title', 'заголовок '+n._getid()._getid);
									//n.icons = '<>';
									
									if( ! nodeinnodes(c.nodeid) ){
										///scope.nodes.push(n)
										// т.к. узел еще не в модели возможно его позиция не корректна, 
										// сообщим о его реальных  размерах на сервер
										//scope.$scan();
										//n._resize(); // TODO можно пересчитать все узлы после обработки всей пачки комманд.
									}
									break;
								}
							case 'setTargetNode':{
									ap.walk.getObject('node', c.nodeid)._select();
									//scope.selectednode = ap.walk.getObject('node', c.nodeid);
									break;
								} 
							/*	переделать
							case 'nodeInvisible':{
									// уберем его из списка узлов
									for(var i in scope.nodes){
										var n = scope.nodes[i];
										if(n._getid()._getid==c.nodeid){
											///scope.nodes.splice(i,1);
											break;
										}
									}
									// сотрем информацию про него TODO
									//delete ap.walk.class.node[c.nodeid]
								}
								*/
							case 'openNode':{
									// ответ от сервера пришел со свойствами, давай их заполним
									var node = ap.walk.getObject('node', c.nodeid);
									for(var k in c.properties)
										if(k!='command')
											node.setProperty(k,c.properties[k]);										
									// TODO
									// updateAllEdgeOnNode(this._getid()._getid);
									// поправим отображение, могут изменится размеры
									
									S.$scan();
									// отошлем новые размеры на сервер, может что-то еще подвинется
									node._resize();
									break
								}
							default: 
						};
					}
					
					// получили новые данные, поправили модель - обновим GUI
					scope.$scan(); 
				}

				/* функция посылает запросы на сервер от узлов, если в узле случилось что-то важное */
				var requeue = [];
				var isRequestNow = false;
				// todo rewrite
				scope.supajax = function( command, mapid, userid, nodeid, callback/*function*/, data /*array - прочие данные*/){
					if(!data ) data={};
					requeue.push({command:command, mapid:mapid, userid:userid, nodeid:nodeid, data:data});
					if(!isRequestNow){
						isRequestNow = true;
						$.ajax( '/supajax', {
							type:'post',
							contentType: "application/json; charset=utf-8",
							data: JSON.stringify(requeue), 
							success: function(data){
								isRequestNow = false;
								requeue = [];
								var command_array = data != "" ? $.parseJSON(data) : [];
								scope.handlesupajaxresponse(command_array);
							}, 
							error: function(){
								isRequestNow = false;
							}
						});

						
					}
					
					/*
					var d={	commands: command, mapid:mapid, userid:userid, nodeid: nodeid };
					// data[i0], data[i1], data[i2] итд это элементы массива., $.ajax плохо кодирует параметры, т.к. POST
					for(var i=0; i<data.length; ++i)
						d['i'+i]=data[i];
					$.getJSON('/supajax',d, 
						function(data){
							if(callback){
								callback(data);
							};
							var command_array = JSON.parse(data);
							scope.handlesupajaxresponse(command_array);
						}
					);
					*/
				}

				/*скрипт для выбора карты*/
				scope.selectMap = function( mapid ){
					
					/*
					var newsearch=insertParam('map', mapid);
					var state = history.state;
					if(!state)
						state={};
					state.map=mapid;
					history.pushState( state, document.title, '?'+newsearch);
					*/
					Finch.navigate('mindmap', {map: mapid}, true);
					
					//
					// вызовем обработку на сервере
					/* TODO 
					scope.supajax(	'selectmap', 
								mapid, 
								S.userid, 
								'', 
								function(data){
									// сюда прийдет информация для показа карты
								}, 
								[scope.mapid, JSON.stringify(scope.viewPort)] // в модели Mapid Пока не поменялся
					);
					
					// грохнем все узлы в нашей модели, т.к. сейчас прийдут новые
					scope.nodes = [];
					scope.mapid = mapid;
					scope.$scan();
					*/
					
					$('#mapselectmenu').slideUp();
				};		

				/* послать инфу на сервер, посылаем как есть по реальному размеру области просмотра 
				 * вызывается из container drag stop */
				// todo пока up right left ходишь по модели надо бы двигать viewport за просмотром
	//переделать под STRL
				scope.setViewPort = function (){
					// сообщить на сервер о текущих размерах обрасти просмотра
					var position = $("#container").position();
					var bodyW = $('body').width();
					var bodyH = $('body').height();
					scope.viewPort = { // inches
						left: position.left / dpi.get(false), 
						top:  position.top / dpi.get(false),  
						width:  scope.scale*bodyW / dpi.get(false),
						height: scope.scale*bodyH / dpi.get(false),
					};
					//scope.$scan();
				}
				
				/*
				// нажатия кнопок "на узлах", фокус ввода на самом деле на workarea. события от него
				scope.containerInput = function(event){
					var nodelastclicked = scope.selectednode;
					//console.log('event target', event.target, ' event=',event);
					if(event.target==$('#workarea')[0]  ){
						// todo особенно когда shift+enter часто вставляется несколько узлов нужно это обработать
						//console.log(event);
						if(event.keyCode==9){ 	// Sub Topic
							if(scope.selectednode)
								scope.selectednode._insertsubtopic();
						}
						if(event.keyCode==38 ){ // Up
							var parent = scope.nodes[scope.selectednode.parent];
							var thisindex = -1;
							if(parent){
								for(var i in parent.childs){
									if(parent.childs[i]==scope.selectednode.id){
										thisindex = parseInt(i)
										if(thisindex>0){
											scope.selectednode = scope.nodes[parent.childs[parseInt(i)-1]];
											scope.$scan();
										}
										break;
									}
								}
							}
						}
						if(event.keyCode==40 ){ // Down
							var parent = scope.nodes[scope.selectednode.parent];
							var thisindex = -1;
							if(parent){
								for(var i in parent.childs){
									if(parent.childs[i]==scope.selectednode.id){
										thisindex = parseInt(i);
										if(thisindex<parent.childs.length){
											scope.selectednode = scope.nodes[parent.childs[parseInt(i)+1]];
											scope.$scan();
										}
										break;
									}
								}
							}						}
						if(event.keyCode==39 ){ // Right
							if(scope.selectednode && scope.selectednode.childs.length>0){
								scope.selectednode = scope.nodes[ scope.selectednode.childs[0] ];
								scope.$scan();
							}
						}
						if(event.keyCode==37 ){ // Left
							if(scope.selectednode && scope.selectednode.parent){
								scope.selectednode = scope.nodes[ scope.selectednode.parent ];
								scope.$scan();
							}
						}
						if(event.keyCode==13 && ! event.shiftKey){ 	// Enter - insertTopicAfter
							var parent = scope.nodes[scope.selectednode.parent];
							var thisindex = -1;
							if(parent){
								if(parent){
									for(var i in parent.childs){
										if(parent.childs[i]==scope.selectednode.id){
											thisindex = parseInt(i)
											scope.newNode(parent, thisindex+1);
										}
									}
								}
							}
						}
						if(event.keyCode==13 && event.shiftKey){ 	// Shift + Enter - insertTopicBefore
							var parent = scope.nodes[scope.selectednode.parent];
							if(parent){
								var thisindex = -1;
								if(parent){
									for(var i in parent.childs){
										if(parent.childs[i]==scope.selectednode.id){
											thisindex = parseInt(i)
											scope.newNode(parent, thisindex);
										}
									}
								}
							}								
						}

						// todo
						if(event.keyCode==46 ){ 	// Del
							if(confirm('Вы уверены, что хотите удалить топик?')){
								deleteNode(nodelastclicked);
							}
						}
						// todo
						if(event.keyCode==113 ){ 	// F2
							//var title = nodelastclicked._getProperty('title')._getProperty;
							//if(title){
								nodelastclicked.te.editable('show');
							//}
								
						};
						event.stopPropagation();
						
						$('workarea').focus();

					}
				};			
				*/
				
				scope.scaleUp = function(){
					scope.scale = scope.scale*1.1;
				};
				scope.scaleDown = function(){
					scope.scale = scope.scale/1.1;
				};

				/*инициализация модели*/
				
				// глобальная переменная - для отладки
				// назначение 1) связь с директивами приложения, 2) связь с методами классов
				S = scope; 
				
				/*инициализация ситуации приложения*/
				//scope.setViewPort(); // определить свое окно просмотра, сохранить его в модели scope.viewPort
				//scope.selectMap('map1'); // TODO временно , выбрали карту по умолчанию. 
				
				//drag(); // включим возможность таскать карту за контейнер
				plnr.updatePositions(scope.nodes, scope.rootId);
				scope.$scan();
				

		}
	}
	
})
