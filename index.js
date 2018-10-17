const express = require("express");
const app = express();
const mysql = require("mysql");
const morgan = require("morgan");
const moment = require("moment");
const bodyParser = require("body-parser");
// const pool = require("./config.js");
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
const timeNow = new Date();
const timeinput = moment(timeNow);

app.post("/api/signin", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `select * from users where username="${
        req.body.username
      }" and password="${req.body.password}"`,
      () => {
        res.send("INVALID USERNAME OR PASSWORD");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//RESERVE MASS
app.post("/api/reservemass", (req, res) => {
  const timeofmass = moment(req.body.dateofmass);
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          massreservation(firstname, lastname, typeofmass, dateofmass, timeinput, details)
          VALUES( "${req.body.firstname}",
                  "${req.body.lastname}",
                  "${req.body.typeofmass}",
                  "${timeofmass.format("L")}",
                  "${timeinput.format("LLL")}",
                  "${req.body.details}")`,
      () => {
        res.send("SUCCESSFULLY REGISTERED");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//RESERVE MASS
app.post("/api/contacts", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          contacts(name, email, contact, details, time)
          VALUES( "${req.body.name}",
                  "${req.body.email}",
                  "${req.body.contact}",
                  "${req.body.details}",
                  "${timeinput.format("LLL")}")`,
      () => {
        res.send("SUCCESSFULLY SEND YOUR MESSAGE TO THE ADMIN");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//MASS RESERVED LIST
app.get("/api/massreserved", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      "SELECT * FROM massreservation ORDER BY timeofmass",
      (error, results) => {
        res.json(results);
        connection.release();
        connection.destroy();
      }
    );
  });
});

//LIST OF CONTACTS
app.get("/api/listofcontacts", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM contacts ORDER BY time DESC", () => {
      res.json(results);
      connection.release();
      connection.destroy();
    });
  });
});

//CANCEL MASS RESERVED
app.post("/api/cancelmass", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `DELETE FROM massreservation WHERE id = "${req.body.ID}"`,
      () => {
        res.send("SUCCESSFULLY CANCEL THE RESERVATION");
        connection.release();
        connection.destroy();
      }
    );
  });
});

app.get("*", (req, res) => res.send("./public/index.html"));
app.listen(8080, () => console.log(`App listening on port 8080`));
