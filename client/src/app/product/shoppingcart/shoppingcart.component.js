(function () {
  'use strict';
  angular
  .module('product.shoppingcart', ['services.haailaUtils', 'services.accountResource', 'ui.bootstrap'])
  .component('shoppingcart', {
    templateUrl: 'product/shoppingcart/shoppingcart.tpl.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: ["haailaUtils", function (haailaUtils) {
      var $ctrl = this;
      $ctrl.imageSource = "";
      $ctrl.retVal = "";
      $ctrl.$onInit = function () {
        $ctrl.cart = $ctrl.resolve.cart;
      };


      $ctrl.checkout =  function(){
        console.log("checking out");
        //$ctrl.close({$value: $ctrl.target});
      };

      $ctrl.closeModal = function () {
        $ctrl.close({$value: $ctrl.cart}); 
      };

    }]
  });
}());