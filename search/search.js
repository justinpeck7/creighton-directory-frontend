angular.module('creightonDir.search', [
    'ui.router'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('search', {
      url: '/search',
      controller: 'SearchCtrl',
      controllerAs: 'search',
      templateUrl: 'search/search.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('SearchCtrl', function HomeController() {

  });
