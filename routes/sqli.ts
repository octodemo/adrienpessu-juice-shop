var express = require('express')
var bodyParser = require('body-parser')
const { Pool } = require('pg')
var RateLimit = require('express-rate-limit')

const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: process.env.POSTGRES_PASSWORD,
    port: 3211,
})

var test;
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);


app.get("/", function(req, res){
    const search = req.params.q

    if (search != "") {
        var squery = "SELECT * FROM users WHERE name = \"" + search + "\""
        pool.query(squery, (err, res) => {
            console.log(err, res)
            pool.end()
        })
    }
})

app.listen(8000, function () {
    console.log("Server running");
});

  let drinks = ['lemonade', 'soda', 'tea', 'water'];
  let food = ['beans', 'chicken', 'rice'];
  let iban = "DE012345678910112345"