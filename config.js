const mysql = require("mysql");

module.exports = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "noebayut",
  debug: false
});
