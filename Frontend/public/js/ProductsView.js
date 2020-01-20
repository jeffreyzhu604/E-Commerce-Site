import { ProductView } from './ProductView.js';
import { ProductModal } from './ProductModal.js';

var ProductsView = function(container, displayed, storeInstance) {
	this.productList = this.renderProductList(container, displayed, storeInstance);
};

ProductsView.prototype.initEvents = function(parent, storeInstance) {
	console.log(parent.childNodes);
	this.registerAddClickEventListeners(parent, storeInstance);
	this.registerRemoveClickEventListeners(parent, storeInstance);
	this.registerProductModalClickEventListener(parent, storeInstance);
}

ProductsView.prototype.registerAddClickEventListeners = function(parent, storeInstance) {
	console.log('parent', parent)
	parent.addEventListener("click", addClickEventListener(storeInstance), false);
}

function addClickEventListener(storeInstance) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-add")) {
			console.log('e.target', e.target); 
			console.log('parentNode', e.target.parentNode);
			var product = e.target.parentNode.classList.item(0);
			console.log(product);
			storeInstance.addItemToCart(product);
			storeInstance.timer.resetTimer();		
		}
		e.stopPropagation();		
	}
}

ProductsView.prototype.registerRemoveClickEventListeners = function (parent, storeInstance) {
	parent.addEventListener("click", removeClickEventListener(storeInstance), false);
}

function removeClickEventListener(storeInstance) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-remove")) {
			var product = e.target.parentNode.classList.item(0);
			storeInstance.removeItemFromCart(product);
			storeInstance.timer.resetTimer();	
		}
		e.stopPropagation();
	}
}

ProductsView.prototype.registerProductModalClickEventListener = function(parent, storeInstance) {
	parent.addEventListener("click", productModalClickEventListener(parent, storeInstance), false);
}

function productModalClickEventListener(parent, storeInstance) {
	var self = this;
	console.log(self);
	return function(e) {
		if (e.target !== e.currentTarget && e.target.tagName == "IMG") {
			console.log('product modal should appear here');
			var productName = getItemName(e.target.getAttribute("SRC"));
			var modal = document.getElementById("product-modal");
			var modalContent = document.getElementById("product-modal-content");
			var productModal = new ProductModal(modalContent, storeInstance, productName);
			modal.style.visibility = "visible";
		}
		e.stopPropagation();
	}
}

function getItemName(url) {
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}

/*
	container is used to reference productList
*/
ProductsView.prototype.renderProductList = function(container, displayed, storeInstance) {
	/*
		container will be the div element with id productView
		- create a document fragment and append to container
		storeInstance has property stock which contains all the itemName's
		- iterate through stock object

	*/
	console.log('renderProductList');
	container.innerHTML = "";
	for (var key in displayed) {
		console.log(key);
		// TO DO: Dependency on renderProduct function
		var productItem = new ProductView(document.createElement("div"), storeInstance, displayed[key]);
		container.appendChild(productItem);
	}		
	console.log(container.childNodes);	
	console.log('After renderProductList');
}

export { ProductsView };