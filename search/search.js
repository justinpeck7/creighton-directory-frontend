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
  .controller('SearchCtrl', function HomeController($rootScope, $resource) {
    $rootScope.showNavBar = true;
    var search = this;
    search.lookup = {};
    var Find = $resource('http://localhost:3001/user/auth/findAll', {}, {
      get: {
        method: 'get',
        isArray: false
      }
    });

    search.doLookup = function() {
      Find.get({
        name: search.lookup.name || ''
      }).$promise.then(function(data) {
        search.results = preProcessData(data);
      });
    };

    function preProcessData(data) {
      for (var i in data.users) {
        if(data.users[i].groups) {
          data.users[i].groups = data.users[i].groups.join(', ');
        }
      }
      return data.users;
    }
  });
