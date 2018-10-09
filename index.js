const express = require("express");
const app = express();
const mysql = require("mysql");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "noebayut",
  debug: false
});

app.use(express.static(__dirname + "/public"));

console.log(Date.now());
pool.getConnection((err, connection) => {
  !err
    ? console.log("SUCCESSFULLY CONNECTED TO DATABASE")
    : console.log("NOT CONNECTED TO DATABASE");
  connection.destroy();
});
app.post("/api/signin", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `select * from users where username="${
          req.body.username
        }" and password="${req.body.password}"`,
        (err, results) => {
          if (!err) {
            // console.log("success");
            results.length == 0
              ? res.send("INVALID USER NAME OR PASSWORD")
              : res.send("LOGIN SUCCESSFULLY");
          }
        }
      );
      connection.release();
    } else {
      connection.release();
    }
  });
});

//RESERVE MASS
app.post("/api/reservemass", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `INSERT INTO
          massreservation(firstname, lastname, typeofmass, dateofmass, timeinput, details)
          VALUES( "${req.body.firstname}",
                  "${req.body.lastname}",
                  "${req.body.typeofmass}",
                  "${req.body.dateofmass}",
                  "${Date.now()}",
                  "${req.body.details}")`,
        (error, results) =>
          !error
            ? res.send("SUCCESSFULLY REGISTERED")
            : res.send("THERE'S SOMETHING WRONG RESERVING A MASS")
      );
      connection.release();
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
    }
  });
});

//RESERVE MASS
app.post("/api/contacts", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `INSERT INTO
          contacts(name, email, contact, details, time)
          VALUES( "${req.body.name}",
                  "${req.body.email}",
                  "${req.body.contact}",
                  "${req.body.details}",
                  "${Date.now()}")`,
        (error, results) =>
          !error
            ? res.send("SUCCESSFULLY SEND YOUR MESSAGE TO THE ADMIN")
            : res.send("YOUR MESSAGE IS NOT SUCCESSFULLY SEND")
      );
      connection.release();
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
    }
  });
});

//MASS RESERVED LIST
app.get("/api/massreserved", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        "SELECT * FROM massreservation ORDER BY timeofmass",
        (error, results) => {
          if (!error) {
            res.json(results);
            connection.release();
          }
        }
      );
    } else {
      connection.release();
    }
  });
});

//LIST OF CONTACTS
app.get("/api/listofcontacts", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        "SELECT * FROM contacts ORDER BY time DESC",
        (error, results) => {
          if (!error) {
            res.json(results);
          }
        }
      );
      connection.release();
    } else {
      connection.release();
    }
  });
});

//CANCEL MASS RESERVED
app.post("/api/cancelmass", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `DELETE FROM massreservation WHERE id = "${req.body.ID}"`,
        err =>
          !err
            ? res.send("SUCCESSFULLY CANCEL THE RESERVATION")
            : res.send("SOMETHING ERROR TO CANCEL!")
      ); //value from the user
    } else {
      res.json("Error connecting to db. " + err);
    }
  });
});

app.get("*", (req, res) => res.send("./public/index.html"));
app.listen(8080, () => console.log(`App listening on port 8080`));
