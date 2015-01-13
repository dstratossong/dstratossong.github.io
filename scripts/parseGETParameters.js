/** Credit goes to Qwerty, Bakudan and Samuel Liew; Found on Stack Overflow at
 *  http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
 *  
 *  Exports a function that takes in a string of query, similar to GET variables in HTTP request url
 *  To use this function, simply call parseGETParameters(String str), and it will return an object.
 *  Note that duplicate keys will be overwritten.
 *
 *  Note that the function will parse the GET url parameters if you call 
 *  parseGETParameters(window.location.search)
 *
 *	This is extremely useful for finding out parameters on client side.
 */

// Examples are below

function parseGETParameters(str) {
    var retVal = {};
    // window.location.search
    // passed in as param for debugging
    str.substr(1).split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            // var obj = {
            //     key: tmp[0],
            //     value: decodeURIComponent(tmp[1])
            // };
            // retVal.push(obj);
            retVal[tmp[0]] = decodeURIComponent(tmp[1]);
    });
    return retVal;
}

/*
// The code below are tests. 

var res = parseGETParameters('?a=a&b=b&c=c%20and%20d')

console.log(res);			// { a: 'a', b: 'b', c: 'c and d' }
console.log(res.a);			// a
console.log(typeof res.a); 	// string
console.log(res.d == null);	// true

*/