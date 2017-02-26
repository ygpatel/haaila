(function () {
  'use strict';
  angular
  .module('product.stitchingservice', ['services.haailaUtils',  'ui.bootstrap', 'security'])
  .directive('stitchingservice', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/stitchingservice/stitchingservice.tpl.html',
      scope: {
        service: '='
      },
      controller: ["$scope", "haailaUtils","$uibModal", "security",
      function SelectboxController($scope, haailaUtils,$uibModal, security) { 
                
        $scope.dataSCModel = "";

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
        
        $scope.isActive = function (stitch) {
          if (!angular.isUndefined(this.service.scEntry.addInfo)) {
            if (stitch === this.service.scEntry.addInfo.stitch) {
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

        $scope.itemSelected = function(ser, serData){
          var addInfo = $scope.$parent.product.scEntry.addInfo;
          if (addInfo !== null && addInfo !== "" &&  !angular.isUndefined(addInfo)){
            var oSearch = {};
            oSearch.measurementId = serData.meas_code;
            addInfo.measurements = "";
            if (oSearch.measurementId.length > 0) {
              haailaUtils.getMeasurements(oSearch.measurementId).then (function(measurements){
                ser.scEntry.addInfo.measConfig = measurements.fields;
                ser.scEntry.addInfo.measDataInput = {};
                for (var i=0; i<measurements.length; i++){
                    ser.scEntry.addInfo.measDataInput[measurements[i].code] = "";
                }
              });
            } else {
              //$scope.$parent.isAddButtonEnabled = true;
              $scope.$parent.addButtonTooltip = "";
            }
          }
          else {            
            $scope.$parent.isAddButtonEnabled = false;
            //$scope.$parent.addButtonTooltip = $scope.$parent.product.meta.metaconfig.component.addCartMessage;
          } 

          //update the scEntry and the total
            ser.scEntry.desc = haailaUtils.getLabel(ser.scEntryDesc, ser.scEntry.addInfo);
            ser.scEntry.cost = ser.scEntry.addInfo.add_cost;
            this.$root.$broadcast('UpdateTotal');  


        };


        $scope.isUserLoggedIn = (security.currentUser !==null, true,false);  

/*        $scope.getCustomMeasurement = function(ser) {    
          $scope.$parent.product.scEntry.addInfo.a = haailaUtils.getCustomMeasurement(ser,true);    
        }; */ 

        $scope.accountMeasurements = "";

        $scope.customItemSelected = function(ser) {
          var value = ser.scEntry.addInfo.measConfig;
          if (value ==="profile") {
            haailaUtils.fetchAccountMeasurements(ser.scEntry.addInfo.meas_code).then(function(data){
              $scope.accountMeasurements =  data;
            });
          }  
        };

        $scope.customMeasurement = {};

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
            haailaUtils.getMeasurements(ser.scEntry.addInfo.meas_code).then(function(measConfig) {
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
            ser.scEntry.addInfo.measConfig = 'profile';
            //the below will update the $scope.accountMeasurements with freshly fetched profile measurements that will have the updated/added profile
            haailaUtils.fetchAccountMeasurements(ser.scEntry.addInfo.meas_code).then(function(data){
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
      }]
    };   
  });
}());