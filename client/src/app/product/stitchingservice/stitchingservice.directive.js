(function () {
  'use strict';
  angular
  .module('product.stitchingservice', ['services.haailaUtils',  'ui.bootstrap', 'security'])
  .directive('stitchingservice', ['security', function(security) {

    return {
      restrict : 'EA',
      templateUrl:'product/stitchingservice/stitchingservice.tpl.html',
      scope: {
        service: '=',
        index: '='
      },
      controller: ["$scope", "haailaUtils","$uibModal", "security", "$location", "$rootScope",
      function SelectboxController($scope, haailaUtils,$uibModal, security, $location, $rootScope) { 

        $scope.isAuthenticated = security.isAuthenticated;
        $scope.service.measConfigs = {};
        $scope.service.measConfigModel = {};
        $scope.customMeasurement = {};

        $scope.updateCostAndDesc = function(ser) {
          if (ser.scEntry) {
            if (ser.scEntry.stitchInfo) {
              ser.scEntry.desc = haailaUtils.getLabel(ser.scEntryDesc, ser.scEntry.stitchInfo);
            }
            
            if (ser.scEntry.stitchInfo) {  
              if (ser.scEntry.stitchInfo.add_cost) {
                ser.scEntry.cost = ser.scEntry.stitchInfo.add_cost;
                this.$root.$broadcast('UpdateTotal');  
              }
            }  
          }            
        };

        $scope.itemSelected = function(stitchInfo, ser, isCalledFromTemplate){
          //store the stitchInfo for a sign in return
          ser.scEntry.stitchInfo = stitchInfo;
          var measurementId = stitchInfo.meas_code;
          if (measurementId !== null && measurementId !== "" &&  !angular.isUndefined(measurementId)){
            var oSearch = {};
            oSearch.measurementId = measurementId;

            if (($scope.service.scEntry.model.customOption === undefined || isCalledFromTemplate) && stitchInfo.stitch === "CUSTOM") { 
              $scope.service.scEntry.model.customOption = "email";
            }  
            if (oSearch.measurementId.length > 0) {
              haailaUtils.getMeasurements(oSearch.measurementId).then (function(measurements){
                ser.measConfigs = measurements;
                // ser.scEntry.model.data = {};
                // for (var i=0; i<measurements.fields.length; i++){
                //     ser.scEntry.model.data[measurements.fields[i].code] = "";
                // }
                $scope.updateCostAndDesc(ser);
              });
            } 
          } else {
              $scope.updateCostAndDesc(ser);
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

        $scope.customItemSelected = function(ser) {
          var value = ser.scEntry.model.customOption;
           if (value ==="profile") {
            if ($scope.isAuthenticated()) {
              haailaUtils.fetchAccountMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(data){
                ser.measConfigs =  data;
              });               
            } 
           }  
        };


        $scope.customMeasurementSelected = function(ser) {
          //update scEntry description with profile name
          if (ser.measConfigModel !== undefined) {
            ser.scEntry.model.data = {};
            ser.scEntry.model.data.measurements = ser.measConfigModel.measurements;
            ser.scEntry.model.data.profile_name = ser.measConfigModel.profile_name;
            ser.scEntry.model.data.accountMeasurementId = ser.measConfigModel._id;
            ser.scEntry.desc = haailaUtils.getLabel(ser.scEntry.desc, ser.scEntry.model.data);
          }
        };

        $scope.addUpdateMeasurement = function(ser,addedit) {
          var measData = "";
          if (addedit === 'ADD') {
            haailaUtils.getMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(measConfig) {
              ser.measConfigModel={};
              ser.measConfigModel.measurement_id = measConfig;
              
              ser.scEntry.model.data.profile_name = "";
              ser.scEntry.model.data.measurements = {};
              haailaUtils.updateCustomMeasurement(ser.measConfigModel,ser.scEntry.model.data,true,addedit)
              .then(function(selectedItem) { 
                $scope.refreshCustomMeasurements(selectedItem,ser);

              });
            });
          } else {
              haailaUtils.updateCustomMeasurement(ser.measConfigModel,ser.scEntry.model.data,true,addedit)
              .then(function(selectedItem) { 
                $scope.refreshCustomMeasurements(selectedItem,ser);
              });
          }
        }; 

        $scope.refreshCustomMeasurements = function(selectedItem,ser) {
          if (selectedItem !== "") {
            ser.scEntry.model.customOption = 'profile';
            //the below will update the $scope.measConfigs with freshly fetched profile measurements that will have the updated/added profile
            haailaUtils.fetchAccountMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(data){
              ser.measConfigs =  data;
              for (var i=0; i< ser.measConfigs.length; i++) {
                if (ser.measConfigs[i]._id === selectedItem) {
                  ser.measConfigModel = ser.measConfigs[i];                  
                  break;
                }
              }
              $scope.customMeasurementSelected(ser);

            });

          }          
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
          this.$root.$broadcast('CacheProductAndLogin');   
        };

        //check if this is a round trip from login in which case update the 
        //product (and hence variations and services) from cached value
        if($rootScope.productFromCache) {
            $scope.customItemSelected($scope.service);   
            $scope.itemSelected($scope.service.scEntry.stitchInfo,$scope.service, false);
        } else {
          $scope.service.scEntry.model.stitch = $scope.service.data[0].stitch;
          $scope.service.scEntry.stitchInfo = $scope.service.data[0];
          $scope.itemSelected($scope.service.scEntry.stitchInfo,$scope.service, false);
        }

      }]
    };   
  }]);
}());