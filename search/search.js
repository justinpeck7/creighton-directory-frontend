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
    $rootScope.$broadcast('setProfile');
    var search = this;
    search.lookup = {};
    search.advanced = {};
    search.advancedLookup = false;
    /*$resource is a wrapper for the $http service. It allows us to make http calls that return a $promise,
    which is just a variable that can be 'resolved' at any given point*/
    var Find = $resource('http://localhost:3001/user/auth/findAll'),
      FindAdvanced = $resource('http://localhost:3001/user/auth/findAllAdvanced');

    /*Toggle showing the advanced/basic form*/
    search.toggleAdvanced = function() {
      search.advancedLookup = !search.advancedLookup;
    };

    /*basic lookup*/
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

    /*advanced lookup*/
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
    };

    /*format our groups so they don't show up like ['group 1', 'group2'] on the page*/
    function preProcessData(data) {
      for (var i in data.users) {
        if (data.users[i].groups) {
          data.users[i].groups = data.users[i].groups.join(', ');
        }
      }
      return data.users;
    }
  });
