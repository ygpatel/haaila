'use strict';

exports = module.exports = {

  getCategoryQuery : function(cat, callback) {
    var aCategories = new Array();
    for (var i=0; i < cat.length; i++) {
      var oCategory = new Object();
      oCategory._id = cat[i]._id;
      oCategory.category = cat[i].category;
      oCategory.categoryLabel = cat[i].categorylabel;
      oCategory.query = new Object();
      oCategory.query.querySearch = new Object();
      oCategory.query.querySearch.filters = new Object();
      oCategory.query.querySearch.filters.category_id = cat[i]._id ;
      oCategory.query.queryConfig = cat[i].features.filter(filterByIsSearchable);
      oCategory.query.queryResult = new Object();
      aCategories.push(oCategory);
    }
    return callback (null,aCategories)
    
    function filterByIsSearchable(product) {
        return product.isSearchable;    
    }  
             
  },

  updateProductFilter : function(inputFilter,callback) {

    
    
    console.log("Input filter :"+inputFilter);

    if (!inputFilter.category_id) {
        console.log ("Updated Filter Invalid Category");
       callback("Invalid Category", null)
    }
    else {
      var updatedFilter = {};

        
      console.log ("input Filter:" + JSON.stringify(inputFilter));
      for (var key in inputFilter) {
        // skip loop if the property is from prototype
        if (!inputFilter.hasOwnProperty(key)) continue;
        
        var obj = inputFilter[key];
        
        switch (key) {
          case "category_id":
            updatedFilter[key] = obj;
            break;
          case "type":
          case "fabric":
          case "style":
            if (Array.isArray(obj)) {
                if (obj.length > 0) {
                  updatedFilter["product_feature."+key] = new Object();
                  updatedFilter["product_feature."+key]["$in"] = obj;
                }  
            }
            else {
                if (obj.length > 0) {
                  updatedFilter["product_feature."+key] = new Object();
                  updatedFilter["product_feature."+key]["$in"] = new Array(obj);
                }  
            }    
            break;
          case "sale_price":  
            //todo
            if(!(typeof obj === "object" && !Array.isArray(obj) && obj !== null)) {
                obj = JSON.parse(obj);
            }              
            console.log("Price-------: " + JSON.stringify(obj));
            updatedFilter[key] = new Object();
            updatedFilter[key]["$lte"] = parseFloat(obj.max);
            updatedFilter[key]["$gte"] = parseFloat(obj.min);
            break;
        }
          
      }
      console.log ("Updated Filter:" + JSON.stringify(updatedFilter));
      return callback (null,updatedFilter)
    

    }

  }  
};
