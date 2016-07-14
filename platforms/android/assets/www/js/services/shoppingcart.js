'use strict';
angular.module('starter.controllers')
  .service('shoppingCart', function ($rootScope) {
  	return {
      getProducts : function(){
        return $rootScope.shoppingCart;
      },

      totalize : function(){
        var _total = 0;

        angular.forEach($rootScope.shoppingCart, function(_curr){
          _total = _total + (_curr.data.unidades * _curr.data.precio_venta);
        });

        return _total;
      },

      totalizeIva : function(iva){
        var _total = 0;

        angular.forEach($rootScope.shoppingCart, function(_curr){
            if(_curr.data.iva == iva){
              _total = _total + (_curr.data.valor_iva);
            }
        });

        return _total;
      },

      save : function(){

      },

      hasPendding : function(){

      }

  	};
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
