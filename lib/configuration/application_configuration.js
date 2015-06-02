var default_configuration = require('./default_configuration');
var _ = require('underscore');
var application_state = require('./../state/state');

module.exports.merge = function(user_configuration){
	var configuration_object = _.merge(default_configuration, user_configuration);
	application_state.set('configuration_object', configuration_object);
}