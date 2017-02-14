'use strict';

exports = module.exports = function(app, mongoose) {
  var variationSchema = new mongoose.Schema({
    _id: String,
    name : String,
    desc: String,
    label : String,
    help_link_text : String,
    component : {},
    data : [{}],
    data_info : {}   
	});
  variationSchema.index({ _id: 1 });
  variationSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Variation', variationSchema, 'variations');
};