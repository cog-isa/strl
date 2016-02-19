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
			
			//width: 1, //������ ������������ ��������
			//height: 0.25,
			// ����������� �������������� ..�� ���
			//left: 1,
			//top: 1,
			
			// logic part
			icons: 	[
						{hint:'�����',	img:'/static/img/rob1.png'}, 
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
			opened: false, // ���������� ��� ��������
			element: null, // ������, ������������ � ������ _resize, ��������������� � ��������� alight.directives.sup.node
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
		
			
			//��������� ������ �� ��������!!!?
			// ������ ������������� ������� ������� ����� ��������� �������,  ��� ��� ������ ���� ���������/�����������, 
			//������� ��������� ($scan) - ����� ����������� ������� ����� ���� �����
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
					
					// ������� ����� ������� �� ������
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
			
			// �������/������ ������ ������� 2x$scan
			_close:{
				code: function(){

					this.opened = false;
					S.$scan(); // ������� ����������� ���� - ������ � ���� ������� ������
					// ������ mmdbjs ����� ���� �������
					this._resize(); // ������������ ���������� � ����������� �� ��� ������ �������
					S.$scan();
				}	
			}, 
			
			// �������/�������� ������ ������� 2x$scan
			_open: {
				code: function(){				
					this.opened = true;// ������� �� �������� ������� ��� �������.
					S.$scan(); // ������� ����������� �������� ���� - ������ � ���� ������� ������
					// ������ mmdbjs ����� ���� �������
					this._resize(); // ������������ ���������� � ����������� �� ��� ������ �������
					S.$scan(); // �������� ����� �����������
					//S.$scan(); // todo �������... �� �� watch
				}
			},
			
			// ��������� ����� ����� ����, ������ ����
			_select: {
				code: function(){
					var nodeid = this.id;
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, true ); // #mindmap doUpdate
					
					// ������� � ������� S ��� ������� ����� !!! - ������ ����� � ����������.
					S.selectednode = this;
					// ������ ����
					hideInfoBlocks();
					// S.$scan() // ��� �������� ������ ����������� ����� ����, �� ��� ��� ������ ����
				}
			}, 
			// ���������� �������� $scan
			_setProperty:{
				code: function(n,v){
					this.properties[n]=v;
					S.$scan();
					// todo ��������� ����� �������� �� ������
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
			// �������� ��������
			_getProperty: {
				code:function(n){
					return {_getProperty:this.properties[n]};
				}
			},
			// ������� ���� ���� �������, ����� ������� ���������� (��� ������ � ������ ������ ����) + EDGES
			_allPropertyes:{
				code:function(){
					var props = Object.keys(this.properties);
					// ������ ����������
					// todo ������� ����� clone � for in ��� filter
					//for(var i = props.length - 1; i >= 0; i--) {
					//	if( props[i] === 'title' ) { // props[i] === 'color' || 
					//	   props.splice(i, 1);
					//	}
					//}
					
					return { allPropertyes: props };
				}
			},

			// ���������� � alight.directives.sup.path ��� ����������� ���� � ��������
			
			//�� ����� ������� ���������� $watch
			// TODO ��� �������� �������, ���� ������� $watch ����������� ���� ������� ... ���� ����������	
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
			
			icons: 	[	{hint:'�����',	img:'/static/img/rob1.png'}, 
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
			opened: false, // ���������� ��� ������������ ������� �������
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
		
			
			//��������� ������ �� ��������!!!?
			//close, open, select, setProp,  getTitle, setTitle, getProp, allProp
			// �������/������ ������ ������� 2x$scan
			
		}
	}	
};
	
	/**	
	getObject2 - ������� ������ � ���������� ����������
	������� code:
	
	������ ���� ���������..
	���������:  -������� (����)
				-������� +	
	***/
	
	// ������������� ������� � ��������
	var positions = {};
	// ���� �������������
			
	function initAgent(agent_element, node){ // todo ��������� � �������� ������
		$(agent_element).tooltip();
		
		/******************   �������������� ����� ************************/

		// ����������� ������������� ����.
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
		// INFO ? �.�. al-repeat = "node in nodes" => node
		var KEY = value || 'node';
		//var node=scope.$getValue(KEY); 
		var node=scope.$parent.nodes[scope.nodeid];
		initNode(e, node); //����������� 
		// �������� � ������ �������  ���� - ������� DOM � ������ (����� � resize �������� ���� �������� ������)
		node.element = e; 
		
		/*
		// ���������� ������ ��  �������� (������������/��������������, ��������)
		var expandbutton = $(e).find('.nodehandle_collapse_expand');
		
		expandbutton.on('click', function(){
			if(!node.isCollapsed ){
				node._collapse();
			}else{
				node._expand();
			}
			return false;
		});	
		
		// ����� ���������� ��� ���� ��������
		var needShow = false;
		var infoBlockClicked = false;
		var showInfoBlock = function(){
			$(e).find('.info_block').show();	
		};
		
		// ������ ��� ���� �����
		//var  ���������� ������� ��������� �����
		hideInfoBlocks = function(){
			needShow = false;
			infoBlockClicked = false;
			
			$('.info_block').hide();	
		};
				
		
		// ��� ����� ���� �������� ���� ������, �� ��������, 
		// �� �������� ���� (stopPropagation), �.�. ��� ��������� ���� ���������� ���� �����
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
				
				// �������� ���������� � ������ ��� �����
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
					scope.$scan(); // ����� ���� ��������
					setTimeout(function(){
						n._resize();// ��������� �������
						scope.$scan(); // ����� ���� ��������
					},0);
					
				}

			//*********������� - ������ ��������� *****************

				
		}
	}
	
})
