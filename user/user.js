/*This is our 'profile' page which shows more detailed information about each user*/
angular.module('creightonDir.user', [
  'ui.router'
])
  .config(function($stateProvider) {
    $stateProvider.state('user', {
      url: '/user/:netId',
      controller: 'UserCtrl',
      controllerAs: 'user',
      templateUrl: 'user/user.html',
      data: {
        requiresLogin: true
      }
    });
  })
  .controller('UserCtrl', function HomeController($rootScope, $stateParams, $resource, store, jwtHelper, $uibModal) {
    $rootScope.showNavBar = true;
    $rootScope.$broadcast('setProfile');
    var user = this,
      FindOne = $resource('/user/auth/findOne'),
      token = store.get('jwt'),
      jwt = jwtHelper.decodeToken(token),
      netId = jwt.netId;
    user.loading = true;

    /*Find a single user and return results*/
    FindOne.get({
      netId: $stateParams.netId
    }).$promise.then(function(data) {
      user.info = data.user;
      user.info.groups = user.info.groups.join(', ');
      user.showEditButton = user.info.netId === netId;
      user.loading = false;
    });

    user.showEdit = function() {
      $uibModal.open({
        animation: false,
        templateUrl: 'user/editprofile.html',
        controller: 'ModalCtrl',
        controllerAs: 'modal',
        size: 'lg'
      });
    };
  })
  .controller('ModalCtrl', function($scope, $resource, store, jwtHelper) {
    var modal = this,
      token = store.get('jwt'),
      jwt = jwtHelper.decodeToken(token),
      netId = jwt.netId;
    modal.user = {};

    function formDataObject(data) {
      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        fd.append(key, value);
      });
      return fd;
    }

    var Upload = $resource('/upload/auth/profile', {}, {
      save: {
        method: 'POST',
        transformRequest: formDataObject,
        headers: {
          'Content-Type': undefined,
          enctype: 'multipart/form-data'
        }
      }
    });

    modal.close = function() {
      $scope.$close();
    };

    modal.sendFile = function() {
      console.log('got here');
      if (!modal.user.password || (modal.user.password === modal.user.passwordConfirm)) {
        Upload.save({
          picture: modal.upload,
          netId: netId,
          userData: JSON.stringify(modal.user)
        }).$promise.then(function() {
          $scope.$close();
          location.reload();
        });
      }
      else {
        alert('Passwords must match');
      }
    };
  });
