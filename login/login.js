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
  login.loading = false;
  store.remove('jwt');

  /*Send user data and attach returned token to local store*/
  login.login = function() {
    login.loading = true;
    $http({
      url: '/user/createSession',
      method: 'POST',
      data: login.user
    }).then(function(response) {
      login.loading = false;
      store.set('jwt', response.data.id_token);
      $rootScope.$broadcast('setProfile');
      $state.go('home');
    }, function(error) {
      login.loading = false;
      alert(error.data);
    });
  };
});
