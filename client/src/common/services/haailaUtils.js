angular.module('services.haailaUtils', ['services.productResource', 'services.accountResource', 'ui.bootstrap', 'security'])
.factory('haailaUtils', ['productResource', 'accountResource', '$q', '$location', '$log', '$rootScope', '$uibModal', 'securityAuthorization',
  function (productResource, accountResource, $q, $location, $log, $rootScope, $uibModal, securityAuthorization) {
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


  haailaUtils.fetchAccountMeasurements = function(measurementId) {
     //get app stats only for admin-user, otherwise redirect to /account
    var redirectUrl;
    var promise = securityAuthorization.requireVerifiedUser() 
      .then(function(){
        //handles url with query(search) parameter
        return accountResource.getAccountMeasurements(measurementId);
      }, function(reason){
        //rejected either user is un-authorized or un-authenticated
        redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
        return $q.reject();
      })
      .catch(function(){
        redirectUrl = redirectUrl || '/account';
        $location.search({});
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

    if (data.add_cost) {
      if (data.add_cost > 0) {
        label = label.replace ("{{add_cost}}", data.add_cost);
      } else {
        //truncate
        label = label.replace ("(add ${{add_cost}})", "");
      }
    } else {
      label = label.replace ("(add ${{add_cost}})", "");
    }
    if (data.stitch) {
      label = label.replace ("{{stitch}}", data.stitch);
    }
    if (data.profile_name !== undefined) {
      if (data.profile_name !== "") {
        label = label.replace ("{{profile_name}}", "for "+data.profile_name);
      } else {
        label = label.replace ("{{profile_name}}", "");
      }
    }

    console.log("getLabel :" + label);
    return label;

  };

  haailaUtils.updateCustomMeasurement = function(config,model,fromProduct, addedit) {     

    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'customsizing',
      resolve: {
        measConfig: function() {
          var resObj = {};
          resObj.config = config;
          resObj.model = model;
          resObj.fromProduct = fromProduct;
          resObj.addedit = addedit;  
          return resObj;
        }
      }                            
    });
    return modalInstance.result;
    // modalInstance.result.then(function (selectedItem) {
    //   return selectedItem;  
    // }, function (cancelSelectedItem) {
    //   return cancelSelectedItem;    
    // });
  };

  haailaUtils.getShoppingCart = function(product) {     
    var modalInstance = $uibModal.open({
      animation: true,
      component: 'shoppingcart',
      resolve: {
        cart: function() {
          return product;
        }
      }                            
    });
    return modalInstance.result;
  };




  haailaUtils.getIndexFromArrayOfObject = function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) { 
      if (arraytosearch[i][key] === valuetosearch) {
        return i;
      }
    }
    return null;
  };


  haailaUtils.isObjectEmpty = function(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }    
    }
    return true;
  };


  return haailaUtils;
}]);