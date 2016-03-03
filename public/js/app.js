var app = angular.module("weatherCharting", []);

app.controller('mainDashboard', function($scope, $http) {
  $http.get('/data')
  .then(function successCallback(response) {
    charting(response);
    $scope.data = response;
    jQuery(".dropdown-menu li a").on('click', function() {
      charting(response, jQuery(this).data("dimension"))
    })

    }, function errorCallback(response) {
      console.log(response);
    });
})

app.directive('myDashboard', function() {
  return {
    restrict: 'A',
    templateUrl: 'views/angular/dashboard.html'
  };
});
