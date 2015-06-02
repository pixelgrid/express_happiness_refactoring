var register_eh_all_routes_middleware = require('./register_eh_all_routes_middleware');
var register_all_middlewares = require('./register_all_middlewares');
var register_parameters_validation_middleware = require('./register_parameters_validation_middleware');
var register_mock_middleware = require('./register_mock_middleware');
var register_controller_function_middleware = require('./register_controller_function_middleware');
var register_request_augmenting_middlewares = require('./register_request_augmenting_middlewares');
var mock_middleware_added = require('./mock_middleware_added');
var document_route = require('./../documentation/document_method').document;

module.exports = function register_route_middlewares(app, router, base_url, pre_validation_middlewares, post_validation_middlewares){

	var application_state = require('./../state/state');
	var routes_tree = application_state.get('routes_tree');
	var route = router.route(base_url + '/');

	register_request_augmenting_middlewares(router, base_url, pre_validation_middlewares);

	/**
	 * For all the parameters bellow params go as follows
	 *
	 * @param {object} node, the current object from the routes configuration being examined
	 * @param {string} nodeName, the key of the current route
	 * @param {string} baseUrl, the baseUrl passed in the expressHappiness generate function
	 * @param {array} inheritedGroups, the groups that are inherited from previous parts of the route 
	 * @param {object<arrays>} pre_validation_middlewares, the object with the middlewares passed from the user
	 * for pre validation registration
	 * @param {object<arrays>} post_validation_middlewares, the object with the middlewares passed * from the user for post validation registration
	 */
	for(var route in routes_tree){
		['get', 'post', 'put', 'delete'].forEach(function(method){

			register_eh_all_routes_middleware(route, method, pre_validation_middlewares);
			register_all_middlewares(route, method, middlewares, inheritedGroups);
			register_parameters_validation_middleware();

			/** document the route, to be presented when accessing baseurl */
			document_route(base_url, node, method, nodeName);

			/** checks if mocking is enabled and if the mocking file exists */
			app.use(register_mock_middlewares(type, path, nodeName, alias));

			/** if mocking exists is returned and the request is terminated*/
			app.use(mock_middleware_added);

			register_eh_all_routes_middleware(route, method, post_validation_middlewares);
			register_all_middlewares(route, method, post_validation_middlewares, inheritedGroups);
			register_controller_function_middleware(node, route, method, path, nodeName);

			//if there is a subroutes property call function recursivelly
		});

		if('subRoutes' in route){
			register_route_middlewares(app, router, base_url, pre_validation_middlewares, post_validation_middlewares);
		}
	}
	
	app.use('', route);

	//failsafe?
	app.get('*', function(req, res, next){
	    var err = new Error();
	    err.type = '404';
	    return next(err);
	});


	/*
		Pre validation eh-allRoutes middleware
		Pre validation middlewares
		Attributes validation middleware
		Mocking Middlewares
			The first one checks if mocking is enabled and a mock file exists and returns a function returning its contents
			The second one registers a middleware that returns them contents
		Post validation eh-allRoutes middleware
		Post validation middlewares
		Controller function middleware
	*/
}