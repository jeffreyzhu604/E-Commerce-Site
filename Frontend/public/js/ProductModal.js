var ProductModal = function(container, storeInstance, productName) {
	this.renderProductModal(container, storeInstance, productName);
};

ProductModal.prototype.initEvents = function(container, storeInstance) {
	this.registerAddClickEventListeners(container, storeInstance);
	this.registerRemoveClickEventListeners(container, storeInstance);
	this.registerCloseModalClickEventListener(container);

}

ProductModal.prototype.registerAddClickEventListeners = function(parent, storeInstance) {
	parent.addEventListener("click", addClickEventListener(storeInstance, parent), false);
}

function addClickEventListener(storeInstance, parent) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-add")) {
			var product = e.target.parentNode.classList.item(1);
			parent.removeEventListener("click", addEventListener);
			storeInstance.addItemToCart(product);
			storeInstance.timer.resetTimer();		
		}
		e.stopPropagation();		
	}
}

ProductModal.prototype.registerRemoveClickEventListeners = function (parent, storeInstance) {
	parent.addEventListener("click", removeClickEventListener(storeInstance, parent), false);
}

function removeClickEventListener(storeInstance, parent) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("btn-remove")) {
			var product = e.target.parentNode.classList.item(1);
			parent.removeEventListener("click", removeClickEventListener);
			storeInstance.removeItemFromCart(product);
			storeInstance.timer.resetTimer();		
		}
		e.stopPropagation();		
	}
}

ProductModal.prototype.registerCloseModalClickEventListener = function(parent) {
	parent.addEventListener("click", closeModalClickEventListener(parent), false);
}

function closeModalClickEventListener(parent) {
	return function(e) {
		if (e.target !== e.currentTarget && e.target.classList.contains("close-modal")) {
			console.log('target', e.target);
			console.log('parent', parent);
			parent.parentNode.style.visibility = "hidden"; 
		}
		e.stopPropagation();	
	}
}

ProductModal.prototype.renderProductModal = function(container, storeInstance, productName) {
	console.log(container);
	console.log(storeInstance);
	container.innerHTML = "";

	if (productName) {
		// currentItem.id = item;
		var newContainer = document.createElement("div");

		newContainer.classList.add(productName + "-modal");
		newContainer.classList.add(productName);

		var label = document.createElement("p");
		var labelNode = document.createTextNode(storeInstance.stock[productName].label);
		label.appendChild(labelNode);
		

		var image = document.createElement("img");
		image.src = storeInstance.stock[productName].imageUrl;

		var quantity = document.createElement("p");
		var quantityNode;
		if (!storeInstance.cart[productName])
			quantityNode = document.createTextNode("0");
		else
			quantityNode = document.createTextNode("" + storeInstance.cart[productName]);
		quantity.appendChild(quantityNode);
		quantity.classList.add("quantity");
		

		// Event listener is on productList......
		var addBtn = document.createElement("button");
		addBtn.classList.add("btn-add");
		addBtn.innerHTML = "+";
		

		var removeBtn = document.createElement("button");
		removeBtn.classList.add("btn-remove");
		removeBtn.innerHTML = "-";

		var total = document.createElement("p");
		var totalPrice;
		if (!storeInstance.cart[productName])
			totalPrice = 0;
		else
			totalPrice = storeInstance.cart[productName] * storeInstance.stock[productName].price;
		total.innerHTML = "$" + totalPrice + ".00"; 

		newContainer.appendChild(image);
		newContainer.appendChild(label);
		newContainer.appendChild(quantity);
		newContainer.appendChild(addBtn);
		newContainer.appendChild(removeBtn);
		newContainer.appendChild(total);
		var close = document.createElement("button");
		close.innerHTML = "X";
		close.classList.add("close-modal");
		newContainer.appendChild(close);
		container.appendChild(newContainer);

		//console.log(newContainer);

		// console.log(container.childNodes);		
	}

};

export { ProductModal };