define( [ 	"/static/js/lib/aplib.js" , "/static/js/modules/helpers.js",  "/static/js/lib/finchjs/finch.js", 
			"/static/js/modules/planarizator.js"
		],
		function( _aplib, _helpers, _finch, plnr ){

        // global dpi хз зачем, пусть пока будет
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


	////////////////////////////////// setup our class ( aplib )
	ap.jsdesc['agent'] = {
		fields:{
			id: "rnd1",
			type_obj:"agent",
			posx:0,
			posy:0,
			
			isVisible: true,
			
			icons: 	[
						{hint:'Агент',	img:'/static/img/rob1.png'}, 
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
			_get_pos:{
				code:function(){
				return {_get_pos: this.posx +": "+ this.posy}
				}
			},	


/* this.fields.posx
	function gogo(x, y){
		var xy = [];		
		xy = _get_pos;
		
		var arr = xy.split(' ');
		while (arr[0] < x){
			while (arr[1]<y){
				arr[0] +=1;
				arr[1] +=1;			
			}
		}
	};*/

			_step:{
				code:function(x, y){
				
					if (this.fields.posx < x){
						this.fields.posx += 1;
						if(this.fields.posx > x){
							this.fields.posx -= 1;
						}
					}
						
					if (this.fields.posy < y){
						this.fields.posy += 1;
						if(this.fields.posy > y){
							this.fields.posy -= 1;
						}
					}						
						
						
				/*	//как-то через контекст надо
				while (node.fields.posx < x){
					while (node.fields.posy < y){
						this.fields.posx += 1;
						this.fields.posy += 1;
					}
				
				}
				*/
				//return arr;	
				}
			}, // проверить скобки
			
			//_delete_obj:{todo}
			
			//попробовать сделать РЕСАЙЗ ПО масштабу!!!?
			// только устанавливает ТЕКУЩИЕ РАЗМЕРЫ чтобы подвинуть соседей,  они УЖЕ должны быть применены/установлены, 
			//сначала применяем ($scan) - затем пододвигаем соседей через этот метод
			_paint:{
				code:function(scale){
					if(this.element){					
						//ОТРИСОВАТЬ объект в масштабе scale						

						S.$scan();
					}else{
						console.log("_resize3");
					}
					
					/*сообщим новые размеры на сервер
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
			
			_insertagent:{
				code:function(x, y){
					var node=this;
					var id= guid();
					
					var n = ap.walk.getObject2('agent', id);
					n.id = id;
					S.nodes[id]=n;
					
					S.fields.posx = x;
					S.fields.posy = y;
					
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
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, /*doUpdate*/true ); // #mindmap
					
					// пометим в главном S что выбрали этого !!! - плохая связь с контекстом.
					S.selectednode = this;
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
			
			//за этими данными происходит $watch
			// TODO она вызывает ТОРМОЗА, ЕСЛИ сделать $watch результатов этой функции ... надо КЭШИРОВАТЬ	
		}
	}
	//ap.walk.class.node = {};	 // todo remove
	
	/////////////////////////// HELP FUNCTIONS
	// инициализация узла в браузере

	/**	
	getObject2 - создает объект с описанными свойствами
	описать code:function(){...}
	
	писать свои директивы..
	директива:  -словарь (хуже)
				-функция +	
	***/
	
//TODO
	function initAgent(agent_element, node){
		$(agent_element).tooltip();

		//var id = $(event.target).attr('id');
		
		// сделаем title редактируемым, но не работает
		var te = $(agent_element).find('.nodetitle');
		te.editable({
		   type:  'text',
		   //send:'never',
   
		   name:  'title',
		   title: 'Введите новое название',
		   placement: 'left',
		   //enablefocus:true
		});
		te.on('update', function(e, editable) {
			//alert('new value: ' + editable.value);
			$('#workarea').focus();
		});
		node.te = te;
	};	
	
	////////////directives
	alight.directives.strl ={};
	alight.directives.strl.agent = function(e, value, scope){
		var KEY = value || 'agent';
		//var node=scope.$getValue(KEY); 
		var node=scope.$type_obj.nodes[scope.nodeid];
		initAgent(e, node); //настраиваем 
		// сохраним в модели элемент  узла - связжем DOM в модель (чтобы в resize узнавать СВОЙ реальный размер)
		node.element = e; 
		
		
		// показ информации для всех объектов
		var needShow = false;
		var infoBlockClicked = false;
		var showInfoBlock = function(){
			$(e).find('.info_block').show();	
		};
		
		
		// скрыть все инфо блоки
		//var  глобальная функция вызовется везде
		hideInfoBlocks = function(){
			needShow = false;
			infoBlockClicked = false;
			
			$('.info_block').hide();	
		};
				
		
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
				scope.rootId = 'agent'; //1й агентна поле
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;


				scope.rootId = 'node'; //2й агентна поле
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;				
				
				scope.rootId = '123'; //3й агентна поле
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;				
				
				// выбираем первыйузел в списке или ничто
				//scope.selectednode = scope.rootNode;
				
				scope.newNode = function(){
					// todo send to server
					var id = guid();
					var n = ap.walk.getObject2('agent', id);
					n.id = id;
							
					scope.nodes[id] = n;
					
					scope.$scan(); // такой узел появился
				}
				
			
						
			//*********функции - методы контекста *****************
			
			/* функция посылает запросы на сервер от узлов, если в узле случилось что-то важное */
			//var requeue = [];
			//var isRequestNow = false;
			//scope.supajax = function( command, mapid, userid, nodeid, callback/*function*/, data /*array - прочие данные*/)
			

				
				scope.scaleUp = function(){
					scope.scale = scope.scale*1.1;
				};
				scope.scaleDown = function(){
					scope.scale = scope.scale/1.1;
				};

				/*инициализация модели*/
				
				// глобальная переменная - для отладки
				// назначение 1) связь с директивами приложения, 2) связь с методами классов
					
				
				//plnr.updatePositions(scope.nodes, scope.rootId);
				S = scope;	
				//scope.$scan(); //- перерисовать обновленное
		}
	}
	
})
