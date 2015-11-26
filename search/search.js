angular.module('creightonDir.search', [
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
  .controller('ChatCtrl', function HomeController(socket, store, jwtHelper) {
    var chat = this;
    chat.messages = [];

    var token = store.get('jwt');
    var jwt = jwtHelper.decodeToken(token);

    chat.send = function() {
      socket.emit('sentMsg', {name: jwt.name, message: chat.input});
      chat.input = '';
    }

    socket.on('message', function(sent) {
        chat.messages.push({name: sent.name, message: sent.message});
    });

  });
