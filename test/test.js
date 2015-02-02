var async = require('async');

function test(cb) {
	var KeyCDN = require('../index.js');
	
	var api = new KeyCDN(process.env.KEYCDN_USER || 'user_name', process.env.KEYCDN_PASS || 'password');
	
	async.waterfall([
	//Get Zones
	function(callback) {
		api.get('zones.json', {}, function(err, result) {
			console.log('zones.json', err, result);
			callback(err);
		})
	}
	], function(err) {
		cb(err);
	});
}

test(function(err) {
	console.log('Test Done');
});
