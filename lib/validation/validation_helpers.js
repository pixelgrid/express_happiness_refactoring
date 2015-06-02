module.exports = {
	validateEmail : function(email){
	    var re = /^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	    return re.test(email);
	},

	hasTheErrorKey : function(field, errorKey){
	    if(field.validationFailureTexts != null && field.validationFailureTexts != undefined){
	        if(field.validationFailureTexts[errorKey] != null && field.validationFailureTexts[errorKey] != undefined){
	            return field.validationFailureTexts[errorKey];
	        }
	    }
	    return false;
	}

}