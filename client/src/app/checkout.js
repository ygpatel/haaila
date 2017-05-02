angular.module('checkout', [
  //'ngRoute', TODO change to ui.router
  'product',
  'widgets',
  'services.haailaUtils',
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
]);

angular.module('checkout').controller('CheckoutCtrl', ['$scope', '$location', 'security','haailaUtils',
  function ($scope, $location, security,haailaUtils) {
    $scope.isAuthenticated = function(){
      return security.isAuthenticated();
    };
    $scope.isGuestCheckOutActivated = false;
    $scope.showCheckoutType = function(){
      if ($scope.isGuestCheckOutActivated || $scope.isAuthenticated()) {
        return false;
      } else  {
        return true;
      }
    };
    $scope.isActive = function(viewLocation){
      return $location.path() === viewLocation;
    };
    $scope.cartCount = function() {
      return haailaUtils.getShoppingCartCount();
    };
    $scope.isBillingInfoCollapsed = false;
    //provide a resolve object in the format that the address component uses.

    $scope.resolve = {
      addressObj:{data:{}, mode: "CAPTURE"}
    };

  }
]);
