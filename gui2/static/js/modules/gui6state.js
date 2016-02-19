define( [ 	"/static/js/modules/mmdbjsinit.js" ,"/static/js/lib/aplib.js" , "/static/js/modules/helpers.js", 
			"/static/js/lib/finchjs/finch.js"
		],  
		function( mmdbjsinit, _aplib ){
	console.log(mmdbjsinit);
	////////////////////////////////// setup our class ( aplib )
	//
	ap.walk.jslabels.nn={
		__in_collapsed_subtree :{  // такое поле , по моему, только у mmdbjs Node есть
				classname :function(o){
					//var a = $(o).attr('objid');
					//return a.split('_')[0];
					return 'node'
				}, 
				id : function(o){
					//var a = $(o).attr('objid');
					//return a.split('_')[1];
					return o.__id
				}
			}		
	} 
	ap.jsdesc['node'] = {
		fields:{
			// logic part
			icon:'[$]',  
			parentnode: '', // ид родителя, ПОКА нужен для перетаскивания узлов - TODO сделать через метод
			
			properties: { // title, color, ... другие прочие свойства
					color:'yellow', 
					testProp: 'somevalue' 
			}, 
			actions: ['В закладки'], 
			
			// view part
			opened: false, 
			element: null, // СТАРОЕ, используется в методе _resize, устанавливается в директиве alight.directives.sup.node
			svgpath: null, 
			
			// cache part
			fexpanded: true, // теперь определен в методе _isexpanded через "def isCollapsed(self, user_id, force_update=False):" ТАМ он выставляется насильно
			fparent: null, 
			fisleft: false, // todo сделать коррекцию через mmservice иначе сплошные расхождения могут быть при добавлении новых узлов AUTO
			// frect: [], 	// тут как-то я поспешно/опрометчиво...вызов метода - надежнее, ибо отдает ТОЧНЫЕ координаты
			fvisivle: true,	// в свернутом поддереве или нет
			
			
		},
		methods:{
			// ID узла получать только ТАК. это позволит раньше вявить ошибки с AP метками объектов
			_getid:{
				code : function(){
					//return { getid: ap.walk.jslabels.objid.id(this) }
					return { _getid: this.__id }; 
				}
			},
			
			// когда юзер изменил размер узла самостоятельно
			_setrect:{
				code: function(rect){
					//this.frect = rect; 
					
					//var l= $pyjs.loaded_modules.__builtin__.list();
					//l.append(rect[0]);
					//l.append(rect[1]);
					//l.append(rect[2]);
					//l.append(rect[3]);
					
					// def setSize(self, user_id, width_inches, height_inches):
					this.setSize(pyjsUSERID, rect[2], rect[3]); // тут думается что rect это [x,y,w,h]
				}
			}, 
			// получить rect, лучше бы эти данные кэшировать
			_getrect: {
				code:function(){
					if(this.getRect)
						/*
						var result = [ // maybe  getArray() give js native array
									this.getRect(pyjsUSERID).__getitem__(0), 
									this.getRect(pyjsUSERID).__getitem__(1),
									this.getRect(pyjsUSERID).__getitem__(2),
									this.getRect(pyjsUSERID).__getitem__(3),
								];*/
						var result = this.getRect(pyjsUSERID).__array;
						//this.frect = result;
						return { _getrect: result };

					return {  _getrect: null }
				}
			},
			// только устанавливает ТЕКУЩИЕ РАЗМЕРЫ setRect,  они УЖЕ должны быть применены/установлены, сначала применяем ($scan) - затем пододвигаем соседей через этот метод
			_resize:{
				code:function(width, height){
					console.log("_resize1" );
					if(this.element){
						console.log("_resize2");
						var left =  $(this.element).position().left/dpi.get(false);
						var top =  $(this.element).position().top/dpi.get(false);
						var width = $(this.element).width()/dpi.get(false);
						var height = $(this.element).height()/dpi.get(false);
						//this.isResized = true;
						this._setrect([left, top, width, height]);
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
			// вызывают, чтобы распахнуть узел $scan (вызывается из sup-node директивы , прослушка DOM on click)
			_expand: {
				code: function(){
					/* old
					var node = this;
					S.supajax(	'expandNode', 
								history.state.map,  // TODO get from scope.mapid
								S.userid, 
								this.getid().getid, 
								function(){
									console.log('expand node callback ok');
									node.expanded = true;
								} 
					);
					*/
					// def expand(self, user_id):
					this.expand(pyjsUSERID);
					
					this.fexpanded =  true; // todo remove т.к. это временно mmservice деллает это же (должен делать)
										
					S.$scan();
				}
			}, 
			// схлапывает узел $scan
			_collapse: {
				code: function(){
					/* old
					var node = this;
					S.supajax(	'collapseNode', 
								history.state.map, // TODO get from scope.mapid or S.mapid
								S.userid, 
								this.getid().getid, 
								function(){
									console.log('collapse node callback ok');
									node.expanded = false;
								} 
					);
					*/
					// def collapse(self, user_id):
					this.collapse(pyjsUSERID);

					this.fexpanded =  false; // todo remove т.к. mmservice деллает это же

					S.$scan();
				}
			}, 
			// в левом или правом поддереве узел
			_isleft:{
				code:function(){
					if(this.isLeftSubtree){ // может так быть при вычислении шблонов:  (function() {return ((this.node || {})._isleft())})  и не будет такого поля
						var result = this.isLeftSubtree($pyjs.loaded_modules.builtins.str('USERID'));
						this.fisleft = result
						return {_isleft: result };
					}else{
						this.fisleft = false;
						return {_isleft: false};
					}
				}
			},
			// раскрыт ли узел или схлопнут ? 
			_isexpanded: {
				code:function(){
					// def isCollapsed(self, user_id, force_update=False):
					var b = (this.isCollapsed($pyjs.loaded_modules.builtins.str('USERID')), true) ;
					
					this.fexpanded = !b ; // cache
					
					return {_isexpanded: ! b};
				}
			}, 
			_isInCollapsedSubtree:{
				code: function(){
					//TODO 
					if(this.isInCollapsedSubtree)
						return {_isInCollapsedSubtree: this.isInCollapsedSubtree(pyjsUSERID, true) };
					else
						return {_isInCollapsedSubtree: false };
				}
			},
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
					S.$scan(); // костыль... из за watch,я не знаю где не нашел пока 
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
					S.$scan(); // костыль... из за watch
				}
			},
			// произишел выбор этого узла, тычком мыши
			_select: {
				code: function(){
					// TODO - доработать через нормальную либу - запишем факт выбора узла в историю
					var nodeid = this._getid()._getid;
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, /*doUpdate*/true ); // #mindmap
					
					//фокус ввода на ...
					$('#workarea').focus();
					
					// пометим в главном S что выбрали этого !!! - плохая связь с контекстом.
					S.selectednode = this;
					// костыль - сообщим о своих реальных размерах
					//this.resize();
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
			// получить свойство
			_getProperty: {
				code:function(n){
					return {_getProperty:this.properties[n]};
				}
			},
			// списиок ИМЕН всех свойств, кроме свойств исключений (для показа в списке сойств узле) + EDGES
			allPropertyes:{
				code:function(){
					
					// костыль, но производительость в пллюсе от этого todo сделать тут красиво, например спец директивой
					// при построении узлов - опросится этот метод, заодно и поправим  линию, зато никаких warch со слежкой за результатами тяжелой функции
					$(this.svgpath).attr("d", this._edge2()._edge2);

					
					var props = Object.keys(this.properties);
					// удалим исключения
					for(var i = props.length - 1; i >= 0; i--) {
						if( /*props[i] === 'color' || */ props[i] === 'title' ) {
						   props.splice(i, 1);
						}
					}
					return { allPropertyes: props };
				}
			},
			// этот метод НАСИЛЬНО вернет родителя, но лучшебы его КЭШИРОВАТЬ
			_getparent:{
				code:function(){
					//var magicField = '__walkJS__modificationFlag' ; // флаг из aplib,  костыль

					// def getParent(self, force_update=False):
					var gp = this.getParent( true );
					if(gp){
						ap.walk.fixObject(gp, 'node',gp.__id); // возможно там нет наших методов...  добавим
						this.fparent = gp; // todo убрать, это временно, mmservice должен выствлять это поле
						return {_getparent: gp }; 
					}else
						return {_getparent: null }; 
				}
			},
			// вызывается в alight.directives.sup.path для отображения пути к родителю. за этими данными происходит $watch
			// TODO она вызывает ТОРМОЗА, ЕСЛИ сделать $watch результатов этой функции ... надо КЭШИРОВАТЬ
			_edgeCoord:{
				code:function(){
					var node = this;
					//var P = this._getparent()._getparent;
					var P = this.fparent;
					if(!P) // is root
						return {_edgeCoord:[]};

					// computation
					var thisrect = this._getrect()._getrect; 
					var prect    = P._getrect()._getrect;
					if(thisrect){
						var x1 = thisrect[0] /*left*/; // right
						if(  this.fisleft /*|| $('#'+parentid).hasClass('left')*/ )
							x1 = thisrect[0] /*left*/ + thisrect[2] /*width*/;
						x1*=dpi.get(false);
						
						var y1 = thisrect[1] /*top*/ + thisrect[3] /*height*/  /2;
						y1*=dpi.get(false);
						
						
						var x2 = prect[0] /*left*/ + prect[2] /*width*/; // right
						if(  this.fisleft   )
							x2 = prect[0] /*left*/ ; 
						x2*=dpi.get(false);
						var y2 =  prect[1] /*top*/ + prect[3] /*height*//2;
						y2*=dpi.get(false);
						
						var wo = $('svg').attr('width');
						var max= Math.max(x1,x2);
						if(max>wo)
							$('svg').attr('width', max);
							
						var ho = $('svg').attr('height');
						max= Math.max(y1,y2);
						if(max>ho)
							$('svg').attr('height', max);
						return {_edgeCoord:[x1, y1, (x1+x2)/2, y1, (x1+x2)/2, y2, x2, y2]}
					}else
						return null;

				}
			},
			// text для 
			_edge2:{
				code:function(){
					var c = this._edgeCoord()._edgeCoord;
					if(c && c.length>0){
						var v='M'+c[0]+','+c[1];
						v+='C'+c[2]+','+c[3]+',';
						v+=c[4]+','+c[5]+',';
						v+=c[6]+','+c[7] ;
						//$(e).attr('d', v);	
						return {_edge2:v}; // data for d of path
					}else
						return {_edge2:'M0,0M1,1'};
				}
			},
			// TODO 
			_insertsubtopic:{
				code:function(){
					var node=this;
					// def createNode(self, name, parent=None, child=None, before=False, side=SIDE_AUTO):
					var id= guid();
					var nn = S.mindmap.createNode( $pyjs.loaded_modules.builtins.str(id),this);
					setTimeout(function(){
						nn._resize();
						S.$scan();
						S.$scan(); // костыль... хз
					}, 1);
					///S.nodes.push(nn);
					S.$scan();
					/*
					S.supajax( 	'insertSubTopic', 
								S.mapid, 
								S.userid, 
								node._getid()._getid,
								function(data){
									$('#workarea').focus();
								}, 
								[]
					);
					*/
				}
			}
		
		}
	};
	ap.walk.class.node = {};	
	
	/////////////////////////// HELP FUNCTIONS
	// инициализация узла в браузере
	var positions = {};
	// сама инициализация
	function initNode(nodeelement, node){ // todo перенестив контекст вызова
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
	};	
	///////////////////////////////////// directives
	alight.directives.sup={};
	alight.directives.sup.node = function(e, value, scope){
		// INFO ? т.к. al-repeat = "node in nodes" => node
		var node=scope.node; 
		initNode(e, node); //настраиваем пеертаскивание уза итд
		// сохраним в модели элемент  узла - связжем DOM в модель (чтобы в resize узнавать СВОЙ реальный размер)
		scope.node.element = e; 
		// прослушаем всякое от  элемента (сворачивание/разворачивание, например)
		var expandbutton = $(e).find('.nodehandle_collapse_expand');
		expandbutton.on('click', function(){
			if(node.fexpanded ){
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
	}
	alight.directives.sup.path=function(e,name,scope){
		var node=scope[name];
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
		tree6app : function (scope){
			require(["output/lib/mindmap"] , function(){
				
				pyjsUSERID = $pyjs.loaded_modules.builtins.str("USERID");
							
				scope.mapid = 'MAPID', // ! not binded
				scope.userid = 'USERID', // ! need read logined user id? now not used
				scope.viewPort = [ ]; 	// inches x,y,w,h

				// те узлы карты, которые видны, в данный момент
				// TODO ВАЖНО : НАЖО ПЕРЕПИСАТЬ nodes ТАК ЧТОБЫ nodes = { <id>: <aplibobject nn:<mmdbjs object> >} СЛОВАРЬ А НЕ СПИСОК, 
				// чтобы было удобно сопоставлять эти две системы в обе стороны, поэму возможно надо: 

				scope.nodesFromServer = []; // спиок узлов с сервера, и уже тут мы по нему строим оба других и синхронизируем их
				
				scope._nodes=[ // cache
				];
				Object.defineProperty(scope, "nodes", { get: function () { 
					if(scope.mindmap){
						if(scope.mindmap.getAllNodes().__len__()!=scope._nodes.length)
							scope._nodes=scope.mindmap.getAllNodes().__array.map(function(v){return ap.walk.fixObject(v,'node',v.__id)});
						return scope._nodes;
					}else
						return [];
				} });
				
				// mmdbjs система написаная на питоне с которой надо свести JS  часть 
				scope.mindmap = $pyjs.loaded_modules.mindmap.MindMap( $pyjs.loaded_modules.builtins.str('MAPID'), $pyjs.loaded_modules.builtins.str('USERID') );
				scope.mindmap.clearMap();
				
				// записхаем туда КОРЕНЬ
				var rootnode=scope.mindmap.getRoot(); // pyjs mmdb object
				
				ap.walk.fixObject(rootnode, 'node', rootnode.__id);
				
				
				setTimeout(function(){
					rootnode._resize(); // костыльноЕ-то, блин программирование
					scope.$scan();
				},1);
				
				
				///scope.nodes.push(rootnode);
								
				// выбираем первыйузел в списке или ничто
				scope.selectednode = scope.nodes[0];
				
				// debug|test метод, чтобы хоть как-то наполнять карту - сделать новый узел просто так в корне
				scope._newNode = function(){
					//require(["/static/js/modules/helpers.js"], function(){ // для guid // теперь он тупой и в звисимостях модуля
						/*
						var id = guid();
						var n = ap.walk.getObject('node', id); // делаем объект
						n.objid='node_'+id;
						n.nn =  scope.mindmap.createNode( $pyjs.loaded_modules.builtins.str(id) );
						scope.nodes.push(n);
						*/
						// сделаем основу- mmdbjs объект и проствим в него node методы и фишки
						var id = guid();
						var n = scope.mindmap.createNode( $pyjs.loaded_modules.builtins.str(id) );

						ap.walk.fixObject(n,'node', id);
						setTimeout(function(){
							n._resize();
							scope.$scan();
						},0);
						
						n._getparent(); // чтобы закешировать, ? todo возможно убрать, т.к. mmservice должен делать это же
						n._isleft(); // тоже
						n._getrect();
						
						///scope.nodes.push(n);
					//})
				}
				
				/*
				 * 	**********функции - методы контекста *****************
				 */
				// функция работает с контекстом, она меняет модель в зависимостиот ответа с сервера
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
									n.icon = '<>';
									
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

				/* выбор окна просмотра, послать инфу на сервер */
				scope.setViewPort = function (){
					// сообщить на сервер о текущих размерах обрасти просмотра
					var position = $("#container").position();
					var bodyW = $('body').width();
					var bodyH = $('body').height();
					var viewPort = { // inches
						left: position.left / dpi.get(false), // minus
						top:  position.top / dpi.get(false),  // minus
						width: bodyW / dpi.get(false),
						height: bodyH / dpi.get(false),
					};
					/*
					// скажем не правду - площадь области просмотра увеличим в 9 раз часть не будет видно
					//   -----
					//   -----
					//   --#--
					//   -----
					//   -----
					viewPort.left -= viewPort.width*2; if (viewPort.left <0 ) viewPort.left = 0;
					viewPort.top -= viewPort.height*2; if(viewPort.top<0) viewPort.top = 0;
					viewPort.width *= 5;
					viewPort.height *= 5;
					*/
					//
				
					scope.viewPort = viewPort;
					
					// установим рект в либу 		// def setViewedRect(self, rect): // :param rect: list - (x, y, w, h)
					/* НЕ МОГУ ЗАСТАВИТЬ РАБОТАТЬ ЭТОТ КОД. странная ошибка
					var l= $pyjs.loaded_modules.__builtin__.list();
					l.append(viewPort.left);
					l.append(viewPort.top);
					l.append(viewPort.width);
					l.append(viewPort.height);
					S.mindmap.setViewedRect( l );
					*/
					
					/*
					scope.supajax(	'setviewport', 
							scope.mapid, 
							scope.userid, 
							'', 
							function(data){
								// сюда прийдет информация для показа карты
								//scope.handlesupajaxresponse(JSON.parse(data));
							}, 
							[JSON.stringify(scope.viewPort)] // в модели Mapid Пока не поменялся
					);
					*/
						
					
				}
				
				// нажатия кнопок "на узлах", фокус ввода на самом деле на workarea. события от него
				scope.containerInput = function(event){
					
					var nodelastclicked = scope.selectednode;
					
					if(event.target==$('#workarea')[0]){
						//console.log(event);
						if(event.keyCode==9) // Sub Topic
						{
							if(scope.selectednode)
								scope.selectednode._insertsubtopic();
						}

						if(event.keyCode==38 ){ // Up
							var n = nodelastclicked.getAttribute('nodeup');
							if(n && nodelastclicked){
								selectnode($('#'+n).attr('id'));
							}
						}
						if(event.keyCode==40 ){ // Down
							var n = nodelastclicked.getAttribute('nodedown');
							if(n && nodelastclicked){
								selectnode($('#'+n).attr('id'));
							}
						}
						if(event.keyCode==39 ){ // Right
							var n = nodelastclicked.getAttribute('firstchild');
							if(n && nodelastclicked){
								selectnode($('#'+n).attr('id'));
							}
						}
						if(event.keyCode==37 ){ // Left
							var n = nodelastclicked.getAttribute('parentnode');
							if(n && nodelastclicked){
								selectnode($('#'+n).attr('id'));
							}
						}
						if(event.keyCode==13 && ! event.shiftKey) // Enter - insertTopicAfter
						{
							if(nodelastclicked)
								insertTopicAfter(nodelastclicked)
						}
						if(event.keyCode==13 && event.shiftKey) // Shift + Enter - insertTopicBefore
						{
							if(nodelastclicked)
								insertTopicBefore(nodelastclicked)
						}
						if(event.keyCode==46 ){ // Del
							if(confirm('Вы уверены, что хотите удалить топик?'))
								deleteNode(nodelastclicked);
						}
						if(event.keyCode==113 ){ // F2
							var title = $(nodelastclicked).find('.nodetitle');
							if(title){
								var e = new CustomEvent("dblclick", {
									bubbles: false,
									cancelable: false,
									//detail: viewPort,					
								});
								title[0].dispatchEvent(e);
							}
							
						};
						event.stopPropagation();

					}
				};			

				/*инициализация модели*/
				
				// глобальная переменная - для отладки
				// назначение 1) связь с директивами приложения, 2) связь с методами классов
				S = scope; 
				
				
				/*инициализация ситуации приложения*/
				//scope.setViewPort(); // определить свое окно просмотра, сохранить его в модели scope.viewPort
				//scope.selectMap('map1'); // TODO временно , выбрали карту по умолчанию. 
				drag(); // всключим возможность таскать карту за контейнер
				
				setTimeout(function(){
					//scope.setViewPort();
					S._newNode(); S.$scan();
				},1);

			});
		}            
	}
	
})
