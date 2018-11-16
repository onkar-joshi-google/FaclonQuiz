var http = require('http');
var url = require('url');

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
    } else if (req.method === 'DELETE') {
        var q = url.parse(req.url, true).query;
        var userId = q.userId;
        deleteUserAndContacts(userId);
        res.end();
    }
   
}).listen(8080);

function addToDatabase(contact) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    // Initializing mongodb connection.
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      try {
        var id = new require('mongodb').ObjectID(contact.userId);
      } catch (excepion) {
          throw 'UserId is invalid. Please try with a valid userId.'
      }
      dbo.collection("user").findOne({"_id": id}, function(err, result) {
        if (err) throw err;
        // This allows new contact entry only if a user with mentioned userId is present.
        if (result !== null) {
            dbo.createCollection("contact", function(err, res) {
                if (err) throw err;
            });
            dbo.collection("contact").insertOne(contact, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        } else throw 'User with specified userId not present.'
        db.close();
      });
    });
}

function deleteUserAndContacts(userId) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    // Initializing mongodb connection.
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var id = new require('mongodb').ObjectID(userId);
        dbo.collection("user").deleteOne({ _id : id}, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });

        dbo.collection("contact").deleteOne({userId: userId }, function(err, obj) {
            if (err) throw err;
            console.log("Contacts Deleted Successfully");
        })
    });
}