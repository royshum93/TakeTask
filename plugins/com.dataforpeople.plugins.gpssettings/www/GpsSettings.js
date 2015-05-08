
var exec = require('cordova/exec');

function GpsSettings() {
}

GpsSettings.prototype.launch = function() {
	exec(null, null, "GpsSettings", "launch", []);
};

GpsSettings.install = function() {
	if(!window.plugins) {
		window.plugins = [];
	}

	window.plugins.GpsSettings = new GpsSettings();
	return window.plugins.GpsSettings;
};

cordova.addConstructor(GpsSettings.install);