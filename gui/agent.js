define( [ 	"/static/js/modules/planarizator.js"	],  
		function( plnr ){

/*
	////////////////////////////////// setup our class ( aplib )
	ap.jsdesc['agent'] = {
		fields:{
			id: "rnd1",
			type_obj:"agent",
			posx:0,
			posy:0,
			
			isVisible: true,
			
			//width: 1, //размер отображаемой картинки
			//height: 0.25,
			// расчитаются планаризатором ..хз что
			//left: 1,
			//top: 1,
			
			// logic part
			icons: 	[
						{hint:'Агент',	img:'/static/img/rob1.png'}, 
					],
			
			properties: {
					shape:'rect',
					active:1,
					passability: 40,
					health: 100,
					material: 'wood',
					tempriche: 30,
					reflectivity: 50,
					fuel: 80
			},
			//actions:
			// view part
			opened: false, // переделать под свойства
			element: null, // СТАРОЕ, используется в методе _resize, устанавливается в директиве alight.directives.sup.node
		},	
		methods:{
			_getid:{
				code:function(){
					//return { getid: ap.walk.jslabels.objid.id(this) }
					return { _getid: this.__id }; 
				}
			},
			
	//	_get_pos:{todo}
	//	_delete_obj:{todo}
		
			
			//проверить РЕСАЙЗ ПО масштабу!!!?
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
					//var node = this;
					//S.supajax( 	'resizeNode', 
					//			history.state.map, 
					//			S.userid, 
					//			node.getid().getid,
					//			function(){
					//				// ! updateAllEdgeOnNode(node.getid().getid);
					//				// S.$scan();
					//			}, 
					//			[width, height]
					//);
					

					
				}
			}, 
			
			// закрыть/скрыть список свойств 2x$scan
			_close:{
				code: function(){

					this.opened = false;
					S.$scan(); // покажем уменьшенный узел - теперь у него размеры меньше
					// скажем mmdbjs новые свои размеры
					this._resize(); // переасчитаем координаты в зависимости от его нового размера
					S.$scan();
				}	
			}, 
			
			// открыть/показать список свойств 2x$scan
			_open: {
				code: function(){				
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
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, true ); // #mindmap doUpdate
					
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
					// todo сделать через clone и for in Или filter
					//for(var i = props.length - 1; i >= 0; i--) {
					//	if( props[i] === 'title' ) { // props[i] === 'color' || 
					//	   props.splice(i, 1);
					//	}
					//}
					
					return { allPropertyes: props };
				}
			},

			// вызывается в alight.directives.sup.path для отображения пути к родителю
			
			//за этими данными происходит $watch
			// TODO она вызывает ТОРМОЗА, ЕСЛИ сделать $watch результатов этой функции ... надо КЭШИРОВАТЬ	
		}
	}
	//ap.walk.class.node = {};	 // todo remove
*/	

function Agent(){
		var fields = {
			id: "rnd1",
			type_obj:"agent",
			posx:0,
			posy:0,
			isVisible: true,
			
			icons: 	[	{hint:'Агент',	img:'/static/img/rob1.png'}, 
					],
			
			properties: {
					shape:'rect',
					active:1,
					passability: 40,
					health: 100,
					material: 'wood',
					tempriche: 30,
					reflectivity: 50,
					fuel: 80
			},
			opened: false, // переделать под распахивание свойств объекта
		},	
		var methods = {
			_getid:{
				code:function(){
					return { _getid: this.__id };
				}
			},			

			_get_pos:{
				code:function(){
				return {_get_pos: this.posx +":"+ this.posy}
				}
			},		
			
			//_delete_obj:{todo}
		
			
			//проверить РЕСАЙЗ ПО масштабу!!!?
			//close, open, select, setProp,  getTitle, setTitle, getProp, allProp
			// закрыть/скрыть список свойств 2x$scan
			
		}
	}	
};
	
	/**	
	getObject2 - создает объект с описанными свойствами
	описать code:
	
	писать свои директивы..
	директива:  -словарь (хуже)
				-функция +	
	***/
	
	// инициализация объекта в браузере
	var positions = {};
	// сама инициализация
			
	function initAgent(agent_element, node){ // todo перенести в контекст вызова
		$(agent_element).tooltip();
		
		/******************   перетаскивание узлов ************************/

		// Всплывающая редактируемая инфа.
		var te = $(agent_element).find('.nodetitle');
		te.editable({
		   type:  'text',
		   send:'never', 
		   
		   name:  'title',
		   title: 'Enter new Title',
		   //placement: 'right',
		   //enablefocus:true
		});
		te.on('update', function(e, editable) {
			//alert('new value: ' + editable.value);
			//$('#workarea').focus();
		});
		node.te = te;	
	};	
	
	////////////////////////directives
	alight.directives.sup={};
	alight.directives.sup.node = function(e, value, scope){
		// INFO ? т.к. al-repeat = "node in nodes" => node
		var KEY = value || 'node';
		//var node=scope.$getValue(KEY); 
		var node=scope.$parent.nodes[scope.nodeid];
		initNode(e, node); //настраиваем 
		// сохраним в модели элемент  узла - связжем DOM в модель (чтобы в resize узнавать СВОЙ реальный размер)
		node.element = e; 
		
		/*
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
	*/
	}	

	return  {
		agent_app : function (scope){
		

				scope.mapid = 'MAPID', // ! not binded
				scope.userid = 'USERID', // ! need read logined user id? now not used
				scope.scale = 1;
				//scope.viewPort = [ ]; 	// inches x,y,w,h
				
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

			//*********функции - методы контекста *****************

				
		}
	}
	
})
