var erH, reusableRequiredFields;
var validator = require('validator');
var moment = require('moment');
var routes_configuration;
var unitValidator = require('./type_validators');
var errorHandler = require('./../errors/error_handler.js');
var validation_helpers = require('./validation_helpers'); 
var validateEmail = validation_helpers.validateEmail;
var hasTheErrorKey = validation_helpers.hasTheErrorKey;

exports.initiate = function(){
    var application_state = require('./../state/state');
    var configuration_object = application_state.get('configuration_object');
    var errorFile = application_state.get('errorFile');
    var errorsConfigurationFile = application_state.get('errorsConfigurationFile');
    erH = new errorHandler(confObj.errorFile, confObj.errorsConfigurationFile);
}

// this functions takes all fields to be validated
// and then passes them to the unitValidate function which checks each one
var firstLevelIterator = function(fields, errors, req, func, callback){
    var index = 0;
    var done = false;
    var iterations = fields.length;
    var loop = {
        next: function(){
            if(done){
                return;
            }

            if(index < iterations){
                var self = this;
                var theField = fields[index];
                unitValidate(theField, errors, req, [theField.key],
                    function(){
                        index++;
                        func(self);
                    }
                );
            } else {
                done = true;
                callback();
            }
        }
    }

    loop.next();
    return loop;
}

// validates object type
// passes each key to the unitValidate function
// if there are nested object this function will be called recursivelly
var validate = function(obj, errors, req, path, func, callback) {
    var index = 0;
    var done = false;
    var iterations = Object.keys(obj.keys).length;
    var objKeys = Object.keys(obj.keys);
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                var newPath = path.slice();
                newPath.push(objKeys[index]);
                var self = this;
                unitValidate(obj.keys[objKeys[index]], errors, req, newPath, function(){
                    index++;
                    func(self);
                });

            } else {
                done = true;
                callback();
            }
        }
    };

    loop.next();
    return loop;
};

/*
 @unit: the unit to be validated taken from the signature
 @req: the request object
 @path: the base path of the current unit. It's an array
 @isRoot: a boolean indicating whether the passed unit is the root definition object or not
 @unitValidator: an instance of the unitValidator object defined above
 @callback: the callback to be called after the validation process
 */
var unitValidate = function(unit, errors, req, path, callback){
    var get = req.expressHappiness.get;
    var set = req.expressHappiness.set;

    // step 1: check if the parameter is present if it's mandatory according to the signature
    var mandatoryIssue = false;
    if(path.length > 0){
        if(unit.mandatory){
            try{
                var test_var = get(path[0]);
                for(var i=1; i<path.length; i++){
                    test_var = test_var[path[i]];
                }
                if(test_var === undefined || test_var === null){
                    errors.push(path.join('.') + ' is mandatory. Though is missing');
                    mandatoryIssue = true;
                }
            } catch(e){
                errors.push(path.join('.') + ' is mandatory. Though is missing');
                mandatoryIssue = true;
            }
        }
    }

    if(!mandatoryIssue){
        if(unit.type === 'object'){
            validate(unit, errors, req, path, function(loop){
                loop.next();
            }, callback)
        } else {
            try{
                var value = get(path[0]);
                for(var i=1; i<path.length; i++){
                    value = value[path[i]];
                }
                if(value === undefined || value === null){
                    callback();
                } else {
                    var validationFunct = unitValidator[unit.type];
                    validationFunct(unit, value, path, errors, callback);
                }
            } catch(e){
                callback();
            }
        }
    } else {
        callback();
    }

};

// exports.validateAttrs = require('./helpers/validation/attributes_validator');
exports.validateAttrs = function(req, res, next){
    var get = req.expressHappiness.get;
    var set = req.expressHappiness.set;

    //no route for current request
    if(! routes_configuration.routes[req.expressHappiness.apipath[0]] && !req.isRoot){
        var err = new Error();
        err.type = '404';
        return next(err);
    } 

    //top level request
    else if(! routes_configuration.routes[req.expressHappiness.apipath[0]] && req.isRoot){
        return next();
    } 
    // route exists
    else {
        var currentNode = routes_configuration.routes[req.expressHappiness.apipath[0]];
        for(var i=1; i<req.expressHappiness.apipath.length; i++){
            currentNode = currentNode.subRoutes[req.expressHappiness.apipath[i]];
            if(!currentNode){
                var err = new Error();
                err.type = '404';
                return next(err);
                break;
            }
        }

        //nothing to validate continue
        if(!currentNode[req.expressHappiness.apiMethod].fields){
            return next();
        }

        var errors = [];

        firstLevelIterator(currentNode[req.expressHappiness.apiMethod].fields, errors, req, function(loop){
            loop.next();
        }, function() {
            if (errors.length > 0) {
                var err = new Error();
                err.type = 'invalidAttrs';
                err.details = errors;
                return next(err);
            } else {
                return next();
            }
        });
    }
}
