angular.module('sample.chat', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('chat', {
      url: '/chat',
      controller: 'ChatCtrl',
      controllerAs: 'chat',
      templateUrl: 'chat/chat.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('ChatCtrl', function HomeController(socket) {
    var chat = this;
    chat.msg = '';
    socket.on('message', function(message) {
        chat.msg = message;
    });

  });
