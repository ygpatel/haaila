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
        $scope.shoppingCart = undefined;

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
            var shoppingCartEntry = {};
            var i;
            shoppingCartEntry.productId = $scope.product._id;
            shoppingCartEntry.name = $scope.product.name;
            shoppingCartEntry.totalProductCost = $scope.product.scEntry.totalProductCost;
            shoppingCartEntry.thumb =  "img/products/thumb/"+$scope.product.images[0];
            shoppingCartEntry.shipping_cost =  $scope.product.shipping_cost;
            shoppingCartEntry.max_orderable_qty = parseInt($scope.product.max_orderable_qty);
            shoppingCartEntry.qty = 1;
            if($scope.product.variations) {
              if ($scope.product.variations.length > 0) {
                shoppingCartEntry.variations = [];
                for (i=0;i<$scope.product.variations.length;i++) {
                  shoppingCartEntry.variations.push({}); 
                  shoppingCartEntry.variations[i] =  angular.copy($scope.product.variations[i].scEntry);              
                }  
              }
            }  
            if ($scope.product.services) {
              if ($scope.product.services.length > 0) {
                shoppingCartEntry.services = [];
                for (i=0;i<$scope.product.services.length;i++) {
                  shoppingCartEntry.services.push({});   
                  shoppingCartEntry.services[i] =  angular.copy($scope.product.services[i].scEntry);                
                }  
              }
            }  
   
            //replacd this by serverside shopping cart
            if ($rootScope.shoppingCart === undefined){
              $rootScope.shoppingCart = []; 
            }
            $rootScope.shoppingCart.push(shoppingCartEntry);
            //haailaUtils.getShoppingCart($scope.product)
            $location.url('/shoppingcart'); 
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