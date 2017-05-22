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
      $ctrl.errfor = {};
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };

      $ctrl.$onInit = function () {
        
        //$ctrl.address = $ctrl.resolve.resolveObj.address;
        //$ctrl.mode = $ctrl.resolve.resolveObj.mode;  // this can hold ADD, EDIT, DELETE, DISPLAY, FDISPLAY (formatted display)    
      };

      $ctrl.isEdit = function() {
        return ($ctrl.resolve.resolveObj.mode === 'DELETE' || $ctrl.resolve.resolveObj.mode === 'DISPLAY' ? false : true);
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