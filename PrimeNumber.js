var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var txt = q.maxNumber;
    res.end(getPrimeNumbers(txt).toString());
}).listen(8080);

function getPrimeNumbers(tillNumber) {
    var primeNumbers = [];
    for (var i = 2; i < tillNumber; i++) {
        var isPrime = true;
        for (var j = 2; j < i; j++) {
            if (i % j === 0) {
                isPrime = false;
            }
        }
        if (isPrime) primeNumbers.push(i);
    }
    return primeNumbers;
}