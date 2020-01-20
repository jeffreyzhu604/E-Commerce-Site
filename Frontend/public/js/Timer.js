const StoreTimer = function() {
	this.inactiveTime = 0;
};

StoreTimer.prototype.startTimer = function() {
	console.log('startTimer');
	var timer;
	var self = this;
	var handleTimeout = function() {
		alert("Hey there! Are you still planning to buy something?");
		self.resetTimer();
	};
	timer = setInterval(function() {
		self.inactiveTime++;
		// Test w/ 1 second
		if (self.inactiveTime === 300){
			handleTimeout();
		} 		
	}, 1000);	
}

StoreTimer.prototype.resetTimer = function() {
	console.log('resetTimer');
	this.inactiveTime = 0;
}

export { StoreTimer };