var application_state = {};

module.exports = {
	get : function(key, default_value){
		return application_state[key] || default_value;
	},
	set : function(key, value){
		application_state[key] = value;
	}
}