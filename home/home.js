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
      jwt  = store.get('jwt');
    $rootScope.showNavBar = true;
    /*So we know who to say 'hello' to*/
    home.username = jwtHelper.decodeToken(jwt).name.split(' ')[0];
    home.loading = true;

    /*Get announcements so we can paste them on the home template*/
    $http.get('http://localhost:3001/announcements/auth/all').then(function(res) {
      home.announcements = res.data;
      home.loading = false;
    });

  });
