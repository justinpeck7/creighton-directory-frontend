angular.module( 'creightonDir', [
  'creightonDir.home',
  'creightonDir.login',
  'creightonDir.signup',
  'creightonDir.chat',
  'creightonDir.search',
  'angular-jwt',
  'angular-storage',
  'btford.socket-io'
])
.config( function myAppConfig ($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('jwt');
  }

  $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function($rootScope, $state, store, jwtHelper) {
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (to.data && to.data.requiresLogin) {
      if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
        e.preventDefault();
        $state.go('login');
      }
    }
  });
})
.factory('socket', function(socketFactory) {
  var mysocket = io.connect('http://localhost:3001');
  return socketFactory({ioSocket: mysocket});
})
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle;
    }
  });
});
