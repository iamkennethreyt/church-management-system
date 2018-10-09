app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    state.massreserved = [];
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
            alert(res.data);
            window.location.href = "/#!/dashboard/";
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
    });

    //CANCEL MASS RESERVATION
    state.cancelreservation = param => {
      // state.massreserved.filter(ms => ms.ID !== param.ID);
      state.massreserved.splice(state.massreserved.indexOf(param), 1);
      http.post("/api/cancelmass", {
        ID: param.ID
      });
    };
  }
]);
