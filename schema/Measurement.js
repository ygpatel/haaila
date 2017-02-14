'use strict';

exports = module.exports = function(app, mongoose) {
  var measurementSchema = new mongoose.Schema({
    _id: String,
    fields : [{
        code : String,
        label : String,
        value : [],
        component : String,
        selvalue: String
    }]
	});
  measurementSchema.index({ _id: 1 });
  measurementSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Measurement', measurementSchema, 'measurements');
};
