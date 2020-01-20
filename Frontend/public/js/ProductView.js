var ProductView = function(node, storeInstance, itemName) {
	return this.renderProduct(node, storeInstance, itemName);
};

/*
	container is used to reference a product 
*/
ProductView.prototype.renderProduct = function(container, storeInstance, itemName) {
	/*
		This function gets called inside renderProductList
	*/
	console.log('renderProduct');
	container.innerHTML = "";
	container.id = "product-" + itemName;
	container.classList.add(itemName);
	container.classList.add("product");
	container.classList.add("pointer");

	if (storeInstance.stock[itemName].quantity > 0) {
	// Creating the add and remove buttons
	var addBtn = document.createElement("button");		
		addBtn.classList.add("btn-add");
		addBtn.innerHTML = "Add";
		addBtn.style.visibility="hidden";
		container.appendChild(addBtn);
	// console.log(`addBtn for ${itemName} should be hidden`);

	container.addEventListener("mouseover", function() {
		addBtn.style.visibility="visible";
			// console.log(`addBtn for ${itemName} should be visible`);			
	});

	container.addEventListener("mouseout", function() {
		addBtn.style.visibility="hidden";
	});
	}

	var removeBtn = document.createElement("button");
	if (storeInstance.cart[itemName]) {
		removeBtn.classList.add("btn-remove");
		removeBtn.innerHTML = "Remove";
		removeBtn.style.visibility="hidden";
		container.appendChild(removeBtn);

		container.addEventListener("mouseover", function() {
			removeBtn.style.visibility="visible";
				// console.log(`removeBtn for ${itemName} should be visible`);
		});

		container.addEventListener("mouseout", function() {
			removeBtn.style.visibility="hidden";
		});		
		// console.log(`removeBtn for ${itemName} should be hidden`);
	} 

	// Creating the img tags
	var img = document.createElement("img");
	img.src = storeInstance.stock[itemName].imageUrl;
	container.appendChild(img);

	// Creating the p tags for price and label
	var price = document.createElement("p");
	var itemPrice = storeInstance.stock[itemName].price
	var priceNode = document.createTextNode("$" + itemPrice + ".00");
	price.appendChild(priceNode);
	price.classList.add("text");
	container.appendChild(price);

	var label = document.createElement("p");
	var labelNode = document.createTextNode(storeInstance.stock[itemName].label);
	label.appendChild(labelNode);
	label.classList.add("description");
	container.appendChild(label);

	/*
		Improvements: 
		Remove the code from the CSS file and add to this event handler
		below.
	*/ 
	return container;
}

export { ProductView };