/*Define our home module*/
angular.module('creightonDir.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/',
      controller: 'HomeCtrl',
      controllerAs: 'home',
      templateUrl: 'home/home.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('HomeCtrl', function HomeController($http, store, jwtHelper, $rootScope) {
    var home = this,
      jwt  = store.get('jwt'),
      decodedToken = jwtHelper.decodeToken(jwt);
    $rootScope.showNavBar = true;
    /*So we know who to say 'hello' to*/
    home.username =decodedToken.name.split(' ')[0];
    home.loading = true;

    /*For the profile link in the nav*/
    $rootScope.netId = decodedToken.netId;

    /*Get announcements so we can paste them on the home template*/
    $http.get('http://localhost:3001/announcements/auth/all').then(function(res) {
      home.announcements = res.data;
      home.loading = false;
    });

  });
