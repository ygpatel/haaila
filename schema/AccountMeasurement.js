'use strict';

exports = module.exports = function(app, mongoose) {
  var accountMeasurementSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    profile_name: { type: String, default: ''},
    measurement_id : {type: String, ref: 'Measurement' },
    measurements :  {}
  });
  accountMeasurementSchema.index({'account_id': 1, 'measurement_id': 1, 'profile_name':1}, {unique: true});
  accountMeasurementSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('AccountMeasurement', accountMeasurementSchema, 'accountmeasurements');  
};
