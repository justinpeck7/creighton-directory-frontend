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
    search.advanced = {};
    search.advancedLookup = false;
    var Find = $resource('http://localhost:3001/user/auth/findAll'),
      FindAdvanced = $resource('http://localhost:3001/user/auth/findAllAdvanced');

    search.toggleAdvanced = function() {
      search.advancedLookup = !search.advancedLookup;
    }

    search.doLookup = function() {
      search.results = undefined;
      search.loading = true;
      Find.get({
        name: search.lookup.name || ''
      }).$promise.then(function(data) {
        search.results = preProcessData(data);
        search.loading = false;
      });
    };

    search.doAdvancedLookup = function() {
      search.results = undefined;
      search.loading = true;
      FindAdvanced.get({
        name: search.advanced.name,
        netId: search.advanced.netId,
        dormName: search.advanced.dormName,
        groups: search.advanced.groups,
        email: search.advanced.email,
        major: search.advanced.major
      }).$promise.then(function(data) {
        search.results = preProcessData(data);
        search.loading = false;
      });
    }

    function preProcessData(data) {
      for (var i in data.users) {
        if (data.users[i].groups) {
          data.users[i].groups = data.users[i].groups.join(', ');
        }
      }
      return data.users;
    }
  });
