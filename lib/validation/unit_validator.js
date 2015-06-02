var validator = require('validator');
var hasTheErrorKey = require('./validation_helpers').hasTheErrorKey;

module.exports = {
    errors : [],

    int: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(!validator.isInt(value)){
            var er_message = hasTheErrorKey(field, 'type') 
                || fieldNameOnResponse + ' must be an integer. ' + value + ' provided.';
            this.errors.push(er_message);
        } else {
            if(!!field.min){
                if(value < field.min){
                    var er_message = hasTheErrorKey(field, 'min')
                        || fieldNameOnResponse + ' must be greater or equal to ' + field.min + '. ' + value + ' provided.';
                    this.errors.push(er_message);
                }
            }

            if(!!field.max){
                if(value > field.min){
                    var er_message = hasTheErrorKey(field, 'max')
                        || fieldNameOnResponse + ' must be lower or equal to ' + field.max + '. ' + value + ' provided.';
                    this.errors.push(er_message);
                }
            }
        }
    },

    date: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        var momentObj = moment(value, field.validationString);
        if(!momentObj.isValid()){
            var er_message = hasTheErrorKey(field, 'validationString')
                || fieldNameOnResponse + ' must be a date in the format: ' + field.validationString + '. ' + value + ' provided.';
                this.errors.push(er_message);
        } else {
            // in case of dates, for easiness we keep the momentObj representation of the passed variable, no matter
            // which is the format of the date that we expect
            //req.filteredParams[path.join('.') + field.key].momentObj = momentObj;
        }
    },

    oneof: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(field.acceptedValues.indexOf(value) == -1){
            var er_message = hasTheErrorKey(field, 'acceptedValues')
                || fieldNameOnResponse + ' must be one of ' + field.acceptedValues.join(', ') + '. ' + value + ' provided.';
                this.errors.push(er_message);
        }
    },

    boolean: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(value !== true && value !== false && value !== 'true' && value !== 'false'){
            var er_message = hasTheErrorKey(field, 'type')
                || fieldNameOnResponse + ' must be a boolean. ' + value + ' provided.';
            this.errors.push(er_message);
        }
    },

    numeric: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');
        if(!validator.isFloat(value)){
            var er_message = hasTheErrorKey(field, 'type')
                || fieldNameOnResponse + ' must be a number. ' + value + ' provided.';
            this.errors.push(er_message);
        }
    },

    email: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(!validateEmail(value)){
            var er_message = hasTheErrorKey(field, 'type')
                || fieldNameOnResponse + ' must be a valid email address. ' + value + ' provided.';
                this.errors.push(er_message);
        }
    },

    string: function(field, value, path){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(!!field.minChars){
            if(value.length < field.minChars){
                var er_message = hasTheErrorKey(field, 'minChars')
                    || fieldNameOnResponse + ' must be of at least ' + field.minChars + ' long. ' + value + ' provided.';
                this.errors.push(er_message);
            }
        }

        if(!!field.maxChars){
            if(value.length > field.maxChars){
                var er_message = hasTheErrorKey(field, 'maxChars')
                    || fieldNameOnResponse + ' must be of at max ' + field.maxChars + ' long. ' + value + ' provided.';
                this.errors.push(er_message);
            }
        }

        if(!!filed.regexp){
            var er_message = hasTheErrorKey(field, 'type');
            try{
                var passes = field.regexp.test(value);
                if(!passes){
                    if(er_message === false) {
                        er_message = fieldNameOnResponse + ' do not match the provided regular expression';
                    }
                    this.errors.push(er_message);
                }
            } catch(err){
                if(er_message === false) {
                    er_message = fieldNameOnResponse + ' do not match the provided regular expression';
                }
                this.errors.push(er_message);
            }
        }
    },

    array: function(field, value, path, errors){
        var fieldNameOnResponse = field.humanReadable || path.join('.');

        if(!(variable.constructor === Array)){
            var er_message = hasTheErrorKey(field, 'type')
                || fieldNameOnResponse + ' must be of type array. ' + value + ' provided.';
            this.errors.push(er_message);
        }

        if(!!field.minLength){
            if(value.length < field.minLength){
                var er_message = hasTheErrorKey(field, 'minLength')
                    || fieldNameOnResponse + ' must be of at least of ' + field.minLength + ' length. ' + value + ' provided.';
                this.errors.push(er_message);
            }
        }

        if(!!field.maxLength){
            if(value.length > field.maxLength){
                var er_message = hasTheErrorKey(field, 'maxLength')
                    || this.errors.push(fieldNameOnResponse + ' must be of max length ' + field.maxLength + '. ' + value + ' provided.';
                this.errors.push(er_message);
            }
        }
    }

};