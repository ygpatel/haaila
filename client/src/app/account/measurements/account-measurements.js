angular.module('account.measurements.index', ['security.authorization', 'services.utility', 'services.accountResource', 'ngTouch', 'ui.grid', 'ui.grid.selection']);

angular.module('account.measurements.index').controller('AccountMeasurementsCtrl', ['$scope', '$route', '$location', '$log', 'utility', 'accountResource', 'measurements', '$interval', 'uiGridConstants',
  function($scope, $route, $location, $log, utility, accountResource, measurements, $interval, uiGridConstants){
    // local var


    $scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };

    $scope.gridOptions.columnDefs = [
      { name: 'profile_name',  displayName: 'Profile Name', width: '120' },
      { name: 'measurement_id.name',  displayName: 'Measurement Type' , width: '360'},
      { name: '_id', cellTemplate: 'account/measurements/account-measurement-button.tpl.html'}
    ];

    $scope.editMeasurement = function(id) {
      alert(id);
    };
    $scope.gridOptions.multiSelect = false;
    $scope.gridOptions.modifierKeysToMultiSelect = false;
    $scope.gridOptions.noUnselect = true;
    $scope.gridOptions.rowHeight = '55px';
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
      $scope.gridApi = gridApi;
    };

    $scope.toggleRowSelection = function() {
      $scope.gridApi.selection.clearSelectedRows();
      $scope.gridOptions.enableRowSelection = !$scope.gridOptions.enableRowSelection;
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
    };


    $scope.gridOptions.data = measurements;
    $interval( function() {$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);}, 0, 1);


    // $http.get('/data/500_complex.json')
    //   .success(function(data) {
    //     $scope.gridOptions.data = data;

    //     // $interval whilst we wait for the grid to digest the data we just gave it
    //     $interval( function() {$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);}, 0, 1);
    //   });



  }
]);