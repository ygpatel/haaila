'use strict';
var product = {
  productList: function(req, res, next){
    console.log("Request Params: " + JSON.stringify(req.query));

    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '-date_added';


    req.app.utility.products.updateProductFilter(JSON.parse(req.query.filters), function(err, updatedFilters){
      if (err) {
        return next(err);
      }
      else {
        req.app.db.models.Product.pagedFind({
          filters: updatedFilters,
          keys: 'code name short_desc sale_price days_to_ship images',
          limit: req.query.limit,
          page: req.query.page,
          sort: req.query.sort
        }, function (err, results) {
          if (err) {
            return next(err);
          }
          //results.filters = req.query;
          res.status(200).json(results);
        });        
      }
    }) 


  },

  productDetail: function(req, res, next){

    // req.app.db.models.Product.findById(req.params.product_id).exec(function (err, product) {
    //   if (err) {
    //     return next(err);
    //   }
    //   console.log("Product ----------->"+JSON.stringify(product))
    //   res.status(200).json(product);
    // });

//***********
        
    var returnItem = {};
    var isReadyToResponse = false;
    var isSerLookupDone = false; 
    var isVarLookupDone = false;
    require('async').series([
            
      function(callback) {
          req.app.db.models.Product.findById(req.params.product_id).lean().exec(function (err, product) {    
            if (err) throw err;
            returnItem = product;
            returnItem.scEntry = {
              "totalProductCost" : product.sale_price
            };
            returnItem.scEntry.product_id = product._id;
            callback();
        })
      },

      function(callback) {
        console.log("returnItem.services====================>" + JSON.stringify(returnItem.variations));
        var aVariations = [];
        if (returnItem.variations) { 
          if (returnItem.variations.length > 0) {
            //var isSerLookupDone = true;
            require('async').eachLimit(returnItem.variations, 1, function(tvariation, insidecallback) {
              // Perform operation on file here.
              console.log('Processing variations ' + JSON.stringify(tvariation._id));
              req.app.db.models.Variation.findOne({"_id" : tvariation._id}).lean().exec(function(err,variation) {
                  if(err) throw err;
                  //todo cache the meta info
                  variation.scEntry = {};
                  variation.scEntry.model = {};  
                  aVariations.push(variation); 
                  insidecallback();
              })
            }, function(err) {
              if(err) throw err;
              console.log("aVariations====================>" + JSON.stringify(aVariations));
              returnItem.variations = aVariations;
              isVarLookupDone = true;
              callback();
            });
                
          } else {
            isVarLookupDone = true;
            callback();
          }

             
        } else {
                isVarLookupDone = true;
                callback();
        }   
      }, 

      function(callback) {
        console.log("returnItem.services====================>" + JSON.stringify(returnItem.services));
        var aServices = [];
        if (returnItem.services) { 
          if (returnItem.services.length > 0) {
            var isSerLookupDone = true;
            require('async').eachLimit(returnItem.services, 1, function(tservice, insidecallback) {
              // Perform operation on file here.
              console.log('Processing service ' + JSON.stringify(tservice._id));
              req.app.db.models.Service.findOne({"_id" : tservice._id}).lean().exec(function(err,service) {
                  if(err) throw err;
                  //todo cache the meta info
                  service.scEntry = {};
                  service.scEntry.model = {};                  
                  aServices.push(service); 
                  insidecallback();
              })
            }, function(err) {
              if(err) throw err;
              console.log("aServices====================>" + JSON.stringify(aServices));
              returnItem.services = aServices;
              isReadyToResponse = true;
              callback();
            });
                
          } else {
            isReadyToResponse = true;
            callback();
          }

             
        } else {
                isReadyToResponse = true;
                callback();
        }   
      }            

    ],
    function (err) { 
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: " + JSON.stringify(returnItem.services));  
        if (err) {
          return next(err);
        }
        if (isReadyToResponse){
            console.log("Final Request Params: " + JSON.stringify(returnItem.services));
            res.json(returnItem); 
        }
    })
  },

  productQuery: function(req, res){
    var workflow = req.app.utility.workflow(req, res);
    var cache = req.app.utility.haailaCache(req, res);
    console.log("Fetching Queries");
    cache.get("productCategories", function (err, value) {
      if (err) {
        return next(err);
      }
      if (value == undefined) {
        req.app.db.models.ProductCategory.find().lean().exec(function (err, categories) {
          if (err) {
              console.log("Database Not Found........=======>>>>>>>");
              return next(err);
          }
          req.app.utility.products.getCategoryQuery(categories, function (err, oCategories){
            if (err) {
              return next(err);
            }                
            console.log("Getting categories from database=======>");
            cache.set("productCategories", oCategories);
            res.status(200).json(oCategories);            
          })
        }); 
      }
      else { 
          console.log("Getting categories from cache========>");
          res.status(200).json(value);         
      }
    })  
  },
  
  productMeasurement: function(req,res){
    req.app.db.models.Measurement.findById(req.params.measurement_id).exec(function (err, product) {
      if (err) {
        return next(err);
      }
      console.log("Product ----------->"+JSON.stringify(product))
      res.status(200).json(product);
    });    
  }
};
module.exports = product;

