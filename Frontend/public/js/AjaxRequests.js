const ajax = {
	ajaxGet: function(url, onSuccess, onError) {
				console.log('ajaxGet');
				var count = 0;
				var response;
				var sendRequest = function() {
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url);
					console.log(url);
					xhr.onload = function() {
						if (this.readyState == 4 && this.status == 200) {
							response = JSON.parse(this.responseText);
							count = 0;
							if (onSuccess)
								onSuccess(response);
							return response;
						} else {
							++count;
							if (count === 3) {
								count = 0;
								if (onError)
									onError(this.status);
								return;
							}
							sendRequest();
						}
					}
					xhr.ontimeout = function() {
						console.log('timed out');
						++count;
						if (count === 3) {
							count = 0;
							if (onError)
								onError(this.status);
							return;
						}
						sendRequest();
					}
					xhr.timeout = 5000;
					xhr.send();		
				}
				return sendRequest();
			},
	ajaxPost: function(url, data, onSuccess, onError) {
				console.log('ajaxPost');
				console.log(url, data);
				var xhr = new XMLHttpRequest();
				var response;
				var count = 0;
				xhr.open('POST', url);
				xhr.onreadystatechange = function() {
					console.log(this.readyState, this.status);
					if (this.readyState == 4 && this.status == 200) {
						onSuccess(xhr.responseText);
						return;	
					} else {
						onError(this.status);
						console.log(xhr.responseText);
						console.log('Error');
						return;
					}
				}
				xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xhr.ontimeout = function() {
					console.log('timed out');
					++count;
					if (count === 3) {
						count = 0;
						if (onError)
							onError(this.status);
						return;
					}
				}
				xhr.timeout = 5000;
				xhr.send(JSON.stringify(data));
			}
};

export { ajax };