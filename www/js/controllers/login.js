angular.module('starter.controllers').controller('loginCtrl', function($scope, $http, constants, account, storage, $ionicPopup, $state, $rootScope){
    $scope.load = function(){
        if(storage.get('token')){
            $state.go(constants.login_state_sucess);
        }
    }

    $scope.login = function(){
        account.login($scope.form.data).then(function(res){
            if(res.token){

                if(!storage.get('device_registered')){
                    $http.post("http://www.shoply.com.co:8080/push/register/" + res.user._id, { device_token : storage.get('device_token')}).then(function(res){
                        storage.save('device_registered', true);
                    });                    
                }

                storage.save('token', res.token);
                storage.save('user', res.user);
                var user = res.user;
                $rootScope.user = user;

                $state.go('tab.dash');
            }

        }, function(status){
            if(status == 401){
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
            }
        } )
    }
})