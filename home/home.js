angular.module('sample.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('HomeCtrl', function HomeController($scope, $http, store, jwtHelper, $state) {

    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    $http.get('http://localhost:3001/user/auth/allUsers').success(function(data) {
      $scope.userList = data;
    });

    $scope.updateExistingUsers = function() {
      $http.get('http://localhost:3001/user/auth/allUsers').success(function(data) {
        $scope.userList = data;
      });
    };

    $scope.logout = function() {
      store.remove('jwt');
      $state.go('login');
    };

    $scope.deleteUsers = function() {
      $http.delete('http://localhost:3001/user/auth/allUsers')
        .success(function(data) {
          $scope.userList = data;
        });
    }

  });
