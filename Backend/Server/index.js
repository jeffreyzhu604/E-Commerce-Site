// Require dependencies
var path = require('path');
var express = require('express');
var StoreDB = require('../Model/StoreDB');

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, '../../frontend/public');
console.log(__dirname);

// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
  	next();
}

// Declare StoreDB instance
var db = new StoreDB("mongodb://127.0.0.1:27017", "cpen400a-bookstore");
console.log(db);

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource
// app.use(express.static(STATIC_ROOT));

// Configure '/products' endpoint
app.get('/products', function(request, response) {
	var query = request.query;
	console.log(query);
	var promise = new Promise(function(resolve, reject) {
		db.getProducts(query).then(function (productList) {
			resolve(productList);
		}).catch(function() {
			reject('Unsuccessful retrieval from database');
		});
	});
	promise.then(function(productList) {
		console.log('Successful retrieval from database');
		response.send(productList);
	}).catch(function(message) {
		res.send(500).send(message);
	});

});


app.post('/checkout', function(request, response) {
	console.log('post endpoint');	
	var orders = request.body;
	console.log('orders before promise', orders);
	var promise = new Promise(function(resolve, reject) {
		var orderList = db.addOrder(orders);
		resolve(orderList);
	});
	promise.then(function(orders) {
		console.log('orders after promise', orders);
		response.send(orders);
	})
})

// Start listening on TCP port
app.listen(PORT, function(){
    console.log('Express.js server started, listening on PORT '+ PORT);
});