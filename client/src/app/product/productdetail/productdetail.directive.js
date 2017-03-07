(function () {
  'use strict';
  angular
  .module('product.productdetail', ['ui.router','ui.bootstrap', 'services.haailaUtils'])
  .directive('productdetail', function(){
    return {
      restrict : 'EA',
      //transclude:true,
      scope : {
        product : "="
      },
      templateUrl:'product/productdetail/productdetail.tpl.html',
      controller: ["$stateParams", "$scope","$rootScope", "haailaUtils", "$location", "$uibModal",
      function($stateParams, $scope, $rootScope, haailaUtils, $location, $uibModal) {
        var self = this;  
        $rootScope.productFromCache = false;

        //check if you need to update the product with the cachedProduct (in case there was a detour to sign-in)
        if ($rootScope.cachedProduct !== undefined) {
          if ($rootScope.cachedProductUrl === $location.url) {
            $scope.product = angular.copy($rootScope.cachedProduct);
            $rootScope.cachedProduct = undefined;
            $rootScope.cachedProductUrl = undefined;
            $rootScope.productFromCache = true;
          } 
        } 


        $scope.currImageIndex = 0;

        $scope.hasVariations = haailaUtils.hasItemVariations($scope.product);
        $scope.hasServices = haailaUtils.hasItemServices($scope.product);
        $scope.imgobj = {};
        $scope.imgobj.smallimg = "img/products/small/"+$scope.product.images[$scope.currImageIndex]; 
        $scope.imgobj.largeimg = "img/products/large/"+$scope.product.images[$scope.currImageIndex];
        $scope.imgobj.thumbs =  $scope.product.images;   
        $scope.variations = $scope.product.variations;
        $scope.services = $scope.product.services;
        $scope.isAddButtonEnabled = false;
        $scope.measurements = {};


        $scope.updateCart = function() {
          alert("insi$de updateCatt");
          return "";
        };

        $scope.$on('UpdateTotal', function () { 
           var totalProductCost = parseFloat($scope.product.sale_price);
           var i;
           for (i = 0 ; i<$scope.product.variations.length; i++) {
              if ($scope.product.variations[i].scEntry.cost) {
                totalProductCost += parseFloat($scope.product.variations[i].scEntry.cost);
              }
           }
           for (i = 0 ; i<$scope.product.services.length; i++) {
              if ($scope.product.services[i].scEntry.cost) {
                totalProductCost += parseFloat($scope.product.services[i].scEntry.cost);
              }
           }

           $scope.product.scEntry.totalProductCost = totalProductCost;
           
        });  

        $scope.$on('CacheProductAndLogin', function() {
          $rootScope.cachedProduct = angular.copy($scope.product);
          $rootScope.cachedProductUrl = $location.url;
          $location.url('/login');          
        });



        $scope.cacheProduct = function() {
          console.log("in cacheProduct");
        };
        
        $scope.addToCart = function(isFormValid){  
          if (isFormValid) {      
            haailaUtils.getShoppingCart($scope.product)
            .then(function(selectedItem) { 
              console.log(selectedItem);
            });
          }  
        };
        
        
        $scope.itemprice = function(price,addCost){
            return price + (addCost > 0 ? addCost : 0);
        };
        
        //$scope.smallImage="assets/images/productssmall/kqy176.jpg";
        //$scope.largeImage="assets/images/productssmall/kqy176.jpg";   
        
        
        //$scope.getItem($stateParams.itemId); 

        }] 

    };


  });

}());