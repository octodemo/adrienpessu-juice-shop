var express = require('express')
var crypto = require('crypto')
var bodyParser = require('body-parser')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: process.env.POSTGRES_PASSWORD,
    port: 3211,
})

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", function(req, res){
    const search = req.params.q

    if (search != "") {
        var squery = "SELECT * FROM users WHERE name = \"" + search + "\""
        pool.query(squery, (err, res) => {
            console.log(err, res)
            const hash = (data: string) => crypto.createHash('md5').update(res).digest('hex')

            pool.end()
        })
    }
})

app.listen(8000, function () {
    console.log("Server running");
});
