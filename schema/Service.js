'use strict';

exports = module.exports = function(app, mongoose) {
  var serviceSchema = new mongoose.Schema({
    _id: String,
    name : String,
    desc: String,
    label : String,
    help_link_text : String,
    component : {},
    data : [{}],
    data_info : {}   
});
  serviceSchema.index({ _id: 1 });
  serviceSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Service', serviceSchema, 'services');
};
