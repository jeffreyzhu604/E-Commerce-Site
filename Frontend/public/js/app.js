import { ProductsView } from './ProductsView.js';
import { MenuView } from './MenuView.js';
import { StoreTimer } from './Timer.js';                 
import { Store } from './Store.js';
import { ProductModal } from './ProductModal.js'

var store = new Store("http://localhost:3000", new StoreTimer());
store.timer.startTimer();
var displayed = []; // Store the keys of products that should be displayed in the view

window.onload = function() {
	var addBtn = document.getElementsByClassName("btn-add");
	var removeBtn = document.getElementsByClassName("btn-remove");
	var showCartBtn = document.getElementById("btn-show-cart"); // Not working
	var productView = document.getElementById("productView");
	var modal = document.getElementById("modal");
	var hideCartBtn = document.getElementById("btn-hide-cart"); // Not working
	var menu = document.getElementById("menuView");

	var productsView;

	store.syncWithServer(function(delta) {
		var index = 0;
		console.log(delta)
		var products = Object.keys(delta);
		for (var key in products) {
				displayed[index] = products[key];
				index++;
		}
		console.log(displayed);
		console.log('syncWithServer callback');
		
		// Event listeners must be added ONCE to each element
		// Add all event listeners at once??
		var promise = new Promise(function(resolve, reject) {
			productsView = new ProductsView(productView, displayed, store);
			productsView.initEvents(productView, store);				
			var menuView = new MenuView();
			menuView.renderButton(menu, store);
			menuView.initEvents();
			var productModal = new ProductModal(document.getElementById("product-modal-content"), store);
			resolve(store);			
		}).then(function(store) {			
			store.state["cart"].modal.initEvents(document.getElementById("modal-content"), store);
			store.state["product"].modal.initEvents(document.getElementById("product-modal-content"), store);
			console.log('state', store.state);
		});
	});
};		

