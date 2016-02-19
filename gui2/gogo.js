define( [ 	"/static/js/lib/aplib.js" , "/static/js/modules/helpers.js",  "/static/js/lib/finchjs/finch.js", 
			"/static/js/modules/planarizator.js"
		],
		function( _aplib, _helpers, _finch, plnr ){


        // global dpi для расчетов размера пикселей на дюйм в мониторе
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


	/////////////// setup our class ( aplib )////////////////
	ap.jsdesc['agent'] = {
		fields:{
			id: "rnd1",
			type_obj:"agent",
			posx:10,
			posy:10,
			
			isVisible: true,
			
			icons: 	[
						{hint:'јгент',	img:'/static/img/rob1.png'}, 
					],
			
			properties:{
					shape:'rect',
					active:1,
					passability: 40,
					health: 100,
					material: 'wood',
					tempriche: 30,
					reflectivity: 50,
					fuel: 80
			},

			opened: false, // переделать под свойства
		},	
		methods:{
			_getid:{
				code:function(){
					//return { getid: ap.walk.jslabels.objid.id(this) }
					return { _getid: this.__id }; 
				}
			},
			_get_pos:{ //бесполезна наверно
				code:function(){
				return {_get_pos: this.posx +": "+ this.posy}
				}
			},
			_step:{
				code:function(x, y){
					if (this.posx < x){
						this.posx += 1;
						if(this.posx > x){
							this.posx -= 1;
						}
					}
						
					if (this.posy < y){
						this.posy += 1;
						if(this.posy > y){
							this.posy -= 1;
						}
					}					
				//return {posix:this.posx, posix:this.posy};			
				}
			}, 
			//проблема вылезает из-за оберток над _gotoxy	//перенести функцию в другое место
			_gotoxy: {
				code: function gotoxy(x, y, scope){
					console.log(this.posx, this.posy);
					this._step(x, y);
					if (this.posx < x || this.posy < y) {
						scope.$scan();//обновить объект => перерисовать
						var self = this;
						//setTimeout(function() {self._gotoxy(x, y, scope)}, 10); на что влияет точка с запятой??
						  setTimeout(function() {self._gotoxy(x, y, scope);}, 10);
						
					}
				}
			},
			
			//_delete_obj:{todo}
			
			//todo
			_insertagent:{
				code:function(agent, x, y){
					var node=this;
					var id= guid();
					
					var n = ap.walk.getObject2('agent', id);
					n.id = id;
					S.nodes[id]=n;
					
					S.agent.posx = x;
					S.agent.posy = y;
					
					S.$scan();
					//$('#workarea').focus();
					setTimeout(function(){
						n._paint();
					},0);
					
				}
			},			
			
			// произишел выбор этого узла, тычком мыши
			_select: {
				code: function(){
					var nodeid = this.id;
 
					Finch.navigate( 'startmap', {nodeid:nodeid}, /*doUpdate*/true ); // #mindmap
					
					// пометим в главном S что выбрали этого !!! - плоха¤ св¤зь с контекстом.
					S.selectednode = this;
					// S.$scan() // сам делаетс¤ внутри обработчика тычка мыши, не фиг тут делать скан
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

			// получить свойство
			_getProperty: {
				code:function(n){
					return {_getProperty:this.properties[n]};
				}
			},
			//список имен всех свойств
			_allPropertyes:{
				code:function(){
					var props = Object.keys(this.properties);					
					return { allPropertyes: props };
				}
			},
		}
	}
	//ap.walk.class.node = {};	 // todo remove

	// инициализация узла в браузере
	
//TODO
	function initAgent(agent_element, node){
		//$(agent_element).tooltip();

		var id = $(event.target).attr('id');
		
		// сделаем title редактируемым
		var te = $(agent_element).find('.nodetitle');
		te.editable({
		   type:  'text',
		   send:'never',
   
		   name:  'title',
		   title: 'Введите новое название',
		   placement: 'right',
		   enablefocus:true
		});
		te.on('update', function(e, editable) {
			//alert('new value: ' + editable.value);
			//$('#workarea').focus();
		});
		node.te = te;
	};	
	
	
	////	function FirstPrint (node){	};
	
	/////////directives
	alight.directives.strl ={};
	alight.directives.strl.agent = function(e, value, scope){
		var KEY = value || 'agent';
		//var node=scope.$getValue(KEY); 
		var node=scope.nodes[scope.nodeid]; 
		initAgent(e, node); //настраиваем 
				
		//элемент nodes[scope.nodeid]
		node.element = e; 
		
		var agent1 = scope.nodes[scope.nodeid]; 
		
		//agent1._insertagent(agent1, 200,300);
		

		scope.$scan();
		
		// при тычке либо показать либо скрыть, по ситуации, 
		$(e).find('.info_circle').click(function(evt){
			if(!infoBlockClicked){
				infoBlockClicked = true;
				
				//$(e).find('.info_block .focus_button').focus();
				showInfoBlock();
			}else
				hideInfoBlocks();
			
			evt.stopPropagation();
		});
		
	/**/
	}	

	return  {
		agent_app : function (scope){

				//scope.mapid = 'MAPID', // ! not binded
				//scope.userid = 'USERID', // ! need read logined user id? now not used
				scope.scale = 1;
				
				scope.nodes = { };
				scope.helper = {
					nodesIDs : function(){
						return Object.keys(scope.nodes);
					},
					propNames : function(node){
						return Object.keys(node.properties);
					}
				}
				
				// add agent TODO переделать id			
				scope.firsId = 'agent'; //1й агент на поле
				var r = ap.walk.getObject2('agent', scope.firsId);
				r.id = scope.firsId;
				r.posx = 50;
				r.posy = 50;
				r._gotoxy(1200,500, scope);
				scope.nodes[r.id] = r;
				
				/*
				//scope.firsId = 'agent'; //2й агент на поле
				scope.ID = '1' + guid();
				var r2 = ap.walk.getObject2('agent', scope.ID);
				r2.id = scope.ID;
				r2.posx = 10;
				r2.posy = 50;
				r2._gotoxy(800,300, scope);
				scope.nodes[r2.id] = r2;
				*/
				
				
			/***TODO создание новых объектов переписать функцию***/
				scope.newNode = function(n){
					var x = 1;
					while (x<n) { // что-то пошло не така
						var id = 'agent'+guid();
						var n = ap.walk.getObject2('agent', id);
						n.id = id;
						n.posx +=  50;
						n.posy +=  50;
						
						scope.nodes[n.id] = n;

						scope.$scan(); // такой агент появился
						x++;
					}
				
				}
				
			//nodes[nodeid].posx	
			//var xx = scope.newNode(20); // что-то не работает		
	
/*			
	var x = 1;
	while (x<10) {
				scope.firsId = 'agent'+x; //1й агентна поле
				var r = ap.walk.getObject2('agent', scope.firsId);
				r.id = scope.firsId;
				r.posx = 100+x*10;
				r.posy = 100+x*10;
				scope.nodes[r.id] = r;
	x++;
	}	
*/	
						
			//*********функции - методы контекста *****************
			
			
			//не используется пока
			// функция работает с контекстом, она меняет модель в зависимости от ответа с сервера
				scope.handleajaxresponse = function (data){
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
									break;
								} 
							case 'newNodeCoord': {
									var n=ap.walk.getObject('node', c.nodeid); //заменить на getObject2
									
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
							
							// переделать невидимость под прозрачный
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
							
							case 'openNode':{// возможно уберем
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
			
				/* послать инфу на сервер, посылаем как есть по реальному размеру области просмотра 
				 * вызывается из container drag stop */

				scope.setViewPort = function (id){
						/*// сообщить на сервер о текущих размерах области просмотра
						var position = $("#container").position();
						*/
					var positionx = $(""+id).posx;
					var positiony = $(""+id).posy;
					scope.viewPort = { // inches
						left: position.left / dpi.get(false), 
						top:  position.top / dpi.get(false),  
					};
					//scope.$scan();
				}
			

				scope.scaleUp = function(){
					scope.scale = scope.scale*1.1;
				};
				scope.scaleDown = function(){
					scope.scale = scope.scale/1.1;
				};

				
		/***** перемещение объкта в модели	****/
		/*
		function gotoxy(node, x, y){
			while (node.posx < x){
				while (node.posy < y){
					node._step(x, y);
				//scope.$scan();	
				}		
			}
			
		scope.$scan();	
		//temp = nodes[id]._get_pos(); работа с методами примерно такая
		//S.nodes['agent']._step();
		//S.$scan();

		};
		*/
		
			//gotoxy(r, 800,500); //scope.nodes[r.id]
	
		
				// переписать планоризатор для перемещения объектов
				//plnr.updatePositions(scope.nodes, scope.firsId);
				
				// глобальна¤ переменна¤ - для отладки
				// назначение 1) связь с директивами приложени¤, 2) связь с методами классов
				S = scope;	
				//scope.$scan(); //- перерисовать обновленное

		}
	}
	
})
