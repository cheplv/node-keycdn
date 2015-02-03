/*
 *  KeyCDN Main API File
 */

function KeyCDN(username, password, endpoint) {
	this.needle = require("needle");
	this.needle.defaults({ timeout: 30000 });

	this.username = username;
	this.password = password;
	this.endpoint = endpoint || 'https://www.keycdn.com/';
	
	this.cookie = "";
	
	this.getUsername = function() { return this.username; };
	this.setUsername = function(username) { this.username = username; return this; };
	this.getPassword = function() { return this.password; };
	this.setPassword = function(password) { this.password = password; return this; };
	this.getEndpoint = function() { return this.endpoint; };
	this.setEndpoint = function(endpoint) { this.endpoint = endpoint || this.endpoint; return this; };
	
	this.get = function(method, params, cb) {
		this.execute('GET', method, params, cb);
	}
	
	this.post = function(method, params, cb) {
		this.execute('POST', method, params, cb);
	}
	
	this.put = function(method, params, cb) {
		this.execute('PUT', method, params, cb);
	}

	this.delete = function(method, params, cb) {
		this.execute('DELETE', method, params, cb);
	}
	
	this.execute = function(action, method, params, cb) {
		var qs = require('querystring'); 
		var options = {
			headers: {},
			auth: 'basic',
			username: this.getUsername(),
			password: this.getPassword(),
			debug: true
		}
		
		var endpoint = this.getEndpoint().replace(/\/+$/,'') + '/' + method.replace(/^\/+/,'');
		var qs_args = qs.stringify(params);

		var needle_callback = function(err, resp) {
			var rv_err = null;
			if (resp.statusCode != "200") {
				return cb('KeyCDN-Error: Invalid response status - ' + resp.statusCode, {});
			}
			cb(err, resp.body || {});
		}
		
		switch(action) {
			case 'GET':
				this.needle.get(endpoint + "?" + qs_args, options, needle_callback);
				break;
				
			case 'POST':
			case 'PUT':
			case 'DELETE':
				var endpoint_action = action.toLowerCase();
				if (typeof this.needle[endpoint_action] != 'function') {
					return cb('KeyCDN-Error: Unknown Method - ' + action, {});
				}
				
				this.needle[endpoint_action](endpoint, params, options, needle_callback);
				break;
				
			default:
				return cb('KeyCDN-Error: Unknown Method - ' + action, {});
				break;
		}
	}
}

module.exports = KeyCDN;