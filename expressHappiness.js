var enviroment_setup = require('./lib/configuration/enviroment_setup');
var bootstrap = require('./bootstrap/bootstrap');

function expressHappiness(app, router, user_configuration){
	enviroment_setup(app, router, user_configuration);
	this.generate = bootstrap(app, router);
}

module.exports = expressHappiness;