module.exports = function(app){
    var application_state = require('./../state/state');
    var configuration_object = application_state('configuration_object');
    var errorsConfigurationFile = configuration_object.get('errorsConfigurationFile');
    var errorFile = configuration_object.get('errorFile'); 
    var errors = require(errorsConfigurationFile).errors;
    var predefined_errors = require('./predefined_errors');

    [
        'undefinedError',
        'invalidAttrs',
        'noMockData',
        'underDevelopment',
    ].forEach(function(error_name){
        if(!errors.hasOwnProperty(error_name)) {
            errors[error_name] = predefined_errors[error_name];
        } else {
            errors[error_name] = formatError(predefined_errors[error_name], errors[error_name])
        }        
    });

    if(!errors.hasOwnProperty('404')) {
        errors['404'] = fourZeroFour;
    } else {
        errors['404'] = formatError(fourZeroFour, errors['404'])
    }

    var ErrorHandlerModule = require('../../ErrorHandler.js');
    var ErrorHanlder = new ErrorHandlerModule(errorFile);

    app.use(function (err, req, res, next) {
        if(errors.hasOwnProperty(err.type)){
            ErrorHanlder.handleError(errors[err.type], err, req, res);
        } else {
            ErrorHanlder.handleError(errors.undefinedError, err, req, res);
        }
    });
};

function formatError(error, options){
    var keys = Object.keys(options);
    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        error[key] = options[key];
    }
    return error;
}