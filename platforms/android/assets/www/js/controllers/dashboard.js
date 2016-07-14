angular.module('starter.controllers').controller('dashboardCtrl', function($scope, $rootScope, $ionicPlatform,  $q,  $ionicScrollDelegate, $timeout, api, constants, account, storage, $ionicPopup, $ionicLoading, $state){
    $scope.localHistory = [];
  
    $rootScope.$on('add_comment', function(event, data){
      $scope.products[data.index].comments.push(data.comment);
    });

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'
        });
    };

     $scope.showConfirm = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Salir',
         template: 'Desea salir de la aplicación?',
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
          navigator.app.exitApp()
         } else {
           console.log('You are not sure');
         }
       });
     }; 

    $scope.history = function(){
        $scope.products = [];
        $scope.records = [];

        var deferedCategories = $q.defer();
        var deferedProducts = $q.defer();
        
        $scope.show();
        
        var _parent = $scope.localHistory.pop();
        
        if(_parent.parent == "#"){
          $scope.load();
          return;
        }

        var _reqCategories = api.categoria().add("childs/" + _parent.parent).get();
        
        $q.all([_reqCategories]).then(function(values){
            $scope.records = values[0].data;
            $scope.hide();
        })
    }

    $scope.like = function(){
        var _product = this.record;
        var user = angular.fromJson(localStorage.user)._id;

        if(_product._like.indexOf(user) > -1){
          return;
        }
        
        api.producto(this.record._id).add("/like").post({ user : user }).success(function(res){
            if(res){
              _product._like.push(user);
            }
        });
    }

    $scope.add = function(){
        var _product = this.record;
        console.log(_product);
          var myPopup = $ionicPopup.show({
            template: '<input type="number" style="text-align:center;" placeholder="Numero de Unidades"  ng-model="$parent.unidades">',
            title: 'Numero de Unidades',
            subTitle: 'escriba el numero de unidadesa pedir',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-custom',
                onTap: function(e) {
                  if (!$scope.unidades) {
                    e.preventDefault();

                  } else {
                    return $scope.unidades;
                  }
                }
              }
            ]
          });

          myPopup.then(function(res) {
            if(res){
                var _updated = false; 

                angular.forEach($rootScope.shoppingCart, function(_cur){
                  if(_cur._id == _product._id ){
                    var _unidades = _cur.data.unidades;
                    _unidades = _unidades + res;

                    angular.extend(_cur.data, {unidades : _unidades});
                    _updated = true;    
                  }
                });

                if(_updated){
                  return;
                }

                angular.extend(_product.data, {unidades : res});
                $rootScope.shoppingCart.push(_product);
                $scope.unidades = 1;
            }
          });
    }

    $scope.unFollow = function(){
        api.producto().add("unfollow").post(angular.fromJson(localStorage.user)._id).success(function(res){
            console.log("following" , res);
        });
    }

    $ionicPlatform.registerBackButtonAction(function (event) {
        if($state.current.name == 'tab.dash' && $scope.localHistory.length > 0){
            $scope.history();
        }else if($state.current.name == 'tab.dash' && $scope.localHistory.length == 0){
          $scope.showConfirm();
        }else{
            navigator.app.backHistory();
        }
    }, 100);

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.load = function(){
        $scope.show();

        api.categoria().add("root").get().success(function(res){
            $scope.records = res || [];
            $scope.hide();
        });
    }

    $scope.browse = function(category, back){
        var deferedCategories = $q.defer();
        var deferedProducts = $q.defer();
        
        $scope.show();

        if(!back){
            $scope.localHistory.push(category); 
        }

        var _reqProducts = api.producto().add('category/' + category._id).get();
        var _reqCategories = api.categoria().add("childs/" + category._id).get();

        $q.all([_reqCategories, _reqProducts]).then(function(values){
            $scope.products = values[1].data;
            $scope.records = values[0].data;
            $scope.hide();
        })
    }

    $scope.back = function(){
      $scope.load();
    }
})