/*This is our 'profile' page which shows more detailed information about each user*/
angular.module('creightonDir.user', [
    'ui.router'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('user', {
      url: '/user/:netId',
      controller: 'UserCtrl',
      controllerAs: 'user',
      templateUrl: 'user/user.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('UserCtrl', function HomeController($rootScope, $stateParams, $resource) {
    $rootScope.showNavBar = true;
    var user = this,
      FindOne = $resource('http://localhost:3001/user/auth/findOne');
    user.loading = true;

    /*Find a single user and return results*/
    FindOne.get({
      netId: $stateParams.netId
    }).$promise.then(function(data) {
      user.info = data.user;
      user.info.groups = user.info.groups.join(', ');
      user.loading = false;
    });
  });
