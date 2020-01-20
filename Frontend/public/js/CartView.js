import { StoreTimer } from './Timer.js';

var CartView = function(cart, storeInstance) {
	console.log('Rendering cart');
	this.view = this.renderCart(cart, storeInstance);
}

CartView.prototype.initEvents = function(cart, storeInstance) {
	console.log('Initializing cart events');
	this.registerAddClickEventListeners(cart, storeInstance);
	this.registerRemoveClickEventListeners(cart, storeInstance);
	this.registerShowCartEventListener(document.getElementById("btn-show-cart"), storeInstance);
	this.registerHideCartEventListener(document.getElementById("btn-hide-cart"), storeInstance);
}

CartView.prototype.registerAddClickEventListeners = function(parent, storeInstance) {
	parent.addEventListener("click", addClickEventListener(storeInstance, parent), false);
}

function addClickEventListener(storeInstance, parent) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-add")) {
			var product = e.target.parentNode.classList.item(0);
			parent.removeEventListener("click", addEventListener);
			storeInstance.addItemToCart(product);
			storeInstance.timer.resetTimer();		
		}
		e.stopPropagation();		
	}
}

CartView.prototype.registerRemoveClickEventListeners = function (parent, storeInstance) {
	parent.addEventListener("click", removeClickEventListener(storeInstance, parent), false);
}

function removeClickEventListener(storeInstance, parent) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-remove")) {
			var product = e.target.parentNode.classList.item(0);
			parent.removeEventListener("click", removeClickEventListener);
			storeInstance.removeItemFromCart(product);
			storeInstance.timer.resetTimer();		
		}
		e.stopPropagation();		
	}
}

CartView.prototype.registerShowCartEventListener = function(element, storeInstance) {
	const self = this;
	element.addEventListener("click", self.showCart(storeInstance), false);
}

CartView.prototype.registerHideCartEventListener = function(hideCartBtn, storeInstance) {
	const self = this;
	hideCartBtn.addEventListener("click", self.hideCart(storeInstance), false);
}

CartView.prototype.showCart = function(storeInstance) {
	const self = this;
	return function() {
		console.log(storeInstance);
		storeInstance.timer.resetTimer();
		var modal = document.getElementById("modal");
		var modalContent = document.getElementById("modal-content");
		console.log(self);
		self.renderCart(modalContent, storeInstance);
		modal.style.visibility = "visible";		
	}

}

CartView.prototype.hideCart = function(storeInstance) {
	return function() {
		storeInstance.timer.resetTimer();
		var modal = document.getElementById("modal");
		modal.style.visibility = "hidden";		
	}

} 

/*
	container is used to store #modal-content
*/
CartView.prototype.renderCart = function(container, storeInstance) {
	console.log(container);
	console.log(storeInstance);
	container.innerHTML = "";

	for (var item in storeInstance.cart) {
		var currentItem = document.createElement("div");
		// currentItem.id = item;
		currentItem.classList.add(item);

		var label = document.createElement("p");
		var labelNode = document.createTextNode(storeInstance.stock[item].label);
		label.appendChild(labelNode);
		

		var image = document.createElement("img");
		image.src = storeInstance.stock[item].imageUrl;

		var quantity = document.createElement("p");
		var quantityNode = document.createTextNode("" + storeInstance.cart[item]);
		quantity.appendChild(quantityNode);
		quantity.classList.add("quantity");
		

		// Event listener is on productList......
		var addBtn = document.createElement("button");
		addBtn.classList.add("btn-add");
		addBtn.innerHTML = "+";
		

		var removeBtn = document.createElement("button");
		removeBtn.classList.add("btn-remove");
		removeBtn.innerHTML = "-";
		

		// var totalPrice = document.createElement("p");
		// var totalPriceNode = document.createTextNode(storeInstance.cart[item] * storeInstance.stock[item].price);
		// totalPrice.classList.add("totalPrice");
		// totalPrice.appendChild(totalPriceNode);

		var total = document.createElement("p");
		var totalPrice = storeInstance.cart[item] * storeInstance.stock[item].price;
		total.innerHTML = "$" + totalPrice + ".00"; 

		currentItem.appendChild(image);
		currentItem.appendChild(label);
		currentItem.appendChild(quantity);
		currentItem.appendChild(addBtn);
		currentItem.appendChild(removeBtn);
		currentItem.appendChild(total);

		container.appendChild(currentItem);
		//console.log(newContainer);
	}
	var checkOutBtn = document.createElement("button");
	checkOutBtn.innerHTML = "Check out";
	checkOutBtn.id = "btn-check-out";
	container.appendChild(checkOutBtn);
	checkOutBtn.addEventListener("click", function() {
		checkOutBtn.disabled = true;
		storeInstance.checkOut(function() {
			checkOutBtn.disabled = false;
			console.log(checkOutBtn);
		});
		
	});

	var clearCartBtn = document.createElement("button");
	clearCartBtn.innerHTML = "Clear cart";
	clearCartBtn.id = "btn-clear-cart";
	container.appendChild(clearCartBtn);
	clearCartBtn.addEventListener("click", function() {
		storeInstance.cart = {};
		storeInstance.onUpdate();
	}, false);

	// console.log(container.childNodes);
	return container;
}

export { CartView };