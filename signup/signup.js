angular.module( 'creightonDir.signup', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'SignupCtrl',
    controllerAs: 'signup',
    templateUrl: 'signup/signup.html'
  });
})
.controller('SignupCtrl', function SignupController($http, store, $state, $rootScope) {
  var signup = this;
  signup.user = {};

  /*Send our user data, and attach the returned web token to our 'store' (cookie or local storage)*/
  signup.createUser = function() {
    $http({
      url: '/user/createUser',
      method: 'POST',
      data: signup.user
    }).then(function(response) {
      store.set('jwt', response.data.id_token);
      $rootScope.$broadcast('setProfile');
      $state.go('home');
    }, function(error) {
      alert(error.data);
    });
  }

});
