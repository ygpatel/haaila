(function () {
  'use strict';
  angular
  .module('widgets.rangeslider', ['rzModule'])
  .directive('rangeslider', ['$rootScope', function($rootScope) {
    return{
      restrict: 'EA',
      require:'^productQuery',
      scope: {
          queryconfig : "=",
      },
      templateUrl: 'widgets/rangeslider/rangeslider.tpl.html',
      controller : function($scope, $rootScope){
        $scope.targetQuery = $rootScope.queries[$rootScope.activeCategoryIndex].query;
        if ($scope.targetQuery.querySearch.filters[$scope.queryconfig.code] === undefined) {
          $scope.targetQuery.querySearch.filters[$scope.queryconfig.code] = {};
        }
        
        $scope.queryModel = $scope.targetQuery.querySearch.filters[$scope.queryconfig.code];

        if ($scope.queryModel.min === undefined) {
          $scope.queryModel.min = $scope.queryconfig.data.min;
        }
        if ($scope.queryModel.max === undefined) {
          $scope.queryModel.max = $scope.queryconfig.data.max;
        }


        $scope.$on("slideEnded", function(e) {
          //var currQueryConfig = e.currentScope.queryconfig;
          //var targetQuery = e.currentScope.$root.queries[e.currentScope.$root.activeCategoryIndex].query;
          //targetQuery.querySearch.filters[currQueryConfig.code] = {};
          //targetQuery.querySearch.filters[currQueryConfig.code].min = parseFloat($scope.min);
          //targetQuery.querySearch.filters[currQueryConfig.code].max = parseFloat($scope.max); 
          //$scope.targetQuery.querySearch.filters[currQueryConfig.code].range = true;
          //$scope.targetQuery.querySearch.filters[currQueryConfig.code].type = "number";
          $scope.queryModel.range = true;
          $scope.queryModel.type = "number";
          $rootScope.$broadcast('update-query');
        });
      }
    };
  }]);
}());