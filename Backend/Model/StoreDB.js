// You require the mongodb package and you get the MongoClient object from it
var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.

 * Primer for Promises:
 * https://codeburst.io/playing-with-javascript-promises-a-comprehensive-approach-25ab752c78c3
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		// Use the mongo.connect() method to get the reference to the MongoDB
		// instance client
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName));
				}
			}
		);
	});
}

/*
	Query object:
	
	Query = {
    	minPrice: Number|String,
    	maxPrice: Number|String,
    	category: String
	}

	Products = {
	    Product._id: {
	        "label": Product.label,
	        "price": Product.price,
	        "quantity": Product.quantity,
	        "imageUrl": Product.imageUrl,
	    },
	    Product._id: {
	        "label": Product.label,
	        ... 
	    },
	    Product._id: {
	        "label": Product.label,
	        ... 
	    },
	    ...
	}	
*/
StoreDB.prototype.getProducts = function(queryParams){
	return this.connected.then(function(db){
		// TODO: Implement functionality
		const collection = db.collection('products');
		var productList;

		if (isEmpty(queryParams)){
			// console.log('no queryParams');
			// collection.find({}).toArray(function(err, docs) {
			// 	productList = convertToObject(docs);
			// 	// console.log(productList);
			// 	return productList;
			// });
			return new Promise((resolve, reject) => {
				collection.find({}).toArray(function (err, docs) {
							if (err)
								reject(err);
							else {
								resolve(convertToObject(docs));
							}
					});	
				});	
		} else if (queryParams.minPrice) {
			if (queryParams.minPrice >= 0) {
				if (queryParams.maxPrice) {
					if (queryParams.category) {
						// minPrice, maxPrice and category
						console.log('minPrice, maxPrice and category');
						return new Promise((resolve, reject) => {
							collection.find({$and: [{price : {$gte: Number(queryParams.minPrice)}}, {price : {$lte: Number(queryParams.maxPrice)}}, {category : queryParams.category}]}).toArray((err, docs) => err ? reject(err) : resolve(convertToObject(docs)));
						});											
					} else {	
						// minPrice and maxPrice
						console.log('minPrice and maxPrice');
						return new Promise((resolve, reject) => {
							collection.find({$and: [{price : {$gte: Number(queryParams.minPrice)}}, {price : {$lte: Number(queryParams.maxPrice)}}]}).toArray((err, docs) => err ? reject(err) : resolve(convertToObject(docs)));
						});												
					}
				} else if (queryParams.category) {
					// minPrice and category
					console.log('minPrice and category');
					return new Promise((resolve, reject) => {
						collection.find({$and: [{price : {$gte: Number(queryParams.minPrice)}}, {category : queryParams.category}]}).toArray(function (err, docs) {
							if (err)
								reject(err);
							else {
								resolve(convertToObject(docs));
							}
						});	
					});												
				} else {
					// minPrice only
					console.log('minPrice');
					return new Promise((resolve, reject) => {
						collection.find({price : {$gte: Number(queryParams.minPrice)}}).toArray((err, docs) => err ? reject(err) : resolve(convertToObject(docs)));
					});						
				}
			}
		} else if (queryParams.maxPrice) {
			if (queryParams.category) {
				// maxPrice and category
				console.log('maxPrice and category');
				return new Promise((resolve, reject) => {
					collection.find({$and: [{price : {$lte: Number(queryParams.maxPrice)}}, {category : queryParams.category}]}).toArray((err, docs) => err ? reject(err) : resolve(convertToObject(docs)));
				});										
			} else {
				// maxPrice only
				return new Promise((resolve, reject) => {
					collection.find({price : {$lte: Number(queryParams.maxPrice)}}).toArray(function (err, docs) {
							if (err)
								reject(err);
							else {
								resolve(convertToObject(docs));
							}
						});	
					});	
				}	
		} else {
			// category only
			console.log('category');
			return new Promise((resolve, reject) => {
				collection.find({category : queryParams.category}).toArray((err, docs) => err ? reject(err) : resolve(convertToObject(docs)));
			});							
		}
	}) 
}

function convertToObject(products) {
	var productList = {};
	for (var item in products) {
		/*
			Each item in productList is an object that contains:
			- _id
			- label
			- price
			- quantity
			- imageUrl
			- category

			Extract the _id and use that as a product key to 
			map each product object
		*/
		if (products[item].hasOwnProperty('_id')) {
			productList[products[item]._id] = {};
			productList[products[item]._id] = products[item];
			delete productList[products[item]._id]._id;
		}
	}
	// console.log(productList)
	return productList;	
}

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

StoreDB.prototype.addOrder = function(order) {
	console.log('addOrder');
	return this.connected.then(function(db) {
		console.log(order);
		var orders = db.collection('orders');
		var products = db.collection('products');
		return insert(order, orders, db)
		.then(function(updatedOrdersList) {
			return obtainOrders(updatedOrdersList);
		})
		.then(function(orderList) {
			return updateProducts(orderList, products);
		})
		.then(function(updatedProductsList) {
			return updatedProducts(updatedProductsList);
		})
		.then((result) => result)
		.catch((err) => console.log('There was an issue in the promise chain\n' + err));
	});
}

function insert(order, orders, db) {

	// Collection.insert returns a promise
	console.log('Inserting order into orders collection');
	return orders.insert(order)
				.then(() => db.collection('orders'));
}

function obtainOrders(orders) {
	return new Promise(function(resolve, reject) {
		console.log('Obtaining orders');
		orders.find({}).toArray((err, docs) => err ? reject(err) : resolve((docs)));
	});
}

function updatedProducts(products) {
	return new Promise(function(resolve, reject) {
		var productList = products.find({}).toArray();
		resolve(productList);
	});
}

function updateProducts(orderList, products) {
	return new Promise(function(resolve, reject) {
		console.log('Getting the products that match the cart')
		var promises = []; // Contains promises for each product object in the order
		var productList;
		var promises2 = [];
		var cartQuantity;
		// TO DO: Make this scalable
		console.log('orderList', orderList);
		for (var item in orderList[0].cart) {
			console.log('item', item);
			// [Promise, Promise, ... ] - Each Promise represents an array to hold a product object
			promises.push(products.find({$and : [{"_id" : item}, {"quantity" : {$gte: 0}}]}).toArray());
		}
		Promise.all(promises).then(function(result) {
			productList = result;
			console.log('productList', productList);

			// TO DO: Make this scalable
			for (var item of productList) {
				for (var key in orderList[0].cart) {
					if (item[0]._id == key) {
						cartQuantity = orderList[0].cart[key];
					}
				}
				promises2.push(products.update({"_id" : item[0]._id}, {$set :{"quantity" : (item[0].quantity - cartQuantity)}}));
			}
			Promise.all(promises2).then(() => console.log('Products updated'));
			resolve(products);
		});
	});
}



module.exports = StoreDB;