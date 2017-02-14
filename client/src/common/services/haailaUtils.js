angular.module('services.haailaUtils', ['services.productResource', 'ui.bootstrap'])
.factory('haailaUtils', ['productResource', '$q', '$location', '$log', '$rootScope', '$uibModal',
  function (productResource, $q, $location, $log, $rootScope, $uibModal) {
  var haailaUtils = {};
/*  haailaUtils.getQueryConfig = function(){
    productResource.getAllQueryInfo().then(function(data){
      return data;
    }, function(e){
      //$log.error(e);
      return '';
    });
  }; */ 

  haailaUtils.setQueries = function (queries) {
    $rootScope.queries = queries;
  };


  haailaUtils.setActiveCategoryIndex = function(categoryId) {

    var categoryIndex = 0;
    for (var i = 0; i < $rootScope.queries.length; i++) {
        if ($rootScope.queries[i]._id === categoryId) {      
            $rootScope.activeCategoryIndex = i;
            $rootScope.activeCategory = categoryId;
            break;
        }
    }               
  };  


  haailaUtils.getActiveCategoryIndex = function() {
    return $rootScope.activeCategoryIndex;
  };

  haailaUtils.getProducts = function() {

    var filters = $rootScope.queries[$rootScope.activeCategoryIndex].query.querySearch;


    var redirectUrl;
    var promise = productResource.getProductList(filters)
      .then(function(data){
        //handles url with query(search) parameter
        return $q.resolve(data);
      }, function(reason){
        //rejected either user is un-authorized or un-authenticated
        //redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
        return $q.reject();
      })
      .catch(function(){
        //todo proper handling of redirect in case of errors or exceptions.
        redirectUrl = redirectUrl || '/home';
        $location.path(redirectUrl);
        return $q.reject();
      });
    return promise;
  };

  haailaUtils.getProductDetail = function(categoryId, productId) {
    var redirectUrl;
    var promise = productResource.getProductDetail(categoryId, productId)
      .then(function(data){
        //handles url with query(search) parameter
        return $q.resolve(data);
      }, function(reason){
        //rejected either user is un-authorized or un-authenticated
        //redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
        return $q.reject();
      })
      .catch(function(){
        //todo proper handling of redirect in case of errors or exceptions.
        redirectUrl = redirectUrl || '/home';
        $location.path(redirectUrl);
        return $q.reject();
      });
    return promise;
  };

  haailaUtils.getMeasurements = function(measurementId) {
    var redirectUrl;
    var promise = productResource.getMeasurements(measurementId)
      .then(function(data){
        //handles url with query(search) parameter
        return $q.resolve(data);
      }, function(reason){
        //rejected either user is un-authorized or un-authenticated
        //redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
        return $q.reject();
      })
      .catch(function(){
        //todo proper handling of redirect in case of errors or exceptions.
        redirectUrl = redirectUrl || '/home';
        $location.path(redirectUrl);
        return $q.reject();
      });
    return promise;
  };






  haailaUtils.deserializeProductData = function(data) {
    var querySearch = $rootScope.queries[$rootScope.activeCategoryIndex].query.querySearch; 
    var queryResult = $rootScope.queries[$rootScope.activeCategoryIndex].query.queryResult;   
    querySearch.items = data.items;
    querySearch.pages = data.pages;
    //querySearch.filters = data.filters;
    queryResult.products = data.data;
  };


  haailaUtils.getHelp = function (helpId) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'assets/help/' + helpId.toLowerCase() + '.html',
    });               
  };
  haailaUtils.hasItemVariations = function (product) { 
    if (product.variations) {
      if (angular.isArray(product.variations)) {
        if (product.variations.length>0) {
            return true;
        }
        return false;
      } 
    } 
  };
  haailaUtils.hasItemServices = function (item) {
    if (angular.isArray(item.services)) {
      if (item.services.length>0) {
          return true;
      }
      return false;
    }        
  };

  haailaUtils.getLabel = function(template,data){
    var label = template;

    if (data.v_value) {
      label = label.replace ("{{v_value}}", data.v_value);
    }
    if (data.add_cost > 0) {
      label = label.replace ("{{add_cost}}", data.add_cost);
    } else {
      //truncate
      label = label.replace ("(add ${{add_cost}})", "");
    }
    console.log("getLabel :" + label);
    return label;

  };




  return haailaUtils;
}]);