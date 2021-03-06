(function () {
  'use strict';
  angular
  .module('product.productlist', ['ui.router', 'services.haailaUtils'])
  .directive('productlist', function(){
    return {
      scope : {
        products: "="
      },
      restrict : 'EA',
      templateUrl: 'product/productlist/productlist.tpl.html',
      link: function(scope, element, attributes) {
          //scope.items = attributes["items"];
      },
      controller: ['$scope', '$rootScope', 'haailaUtils', '$log',
      function ProductListController($scope,$rootScope, haailaUtils, $log) {
        $scope.sorts = [
          {label: "\u2193 Newest Arrival", value: "-date_added"},
          {label: "\u2191 Price Lower to Higher", value: "sale_price"},
          {label: "\u2193 Price Higher to Lower", value: "-sale_price"}
        ];
        $scope.limits = [
          {label: "2 items", value: 2},
          {label: "10 items", value: 10},
          {label: "20 items", value: 20},
          {label: "50 items", value: 50},
          {label: "100 items", value: 100}
        ];  
        
        $scope.category = $rootScope.queries[$rootScope.activeCategoryIndex];
        $scope.querySearch = $scope.category.query.querySearch;

        $scope.querySearch.sort = "-date_added";
        $scope.querySearch.limit = 20;



        $scope.queryResult = $scope.category.query.queryResult;
        //if user gets to the product list page product should not be loaded using the cache. 
        //This is a scenario when user had to login to load profile.
        $rootScope.productFromCache = undefined;
        $rootScope.productFromCacheUrl = undefined;

        var fetchProducts = function(){
          haailaUtils.getProducts().then(function(result){
            haailaUtils.deserializeProductData(result);
          }, function(e){
            $log.error(e);
          });
        };
        $scope.filtersUpdated = function(){
          //reset pagination after filter(s) is updated
          var x = $rootScope.queries;
          $scope.querySearch['page'] = undefined;
          fetchProducts();
        };
        $scope.prev = function(){
          $scope.querySearch['page'] = $scope.querySearch["pages"].prev;
          fetchProducts();
        };
        $scope.next = function(){
          $scope.querySearch['page'] = $scope.querySearch["pages"].next;
          fetchProducts();
        };
        $scope.$on('update-query', function(e) {
            
            //collect query for current category
            
            fetchProducts();
    
        });  
      }]
    };
  });
}());