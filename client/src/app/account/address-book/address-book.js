(function () {
  'use strict';
  angular
  .module('account.addressBook', ['services.haailaUtils','services.accountResource', 'services.utility', 'directives.serverError'])
  .directive('addressBook', function(){
    return {
      restrict : 'EA',
      scope: {
      	addresses: "=",
      	selectonly: "="
      },
      templateUrl:'account/address-book/address-book.tpl.html',     
      controller: ['$scope', 'haailaUtils', 'accountResource', function billingInfoController($scope,haailaUtils, accountResource) {
      	$scope.updateAddress = function(address) {
      		haailaUtils.updateAddress(address, "EDIT");
      	};
      	$scope.addAddress = function() {
      		var newAddress = $scope.addresses[$scope.addresses.push({})-1];
      		haailaUtils.updateAddress(newAddress, "ADD");
      	};       	
      	$scope.deleteAddress = function(address) {
      		haailaUtils.deleteAddress(address._id);
      		//update the alert with success or failure
      	};
      	$scope.setDefault = function(address) {
          var data = {};
          data._id = address._id;
      		haailaUtils.setDefaultAddress(data).then (function(data){
            for(var i=0; i<$scope.addresses.length; i++){
              if (data.address._id === $scope.addresses[i]._id) {
                $scope.addresses[i].default = data.address.default;
              } else {
                $scope.addresses[i].default = false;
              }
            }
          });
      	};
     	}]
    };   
  });
}());