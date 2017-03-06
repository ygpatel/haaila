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
        
      
        $ctrl.measurementFields = $ctrl.resolve.measConfig.config.measurement_id.fields;
        $ctrl.description = $ctrl.resolve.measConfig.config.measurement_id.desc;
        $ctrl.fromProduct = $ctrl.resolve.measConfig.fromProduct;

        $ctrl.model = $ctrl.resolve.measConfig.model;
        $ctrl.model.mode = $ctrl.resolve.measConfig.addedit;
        
        $ctrl.measurements = $ctrl.model.measurements;        
        $ctrl.profile_name = $ctrl.model.profile_name;

        
      };

      $ctrl.errfor = {}; //for identity server-side validation
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };



      $ctrl.save =  function(){
        $ctrl.alerts.detail = [];
        
        $ctrl.model.measurement_id = $ctrl.resolve.measConfig.config.measurement_id._id;
        $ctrl.model.fromProduct = $ctrl.resolve.measConfig.fromProduct;


        accountResource.setAccountMeasurements($ctrl.model).then(function(data){
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