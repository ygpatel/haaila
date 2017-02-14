(function () {
  'use strict';
  angular
  .module('product.standardsizing', ['services.haailaUtils'])
  .directive('standardsizing', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/standardsizing/standardsizing.tpl.html',
      scope: {
        variation: '='
      },      
      controller: ["$scope", "haailaUtils",
        function standardSizingController($scope, haailaUtils) {

          $scope.getLabel = function(template,data) {
            return haailaUtils.getLabel(template,data);
          };  


          $scope.itemSelected = function(variation){
            variation.scEntry.desc = haailaUtils.getLabel(variation.scEntryDesc, variation.scEntry.addInfo);
            variation.scEntry.cost = variation.scEntry.addInfo.add_cost;
            this.$root.$broadcast('UpdateTotal');
          };
       } 
      ]};   
  });
}());