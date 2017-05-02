(function () {
  'use strict';
  angular
  .module('cart.billingInfo', ['services.haailaUtils'])
  .directive('billingInfo', function(){
    return {
      restrict : 'EA',
      templateUrl:'cart/billing-info/billing-info.tpl.html',     
      controller: ["$scope", "haailaUtils",
        function billingInfoController($scope, haailaUtils) {
          
       } 
      ]};   
  });
}());