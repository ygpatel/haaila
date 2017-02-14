(function () {
  'use strict';
  angular
  .module('widgets.colorpicker', [])
  .directive('colorpicker', ['$rootScope', function($rootScope) {
    return{
      restrict: 'EA',
      scope: {
          queryconfig : "=",
      },
      templateUrl: 'widgets/colorpicker/colorpicker.tpl.html',
      controller : function($scope, $element, $rootScope){
         $scope.colorPickerClicked = function(key) {
              var currQueryConfig = this.$parent.queryconfig; 
              var valueArray = [];
             for(key in currQueryConfig.data){
                 if (currQueryConfig.data[key].value) {
                     valueArray.push(currQueryConfig.data[key].id);
                 }
             }
             this.$root.queries[this.$root.activeCategoryIndex].query.querySearch.filters[currQueryConfig.queryname] = valueArray;
              
             this.$root.$broadcast('update-query'); 
         };
      },
      link: function(scope, element, attrs){
          //alert("here");
      }
    };
  }]);
}());