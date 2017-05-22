(function () {
  'use strict';
  angular
  .module('cart.paymentMethod', ['services.haailaUtils'])
  .component('paymentMethod', {
    templateUrl: 'cart/payment-method/payment-method.tpl.html',
    bindings: {
      paymentInfo: '='
    },
    controller: [function () {
      var $ctrl = this;
      $ctrl.errfor = {};
      $ctrl.alerts = {
        detail: [], identity: [], pass: []
      };

      $ctrl.$onInit = function () {
        $ctrl.paymentTypes = 
          [
            {
              name: 'CREDITCARD',
              label: 'Credit Card',
              thirdParty: false
            },
            {
              name:'PAYPAL',
              label:'PayPal',
              thirdParty:true,
              url: 'http://paypal.com' //todo replace this with acutal url
            }  
          ];
             
      };

    }]
  });
}());