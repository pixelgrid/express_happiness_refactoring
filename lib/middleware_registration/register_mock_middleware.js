module.exports = function(type, path, nodeName, alias){
    var express_happiness_state = require('./../state/state');
    var configuration_object = express_happiness_state.get('configuration_object');
    
    if(!configuration_object.mockData.enable){
        return function(req, res, next){
            return next();
        }
    }

    var filename = '';
    var route = '';

    for(var i=1; i<path.length; i++){
        filename += path[i] + '.';
        route += path[i] + '/';
    }
    
    route += nodeName;
    filename += nodeName;

    if(alias){
        if(fs.existsSync(configuration_object.mockData.folder + '/' + alias + '.json')){
            var mockData = require(configuration_object.mockData.folder + '/' + alias + '.json');

            return function(req, res, next){
                req.expressHappiness.mockQuery = function(success){
                    success(mockData);
                }
                return next();
            }
        }
    }


    if(fs.existsSync(configuration_object.mockData.folder + '/' + type + '.' + filename + '.json')){
        var mockData = require(configuration_object.mockData.folder + '/' + type + '.' + filename + '.json');

        return function(req, res, next){
            req.expressHappiness.mockQuery = function(success){
                success(mockData);
            }
            return next();
        }
    } else {
        var msg = '-- WARNING -- No mock data found for ' + route + ' route. Please create file named ' + filename + '.json and place it on mockJSONs folder';
        console.log(msg.red.bgWhite);
        return function(req, res, next){
            req.expressHappiness.mockQuery = function(success){
                var err = new Error();
                err.type = 'noMockData';
                return next(err);
            };
            return next();
        }
    }
}