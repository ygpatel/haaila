(function () {
  'use strict';
  angular
  .module('product.stitchingservice', ['services.haailaUtils',  'ui.bootstrap'])
  .directive('stitchingservice', function(){
    return {
      restrict : 'EA',
      templateUrl:'product/stitchingservice/stitchingservice.tpl.html',
      scope: {
        service: '='
      },
      controller: ["$scope", "haailaUtils","$uibModal",
      function SelectboxController($scope, haailaUtils,$uibModal) { 
                
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
          if (stitch === this.service.scEntry.addInfo.stitch) {
              return true;
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
                ser.scEntry.measConfig = measurements.fields;
                ser.scEntry.measDataInput = {};
                for (var i=0; i<measurements.length; i++){
                    ser.scEntry.measDataInput[measurements[i].code] = "";
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

        $scope.getCustomMeasurement = function(ser) {        
          var modalInstance = $uibModal.open({
            animation: true,
            component: 'customsizing',
              
            resolve: {
              measurements: function () {
                return ser.scEntry.measConfig;
              },
              target : function () {
                  return ser.scEntry.measDataInput; 
              }
            }                            
          });
          modalInstance.result.then(function (selectedItem) {
            $scope.$parent.product.scEntry.addInfo.a = selectedItem;
             $scope.$parent.isAddButtonEnabled = $scope.isReadyToAdd($scope.$parent.product.scEntry.addInfo.a);    
          }, function (cancelSelectedItem) {
            $scope.$parent.product.scEntry.addInfo.a = cancelSelectedItem;
              $scope.$parent.isAddButtonEnabled = $scope.isReadyToAdd($scope.$parent.product.scEntry.addInfo.a);    
          });
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