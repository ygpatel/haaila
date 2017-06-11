(function () {
  'use strict';
  angular
  .module('checkout.billingInfo', ['services.haailaUtils'])
  .directive('billingInfo', function(){
    return {
      restrict : 'EA',
      templateUrl:'checkout/billing-info/billing-info.tpl.html',     
      controller: ["$scope", "haailaUtils",
        function billingInfoController($scope, haailaUtils) {
          
       } 
      ]};   
  });
}());