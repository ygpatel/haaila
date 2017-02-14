(function () {
  'use strict';
  angular
  .module('product.customization', ['services.haailaUtils'])
  .directive('customization', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/customization/customization.tpl.html',
      link: function(scope, element, attrs){
            console.log("From itemDetail link");
      },
      scope: false,
      controller: ["$scope", function SelectboxController($scope) {
        $scope.getLabel = function(template,data){
          var sOption = template;
          sOption = template.replace ("{{s}}", data.s);
          sOption = sOption.replace ("{{p}}", data.p);
          return sOption;
        };
      }]
    };  
  });
}());