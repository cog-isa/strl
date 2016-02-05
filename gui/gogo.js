define( [ 	"/static/js/lib/aplib.js" , "/static/js/modules/helpers.js",  "/static/js/lib/finchjs/finch.js", 
			"/static/js/modules/planarizator.js"
		],
		function( _aplib, _helpers, _finch, plnr ){

        // global dpi �� �����, ����� ���� �����
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
						{hint:'�����',	img:'/static/img/rob1.png'}, 
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

			opened: false, // ���������� ��� ��������
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
						
						
				/*	//���-�� ����� �������� ����
				while (node.fields.posx < x){
					while (node.fields.posy < y){
						this.fields.posx += 1;
						this.fields.posy += 1;
					}
				
				}
				*/
				//return arr;	
				}
			}, // ��������� ������
			
			//_delete_obj:{todo}
			
			//����������� ������� ������ �� ��������!!!?
			// ������ ������������� ������� ������� ����� ��������� �������,  ��� ��� ������ ���� ���������/�����������, 
			//������� ��������� ($scan) - ����� ����������� ������� ����� ���� �����
			_paint:{
				code:function(scale){
					if(this.element){					
						//���������� ������ � �������� scale						

						S.$scan();
					}else{
						console.log("_resize3");
					}
					
					/*������� ����� ������� �� ������
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
			
			// ��������� ����� ����� ����, ������ ����
			_select: {
				code: function(){
					var nodeid = this.id;
 
					Finch.navigate( 'mindmap', {nodeid:nodeid}, /*doUpdate*/true ); // #mindmap
					
					// ������� � ������� S ��� ������� ����� !!! - ������ ����� � ����������.
					S.selectednode = this;
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

			// �������� ��������
			_getProperty: {
				code:function(n){
					return {_getProperty:this.properties[n]};
				}
			},
			//������ ���� ���� �������
			_allPropertyes:{
				code:function(){
					var props = Object.keys(this.properties);					
					return { allPropertyes: props };
				}
			},
			
			//�� ����� ������� ���������� $watch
			// TODO ��� �������� �������, ���� ������� $watch ����������� ���� ������� ... ���� ����������	
		}
	}
	//ap.walk.class.node = {};	 // todo remove
	
	/////////////////////////// HELP FUNCTIONS
	// ������������� ���� � ��������

	/**	
	getObject2 - ������� ������ � ���������� ����������
	������� code:function(){...}
	
	������ ���� ���������..
	���������:  -������� (����)
				-������� +	
	***/
	
//TODO
	function initAgent(agent_element, node){
		$(agent_element).tooltip();

		//var id = $(event.target).attr('id');
		
		// ������� title �������������, �� �� ��������
		var te = $(agent_element).find('.nodetitle');
		te.editable({
		   type:  'text',
		   //send:'never',
   
		   name:  'title',
		   title: '������� ����� ��������',
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
		initAgent(e, node); //����������� 
		// �������� � ������ �������  ���� - ������� DOM � ������ (����� � resize �������� ���� �������� ������)
		node.element = e; 
		
		
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
				
				
				// add agent TODO ���������� id			
				scope.rootId = 'agent'; //1� ������� ����
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;


				scope.rootId = 'node'; //2� ������� ����
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;				
				
				scope.rootId = '123'; //3� ������� ����
				var r = ap.walk.getObject2('agent', scope.rootId);
				r.id = scope.rootId;
				r.properties = [];
				scope.nodes[r.id] = r;				
				
				// �������� ���������� � ������ ��� �����
				//scope.selectednode = scope.rootNode;
				
				scope.newNode = function(){
					// todo send to server
					var id = guid();
					var n = ap.walk.getObject2('agent', id);
					n.id = id;
							
					scope.nodes[id] = n;
					
					scope.$scan(); // ����� ���� ��������
				}
				
			
						
			//*********������� - ������ ��������� *****************
			
			/* ������� �������� ������� �� ������ �� �����, ���� � ���� ��������� ���-�� ������ */
			//var requeue = [];
			//var isRequestNow = false;
			//scope.supajax = function( command, mapid, userid, nodeid, callback/*function*/, data /*array - ������ ������*/)
			

				
				scope.scaleUp = function(){
					scope.scale = scope.scale*1.1;
				};
				scope.scaleDown = function(){
					scope.scale = scope.scale/1.1;
				};

				/*������������� ������*/
				
				// ���������� ���������� - ��� �������
				// ���������� 1) ����� � ����������� ����������, 2) ����� � �������� �������
					
				
				//plnr.updatePositions(scope.nodes, scope.rootId);
				S = scope;	
				//scope.$scan(); //- ������������ �����������
		}
	}
	
})
