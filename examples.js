var cultro = require('./cultro');
var equal = function (a, b) {
    var aType = cultro.type(a);
    var bType = cultro.type(b);
    if(aType != bType) return false;
    if(aType === 'Array') {
        if (a.length != b.length) return false;
        for(var i = 0; i < a.length; i++) {
            if(a[i] != b[i]) return false;
        }
        return true;
    }
    if(aType === 'Object') {
        for(var key in a) {
            if(a[key] != b[key]) return false;
        }
        return true;
    }
    return a === b;
}
//custom log function:
// with one argument, just print it
// with 3 arguments, print the msg, the expected, the actual, and if they really match.


//compare with vanilla js implementation:
/*
    var log = function () {
        var msg = arguments[0], expected = arguments[1], actual = arguments[2]
        if(arguments.length === 1) { 
            console.log(arguments[0];
        } else {
            console.log(msg, expected, actual, equal(actual, expected));
        }
    }
    
    let cultro handle arguments hacks for you.
    plus, you get two functions wrapped up in only one.
    vanilla implementation might be faster, but you lose code readability.
    sacrificing an extra function call with readability might be a good business.
    plus, it's a nice way to inject behaviour based on argument count.
*/
var log = cultro([
    function (msg) {
        console.log(msg);
    },
    function(msg, expected, actual) {
        console.log(msg, expected, actual, equal(actual, expected))
    }
]);


//overload with array of functions (uses function.length property to properly match arguments)
//looks really cool, should cover all your needs
var overloadByArray = cultro([
    function(a, b, c) {
        return 'three';
    },
    function() {
        return 'zero';
    }
]);
log('expected to be \'three\'', 'three', overloadByArray(1, 2, 3));
log('expected to be \'zero\'', 'zero', overloadByArray());

//you can bind a context to it.
var overloadWithContextByArray = cultro([
    function(a,b,c,d) {
        return this.bar;
    }
], { bar: 'bar' });
log('expected to be \'bar\'', 'bar', overloadWithContextByArray(1,2,3,4));

//if multiple functions match the argument length, will push all the results to an array (sequentially)
var cascadingEffect = cultro([
    function(a, b) { return a + b; },
    function(a, b) { return a * 2 + b * 3 },
    function(a, b, c) {return 'baz'}
]);
log('should collect results to an array', [4, 10], cascadingEffect(2, 2));
log('should return \'baz\'', 'baz', cascadingEffect(1, 2, {}));

//one other thing...
//sometimes, you might wanna change the context to a single function
//cultro has a special way of doing this:

var multipleContexts = cultro([
    [function () { return this.foobar }, {foobar: 'foobar'}],
    function() { return this.foobaz },
    [function (a, b) {return a + b * this.c}, {c: 3}],
    [function (a, b, c) {return a + b + c}] //it's ok if you skip it, just don't use it.
], {foobaz: 'foobaz'});

// and since both functions will match because of argument length, both will be called, but yield different results.
log('must be [foobar, foobaz]', ['foobar', 'foobaz'], multipleContexts());
log('must be 6', 6, multipleContexts(0, 2))
log('must be 5', 5, multipleContexts(1, 2, 2))

