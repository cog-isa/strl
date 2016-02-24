define( [ 	"./static/js/lib/aplib.js" , "./static/js/modules/helpers.js",  "./static/js/lib/finchjs/finch.js", 
			"./static/js/modules/planarizator.js"
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
	ap.jsdesc['wall'] = {
		fields:{
			id: "rndw",
			type_obj:"wall",
			posx:350,
			posy:100,
			
			isVisible: true,
			
			icons: 	[
						{hint:'јгент',	img:'./static/img/wall1.png'}, 
					],
			
			properties:{
					shape:'rect',
					active:0,
					passability: 0,
					health: 100,
					material: 'stone',
					tempriche: 30,
					reflectivity: 50,
					fuel: 0
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
			//_delete_obj:{todo}
			
			//todo
			_insertwall:{
				code:function(wall, x, y){
					var node=this;
					var id= guid();
					
					var n = ap.walk.getObject2('wall', id);
					n.id = id;
					S.nodes2[id]=n;
					
					S.wall.posx = x;
					S.wall.posy = y;
					
					S.$scan();
					//$('#workarea').focus();
					setTimeout(function(){
						n._paint();
					},0);
					
				}
			},			
			
			// произишел выбор этого узла
			_select: {
				code: function(){
					var nodeid = this.id;
 
					Finch.navigate( 'startmap', {nodeid:nodeid}, /*doUpdate*/true ); 
					
					// пометим в главном S что выбрали этого !!! - плохая связь с контекстом.
					S.selectednode = this;
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
	function initWall(wall_element, node){

		var id = $(event.target).attr('id');
		
		// сделаем title редактируемым
		var te = $(wall_element).find('.nodetitle');
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
	
	/////////directives
	alight.directives.strl ={};
	alight.directives.strl.wall = function(e, value, scope){
		var KEY = value || 'wall';
		//var node=scope.$getValue(KEY); 
		var node=scope.nodes2[scope.nodeid]; 
		initWall(e, node); //настраиваем 
				
		//элемент nodes2[scope.nodeid]
		node.element = e; 
		
		var wall1 = scope.nodes2[scope.nodeid]; 
		//wall._insertwall...
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
		wall_app : function (scope){

				//scope.mapid = 'MAPID', // ! not binded
				//scope.userid = 'USERID', // ! need read logined user id? now not used
				scope.scale = 1;
				
				scope.nodes2 = { };
				scope.helper2 = {
					nodesIDs : function(){
						return Object.keys(scope.nodes2);
					},
					propNames : function(node){
						return Object.keys(node.properties);
					}
				}
				
				// add wall TODO переделать id			
				scope.wallId = 'wall'; //1й агент на поле
				var r = ap.walk.getObject2('wall', scope.wallId);
				r.id = scope.wallId;

				scope.nodes2[r.id] = r;
					
			/***TODO создание новых объектов переписать функцию***/
				scope.newNode = function(n){
					var x = 1;
					while (x<n) { // что-то пошло не така
						var id = 'wall'+guid();
						var n = ap.walk.getObject2('wall', id);
						n.id = id;
						n.posx +=  50;
						n.posy +=  50;
						
						scope.nodes2[n.id] = n;

						scope.$scan(); 
						x++;
					}
				
				}
				
			//nodes2[nodeid].posx	
			//var xx = scope.newNode(20); // что-то не работает			
						
			//*********функции - методы контекста *****************
			

				scope.scaleUp = function(){
					scope.scale = scope.scale*1.1;
				};
				scope.scaleDown = function(){
					scope.scale = scope.scale/1.1;
				};

				// переписать планоризатор для перемещения объектов
				//plnr.updatePositions(scope.nodes2, scope.firsId);
				
				// глобальна¤ переменна¤ - для отладки
				// назначение 1) связь с директивами приложени¤, 2) связь с методами классов
				S = scope;	
				//scope.$scan(); //- перерисовать обновленное

		}
	}
	
})
