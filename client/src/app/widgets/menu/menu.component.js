(function () {
  'use strict';
  angular
  .module('widgets.menu', ['ngAnimate', 'ngSanitize'])
  .component('menu', {
    templateUrl: 'widgets/menu/menu.tpl.html',
    controller: ['$rootScope', '$scope',
      function menuController($rootScope, $scope) {
        var self = this; 
        self.menuitems = $rootScope.queries;        
      }
    ]
  });
}());
