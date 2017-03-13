(function () {
  'use strict';
  angular
  .module('product.productquery', ['ui.router', 'services.haailaUtils', 'ngAnimate'])
  .directive('productquery', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/productquery/productquery.tpl.html',
      controller: function($stateParams,$rootScope,$scope, haailaUtils) {
        for (var i = 0; i < $rootScope.queries.length; i++) {
          if ($rootScope.queries[i]._id === $stateParams._id) {      
            $scope.queryConfigs = $rootScope.queries[i].query.queryConfig;
            $rootScope.activeCategoryIndex = i;
            $rootScope.activeCategory = $stateParams.categoryId;
            break;
          }
        }
        $scope.removeConfig = function(config) {
          var qry = $rootScope.queries[$rootScope.activeCategoryIndex].query;
          if (qry.querySearch.filters[config.code]) {

            switch(config.querycomponent) {
                case "checklist":
                case "colorpicker":
                    qry.querySearch.filters[config.code] = [];
                    if (config.data) {
                      for (var i=0; i<config.data.length; i++) {
                        config.data[i].value = false;
                      }
                    }
                    break;
                case "rangeslider":
                    qry.querySearch.filters[config.code].min = config.data.min;
                    qry.querySearch.filters[config.code].max = config.data.max;
                    break;
            }

          }
          
          haailaUtils.updateRemoveQueryDisplay();
          this.$root.$broadcast('update-query');
        };


      }   
    }; 
  });
}());

