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
        $scope.measConfigs = {};
        $scope.measConfigModel = {};
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
            //addInfo.measurements = "";
            if (oSearch.measurementId.length > 0) {
              haailaUtils.getMeasurements(oSearch.measurementId).then (function(measurements){
                $scope.measConfigs = measurements;
                ser.scEntry.model.data = {};
                for (var i=0; i<measurements.fields.length; i++){
                    ser.scEntry.model.data[measurements.fields[i].code] = "";
                }
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
                $scope.measConfigs =  data;
              });               
            } 
           }  
        };

        $scope.customMeasurementSelected = function(ser,amModel) {
          //update scEntry description with profile name
          ser.scEntry.model.data = {};
          ser.scEntry.model.data.measurements = amModel.measurements;
          ser.scEntry.model.data.profile_name = amModel.profile_name;
          ser.scEntry.model.data.accountMeasurementId = amModel._id;
          ser.scEntry.desc = haailaUtils.getLabel(ser.scEntry.desc, ser.scEntry.model.data);
          console.log($scope.customMeasurement);
        };

        $scope.addUpdateMeasurement = function(ser,addedit) {
          //var meas = measurements[haailaUtils.getIndexFromArrayOfObject(measurements,'_id',id)];
          //var meas = ser.scEntry.addInfo.measDataInput;
          var measData = "";
          if (addedit === 'ADD') {
            haailaUtils.getMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(measConfig) {
              ser.scEntry.measConfig = {};
              ser.scEntry.measConfig = measConfig; 
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
            //the below will update the $scope.measConfigs with freshly fetched profile measurements that will have the updated/added profile
            haailaUtils.fetchAccountMeasurements(ser.scEntry.stitchInfo.meas_code).then(function(data){
              $scope.measConfigs =  data;
              for (var i=0; i<$scope.measConfigs.length; i++) {
                if ($scope.measConfigs[i]._id === selectedItem) {
                  ser.scEntry.addInfo.measDataInput = $scope.measConfigs[i];
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
          this.$root.$broadcast('CacheProductAndLogin');   
        };

        //check if this is a round trip from login in which case update the 
        //product (and hence variations and services) from cached value
        if($rootScope.productFromCache) {
            $scope.customItemSelected($scope.service);            

        }


      }]
    };   
  }]);
}());