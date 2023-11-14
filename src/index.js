var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
var connection = require("./database.js");

var corsOptions = { origin: `http://localhost:${process.env.PORT}` };

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

port = process.env.PORT;

app.get("/", function (req, res) {
    let sql = "SELECT * FROM UserData";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

connection.connect(function (err) {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Database Connected!");
});

app.listen(port, function () {
    console.log("App Listening on port", port);
});

connection.end();
