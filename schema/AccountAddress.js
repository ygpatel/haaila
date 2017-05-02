'use strict';
exports = module.exports = function(app, mongoose) {
  var accountAddressSchema = new mongoose.Schema({
  	account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    name:  {type:String, default: ''},
    default: {type:Boolean, default: false},
    lastShipped: {type:Boolean, default: false},
    address1: {type:String, default: ''},
    address2: {type:String, default: ''},
   	city:  {type:String, default: ''},
    state: {type:String, default: ''},
    country:  {type:String, default: ''},   
    zip: { type: String, default: '' },
    phone: { type: String, default: '' }
  });
  accountAddressSchema.index({'account_id': 1});
  accountAddressSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('AccountAddress', accountAddressSchema, 'accountaddresses');  
};
