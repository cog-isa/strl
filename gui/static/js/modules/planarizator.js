/* example of composition
 * composition: 
 * 	Objectrnd1: Object
 * 		id: "rnd1"
 * 		parent: "root"
 * 		childs: Array[2] // ids
 * 		width: 137.47190139256418
 * 		height: 48.3104158192873
 * 		isCollapsed: false
 * 		isLeft: true

 * 		left: 706.5665979846381
 * 		top: 3329.4495734281372
 * 		isVisible: true

 * 		pl_data: Object
 * 		bottom: function (){ return this.top + this.height; }
 * 		right: function (){ return this.left + this.width; }
 * 		__proto__: Object
 * 	rnd2: Object
 * 	rnd3: Object
 * */
var plnr = {
    FREESPACE_X: 0.5,
    FREESPACE_Y: 0.1,

	//не нужна
    __setInvisible: function(composition, start_node) {
        var cc = start_node.childs.length; //сделать без childs 
        for (var i = 0; i < cc; i++) {
            var child = composition[start_node.childs[i]];
            child.isVisible = false;
            this.__setInvisible(composition, child);
        }
    },

   //TODO
    updatePositions: function(composition, root_id) {
        var root = composition[root_id];
        root.isVisible = true;
        return composition;
    }
};

define(function(){
		return plnr;
})

