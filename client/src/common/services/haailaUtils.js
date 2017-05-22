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

  haailaUtils.getActiveCategory = function() {
    return $rootScope.queries[$rootScope.activeCategoryIndex]._id;
  };


  haailaUtils.getProducts = function() {

    var filters = $rootScope.queries[$rootScope.activeCategoryIndex].query.querySearch;
    if (filters.sort === undefined) {
      filters.sort = "-date_added";
    }
    if (filters.limit === undefined) {
      filters.limit = 20;
    }
    haailaUtils.updateRemoveQueryDisplay();

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


  haailaUtils.updateRemoveQueryDisplay = function(){
    var qry = $rootScope.queries[$rootScope.activeCategoryIndex].query;
    for (var i=0; i<qry.queryConfig.length; i++) {
      if (qry.querySearch.filters[qry.queryConfig[i].code]) {
        if (!haailaUtils.isObjectEmpty(qry.querySearch.filters[qry.queryConfig[i].code])) {

          if (qry.queryConfig[i].querycomponent === "rangeslider") {
             var objModel = qry.querySearch.filters[qry.queryConfig[i].code];
             var objConfig = qry.queryConfig[i].data;
             if (objConfig.min === objModel.min && objConfig.max ===  objModel.max) {
                qry.queryConfig[i].isSearched = false;
             } else {
                qry.queryConfig[i].isSearched = true;
             }
          } else {

            qry.queryConfig[i].isSearched = true;
          }
        } else {
           qry.queryConfig[i].isSearched = false;
        }       
      } else {
        qry.queryConfig[i].isSearched = false;
      }
    }
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

  haailaUtils.getDefaultAddress = function() {
    var promise = accountResource.getDefaultAddress()
      .then(function(data){
        //handles url with query(search) parameter
        return $q.resolve(data);
      }, function(reason){
        //rejected either user is un-authorized or un-authenticated
        //redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
        return $q.reject("Error fetching default address");
      })
      .catch(function(){
        //todo proper handling of redirect in case of errors or exceptions.
        return $q.reject("Error fetching default address");
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
    if (data) {
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
      if (data.stitch !== undefined) {
        if (data.stitch !== "") {
          label = label.replace ("{{stitch}}", data.stitch);
        } else {
          label = label.replace ("{{stitch}}", "");
        }
      } else {
        label = label.replace ("{{stitch}}", "");
      }  

      if (data.profile_name !== undefined) {
        if (data.profile_name !== "") {
          label = label.replace ("{{profile_name}}", "for "+data.profile_name);
        } else {
          label = label.replace ("{{profile_name}}", "");
        }
      } else {
        label = label.replace ("{{profile_name}}", "");
      }

    } else {
      label = label.replace ("{{v_value}}", "");
      label = label.replace ("{{stitch}}", "");
      label = label.replace ("(add ${{add_cost}})", "");
      label = label.replace ("{{profile_name}}", "");
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


  haailaUtils.updateAddress = function (address,mode) {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'address',
      resolve : {
        resolveObj : function() {
          var resObj = {};
          resObj.address = address;
          resObj.mode = mode ;
          resObj.ready = true;
          return resObj;
        } 
      }   
    });
    return modalInstance.result;
  };






  haailaUtils.setDefaultAddress = function(data) {
    var redirectUrl;
    var promise = accountResource.setDefaultAddress(data)
      .then(function(data){
        return $q.resolve(data);
      }, function(reason){
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

  haailaUtils.getShoppingCart = function(cart) {     
    var modalInstance = $uibModal.open({
      animation: true,
      component: 'shoppingcart',
      resolve: {
        cart: function() {
          return cart;
        }
      }                            
    });
    return modalInstance.result;
  };

  haailaUtils.getShoppingCartCount = function() {
    if ($rootScope.shoppingCart ) {
      return $rootScope.shoppingCart.length; 
    } else {
      return 0;
    }
    
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