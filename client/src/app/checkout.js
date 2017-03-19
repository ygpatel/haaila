angular.module('checkout', [
  //'ngRoute', TODO change to ui.router
  'product',
  'widgets',
  'services.haailaUtils',
  'ui.bootstrap',
  'ui.router'
]);

angular.module('checkout').controller('CheckoutCtrl', ['$scope', '$location', 'security','haailaUtils',
  function ($scope, $location, security,haailaUtils) {
    $scope.isAuthenticated = function(){
      return security.isAuthenticated();
    };
    $scope.isAdmin = function(){
      if($location.path().indexOf('/admin') === -1){
        return false;
      }else{
        return security.isAdmin();
      }
    };
    $scope.logout = function(){
      return security.logout();
    };
    $scope.isActive = function(viewLocation){
      return $location.path() === viewLocation;
    };
    $scope.cartCount = function() {
      return haailaUtils.getShoppingCartCount();
    };
  }
]);