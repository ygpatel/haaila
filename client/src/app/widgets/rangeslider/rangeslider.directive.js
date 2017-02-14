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
      controller : function($scope, $element, $rootScope){
        $scope.$on("slideEnded", function(e) {
          var currQueryConfig = e.currentScope.queryconfig;
          var targetQuery = e.currentScope.$root.queries[e.currentScope.$root.activeCategoryIndex].query;
          targetQuery.querySearch.filters[currQueryConfig.code] = {};
          targetQuery.querySearch.filters[currQueryConfig.code].min = parseFloat(e.currentScope.queryconfig.data.min);
          targetQuery.querySearch.filters[currQueryConfig.code].max = parseFloat(e.currentScope.queryconfig.data.max); 
          targetQuery.querySearch.filters[currQueryConfig.code].range = true;
          targetQuery.querySearch.filters[currQueryConfig.code].type = "number";
          $rootScope.$broadcast('update-query');
        });
      }
    };
  }]);
}());