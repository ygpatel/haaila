angular.module('account.measurements.index', ['security.authorization', 'services.utility', 'services.accountResource']);
// angular.module('account.measurements.index').config(['$routeProvider', function($routeProvider){
//   $routeProvider
//     .when('/admin/users', {
//       templateUrl: 'admin/users/admin-users.tpl.html',
//       controller: 'UsersIndexCtrl',
//       title: 'Manage Users',
//       resolve: {
//         users: ['$q', '$location', '$log', 'securityAuthorization', 'adminResource', function($q, $location, $log, securityAuthorization, adminResource){
//           //get app stats only for admin-user, otherwise redirect to /account
//           var redirectUrl;
//           var promise = securityAuthorization.requireAdminUser()
//             .then(function(){
//               //handles url with query(search) parameter
//               return adminResource.findUsers($location.search());
//             }, function(reason){
//               //rejected either user is un-authorized or un-authenticated
//               redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
//               return $q.reject();
//             })
//             .catch(function(){
//               redirectUrl = redirectUrl || '/account';
//               $location.search({});
//               $location.path(redirectUrl);
//               return $q.reject();
//             });
//           return promise;
//         }]
//       },
//       reloadOnSearch: false
//     });
// }]);
angular.module('account.measurements.index').controller('AccountMeasurementsCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'accountResource', 'measurements',
  function($scope, $route, $location, $log, utility, accountResource, measurements){
    // local var
    $scope.measurements = measurements;

    // var fetchMeasurements = function(){
    //   adminResource.findUsers($scope.filters).then(function(data){
    //     deserializeData(data);

    //     // update url in browser addr bar
    //     $location.search($scope.filters);
    //   }, function(e){
    //     $log.error(e);
    //   });
    // };


    // // $scope vars
    // //select elements and their associating options
    // $scope.roles = [{label: "any", value: ""}, {label: "admin", value: "admin"}, {label: "account", value: "account"}];
    // $scope.isActives =[{label: "either", value: ""}, {label: "yes", value: "yes"}, {label: "no", value: "no"}];
    // $scope.sorts = [
    //   {label: "id \u25B2", value: "_id"},
    //   {label: "id \u25BC", value: "-_id"},
    //   {label: "username \u25B2", value: "username"},
    //   {label: "username \u25BC", value: "-username"},
    //   {label: "email \u25B2", value: "email"},
    //   {label: "email \u25BC", value: "-email"}
    // ];
    // $scope.limits = [
    //   {label: "10 items", value: 10},
    //   {label: "20 items", value: 20},
    //   {label: "50 items", value: 50},
    //   {label: "100 items", value: 100}
    // ];

    // //initialize $scope variables
    // deserializeData(data);
  }
]);