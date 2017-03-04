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
      $ctrl.retVal = "";
      $ctrl.$onInit = function () {
        $ctrl.fromProduct = $ctrl.resolve.fromProduct;
        if ($ctrl.fromProduct) {
          $ctrl.measurements = $ctrl.resolve.service.scEntry.measConfig.fields;
          $ctrl.description = $ctrl.resolve.service.scEntry.measConfig.desc;
          $ctrl.mode = $ctrl.resolve.service.addupdate;
          $ctrl.target = $ctrl.resolve.service.scEntry.model.data;  
        } else {
          $ctrl.measurements = $ctrl.resolve.service.measurement_id.fields;
          $ctrl.description = $ctrl.resolve.service.measurement_id.desc;
          $ctrl.mode = $ctrl.resolve.service.addupdate;
          $ctrl.target = $ctrl.resolve.service;  
        }             

        
        
        $ctrl.cancelTarget =  angular.copy($ctrl.target);   
        
      };

      $ctrl.errfor = {}; //for identity server-side validation
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };



      $ctrl.save =  function(){
        $ctrl.alerts.detail = [];
        $ctrl.target.mode = $ctrl.mode;
        $ctrl.target.fromProduct = $ctrl.fromProduct;
        accountResource.setAccountMeasurements($ctrl.target).then(function(data){
          if(data.success){
            $ctrl.alerts.detail.push({
              type: 'success',
              msg: 'Measurements have been updated.'
            });
            $ctrl.retVal = data.measurements._id;
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

      $ctrl.closeModal = function () {
        $ctrl.close({$value: $ctrl.retVal});
      };

      $ctrl.updateImage = function(code) {
        $ctrl.imageSource = "img/measurements/"+code+".jpg";
      };
    }]
  });
}());