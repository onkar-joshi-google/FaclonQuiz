var http = require('http');

http.createServer(function (req, res) {
    let body = [];
    if (req.method === 'POST') {
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            console.log(JSON.parse(body));
            addToDatabase(JSON.parse(body));
            res.end(body.toString());
        });
   }
   
}).listen(8080);

function addToDatabase(user) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    // Validator for validating fields on our end.
    var validator = require('validator');
    if(!validator.isAlpha(user.name)) throw 'Name can contain only string literals.';
    if(!validator.isMobilePhone(user.phone)) throw 'Phone number must contain only digits.';
    if(!validator.isAlpha(user.surname)) throw 'Surname can contain only string literals.';
    if (!validator.isEmail(user.email)) throw 'Invalid Email.';
    if (!validator.isNumeric(user.age, [{no_symbols: true}])) throw 'Age can contain only numbers.';
    // Validation end.
    // Initializing mongodb connection.
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.createCollection("user", function(err, res) {
        if (err) throw err;
      });
      // The below line ensures that all email and phone combinations are unique
      dbo.collection("user").createIndex({ email: 1, phone: 1 }, { unique: true })
      dbo.collection("user").insertOne(user, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
}