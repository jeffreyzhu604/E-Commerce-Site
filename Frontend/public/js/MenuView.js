import { ProductsView } from './ProductsView.js';

var MenuView = function(container, storeInstance) {
	// console.log('MenuView');
	// this.renderMenu(container, storeInstance);
};

MenuView.prototype.initEvents = function() {
	console.log('initEvents MenuView');
	/* When the user clicks on the button,
	toggle between hiding and showing the dropdown content */
	document.getElementById("dropbtn").addEventListener("click", function() {
		console.log('Showing menu');
		document.getElementById("myDropdown").classList.toggle("show");
		console.log(document.getElementById("myDropdown").classList);
	}, false);

    // Prevents menu from closing when clicked inside 
    document.getElementById("myDropdown").addEventListener('click', function (event) { 
        if (event.target.id == "min-price" || event.target.id == "max-price")
        	event.stopPropagation(); 
        console.log('preventing close',event.target)
    });

	// Close the dropdown menu if the user clicks outside of it
	window.onclick = function(event) {
	  if (!event.target.matches('.dropbtn')) {
	    var dropdowns = document.getElementsByClassName("dropdown-content");
	    console.log('dropdowns', dropdowns);
	    var i;
	    for (i = 0; i < dropdowns.length; i++) {
	      var openDropdown = dropdowns[i];
	      console.log(openDropdown);
	      if (openDropdown.classList.contains('show')) {
	        openDropdown.classList.remove('show');
	      }
	    }
	  }
	}	
}

MenuView.prototype.renderButton = function(container, storeInstance) {
	console.log('renderButton');
	var menuButton = document.createElement('button');
	menuButton.id = "dropbtn";
	menuButton.classList.add("dropbtn");
	menuButton.innerHTML = "Menu";
	container.appendChild(menuButton);
	var renderedMenu = this.renderMenu(document.createElement('div'), storeInstance);
	console.log(renderedMenu);
	container.appendChild(renderedMenu);
	console.log(container.childNodes);
}

/*
	renderMenu - Renders the product category menu and the price filters on
	the given DOM element.
*/
MenuView.prototype.renderMenu = function(container, storeInstance){
	// NOTE: perhaps this is the correct way to empty a container.. Use to 
	// refactor code..
	while (container.lastChild) container.removeChild(container.lastChild);
	container.id = "myDropdown";
	container.classList.add("dropdown-content");
	if (!container._filters) {
		// Query object
		container._filters = {
			minPrice: null,
			maxPrice: null,
			category: ''
		};
		container._refresh = function(){
			storeInstance.queryProducts(container._filters, function(err, products){
					if (err){
						alert('Error occurred trying to query products');
						console.log(err);
					}
					else {
						var displayed = Object.keys(products);
						var productList = new ProductsView(document.getElementById('productView'), displayed, storeInstance);
					}
				});
		}
	}

	var box = document.createElement('div'); container.appendChild(box);
		box.id = 'price-filter';
		var input = document.createElement('input'); box.appendChild(input);
			input.id = "min-price";
			input.type = 'number';
			input.value = container._filters.minPrice;
			input.min = 0;
			input.placeholder = 'Min Price';
			input.addEventListener('blur', function(event){
				container._filters.minPrice = event.target.value;
				container._refresh();
			});

		input = document.createElement('input'); box.appendChild(input);
			input.id = "max-price";
			input.type = 'number';
			input.value = container._filters.maxPrice;
			input.min = 0;
			input.placeholder = 'Max Price';
			input.addEventListener('blur', function(event){
				container._filters.maxPrice = event.target.value;
				container._refresh();
			});

	var list = document.createElement('ul'); container.appendChild(list);
		list.id = 'menu';
		list.classList.add('menu');
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === '' ? ' active': '');
			listItem.appendChild(document.createTextNode('All Items'));
			listItem.addEventListener('click', function(event){
				container._filters.category = '';
				container._refresh()
			});
	var CATEGORIES = [ 'Clothing', 'Technology', 'Office', 'Outdoor' ];
	for (var i in CATEGORIES){
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === CATEGORIES[i] ? ' active': '');
			listItem.appendChild(document.createTextNode(CATEGORIES[i]));
			listItem.addEventListener('click', (function(i){
				return function(event){
					container._filters.category = CATEGORIES[i];
					container._refresh();
				}
			})(i));
	}
	return container;
}

export { MenuView };