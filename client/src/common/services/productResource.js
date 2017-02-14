angular.module('services.productResource', ['ngResource']).factory('productResource', ['$http', '$rootScope', function ($http, $rootScope) {
  // local variable
  var baseUrl = '/api';
  var productUrl = baseUrl + '/productlist';
  var productQueryUrl = baseUrl + '/productquery';
  var measurementUrl = baseUrl + '/measurement/';
  
  

  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return msg.join(' ');
  };


  // query api
  var resource = {};

  resource.getAllQueryInfo = function(){
    return $http.get(productQueryUrl).then(processResponse, processError);
  };

  // ----- Product api -----
  resource.getProductList = function(filters){
    return $http.get(productUrl, { params: filters }).then(processResponse, processError);
  };

  resource.getProductDetail = function(categoryId, productId){
    var url = baseUrl+ '/category/' + categoryId + '/product/' + productId;
    return $http.get(url).then(processResponse, processError);
  };

  resource.getMeasurements = function(measurementId) {
    var url = measurementUrl + measurementId;
    return $http.get(url).then(processResponse, processError);
  };

  return resource;

}]);







