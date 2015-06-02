var helper_functions = require('./helpers/helpers');

module.exports = function(route, pre_validation_middlewares){
	route.get(helper_functions.putMethodsOnReq('get'));
	route.get(helper_functions.putApipathToReq([], ''));

	// for the top level url, before the examination of the 
	// user defined routes, isRoot is set to true
	route.get(function(req, res, next){
	    req.isRoot = true;
	    return next();
	});

	//this is an object, parsed as an array?
	for(var i=0; i<pre_validation_middlewares.length; i++){
	    route.all(pre_validation_middlewares[i]);
	}

	//if the top level base url is requested
	//we serve up the page which documents the api defined
	route.get(function(req, res){
	    var fs = require('fs');
		var flatSignature = require('./../documentation/document_method').flatSignature;
	    fs.readFile(__dirname + '/../views/index.html', { 'encoding':'utf8'}, function(err, data){
	        if(err){
	            console.log(err);
	        } else {
	            var _ = require('underscore');
	            var template = _.template(data);
	            res.send(template({signature:flatSignature}));
	        }
	    });
	});
}