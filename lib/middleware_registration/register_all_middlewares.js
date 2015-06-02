/**
 * Function that applies middlewares 
 * before and after the parameters validation
 *
 *
 * @param  {Express Route} route, the express route currently being handled
 * @param  {string} The http method currently being registered
 * @param  {Array} middlewares, An array of middlewares to be applied
 * @param  {Array} inheritedGroups, the groups of the route plus everything that is inherited
 * @return {undefined}
 */
module.exports = function (route, method, middlewares, inheritedGroups){
    inheritedGroups.forEach(function(group_name){
        if(group_name in inheritedGroups){
            inheritedGroups[group_name].forEach(function(middleware_name){
                route[method](middleware_name);
            })
        }

    });
};