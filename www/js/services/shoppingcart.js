'use strict';
angular.module('starter.services')
  .service('shoppingCart', function ($rootScope) {
    return {
      totalize : function(products){
        var _total = 0;

        angular.forEach(products, function(_curr){
          console.log("_curr", _curr);
          _total = _total + (_curr.data.unidades * _curr.data.precio_venta);
        });

        return _total;
      },

      totalizeIva : function(products){
        var _total = 0;

        angular.forEach(products, function(_curr){
              _total = (_total + (_curr.data.valor_iva)) * _curr.data.unidades;
        });

        return _total;
      },

      totalizeDiscount : function(products){
        var _total = 0;

        angular.forEach(products, function(_curr){
          if(_curr.data.valor_descuento){
             _total = (_total + _curr.data.valor_descuento);
          }
        });

        return _total;
      }
    };
  });
