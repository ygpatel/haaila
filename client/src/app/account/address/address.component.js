(function () {
  'use strict';
  angular
  .module('account.address', ['services.haailaUtils', 'services.accountResource', 'ui.bootstrap'])
  .component('address', {
    templateUrl: 'account/address/address.tpl.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: ["accountResource", function (accountResource) {
      var $ctrl = this;
      $ctrl.retVal = "";
      $ctrl.$onInit = function () {
        $ctrl.data = $ctrl.resolve.addressObj.data;
        $ctrl.data.mode = $ctrl.resolve.addressObj.mode; 
        $ctrl.delete  = $ctrl.resolve.addressObj.mode === 'DELETE';       
      };

      $ctrl.errfor = {}; //for identity server-side validation
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };

      $ctrl.save =  function(){
        $ctrl.alerts.detail = [];
        accountResource.setAccountAddress($ctrl.data).then(function(data){
          if(data.success){
            $ctrl.alerts.detail.push({
              type: 'success',
              msg: 'Address have been updated.'
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
      };

      $ctrl.closeModal = function () {
        $ctrl.close({$value: $ctrl.retVal});
      };

    }]
  });
}());