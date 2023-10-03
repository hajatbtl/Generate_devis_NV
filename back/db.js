const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "sky",
//     password: "70E7jz3&p",
//     database: "admin_sky"
// });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sky_ingenierie"
});

db.connect(function(err) {
    if (err) console.log(err);
    console.log("Connected!");
});

module.exports = {
    db
};
