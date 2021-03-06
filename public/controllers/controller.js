let instance = {};

const app = angular.module("app", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "../views/index.html",
      controller: "appController"
    })
    .when("/dashboard", {
      templateUrl: "../views/dashboard.html",
      controller: "appController"
    })
    .when("/dashboard/massreservation", {
      templateUrl: "../views/dashboardmassreservation.html",
      controller: "appController"
    })
    .when("/dashboard/newsfeed", {
      templateUrl: "../views/dashboardnewsfeed.html",
      controller: "appController"
    })
    .when("/dashboard/contacts", {
      templateUrl: "../views/dashboardcontacts.html",
      controller: "appController"
    })
    .when("/login", {
      templateUrl: "../views/login.html",
      controller: "appController"
    })
    .otherwise("/");
});

app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    state.massreserved = [];
    state.user = instance;
    state.massCategory = [
      "BAPTISMAL",
      "DEATH",
      "WEDDING",
      "THANKS GIVING MASS"
    ];
    //FUNCTION VALIDATOR
    const validatator = (params, param2) => {
      if (!params) {
        alert(`PLEASE INPUT ${param2}`);
        return null;
      }
    };

    //SIGNIN FUNCTION
    state.signin = () => {
      if (!state.password || !state.username) {
        validatator(state.username, "USERNAME");
        validatator(state.password, "PASSWORD");
      } else {
        http
          .post("/api/signin", {
            username: state.username,
            password: state.password
          })
          .then(res => {
            if (res.data === "SUCCESSFULLY SIGNIN") {
              alert(res.data);
              instance = res.data[0];
              window.location.href = "/#!/dashboard/";
            } else {
              alert("INVALID USERNAME OR PASSWORD");
            }
          });
      }
    };

    //RESERVE MASS FUNCTION
    state.reservemass = () => {
      const newObject = {
        firstname: state.firstname,
        lastname: state.lastname,
        typeofmass: state.selected,
        dateofmass: state.massdate,
        details: state.details
      };
      http
        .post("/api/reservemass", newObject)
        .then(res => {
          alert(res.data);
          $("#btn-close").trigger("click");
        })
        .then(() => {
          state.massreserved.push(newObject);
          document.getElementById("form").reset();
        });
    };

    //CONTACTS MASS FUNCTION
    state.contacts = () => {
      http
        .post("/api/contacts", {
          name: state.name,
          email: state.email,
          contact: state.contact,
          details: state.details
        })
        .then(res => {
          alert(res.data);
        });
      document.getElementById("form").reset();
    };

    //DISPLAY MASS RESERVED
    http.get("/api/massreserved").then(res => {
      state.massreserved = res.data;
      state.massreservedcount = res.data.length;
    });

    //DISPLAY LIST OF CONTACTS
    http.get("/api/listofcontacts").then(res => {
      state.listofcontacts = res.data;
      state.listofcontactscount = res.data.length;
      let d = new Date(res.data[0].time);
      console.log("HELlloooo", Date.parse(res.data[0].time));
    });

    //CANCEL MASS RESERVATION
    state.cancelreservation = param => {
      if (confirm("Are you sure you want to cancel reservation?")) {
        state.massreserved.splice(state.massreserved.indexOf(param), 1);
        http.post("/api/cancelmass", {
          ID: param.ID
        });
      }
    };

    state.logout = () => {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "/#!/";
      }
    };
  }
]);
