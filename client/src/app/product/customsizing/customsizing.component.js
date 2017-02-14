(function () {
  'use strict';
  angular
  .module('product.customsizing', ['services.haailaUtils'])
  .component('customsizing', {
    templateUrl: 'product/customsizing/customsizing.tpl.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var $ctrl = this;

      $ctrl.$onInit = function () {
      $ctrl.measurements = $ctrl.resolve.measurements;
      $ctrl.target = $ctrl.resolve.target;   
      $ctrl.cancelTarget =  angular.copy($ctrl.target);   

      };

      $ctrl.ok = function () {
        $ctrl.close({$value: $ctrl.target});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: $ctrl.cancelTarget});
      };
    }
  });
}());