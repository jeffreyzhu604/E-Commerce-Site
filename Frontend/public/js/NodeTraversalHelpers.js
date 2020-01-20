const nodeTraversal = {
	/*
		Node will be the starting point, element is the DOM node we're 
		searching for and replacedNode is the node we're replacing 
		element with. After the node has been replaced the reference to
		the events is gone.
	*/
	findNode: function(node, nodeToBeFound) {
					var found = false; // we can gather elements here
					var loop=function(element)
					{
						do{
							// we can do something with element
							if (element.nodeType == 1 && element.id == nodeToBeFound.firstChild.id) {
								found = true;
							}
							if(element.hasChildNodes())
								loop(element.firstChild);
						}
						while(element=element.nextSibling);
					}
					loop(node);
					//loop(start_elem.firstChild); // do not include siblings of start element
					return found;
				},
	findReplacedNode: function(node, nodeToBeFound, nodeToBeReplaced) {
							var loop=function(element)
							{
								do{
									// we can do something with element
									if (element.nodeType == 1 && element.id == nodeToBeFound.firstChild.id) {
										nodeToBeReplaced.parentNode.replaceChild(nodeToBeFound, nodeToBeReplaced);
									}
									if(element.hasChildNodes())
										loop(element.firstChild);
								}
								while(element=element.nextSibling);
							}
							loop(node);
							//loop(start_elem.firstChild); // do not include siblings of start element
						}
};

export { nodeTraversal };