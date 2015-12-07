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

    /*Create a new announcement. Right now this page is only accessable by typing in the
    URL. Not sure if we should have a link for it or not. Probably don't want anybody to be able to
    add announcements*/
    anc.send = function() {
      $http({
        url: '/announcements/auth/new',
        method: 'POST',
        data: anc.msg
      }).then(function(res) {
        anc.added = 'Added!';
      });
    };
  });
