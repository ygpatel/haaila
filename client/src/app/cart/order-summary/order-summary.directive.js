(function () {
  'use strict';
  angular
  .module('cart.orderSummary', ['services.haailaUtils'])
  .directive('orderSummary', function(){
    return {
      restrict : 'EA',
      templateUrl:'cart/order-summary/order-summary.tpl.html',     
      controller: ["$scope", "haailaUtils",
        function billingInfoController($scope, haailaUtils) {

       } 
      ]};   
  });
}());