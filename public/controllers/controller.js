app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    state.helloWorld = "hello world";
  }
]);
