angular.module('starter.controllers').controller('shoppingCarController', function($scope, api, $ionicLoading,  $ionicPopup, $rootScope, shoppingCart, $state, storage, $ionicModal){
   $scope.total = shoppingCart.totalize();
   $scope.addressList  = angular.fromJson(storage.get('addressList')) || [];
   
   $ionicModal.fromTemplateUrl('templates/modal/request_info.html', {
    scope: $scope
   }).then(function(modal){
   		$scope.modal = modal;
   });

   $scope.load = function(){
        api.user().get().success(function(res){
            $scope.records = res || [];
        });
   }

    $scope.remove = function(product){
	 var confirmPopup = $ionicPopup.confirm({
	     title: 'Quitar Producto',
	     template: 'Desea eliminar este producto del carrito?',
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

	   confirmPopup.then(function(res) {
	     if(res) {
        	$rootScope.shoppingCart.splice($rootScope.shoppingCart.indexOf(product), 1);
	     } else {
	       return;
	     }
	   });
    }

    $scope.formInfo = function(){
    	$scope.modal.show();
    }

    $scope.sendRequest = function(){
        if(storage.get("user").type == "SELLER"){
            var _data = angular.extend($scope.form, {
                _seller : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
                _client : $scope.form._client._id 
            });  

            _data.metadata = _data.metadata || new Object();
            _data.metadata.estado = "Facturado";

        }else{
            var _data = angular.extend($scope.form, {
                _client : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
            });
            
                _data.metadata = _data.metadata || new Object();
                _data.metadata.estado = _data.metadata.estado = "Pendiente";  
            }

        if(angular.fromJson(storage.get("GPS"))){
                navigator.geolocation.getCurrentPosition(function(res){
                    console.log("location", res);
                    
                    _data.metadata.geo = {};
                    _data.metadata.geo.latitude = res.coords.latitude;
                    _data.metadata.geo.longitude = res.coords.longitude;

                    _data.metadata.total = shoppingCart.totalize();
                    _data.metadata.cantidad = $rootScope.shoppingCart.length;

                    _data.metadata.total_iva_5 = shoppingCart.totalizeIva(5);
                    _data.metadata.total_iva_10 = shoppingCart.totalizeIva(10);
                    _data.metadata.subtotal = (_data.metadata.total - (_data.metadata.total_iva_5 + _data.metadata.total_iva_10)); 
                    
                    console.log("data", _data);

                    $ionicLoading.show()

                    api.pedido().post(_data).success(function(res){
                        if(res){
                            $rootScope.shoppingCart.length = 0;
                            delete $scope.form;
                            $scope.confirmRequest();
                            $ionicLoading.hide();
                        }
                    });                     
                })
        }else{
            _data.metadata.total = shoppingCart.totalize();
            _data.metadata.envio = 2000;
            _data.metadata.cantidad = $rootScope.shoppingCart.length;

            _data.metadata.total_iva_5 = shoppingCart.totalizeIva(5);
            _data.metadata.total_iva_10 = shoppingCart.totalizeIva(10);
            _data.metadata.subtotal = (_data.metadata.total - (_data.metadata.total_iva_5 + _data.metadata.total_iva_10)); 

            $ionicLoading.show()

            api.pedido().post(_data).success(function(res){
                if(res){
                    $rootScope.shoppingCart.length = 0;
                    delete $scope.form;
                    $scope.confirmRequest();
                    $ionicLoading.hide();
                }
            }); 
        }
    }

    $scope.confirmRequest = function(){
	   var alertPopup = $ionicPopup.alert({
	     title: 'Enviado!',
	     template: 'Su pedido ha sido Enviado',
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

	   alertPopup.then(function(res) {
	   	$scope.back();
	   });
    }

    $scope.back = function(){
        $state.go('tab.dash');
    }

})