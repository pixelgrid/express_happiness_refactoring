var path = require('path');
var application_directory = path.dirname(require.main.filename);

module.exports = {
    mockData:{
        enable: true,
        folder: application_directory + '/mockJSONs',
        global:false
    },
    reusableFieldsFile: application_directory + '/expressHappiness/reusableFields.js',
    errorFile : application_directory + '/expressHappiness/errors.log',
    errorsConfigurationFile : application_directory + '/expressHappiness/conf/errors.js',
    apiConfigurationFile : application_directory + '/expressHappiness/conf/routing_configuration.js',
    controllersFile : application_directory + '/expressHappiness/controllerFunctions.js'
}