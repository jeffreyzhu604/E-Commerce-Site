import { nodeTraversal } from './NodeTraversalHelpers.js';
import { ajax } from './AjaxRequests.js';
import { isEmpty } from './isEmpty.js';
import { ProductsView } from './ProductsView.js';
import { ProductView } from './ProductView.js';
import { CartView } from './CartView.js';
import { ProductModal } from './ProductModal.js';

function Store(serverUrl, timer) {
	this.stock = {};
	this.cart = {};
	this.serverUrl = serverUrl;
	this.timer = timer;
	this.state = {};
}

Store.prototype.addItemToCart = function(itemName) {
		console.log("addItemToCart");
		console.log(itemName);
		if (!(this.cart[itemName])){
			this.cart[itemName] = 1;
			this.stock[itemName].quantity = (this.stock[itemName].quantity - 1);
			this.onUpdate(itemName);
		} else if (this.stock[itemName].quantity === 0) {
			alert("out of stock");
			this.onUpdate(itemName);
		} else if ((this.cart[itemName])) {
			this.cart[itemName] = (this.cart[itemName] + 1);
			this.stock[itemName].quantity = (this.stock[itemName].quantity - 1);
			console.log('cart', this.cart[itemName], 'stock', this.stock[itemName].quantity);
			this.onUpdate(itemName);
		}
};

Store.prototype.removeItemFromCart = function(itemName) {
	console.log("removeItemFromCart");
	console.log(itemName);
	if (!(this.cart[itemName])){
		alert("product not in cart")
		this.onUpdate(itemName);
	} else if ((this.cart[itemName])) {
		this.cart[itemName] = (this.cart[itemName] - 1);
		this.stock[itemName].quantity = (this.stock[itemName].quantity + 1);
		this.onUpdate(itemName);

		if (this.cart[itemName] == 0) {
			delete this.cart[itemName];
			this.onUpdate(itemName);
		}
	}
};

Store.prototype.onUpdate = function(itemName) {
	console.log('onUpdate');
	console.log(this);
	var cart = document.getElementById("modal-content");
	this.state["product"] = {};
	this.state["product"].modal = {};
	if (itemName) {
		var itemId = "product-" + itemName;
		var container = document.getElementById("productView");
		/*
			Below program crashes if our productView does not contain the item, we need
			a seperate communication with the server.
		*/
		if (!document.getElementById(itemId)) {
			console.log(itemId + " does not exist in productView");
		} else {
			var currentItem = new ProductView(document.getElementById(itemId), this, itemName); 
			if (!nodeTraversal.findNode(container, document.getElementById(itemId))) {
				console.log('element does not exist');
				container.appendChild(currentItem);				
			} else {
				console.log('element does exist');
				var nodeToBeReplaced = document.getElementById("product-" + itemName);
				nodeTraversal.findReplacedNode(container, document.getElementById(itemId), nodeToBeReplaced);
			}			
		}
		this.state["product"].modal = new ProductModal(document.getElementById("product-modal-content"), this, itemName);		
	} else {
		console.log('onUpdate w/ no parameters')
		var stock = Object.keys(this.stock)
		var productsList = new ProductsView(document.getElementById("productView"), stock, this);
		this.state["product"].modal = new ProductModal(document.getElementById("product-modal-content"), this);
	}	
	console.log('cart', cart.childNodes);
	this.state["cart"] = {};
	this.state["cart"].modal = {};
	this.state["cart"].modal = new CartView(cart, this);

	console.log('state',this.state);		
};

Store.prototype.syncWithServer = function(onSync) {
	console.log('syncWithServer');
	var self = this;	
	var delta = {};
	var sendRequest = null;
	var promise = new Promise(function(resolve, reject) {
		console.log('creating a new promise');
		sendRequest = ajax.ajaxGet(this.serverUrl + "/products", resolve);
		console.log('sendRequest: ' + sendRequest);
	}.bind(self));

	if (isEmpty(this.stock)) {
		console.log('products is empty');
		promise.then(function(products) {
			console.log(products);
			this.stock = products;
			if (onSync) {
				onSync(this.stock);
			}				
			this.onUpdate();					
		}.bind(self));				
	} else {
		console.log('products is not empty');
		promise.then(function(products) {
			for (var key in products) {
				if (this.stock.hasOwnProperty(key)) {
					console.log(products[key].price, this.stock[key].price, key);
					if ((products[key].price - this.stock[key].price) !== 0 || (products[key].quantity - this.stock[key].quantity) !== 0) {
						delta[key] = {};
						delta[key].price = products[key].price - this.stock[key].price;
						delta[key].quantity = products[key].quantity - this.stock[key].quantity;
					}
				} else {
					delta[key] = key;
				}
			};
		}.bind(self));
		if (onSync) {
			onSync(delta);
		}						
	}			
}

Store.prototype.checkOut = function(onFinish) {
	console.log('checkOut');
	var self = this;
	this.syncWithServer(function(delta) {
		console.log('callback function inside checkOut');
		var changes = "";
		if (!isEmpty(delta)) {
			for (var key in delta) {
				if (this.stock.hasOwnProperty(key)) {
					if (delta[key].price) {
						changes = changes + "Price of " + key + " changed from " + this.stock[key].price + " to " + (this.stock[key].price + delta[key].price) + "\n";
						this.stock[key].price = this.stock[key].price + delta[key].price;
					}
					if (delta[key].quantity) {
						changes = changes + "Quantity of " + key + " changed from " + this.stock[key].quantity + " to " + (this.stock[key].quantity + delta[key].quantity) + "\n\n";
						this.stock[key].quantity = this.stock[key].quantity + delta[key].quantity;
					}
				}
			}
			alert(changes);
		} else {
			var order = {};
			var total = 0;			
			for (var key in this.cart) {
				total = total + this.stock[key].price * this.cart[key];
			}
			// alert("Total balance\n$" + total + ".00");

			order["client_id"] = Math.floor(Math.random()*1000000);
			order["cart"] = this.cart;
			order["total"] = total;
			console.log(self.serverUrl + "/checkout", self, order);
			
			var promise = new Promise(function(resolve, reject) {
				ajax.ajaxPost(self.serverUrl + "/checkout", order, 
					function(message) {
						alert('Your items were successfully checked out!');
						alert(message);
					},
					function(message) {
						alert('There was an issue with your current order.');
						alert(message);
					}
				);
				resolve();
			}).then(function() {
				console.log('Successful post');
				self.cart = {};
				self.onUpdate();
			}).catch(function() {
				console.log('Unsuccessful post');
			});
		}
	}.bind(self));
	// Disabling the check out button
	if (onFinish)
		onFinish();
}

Store.prototype.queryProducts = function(query, callback){
	var self = this;
	var queryString = Object.keys(query).reduce(function(acc, key){
			return acc + (query[key] ? ((acc ? '&':'') + key + '=' + query[key]) : '');
		}, '');
	ajax.ajaxGet(this.serverUrl+"/products?"+queryString,
		function(products){
			Object.keys(products)
				.forEach(function(itemName){
					var rem = products[itemName].quantity - (self.cart[itemName] || 0);
					if (rem >= 0){
						self.stock[itemName].quantity = rem;
					}
					else {
						self.stock[itemName].quantity = 0;
						self.cart[itemName] = products[itemName].quantity;
						if (self.cart[itemName] === 0) delete self.cart[itemName];
					}
					
					self.stock[itemName] = Object.assign(self.stock[itemName], {
						price: products[itemName].price,
						label: products[itemName].label,
						imageUrl: products[itemName].imageUrl
					});
				});
			self.onUpdate();
			callback(null, products);
		},
		function(error){
			callback(error);
		}
	)
}

export { Store };