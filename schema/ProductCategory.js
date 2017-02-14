'use strict';

exports = module.exports = function(app, mongoose) {
  var productCategorySchema = new mongoose.Schema({
    _id : String,
    category : String,
    categorylabel : String,    
    features : [
      {
        code: String,
        label: String,
        data: {},
        isSearchable: Boolean,
        querycomponent: String

      }
    ]
});
  productCategorySchema.index({ _id: 1 });
  productCategorySchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('ProductCategory', productCategorySchema, 'productcategories');
};
