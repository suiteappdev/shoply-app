angular.module('starter.controllers').controller('requestCtrl', function(api, $scope, constants, account, storage, $ionicPopup, $state){
	$scope.load = function(){
		api.pedido().get().success(function(res){
			$scope.records = res || [];
		})
	}
})