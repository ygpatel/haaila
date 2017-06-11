angular.module('checkout.index', [
  //'ngRoute', TODO change to ui.router
  'product',
  'widgets',
  'services.haailaUtils',
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap'
]);

angular.module('checkout.index').controller('CheckoutCtrl', ['$scope', '$location', 'security','haailaUtils', '$uibModal',
  function ($scope, $location, security,haailaUtils, $uibModal) {

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

    $scope.updateAddress = function (type) {
      var modalInstance;
      var modalScope = $scope.$new(true);
      //modalScope.addresses = $scope.addresses;
      modalScope.ok = function (address) {
              modalInstance.close(address);
      };
      modalScope.cancel = function () {
              modalInstance.dismiss('cancel');
      };      
      
      modalInstance = $uibModal.open({
        template: '<address-book></address-book>',
        resolve: {
          addresses: function() {
            return $scope.addresses;
          }
        },
        scope: $scope
        }
      );

      modalInstance.result.then(function (address) {
        if (type==="Shipping") {
          $scope.resolveShip.resolveObj.address = address;
          $scope.order.shippingInfo.address = address;
        } else {
          $scope.resolveBill.resolveObj.address = address;
          $scope.order.billingInfo.address = address;
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.isBillingInfoCollapsed = false;

    //provide a resolve object in the format that the address component uses.
    $scope.resolveShip = {};
    $scope.resolveShip.resolveObj = {};
    $scope.resolveShip.resolveObj.ready = false;

    $scope.resolveBill = {};
    $scope.resolveBill.resolveObj = {};
    $scope.resolveBill.resolveObj.ready = false;

    $scope.addresses = {};
    $scope.selectonly = true;

    var addressMode = 'CAPTURE';
    if (security.isAuthenticated()) {
      //Fetch default address
      haailaUtils.getAccountAddresses().then(function (data){
        $scope.addresses = data;
        for (var i = 0; i<data.length; i++) {
          if (data[i].default === true) {
            addressMode = 'FDISPLAY';
            $scope.order.shippingInfo.address = data[i] ;  
            $scope.order.billingInfo.address = data[i] ;                
            break;  
          } 
        }
        
        $scope.resolveShip.resolveObj.address = $scope.order.shippingInfo.address;
        $scope.resolveBill.resolveObj.address = $scope.order.billingInfo.address;
        $scope.resolveBill.resolveObj.mode = addressMode;
        $scope.resolveShip.resolveObj.mode = addressMode;
        $scope.resolveBill.resolveObj.ready = true;  
        $scope.resolveShip.resolveObj.ready = true;

      }, function(error){
        $scope.error = error;
      });
    } else {
      $scope.resolveShip.resolveObj.address = $scope.order.shippingInfo.address;
      $scope.resolveShip.resolveObj.mode = addressMode; 
      $scope.resolveShip.resolveObj.ready = true;

      $scope.resolveBill.resolveObj.address = $scope.order.billingInfo.address;
      $scope.resolveBill.resolveObj.mode = addressMode; 
      $scope.resolveBill.resolveObj.ready = true;
    }   
  }
]);
