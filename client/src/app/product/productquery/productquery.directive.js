(function () {
  'use strict';
  angular
  .module('product.productquery', ['ui.router', 'services.haailaUtils'])
  .directive('productquery', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/productquery/productquery.tpl.html',
      controller: function($stateParams,$rootScope,$scope) {
        
        console.log ($scope.queryConfigs);

        for (var i = 0; i < $rootScope.queries.length; i++) {
          if ($rootScope.queries[i]._id === $stateParams._id) {      
            $scope.queryConfigs = $rootScope.queries[i].query.queryConfig;
            $rootScope.activeCategoryIndex = i;
            $rootScope.activeCategory = $stateParams.categoryId;
            break;
          }
        }
      }   
    }; 
  });
}());

