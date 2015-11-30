angular.module('creightonDir.chat', [
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
  .controller('ChatCtrl', function HomeController(socket, store, jwtHelper, $rootScope, $timeout) {
    $rootScope.showNavBar = true;
    var chat = this;
    chat.messages = [];

    var token = store.get('jwt'),
      jwt = jwtHelper.decodeToken(token);
    var chatArrays = {
      global: [],
      freshman: [],
      sophomore: [],
      junior: [],
      senior: []
    };
    chat.room = 'global';
    chat.messages = chatArrays.global;


    chat.join = function(index) {
      var rooms = ['global', 'freshman', 'sophomore', 'junior', 'senior'];
      if (chat.room !== rooms[index]) {
        socket.emit('switch', {
          oldRoom: 'global',
          newRoom: rooms[index]
        });
        chat.room = rooms[index];
        chat.messages = chatArrays[rooms[index]];
      }
    }

    chat.send = function() {
      socket.emit('sentMsg', {
        name: jwt.name,
        message: chat.input,
        room: chat.room
      });
      chat.input = '';
      updateScroll();
    }

    socket.on('message', function(data) {
      if(data.name === jwt.name) {
        data.isSelf = true;
      }
        chatArrays[data.room].push({
          name: data.name,
          message: data.message,
          isSelf : data.isSelf
        })
    });

    function updateScroll() {
      $timeout(function() {
        var elm = document.getElementById('chatRoom');
        elm.scrollTop = elm.scrollHeight;
      }, 20, false);
    }

  });
