var route_parser = require('./../express_happiness_router/parser');
var register_error_middlewares = require('./../errors/register_error_middlewares');
var register_middlewares = require('./../middleware_registration/middleware_registration');
var parameters_validator = require('./../validation/validator');

module.exports = function(app, router){
	return function(base_url, pre_validation_middlewares, post_validation_middlewares){
		route_parser.parse();
		parameters_validator.initiate();
		register_middlewares(app, router, base_url, pre_validation_middlewares, post_validation_middlewares);
		register_error_middlewares(app);
	}
}
