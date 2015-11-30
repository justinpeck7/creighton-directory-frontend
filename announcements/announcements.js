angular.module('creightonDir.announcements', [
    'ui.router'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('announcements', {
      url: '/announcements',
      controller: 'AnncCtrl',
      controllerAs: 'anc',
      templateUrl: 'announcements/announcements.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('AnncCtrl', function HomeController($rootScope, $http) {
    $rootScope.showNavBar = true;
    var anc = this;
    anc.msg = {};
    anc.added = '';

    anc.send = function() {
      $http({
        url: 'http://localhost:3001/announcements/auth/new',
        method: 'POST',
        data: anc.msg
      }).then(function(res) {
        anc.added = 'Added!';
      });
    }

  });
