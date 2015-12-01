angular.module( 'creightonDir.login', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    controllerAs: 'login',
    templateUrl: 'login/login.html'
  });
})
.controller( 'LoginCtrl', function LoginController($http, store, $state, $rootScope) {
  $rootScope.showNavBar = false;
  var login = this;
  login.user = {};
  store.remove('jwt');

  /*Send user data and attach returned token to local store*/
  login.login = function() {
    $http({
      url: 'http://localhost:3001/user/createSession',
      method: 'POST',
      data: login.user
    }).then(function(response) {
      store.set('jwt', response.data.id_token);
      $state.go('home');
    }, function(error) {
      alert(error.data);
    });
  }
});
