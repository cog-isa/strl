// !!! INFO : этот файл копируется в gui из mmdb_js, править в mmdb_js,
// коировать через /SATEK/sup/branches/dev3/gui$ ./update_mmdbLib.sh

function mms_newNodeCoord(mapid, userid, parent, node, rect, isLeft){
    // parent, node and rect  are RAW let's HACK now
    if(mapid=='MAPID'){
		var node_id = node.__id;
		var parent_id = parent.__id; 
		var rect = rect.__array; 
		var isleft = node.isLeftSubtree($pyjs.loaded_modules.builtins.str('USERID'));
		var isincollapsedsubtree = node.isInCollapsedSubtree($pyjs.loaded_modules.builtins.str('USERID')); // todo а надо оно ? может тоже проставить в модель ? 

		ap.walk.fixObject(node, 'node', node_id);
		
		// поменяем нашу модель 
		node.fisleft = isleft;
		// пропатчим объектик
		ap.walk.fixObject(parent, 'node', parent_id);
		node.fparent = parent; // готово 
		// rect
		node.frect = rect;
		// 
		node.fvisible = ! isincollapsedsubtree;
	}
    // debug info console.log('mms_newNodeCoord', mapid, userid, parent, node, rect)
}

function mms_nodeCreated( mapid, nodeid, userid){
    // debug info console.log('mms_nodeCreated',  mapid, nodeid, userid)
}

// TODO HERE ALL METHODS
