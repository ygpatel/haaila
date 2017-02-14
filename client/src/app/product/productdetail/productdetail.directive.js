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
      controller: function($stateParams,$scope,$rootScope, haailaUtils) {
        var self = this;  
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
        //$scope.addButtonTooltip = $scope.product.variation.component.addCartMessage;
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

        
        $scope.addToCart = function(isFormValid){

        };
        
        
        $scope.itemprice = function(price,addCost){
            return price + (addCost > 0 ? addCost : 0);
        };
        
        //$scope.smallImage="assets/images/productssmall/kqy176.jpg";
        //$scope.largeImage="assets/images/productssmall/kqy176.jpg";   
        
        
        //$scope.getItem($stateParams.itemId); 

        } 

    };


  });

}());