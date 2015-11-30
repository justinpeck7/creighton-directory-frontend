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
.controller('SignupCtrl', function SignupController($http, store, $state) {
  var signup = this;
  signup.user = {};

  signup.createUser = function() {
    $http({
      url: 'http://localhost:3001/user/createUser',
      method: 'POST',
      data: signup.user
    }).then(function(response) {
      store.set('jwt', response.data.id_token);
      $state.go('home');
    }, function(error) {
      alert(error.data);
    });
  }

});
