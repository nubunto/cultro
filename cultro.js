/* jshint browser:true, node:true */


/* TODO: make cultro match by types as well */
(function () {
    //get the type of the argument
    var type = function (s) { return Object.prototype.toString.call(s).slice(8, -1); };
    
    //get a fresh array copy of the argument
    var slice = function (s) { return Array.prototype.slice.call(s); };
    
    //the cultro function, takes callbacks and the optional context
    function cultro(callbacks, context) {
        //get the type for hacking
        var callbacksType = cultro.type(callbacks);
        return function () {
            //arguments length and the remaining args (for partial application)
            var argsLength = arguments.length,
                args = cultro.slice(arguments); //performance critical code should not use this
            
            //reset the context if nothing is thrown at us
            context = context || null;
            if(callbacksType === 'Array') {
                //return the results of the functions that match the argument length criteria.
                var ret = callbacks
                    .filter(function (fn) {
                        return type(fn) === 'Array' ? fn[0].length === argsLength : fn.length === argsLength; //handling custom context
                    })
                    .map(function (fn) {
                        return type(fn) === 'Array' ? fn[0].apply(fn[1] || null, args) : fn.apply(context, args);
                    });
                //if we're looking to an 1-element array, return that result; else, if it has 0 length, return nothing
                //and, if it has more than one element, return the array.
                return ret.length === 1 ? ret[0] : ret.length === 0 ? undefined : ret;
             }
        };
    }
    
    //handy short functions
    cultro.type = type;
    cultro.slice = slice;
    
    //exporting, works in the browser
    if (typeof module === 'object' && module.exports) module.exports = cultro;
    else if (typeof define === 'function' && define.amd) define(function () { return cultro; });
    else window.cultro = cultro;    
})();