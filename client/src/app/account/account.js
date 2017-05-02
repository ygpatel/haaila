angular.module('account.index', ['ui.router', 'security.authorization']);
// angular.module('account.index').config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider){
//   $stateProvider
//     .state('account', {
//       url: '/account',
//       templateUrl: 'account/account.tpl.html',
//       controller: 'AccountCtrl',
//       title: 'Account Area',
//       resolve: {
//         authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
//       }        
//     });
// }]);

angular.module('account.index').controller('AccountCtrl', [ '$scope',
  function($scope){
    $scope.dayOfYear = moment().format('DDD');
    $scope.dayOfMonth = moment().format('D');
    $scope.weekOfYear = moment().format('w');
    $scope.dayOfWeek = moment().format('d');
    $scope.weekYear = moment().format('gg');
    $scope.hourOfDay = moment().format('H');


    $scope.view_tab = "infoTab";
    $scope.changeTab = function(tab) { $scope.view_tab = tab; };

  }]);
