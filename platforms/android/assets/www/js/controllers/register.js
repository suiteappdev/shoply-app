angular.module('starter.controllers').controller('registerCtrl', function($scope, api, constants, account, storage, $ionicPopup, $state, push){
    $scope.load = function(){

    }

    $scope.register = function(){
    	if($scope.formRegister.$valid){
    		if($scope.form.data.password != $scope.form.data.confirmar_password){
				var alertPopup = $ionicPopup.alert({
					title: 'Formulario incompleto!',
					template: 'las contraseñas no coinciden'
				});

                 return;
    		}

    		api.user().add("exists/" + $scope.form.data.email).get().success(function(res){
    			if(res.exists == -1){
    				$scope.form.data.type = "USER";
		    		api.user().post($scope.form.data).success(function(res){
				      var push = PushNotification.init({
				            android: {
				                senderID: "871168760"
				            },
				            ios: {
				                alert: "true",
				                badge: "true",
				                sound: "true"
				            },
				            windows: {}
				      });

				      push.on('registration', function(data) {
				      	alert(data.registrationId);
					      	$scope.$apply(function(){
			                     $http.post(constants.base_url +"push/register/"+ res._id, { device_token : data.registrationId}).success(function(res){
			                        alert("res", res);
			                     }); 				      		
					      	});
				      });

				      push.on('notification', function(data) {
				            // data.message,
				            // data.title,
				            // data.count,
				            // data.sound,
				            // data.image,
				            // data.additionalData
				      });

				      push.on('error', function(e) {
				          alert(e);
				      });

				     var confirmPopup = $ionicPopup.confirm({
				         title: 'Registro',
				         template: 'Registro Completado.',
				          scope: $scope,
				          buttons: [
				            {
				              text: '<b>Ok</b>',
				              type: 'button-custom',
				              onTap: function(e) {
				                return true;
				              }
				            }
				          ]
				       });

				       confirmPopup.then(function(res) {
					         if(res) {
					          $state.go(constants.login_page);
					          delete $scope.form;
					         }
				       });
		    			});
    			}else{
				     var confirmPopup = $ionicPopup.confirm({
				         title: 'Email en Uso',
				         template: 'Este email ya esta en uso',
				          scope: $scope,
				          buttons: [
				            { text: 'Cancelar' },
				            {
				              text: '<b>Ok</b>',
				              type: 'button-custom',
				              onTap: function(e) {
				                return true;
				              }
				            }
				          ]
				       });
    			}
    		});
    	}
    }
})