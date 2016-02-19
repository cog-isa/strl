var observeDOM = (function(){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		eventListenerSupported = window.addEventListener;

	return function(obj, callback){
		//console.log('observe1');
		if( MutationObserver ){
			// define a new observer
			//console.log('observe2');
			var obs = new MutationObserver(function(mutations, observer){
				//if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
				//    callback();
				if(mutations[0].aaributeName!=""){
					//console.log('observe3');
					callback();
				}
			});
			// have the observer observe foo for changes in children
			obs.observe( obj, { /*childList:true, subtree:true*/ attributes:true }); // !!! тут важно, 
																					 //мы его будем использовать для слежки за атрибутами 
		}
		else if( eventListenerSupported ){
			obj.addEventListener('DOMNodeInserted', callback, false);
			obj.addEventListener('DOMNodeRemoved', callback, false);
		}
	}
})();
// UNIT
define(function(){
	return {observeDOM: observeDOM}
})
