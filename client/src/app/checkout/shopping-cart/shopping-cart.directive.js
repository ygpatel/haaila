(function () {
  'use strict';
  angular
  .module('checkout.shoppingCart', ['services.haailaUtils'])
  .directive('shoppingCart', function(){
    return {
      restrict : 'EA',
      templateUrl:'checkout/shopping-cart/shopping-cart.tpl.html',
      scope : {
        cart : "=",
        inCheckout : "="
      },
      controller: ['$scope',  '$location', '$log', 'haailaUtils', "$rootScope", "$filter",
      function($scope,  $location, $log, haailaUtils,$rootScope, $filter){
        $scope.orderTotal = 0;
        $scope.shippingCost = 0;
        $scope.updateTotals = function(){
          $scope.orderTotal = 0;
          $scope.shippingCost = 0;
          if ($scope.cart !== undefined) {
            for (var i = 0; i < $scope.cart.length; i++) {
              $scope.orderTotal  += $scope.cart[i].totalProductCost * $scope.cart[i].qty;
              $scope.shippingCost += $scope.cart[i].shipping_cost;
            }
          }
        };
        $scope.updateTotals();
          
        $scope.getDetails = function(cartItem) {
          var retDesc = "";
          var i;
          if (cartItem.variations) {
            for (i=0; i<cartItem.variations.length; i++) {
              retDesc +=  "Additional Details:<br/>"+cartItem.variations[i].desc + 
              (cartItem.variations[i].cost > 0 ? " (cost includes additional " + 
               $filter('currency')(cartItem.variations[i].cost) + ")" : "") + "<br/>";
            }
          }
          if (cartItem.services) {
            for (i=0; i<cartItem.services.length; i++) {
              retDesc +=  "Additional Details:<br/>"+cartItem.services[i].desc + 
              (cartItem.services[i].cost > 0 ? " (cost includes" + 
               $filter('currency')(cartItem.services[i].cost) + ")" : "") + "<br/>";
            }   
          } 
          return retDesc;        
        };

        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        $scope.contShop = function() {
          $location.url("/category/" + haailaUtils.getActiveCategory());
        };

        $scope.checkout =  function(){
          $location.url("/checkout");
          //$ctrl.close({$value: $ctrl.target});
        };

        $scope.removeItem = function(itemIndex) {
          $scope.cart.splice(itemIndex,1);
          $scope.updateTotals();
        };


      }   
    ]};
  });
}());