(function () {
  'use strict';
  angular
  .module('product.customsizing', ['services.haailaUtils', 'services.accountResource', 'ui.bootstrap'])
  .component('customsizing', {
    templateUrl: 'product/customsizing/customsizing.tpl.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: ["accountResource", function (accountResource) {
      var $ctrl = this;
      $ctrl.imageSource = "";

      $ctrl.$onInit = function () {
      $ctrl.measurements = $ctrl.resolve.measurements;
      $ctrl.target = $ctrl.resolve.target;   
      $ctrl.cancelTarget =  angular.copy($ctrl.target);   

      };

      $ctrl.errfor = {}; //for identity server-side validation
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };



      $ctrl.ok =  function(){
        $ctrl.alerts.detail = [];
        accountResource.setAccountMeasurements($ctrl.target).then(function(data){
          if(data.success){
            $ctrl.alerts.detail.push({
              type: 'success',
              msg: 'Measurements have been updated.'
            });
          }else{
            angular.forEach(data.errors, function(err, index){
              $ctrl.alerts.detail.push({
                type: 'danger',
                msg: err
              });
            });
          }
        }, function(x){
          $ctrl.alerts.detail.push({
            type: 'danger',
            msg: 'Error updating measurement details: ' + x
          });
        });

        //$ctrl.close({$value: $ctrl.target});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: $ctrl.cancelTarget});
      };

      $ctrl.updateImage = function(code) {
        $ctrl.imageSource = "img/measurements/"+code+".jpg";
      };
    }]
  });
}());