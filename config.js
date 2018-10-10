const mysql = require("mysql");
// DATABASE FREE HOSTING
//https://www.db4free.net/
module.exports = mysql.createPool({
  connectionLimit: 5,
  host: "85.10.205.173",
  port: 3306,
  user: "dadaxxx15",
  password: "dadaxxx15",
  database: "churchmgmt",
  debug: false
});
