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
    /*Available rooms*/
    var chatArrays = {
      global: [],
      freshman: [],
      sophomore: [],
      junior: [],
      senior: []
    };
    /*Default room is 'global'*/
    chat.room = 'global';
    /*We swap out the current messages array (what shows up on the page) whenever a user changes room*/
    chat.messages = chatArrays.global;

    /*Join a new room and change the messages array that should show up*/
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
    };

    /*Send a message to the server, clear our input, and scroll to the bottom of the chat div*/
    chat.send = function() {
      socket.emit('sentMsg', {
        name: jwt.name,
        message: chat.input,
        room: chat.room
      });
      chat.input = '';
      updateScroll();
    };

    /*Receive messages from the server and delegate them to the correct chatArrays message array*/
    socket.on('message', function(data) {
      if (data.name === jwt.name) {
        data.isSelf = true;
      }
      chatArrays[data.room].push({
        name: data.name,
        message: data.message,
        isSelf: data.isSelf
      });
    });

    /*Scroll to the bottom of the chat div. Wrapped in a $timeout because ng-repeat is slow so we need
    to give it time to update the view values*/
    function updateScroll() {
      $timeout(function() {
        var elm = document.getElementById('chatRoom');
        elm.scrollTop = elm.scrollHeight;
      }, 20, false);
    }

  });
