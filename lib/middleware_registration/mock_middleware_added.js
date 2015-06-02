module.exports = function(req, res, next){
    var express_happiness_state = require('./../state/state');
    var configuration_object = express_happiness_state.get('express_happiness_state');
    
    if(configuration_object.mockData.global){
        req.expressHappiness.mockQuery(function(results){
            return res.send(results);
        });
    } else if((req.expressHappiness.get('mock') != 1 && !req.expressHappiness.mock) || configuration_object.mockData.enable){
        return next();
    } else {
        req.expressHappiness.mockQuery(function(results){
            return res.send(results);
        });
    }
}
