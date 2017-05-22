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

    $scope.order = {
      cartInfo : $scope.cart,
      paymentInfo: {type:'CREDITCARD'},
      shippingInfo: {
        address:{}
      },
      billingInfo: {
        address:{}
      }
    };

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
    $scope.resolveShip = {};
    $scope.resolveShip.resolveObj = {};
    $scope.resolveShip.resolveObj.ready = false;

    $scope.resolveBill = {};
    $scope.resolveBill.resolveObj = {};
    $scope.resolveBill.resolveObj.ready = false;



    if (security.isAuthenticated()) {
      //Fetch default address
      haailaUtils.getDefaultAddress().then(function (data){
        $scope.order.shippingInfo.address = data;
        
        $scope.resolveShip.resolveObj = {};
        $scope.resolveShip.resolveObj.address = $scope.order.shippingInfo.address;
        $scope.resolveShip.resolveObj.mode = 'FDISPLAY';
        $scope.resolveShip.resolveObj.ready = true;

        $scope.order.billingInfo.address = data;
        $scope.resolveBill.resolveObj = {};
        $scope.resolveBill.resolveObj.address = $scope.order.billingInfo.address;
        $scope.resolveBill.resolveObj.mode = 'FDISPLAY';
        $scope.resolveBill.resolveObj.ready = true;


      }, function(error){
        $scope.error = error;
      });
    } else {
      $scope.resolveShip.resolveObj.address = $scope.order.shippingInfo.address;
      $scope.resolveShip.resolveObj.mode = "CAPTURE"; 
      $scope.resolveShip.resolveObj.ready = true;

      $scope.resolveBill.resolveObj.address = $scope.order.billingInfo.address;
      $scope.resolveBill.resolveObj.mode = "CAPTURE"; 
      $scope.resolveBill.resolveObj.ready = true;

    }
    
  }
]);
