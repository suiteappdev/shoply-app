angular.module('starter.controllers').controller('loginCtrl', function($scope, constants, account, storage, $ionicPopup, $state){
    $scope.load = function(){
        if(storage.get('token')){
            $state.go(constants.login_state_sucess);
        }
    }

    $scope.login = function(){
        account.login($scope.form.data).then(function(res){
            if(res.token){
                alert(storage.get('device_token'));
                storage.save('token', res.token);
                storage.save('user', res.user);
                var user = res.user;
                
                if(angular.fromJson(storage.get("FIRSTTIME"))){
                    storage.save('FIRSTTIME', true);
                }

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