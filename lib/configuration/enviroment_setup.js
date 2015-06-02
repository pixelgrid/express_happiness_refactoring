var bootstrap = require('./../bootstrap/bootstrap');
var setup_files = require('./../setup_files/setup_files');
var application_configuration = require('./application_configuration');

module.exports = function(app, router, user_configuration){
	var configuration = application_configuration.merge(user_configuration);
	setup_files();
}