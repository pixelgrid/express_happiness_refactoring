#Express Happiness Notes

##Error Handling
* Happens in expressHappiness.js and ErrorHandler.js
* the trigger function is in expressHappiness.js (registerErrors LINE 210)
* The function imports the ErrorHandler.js module (which makes the actual error reporting) 
* creates some default error types and then uses them through a closuse in conjunction with a middleware
* (CAN BE FULLY ABSTRACTED)


##Mocking
###mockQueryGenerationMiddleWare (function)
* if mocking is enabled
* creates a string of the paths
* i.e. for GET /home/user/new and an nodename/alias of create
* searches for a file named get.home.user.new.create.json if no alias exists
* or create.json if alias is present
* if found the contents of the mock data file are passed to a request parameter
* named expressHappiness as a function which when called returns the mock data
	
###mockMiddlewareApplied (function)
* registered as a middleware right after mockQueryDenerationMiddleWare function
* if the global flag of the mockData object passed when creating the express happiness app is true
* the function return as a middleware ends the request passing as a response the data returned from the 
* above function( which is the data read from the mock file found)

* (partialy dependend on the route so it can find the mocking file, can be extracted to own module and called with a single arguament)

	
##Augmenting the request object

###putApipathToReq (accepts the path, nodeName = id of the route as declared in routes, its alias, mock boolean)
* returns a middleware function which augments the expressHappiness object on the request object with
 * apipath -> the path array minus the first value plus the nodeName, if toplevel is just the nodename
 * routeAlias -> the alias passed
 * mock -> the mock boolean passed
		
###putMethodsOnReq (gets as a param the http method used)
* returns a middleware which resets the express happiness object in the request object to an empty object (MIGHT BE A BUG)
* augments it with 3 variables
 * apiMethod -> the http method passed
 * get -> the getGetter helper method which returns a function that
  * if the http method is get, retrieves the requested value from the req.query object else gets it from the req.body property created from the body-parser middleware

 * set -> the getSetter helper method which returns a function that
  * if the http method is get, sets the requested value to the req.query object else sets it to the req.body property created from the body-parser middleware
		
 * (partially depended on the current state of the route the code runs on)


## Controller functions

* They get registered in the configuration file specified by the user which exports an array (by mistake ?) with key value pairs of routes-> controller functions

* The priority of resolving is
 * if there is a array key same as the route alias then that function selected
 * if there is a key of the patern <http method>:<path> seperated with dots then that function is selected
 * if none of the above then a default middleware that throws an error is returned (no controller asscociated error) 

##Middleware sequence
* Pre validation eh-allRoutes middleware
* Pre validation middlewares
* Attributes validation middleware
* Mocking Middlewares
 * The first one checks if mocking is enabled and a mock file exists and returns a function returning its contents
 * The second one registers a middleware that returns them contents
* Post validation eh-allRoutes middleware
* Post validation middlewares
* Controller function middleware
* Error handling middleware(moved)

##Attribute validation Process
* If the declared route has no fields proccess is skipped
* For each field registered the unitValidate function runs on it which
 * If the field has not been passed in the request an error is pushed in the errors array
 * A validate function is chosen based on the unit type (no checking if it exists)
 * This function checks its type against the type declared ( with the validate library)
 * also based on type might check min value, max value (int), min length , max length (string), in array for oneof and so on
 * string has an undocumented regexp validation field
 * The process continues for all fields even if errors occur
 * If they do the error is pushed in the error array which based on the error type defined or setting might be logged in console, send to client, written in errors.log file
 * If the errors array is not empty in this point an error is passed from the middleware just next() otherwise

##Express Happiness Flow
* The user defined configuration object is merged with the default configuration
* The user defined files corresponding to configuration are checked for existence
 * If a file is missing an error is raised and process is exited
 * For each route defined middlewares as defined above are registered
  * If the current route has a subroute key the process is continue recursively
* Errors are registered
* Express app is fired up (listens to port)

## Unused functions and errors
* Errors
 * The has hasKeyError function has a typo preventing the user defined error to be logged
* Unused functions
 * expressHappiness.start and isPortTaken
 * RESTcallsValidator turnToFiltered
