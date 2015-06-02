/**
 * Applies the eh-allRoutes middlewares before and after the parameters validation
 * 
 * @param  {Express Route} route, the express route currently being handled
 * @param  {string} method, The http method currently being registered
 * @param  {array}
 * @return {undefined}
 */
module.exports = function (route, method, middlewares){
    if('eh-allRoutes' in middlewares){
        middlewares['eh-allRoutes'].forEach(function(middleware_name){
            route[method](middleware_name);
        });
    }
}