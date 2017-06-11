(function () {
  'use strict';
  angular
  .module('checkout.orderSummary', ['services.haailaUtils'])
  .directive('orderSummary', function(){
    return {
      restrict : 'EA',
      templateUrl:'checkout/order-summary/order-summary.tpl.html',     
      controller: ["$scope", "haailaUtils",
        function billingInfoController($scope, haailaUtils) {

       } 
      ]};   
  });
}());