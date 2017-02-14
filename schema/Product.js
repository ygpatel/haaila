'use strict';

exports = module.exports = function(app, mongoose) {
  var productSchema = new mongoose.Schema({
    code : String,
    name : String,
    category_id : String,
    short_desc : String,
    long_desc : String,
    variation : [{}],
    services : [{}],
    qty_limit : Number,
    days_to_ship : Number,
    check_inventory : Boolean,
    original_price : Number,
    sale_price : Number,
    base_currency : String,
    shipping_cost : Number,
    weight : Number,
    weight_unit : String,
    dimension : String,
    dimension_unit : String,
    brand : String,
    current_discount : Number,
    images : [String],     
    features : [{}],
    accessories : [],
    similar : []
}
);
productSchema.plugin(require('./plugins/pagedFind'));  
productSchema.index({ code: 1 });   
productSchema.set('autoIndex', (app.get('env') === 'development'));
app.db.model('Product', productSchema, 'products');  
}




