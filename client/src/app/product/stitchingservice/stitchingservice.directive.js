(function () {
  'use strict';
  angular
  .module('product.stitchingservice', ['services.haailaUtils',  'ui.bootstrap', 'security'])
  .directive('stitchingservice', ['security', function(security) {

    return {
      restrict : 'EA',
      templateUrl:'product/stitchingservice/stitchingservice.tpl.html',
      scope: {
        service: '='
      },
      controller: ["$scope", "haailaUtils","$uibModal", "security", "$location", "$rootScope",
      function SelectboxController($scope, haailaUtils,$uibModal, security, $location, $rootScope) { 
        $scope.isAuthenticated = security.isAuthenticated;
        $scope.preSelectStitch = "Unstitch";
        $scope.accountMeasurements = "";
        $scope.customMeasurement = {};

        $scope.updateCostAndDesc = function(ser) {
          ser.scEntry.desc = haailaUtils.getLabel(ser.scEntryDesc, ser.scEntry.stitchInfo);
          ser.scEntry.cost = ser.scEntry.stitchInfo.add_cost;
          this.$root.$broadcast('UpdateTotal');           
        };

        $scope.itemSelected = function(stitchInfo, ser){
          if (angular.isUndefined(ser.scEntry.addInfo)) {
            ser.scEntry.addInfo = {};
          }
          var addInfo = ser.scEntry.addInfo;
          //store the stitchInfo for a sign in return
          ser.scEntry.stitchInfo = stitchInfo;
          var measurementId = stitchInfo.meas_code;
          if (measurementId !== null && measurementId !== "" &&  !angular.isUndefined(measurementId)){
            var oSearch = {};
            oSearch.measurementId = measurementId;
            addInfo.measurements = "";
            if (oSearch.measurementId.length > 0) {
              haailaUtils.getMeasurements(oSearch.measurementId).then (function(measurements){
                ser.scEntry.addInfo.measConfig = measurements.fields;
                ser.scEntry.addInfo.measDataInput = {};
                for (var i=0; i<measurements.fields.length; i++){
                    ser.scEntry.addInfo.measDataInput[measurements.fields[i].code] = "";
                }
                $scope.updateCostAndDesc(ser);
              });
            } 
          } else {
              $scope.updateCostAndDesc(ser);
          }
        };

        $scope.customItemSelected = function(ser) {
          var value = ser.scEntry.model.customOption;
           if (value ==="profile") {
            if ($scope.isAuthenticated()) {
              haailaUtils.fetchAccountMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(data){
                $scope.accountMeasurements =  data;
              });               
            } 
           }  
        };


        $scope.getLabel = function(template,data) {
          return haailaUtils.getLabel(template,data);
        }; 

                
        $scope.getStitchStyle = function(stitch) {
          if (stitch === this.service.model) {
              return '{display:block}';
          } else {
              return '{display:block}';
          }                      
        };
        
        $scope.isActive = function (stitch,ser) {
          if (!angular.isUndefined(ser.scEntry.stitchInfo)) {
            if (stitch === ser.scEntry.stitchInfo.stitch) {
                return true;
            } else {
                return false;
            }            
          } else {
            return false;
          }
        };
                  
        $scope.getLabel = function(template,data){
          var sOption = template;
          sOption = template.replace ("{{s}}", data.s);
          sOption = sOption.replace ("{{c}}", data.c);
          return sOption;
        };





        // $scope.isAuthenticated = function(){ 
        //   return security.isAuthenticated();
        // };


/*        $scope.getCustomMeasurement = function(ser) {    
          $scope.$parent.product.scEntry.addInfo.a = haailaUtils.getCustomMeasurement(ser,true);    
        }; */ 



        $scope.customMeasurementSelected = function(ser) {
          //update scEntry description with profile name
          ser.scEntry.desc = haailaUtils.getLabel(ser.scEntry.desc, ser.scEntry.addInfo.measDataInput);
          console.log($scope.customMeasurement);
        };

        $scope.addUpdateMeasurement = function(ser,addedit) {
          //var meas = measurements[haailaUtils.getIndexFromArrayOfObject(measurements,'_id',id)];
          //var meas = ser.scEntry.addInfo.measDataInput;
          var measData = "";
          if (addedit === 'ADD') {
            haailaUtils.getMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(measConfig) {
              ser.scEntry.addInfo.measDataInput = {};
              ser.scEntry.addInfo.measDataInput.measurement_id = measConfig; 
              haailaUtils.updateCustomMeasurement(ser,true,addedit)
              .then(function(selectedItem) { 
                $scope.refreshCustomMeasurements(selectedItem,ser);
              });
            });
          } else {
              haailaUtils.updateCustomMeasurement(ser,true,addedit)
              .then(function(selectedItem) { 
                $scope.refreshCustomMeasurements(selectedItem,ser);
              });
          }


        }; 


        $scope.refreshCustomMeasurements = function(selectedItem,ser) {
          if (selectedItem !== "") {
            ser.scEntry.customOption = 'profile';
            //the below will update the $scope.accountMeasurements with freshly fetched profile measurements that will have the updated/added profile
            haailaUtils.fetchAccountMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(data){
              $scope.accountMeasurements =  data;
              for (var i=0; i<$scope.accountMeasurements.length; i++) {
                if ($scope.accountMeasurements[i]._id === selectedItem) {
                  ser.scEntry.addInfo.measDataInput = $scope.accountMeasurements[i];
                  break;
                }
              }
            });

          }          
        }; 
                 
        $scope.stdMeasurementSelected = function(ser){
          $scope.$parent.isAddButtonEnabled = $scope.isReadyToAdd($scope.$parent.product.scEntry.addInfo.a);
        };   
                  
        $scope.isReadyToAdd = function(measurementValue){
          var measurementConfig = $scope.$parent.measurements;
          for (var i=0; i<measurementConfig.length; i++){
            var mValue = measurementValue[measurementConfig[i].code];
            if (mValue === "" || mValue === null || typeof mValue === "undefined" || mValue === 0) {
              $scope.$parent.addButtonTooltip = "Please select all the measurements";
              return false;
            }  
          }
          $scope.$parent.addButtonTooltip = "";
          return true;    
        };

        $scope.login = function(ser) {
          //cache the addInfo object in $rootScope
          $rootScope.productState = {};
          $rootScope.productState.scEntry = angular.copy(ser.scEntry);
          $rootScope.productState.location = $location.url;
          $location.url('/login');
        };

        if($rootScope.productState) {
          if($location.url === $rootScope.productState.location) {
            $scope.service.scEntry = angular.copy($rootScope.productState.scEntry);
            $scope.itemSelected($scope.service.scEntry.stitchInfo, $scope.service);
            $scope.customItemSelected($scope.service);            
            $rootScope.productState = undefined;
            // if ($scope.isAuthenticated()) {
            //  haailaUtils.fetchAccountMeasurements($scope.service.scEntry.meas_code).then(function(data){
            //    $scope.accountMeasurements =  data;
            //  });               
            // }
          }
        }

      }]
    };   
  }]);
}());