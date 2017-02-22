(function () {
  'use strict';
  angular
  .module('widgets.qchecklist', [])
  .directive('qchecklist', ['$rootScope', function($rootScope) {
    return{
        restrict: 'EA',
        templateUrl: 'widgets/qchecklist/qchecklist.tpl.html',
        scope: {
          queryconfig : "="
        },
        link: function(scope, element, attrs){
          console.log("From itemQuery link");
        },
        controller : function($scope, $element, $rootScope){
          $scope.chkLstClass = "checkbox checklist";
          $scope.checkListClicked = function(e) {
            var currQueryConfig = this.$parent.queryconfig;  
            var valueArray = [];
            for(var key in currQueryConfig.data){
               if (currQueryConfig.data[key].value) {
                   valueArray.push(currQueryConfig.data[key].label);
               }
            }
            this.$root.queries[this.$root.activeCategoryIndex].query.querySearch.filters[currQueryConfig.code] = valueArray;
            
            this.$root.$broadcast('update-query');
          };
          $scope.moreorless = 'more';
          $scope.toggleCheckListClass = function(){
            if ($scope.chkLstClass === "checkbox checklist") {
              $scope.chkLstClass = "checkbox checklist expanded";
              $scope.moreorless = 'less';
            } else {
              $scope.chkLstClass = "checkbox checklist";
              $scope.moreorless = 'more';
            }

          };
        }
    };
  }]);
}());