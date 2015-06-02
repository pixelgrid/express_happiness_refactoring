module.exports = function(){
	
	var application_state = require('./../state/state');
	var fs = require('fs');
	var all_files_exist = true;
	var configuration_object = application_state.get('configuration_object');

	var files_to_check = [
		configuration_object.reusableFieldsFile,
		configuration_object.errorFile,
		configuration_object.errorsConfigurationFile,
		configuration_object.apiConfigurationFile,
		configuration_object.controllersFile,

	];

	files_to_check.forEach(function(filename){
		if(!fs.existsSync(filename)){
		    all_files_exist = false;
		    var msg = "Reusable fields file (" + filename + ") does not exist. Please create it according the documentation";
		    console.log(msg.red.bgWhite);
		}
	});


	if(configuration_object.mockData.enable && !fs.existsSync(configuration_object.mockData.folder)){
	    all_files_exist = false;
	    var msg = "Mock data folder (" + configuration_object.mockData.folder + ") does not exist. Please create it according the documentation"
	    console.log(msg.red.bgWhite);
	}

	if(!all_files_exist){
		console.log("Routes generation process skipped due to errors. Please fix the errors accordingly and retry".red.bgWhite);
		process.exit(0);
	}

	return true;
}