module.exports.parse = function(){
	var routes_tree;
	var application_state = require('./../state/state');
	var configuration_object = application_state.get(configuration_object);
	var parser = configuration_object.get('json_schema_parser');
	var route_configuration_object = configuration_object.get('apiConfigurationFile')

	if(parser){
		parser = require('./../parsers/' + parser + '_parser');
		routes_tree = parser.parse()
	}else{
		var user_defined_routes_file = configuration_object.get('apiConfigurationFile');
		var fields_loader = require('./../helpers/fields_loader');
		routes_tree = require(user_defined_routes_file).conf(fields_loader).routes;
	}

	application_state.set('routes_tree', routes_tree);
}