/*Initialize our app here. Each string in the array is a dependency to inject in, the 'creghtonDir' modules are located in their respective folders.
'creightonDir.home' is in home/home.js for example*/
angular.module('creightonDir', [
  'creightonDir.home',
  'creightonDir.login',
  'creightonDir.signup',
  'creightonDir.chat',
  'creightonDir.search',
  'creightonDir.user',
  'creightonDir.announcements',
  'angular-jwt',
  'angular-storage',
  'ngResource',
  'btford.socket-io',
  'ui.bootstrap'
])
  .config(function myAppConfig($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    /*Intercept all HTTP calls and slap our web token on so the server knows who we are*/
    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('jwt');
    };
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(function($rootScope, $state, store, jwtHelper) {
    /*If no token is stored locally make the user login*/
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  })
/*Socket config. This is the connection we use in the chat module*/
.factory('socket', function(socketFactory) {
  var mysocket = io.connect('http://174.74.91.215:3000');
  return socketFactory({
    ioSocket: mysocket
  });
})
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
  .controller('AppCtrl', function AppCtrl($rootScope, store, jwtHelper) {
    var app = this;

    /*For the profile link in the nav*/
    $rootScope.$on('setProfile', function() {
      var jwt = store.get('jwt'),
        decodedToken = jwtHelper.decodeToken(jwt);
      $rootScope.loggedInNetId = decodedToken.netId;
    });

  });
