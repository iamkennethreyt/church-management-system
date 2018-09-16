var app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "../views/index.html",
      controller: "appController"
    })
    .otherwise("/");
});
