module.exports = function(node, route, method, path, nodeName){
    var application_state = require('./../state/state');
    var controllers_collection = application_state.get('controllers_collection');

    // if the route has an allias 
    // and there is a controller function registered with that alias
    // it is added as a middleware
    var aliasedFunction = false;
    if(node[method].alias){
        if(controllers_collection.functions[node[method].alias] != undefined && controllers_collection.functions[node[method].alias] != null){
            route[method](controllers_collection.functions[node[method].alias]);
            aliasedFunction = true;
        }
    }

    // if no alias like named controller function exists
    // tries to find a function of the pattern
    // <http method name> : <joined paths>
    // like get:/about
    if(!aliasedFunction){
        if(controllers_collection.functions[method + ":" + path.join('/') + '/' + nodeName] != undefined && controllers_collection.functions[method + ":" + path.join('/') + '/' + nodeName] != null){
            route[method](controllers_collection.functions[method + ":" + path.join('/') + '/' + nodeName]);
        } else {

            //warning message is displayed if no controller function is found 
            var msg = '-- WARNING -- There is currently no control method defined for route ' + path.join('/') + '/' + nodeName + '. Please create it on /controllers/routesControllerFunctions.js and assign it to functions["' + path.join('/') + '/' + nodeName + '"]';
            console.log (msg.red.bgWhite)//if no contoller function is found for a route
            // this middleware runs;
            // and throws an error

            route[method](noControlMethodCallback);
        }
    }
}