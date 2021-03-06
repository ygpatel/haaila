'use strict';
var getCallbackUrl = function(hostname, provider){
  return 'http://' + hostname + '/account/settings/' + provider + '/callback';
};

var sendVerificationEmail = function(req, res, options) {
  req.app.utility.sendmail(req, res, {
    from: req.app.config.smtp.from.name +' <'+ req.app.config.smtp.from.address +'>',
    to: options.email,
    subject: 'Verify Your '+ req.app.config.projectName +' Account',
    textPath: 'account/verification/email-text',
    htmlPath: 'account/verification/email-html',
    locals: {
      verifyURL: req.protocol +'://'+ req.headers.host +'/account/verification/' + options.verificationToken,
      projectName: req.app.config.projectName
    },
    success: function() {
      options.onSuccess();
    },
    error: function(err) {
      options.onError(err);
    }
  });
};

var disconnectSocial = function(provider, req, res, next){
  provider = provider.toLowerCase();
  var outcome = {};
  var fieldsToSet = {};
  fieldsToSet[provider] = { id: undefined };
  req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, function (err, user) {
    if (err) {
      outcome.errors = ['error disconnecting user from their '+ provider + ' account'];
      outcome.success = false;
      return res.status(200).json(outcome);
    }
    outcome.success = true;
    return res.status(200).json(outcome);
  });
};

var connectSocial = function(provider, req, res, next){
  provider = provider.toLowerCase();
  var workflow = req.app.utility.workflow(req, res);
  workflow.on('loginSocial', function(){
    req._passport.instance.authenticate(provider, { callbackURL: getCallbackUrl(req.app.config.hostname, provider) }, function(err, user, info) {
      if(err){
        return workflow.emit('exception', err);
      }
      if (!info || !info.profile) {
        workflow.outcome.errors.push(provider + '  user not found');
        return workflow.emit('response');
      }

      workflow.profile = info.profile;
      return workflow.emit('findUser');
    })(req, res, next);
  });

  workflow.on('findUser', function(){
    var option = { _id: { $ne: req.user.id } };
    option[provider +'.id'] = workflow.profile.id;
    req.app.db.models.User.findOne(option, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        //found another existing user already connects to provider
        workflow.outcome.errors.push('Another user has already connected with that '+ provider +' account.');
        return workflow.emit('response');
      }
      else {
        return workflow.emit('linkUser');
      }
    });
  });

  workflow.on('linkUser', function(){
    var fieldsToSet = {};
    fieldsToSet[provider] = {
      id: workflow.profile.id,
      profile: workflow.profile
    };

    req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      return workflow.emit('response');
    });
  });

  workflow.emit('loginSocial');
};

// public api
var account = {
  getAccountDetails: function(req, res, next){
    var outcome = {};

    var getAccountData = function(callback) {
      req.app.db.models.Account.findById(req.user.roles.account.id, 'name company phone zip').exec(function(err, account) {
        if (err) {
          return callback(err, null);
        }

        outcome.account = account;
        callback(null, 'done');
      });
    };

    var getAccountAddresses = function(callback) {
      var queryObj = {"account_id" : req.user.roles.account.id}
      req.app.db.models.AccountAddress.find(queryObj, '_id default name address1 address2 city state country zip phone').lean().exec(function(err, accountAddresses) {

        if (err) {
          return callback(err, null);
        }
        outcome.addresses = accountAddresses;
        callback(null, 'done');
      });
    };

    var getUserData = function(callback) {
      req.app.db.models.User.findById(req.user.id, 'username email twitter.id github.id facebook.id google.id tumblr.id').exec(function(err, user) {
        if (err) {
          callback(err, null);
        }

        outcome.user = user;
        return callback(null, 'done');
      });
    };

    var asyncFinally = function(err, results) {
      if (err) {
        return next(err);
      }
      console.log("Addresses : " + JSON.stringify(outcome.addresses));
      res.status(200).json(outcome);

      //res.render('account/settings/index', {
      //  data: {
      //    account: escape(JSON.stringify(outcome.account)),
      //    user: escape(JSON.stringify(outcome.user))
      //  },
      //  oauthMessage: oauthMessage,
      //  oauthTwitter: !!req.app.config.oauth.twitter.key,
      //  oauthTwitterActive: outcome.user.twitter ? !!outcome.user.twitter.id : false,
      //  oauthGitHub: !!req.app.config.oauth.github.key,
      //  oauthGitHubActive: outcome.user.github ? !!outcome.user.github.id : false,
      //  oauthFacebook: !!req.app.config.oauth.facebook.key,
      //  oauthFacebookActive: outcome.user.facebook ? !!outcome.user.facebook.id : false,
      //  oauthGoogle: !!req.app.config.oauth.google.key,
      //  oauthGoogleActive: outcome.user.google ? !!outcome.user.google.id : false,
      //  oauthTumblr: !!req.app.config.oauth.tumblr.key,
      //  oauthTumblrActive: outcome.user.tumblr ? !!outcome.user.tumblr.id : false
      //});
    };

    require('async').parallel([getAccountData, getAccountAddresses, getUserData], asyncFinally);
  },


  update: function(req, res, next){
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
      if (!req.body.first) {
        workflow.outcome.errfor.first = 'required';
      }

      if (!req.body.last) {
        workflow.outcome.errfor.last = 'required';
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('patchAccount');
    });

    workflow.on('patchAccount', function() {
      var fieldsToSet = {
        name: {
          first: req.body.first,
          middle: req.body.middle,
          last: req.body.last,
          full: req.body.first +' '+ req.body.last
        },
        company: req.body.company,
        phone: req.body.phone,
        zip: req.body.zip,
        search: [
          req.body.first,
          req.body.middle,
          req.body.last,
          req.body.company,
          req.body.phone,
          req.body.zip
        ]
      };
      var options = { select: 'name company phone zip' };

      req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, options, function(err, account) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.account = account;
        return workflow.emit('response');
      });
    });

    workflow.emit('validate');
  },
  identity: function(req, res, next){
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
      if (!req.body.username) {
        workflow.outcome.errfor.username = 'required';
      }
      else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) {
        workflow.outcome.errfor.username = 'only use letters, numbers, \'-\', \'_\'';
      }

      if (!req.body.email) {
        workflow.outcome.errfor.email = 'required';
      }
      else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
        workflow.outcome.errfor.email = 'invalid email format';
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('duplicateUsernameCheck');
    });

    workflow.on('duplicateUsernameCheck', function() {
      req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.user.id } }, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        if (user) {
          workflow.outcome.errfor.username = 'username already taken';
          return workflow.emit('response');
        }

        workflow.emit('duplicateEmailCheck');
      });
    });

    workflow.on('duplicateEmailCheck', function() {
      req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } }, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        if (user) {
          workflow.outcome.errfor.email = 'email already taken';
          return workflow.emit('response');
        }

        workflow.emit('patchUser');
      });
    });

    workflow.on('patchUser', function() {
      var fieldsToSet = {
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        search: [
          req.body.username,
          req.body.email
        ]
      };
      var options = { select: 'username email twitter.id github.id facebook.id google.id' };

      req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('patchAdmin', user);
      });
    });

    workflow.on('patchAdmin', function(user) {
      if (user.roles.admin) {
        var fieldsToSet = {
          user: {
            id: req.user.id,
            name: user.username
          }
        };
        req.app.db.models.Admin.findByIdAndUpdate(user.roles.admin, fieldsToSet, function(err, admin) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.emit('patchAccount', user);
        });
      }
      else {
        workflow.emit('patchAccount', user);
      }
    });

    workflow.on('patchAccount', function(user) {
      if (user.roles.account) {
        var fieldsToSet = {
          user: {
            id: req.user.id,
            name: user.username
          }
        };
        req.app.db.models.Account.findByIdAndUpdate(user.roles.account, fieldsToSet, function(err, account) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.emit('populateRoles', user);
        });
      }
      else {
        workflow.emit('populateRoles', user);
      }
    });

    workflow.on('populateRoles', function(user) {
      user.populate('roles.admin roles.account', 'name.full', function(err, populatedUser) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.user = populatedUser;
        workflow.emit('response');
      });
    });

    workflow.emit('validate');
  },
  password: function(req, res, next){
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
      if (!req.body.newPassword) {
        workflow.outcome.errfor.newPassword = 'required';
      }

      if (!req.body.confirm) {
        workflow.outcome.errfor.confirm = 'required';
      }

      if (req.body.newPassword !== req.body.confirm) {
        workflow.outcome.errors.push('Passwords do not match.');
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('patchUser');
    });

    workflow.on('patchUser', function() {
      req.app.db.models.User.encryptPassword(req.body.newPassword, function(err, hash) {
        if (err) {
          return workflow.emit('exception', err);
        }

        var fieldsToSet = { password: hash };
        req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, function(err, user) {
          if (err) {
            return workflow.emit('exception', err);
          }

          user.populate('roles.admin roles.account', 'name.full', function(err, user) {
            if (err) {
              return workflow.emit('exception', err);
            }

            workflow.outcome.newPassword = '';
            workflow.outcome.confirm = '';
            workflow.emit('response');
          });
        });
      });
    });

    workflow.emit('validate');
  },
  upsertVerification: function(req, res, next){
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('generateTokenOrSkip', function() {
      if (req.user.roles.account.isVerified === 'yes') {
        workflow.outcome.errors.push('account already verified');
        return workflow.emit('response');
      }
      if (req.user.roles.account.verificationToken !== '') {
        //token generated already
        return workflow.emit('response');
      }

      workflow.emit('generateToken');
    });

    workflow.on('generateToken', function() {
      var crypto = require('crypto');
      crypto.randomBytes(21, function(err, buf) {
        if (err) {
          return next(err);
        }

        var token = buf.toString('hex');
        req.app.db.models.User.encryptPassword(token, function(err, hash) {
          if (err) {
            return next(err);
          }

          workflow.emit('patchAccount', token, hash);
        });
      });
    });

    workflow.on('patchAccount', function(token, hash) {
      var fieldsToSet = { verificationToken: hash };
      req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, function(err, account) {
        if (err) {
          return workflow.emit('exception', err);
        }

        sendVerificationEmail(req, res, {
          email: req.user.email,
          verificationToken: token,
          onSuccess: function() {
            return workflow.emit('response');
          },
          onError: function(err) {
            return next(err);
          }
        });
      });
    });

    workflow.emit('generateTokenOrSkip');
  },
  resendVerification: function(req, res, next){
    var workflow = req.app.utility.workflow(req, res);

    if (req.user.roles.account.isVerified === 'yes') {
      workflow.outcome.errors.push('account already verified');
      return workflow.emit('response');
    }

    workflow.on('validate', function() {
      if (!req.body.email) {
        workflow.outcome.errfor.email = 'required';
      }
      else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
        workflow.outcome.errfor.email = 'invalid email format';
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('duplicateEmailCheck');
    });

    workflow.on('duplicateEmailCheck', function() {
      req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } }, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        if (user) {
          workflow.outcome.errfor.email = 'email already taken';
          return workflow.emit('response');
        }

        workflow.emit('patchUser');
      });
    });

    workflow.on('patchUser', function() {
      var fieldsToSet = { email: req.body.email.toLowerCase() };
      var options = { new: true };
      req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.user = user;
        workflow.emit('generateToken');
      });
    });

    workflow.on('generateToken', function() {
      var crypto = require('crypto');
      crypto.randomBytes(21, function(err, buf) {
        if (err) {
          return next(err);
        }

        var token = buf.toString('hex');
        req.app.db.models.User.encryptPassword(token, function(err, hash) {
          if (err) {
            return next(err);
          }

          workflow.emit('patchAccount', token, hash);
        });
      });
    });

    workflow.on('patchAccount', function(token, hash) {
      var fieldsToSet = { verificationToken: hash };
      req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, function(err, account) {
        if (err) {
          return workflow.emit('exception', err);
        }

        sendVerificationEmail(req, res, {
          email: workflow.user.email,
          verificationToken: token,
          onSuccess: function() {
            workflow.emit('response');
          },
          onError: function(err) {
            workflow.outcome.errors.push('Error Sending: '+ err);
            workflow.emit('response');
          }
        });
      });
    });

    workflow.emit('validate');
  },
  verify: function(req, res, next){
    var outcome = {};
    req.app.db.models.User.validatePassword(req.params.token, req.user.roles.account.verificationToken, function(err, isValid) {
      if (!isValid) {
        outcome.errors = ['invalid verification token'];
        outcome.success = false;
        return res.status(200).json(outcome);
      }

      var fieldsToSet = { isVerified: 'yes', verificationToken: '' };
      req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account._id, fieldsToSet, function(err, account) {
        if (err) {
          return next(err);
        }
        outcome.success = true;
        outcome.user = {
          id: req.user._id,
          email: req.user.email,
          admin: !!(req.user.roles && req.user.roles.admin),
          isVerified: true
        };
        return res.status(200).json(outcome);
      });
    });
  },

  disconnectGoogle: function (req, res, next) {
    return disconnectSocial('google', req, res, next);
  },

  disconnectFacebook: function(req, res, next){
    return disconnectSocial('facebook', req, res, next);
  },

  connectGoogle: function(req, res, next){
    return connectSocial('google', req, res, next);
  },

  connectFacebook: function(req, res, next){
    return connectSocial('facebook', req, res, next);
  },

  getAccountMeasurements: function(req, res, next){
    var queryObj = {"account_id" : req.user.roles.account.id}
    if (req.params.measurement_id) {
      if (req.params.measurement_id.length > 0) {
        queryObj["measurement_id"] = req.params.measurement_id;
      }
    }
    req.app.db.models.AccountMeasurement
    .find(queryObj)
    .select('_id profile_name measurement_id measurements')
    .populate ('measurement_id')
    .lean()
    .exec(function(err, accountMeasurements) {
        if (err) {
          return callback(err, null);
        }
        //console.log("Account Measurements  >>>>>" + JSON.stringify(accountMeasurements));
        return res.status(200).json(accountMeasurements)
      });
  },
  updateAccountMeasurements: function(req,res,next) {
    console.log("AccountMeasurementData ====>" + JSON.stringify(req.body) )
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
      if (!req.body.profile_name) {
        workflow.outcome.errfor.profile_name = 'required';
      }

      for (var i in req.body.measurements) {
        if (isNaN(req.body.measurements[i])) {
            console.log('Incorrect Account Measurement data'+ i);
            workflow.outcome.errors.push('Incorrect Measurement Data');
        }
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('updateMeasurements');
    });

    workflow.on('updateMeasurements', function() {

      var mode = req.body.mode
      var fieldsToSet = {
        profile_name: req.body.profile_name,
        measurements: req.body.measurements
      };
      if (mode === "ADD") {
        fieldsToSet.measurement_id = req.body.measurement_id
        fieldsToSet.account_id = req.user.roles.account.id
      }

      var options = { select: 'profile_name measurements'};

      if (mode == "ADD") {
        //create new model
        console.log ("adding a new measurement profile.");
        var post = new req.app.db.models.AccountMeasurement(fieldsToSet);

        //save model to MongoDB
        post.save(function (err, measurements) {
          if (err) {
            console.log("Error_code"+err.code);
            if (err.code && err.code === 11000) {
              workflow.outcome.errors.push('Measurements for this Profile Name already existing....Please use a different Profile Name');  
              return workflow.emit('response');
            } else {
              return workflow.emit('exception', err);
            }  
          }
          workflow.outcome.measurements = measurements;
          return workflow.emit('response');

        });
      } else {
        req.app.db.models.AccountMeasurement.findByIdAndUpdate(req.body.accountMeasurementId, fieldsToSet, options, function(err, measurements) {
          if (err) {
            console.log("Error_code"+err.code);
            if (err.code && err.code === 11000) {
              workflow.outcome.errors.push('Measurements for this Profile Name already existing....Please use a different Profile Name');  
              return workflow.emit('response');
            } else {
              return workflow.emit('exception', err);
            }  
          }
          workflow.outcome.measurements = measurements;
          return workflow.emit('response');
        });
      }

    });

    workflow.emit('validate');    
  },
  //TODO refactor required between getAccountAddresses and getAccountDetails
  getAccountAddresses: function(req,res,next) {
      var queryObj = {"account_id" : req.user.roles.account.id}
      req.app.db.models.AccountAddress
      .find(queryObj, '_id default name address1 address2 city state country zip phone')
      .lean()
      .exec(function(err, accountAddresses) {

        if (err) {
          return next(err);
        }
       return res.status(200).json(accountAddresses);
      });
  },





  getDefaultAccountAddress: function(req, res, next){
    var queryObj = {
      "account_id" : req.user.roles.account.id,
      "default" : true
    }

    req.app.db.models.AccountAddress
    .findOne(queryObj)
    .select('_id name address1 address2 city state zip country phone')
    .lean()
    .exec(function(err, accountAddress) {
        if (err) {
          return next(err);
        }
        //console.log("Account Measurements  >>>>>" + JSON.stringify(accountMeasurements));
        return res.status(200).json(accountAddress);
      });
  },

  setDefaultAccountAddress: function(req,res,next) {
    var workflow = req.app.utility.workflow(req, res);
    workflow.on('validate', function() {
      if (!req.body._id) {
        workflow.outcome.errfor._id = 'required';
      }
      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }
      workflow.emit('setDefault');
    });
    workflow.on('setDefault', function() {
      //First set all the address to not be default
      req.app.db.models.AccountAddress.update({account_id:req.user.roles.account.id},{default:false},{multi:true}, 
        function(err,num) {
          if (err) {
            console.log("Error_code"+err.code);
            return workflow.emit('exception', err);
          } else {

            var fieldsToSet = {
              default: true
            };

            var fieldsToSearch = {
             account_id : req.user.roles.account.id,
             _id : req.body._id
            }

            var options = { select: 'name address1 address2 city state country zip phone'};
            //set the default address
            req.app.db.models.AccountAddress.findOneAndUpdate(fieldsToSearch, fieldsToSet, {new: true}, function(err, address) {
              if (err) {
                console.log("Error_code"+err.code);
                if (err.code ){
                  return workflow.emit('exception', err);
                }  
              } else {
                workflow.outcome.address = address;
                return workflow.emit('response');
              }  
            });
          }
        }
      );
    }); 
    workflow.emit('validate');  
  },


  updateAccountAddress: function(req,res,next) {

    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
      if (!req.body.address1) {
        workflow.outcome.errfor.address1 = 'required';
      }
      if (!req.body.city) {
        workflow.outcome.errfor.city = 'required';
      }

      if (!req.body.state) {
        workflow.outcome.errfor.state = 'required';
      }
      if (!req.body.zip) {
        workflow.outcome.errfor.zip = 'required';
      }

      if (!req.body.state) {
        workflow.outcome.errfor.state = 'required';
      }

      if (!req.body.country) {
        //replace this based on the geo location
        req.body.country = "US";
      }

      if (!req.body.country) {
        req.body.default = false;
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('updateAddress');
    });

    workflow.on('updateAddress', function() {

      var mode = req.body.mode
      var fieldsToSet = {
        name: req.body.name,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zip: req.body.zip
      };

      if (mode === "ADD") {
        fieldsToSet.account_id = req.user.roles.account.id
      }

      var options = { select: 'name address1 address2 city state country zip phone'};

      if (mode === "ADD") {
        //create new model
        console.log ("adding a new measurement profile.");
        var post = new req.app.db.models.AccountAddress(fieldsToSet);

        //save model to MongoDB
        post.save(function (err, address) {
          if (err) {
            console.log("Error_code"+err.code);
            if (err.code && err.code === 11000) {
              workflow.outcome.errors.push('Address for this Profile Name already existing....Please use a different Profile Name');  
              return workflow.emit('response');
            } else {
              return workflow.emit('exception', err);
            }  
          }
          workflow.outcome.address = address;
          return workflow.emit('response');

        });
      } else {
        req.app.db.models.AccountAddress.findByIdAndUpdate(req.body._id, fieldsToSet, options, function(err, address) {
          if (err) {
            console.log("Error_code"+err.code);
            if (err.code && err.code === 11000) {
              workflow.outcome.errors.push('Measurements for this Profile Name already existing....Please use a different Profile Name');  
              return workflow.emit('response');
            } else {
              return workflow.emit('exception', err);
            }  
          }
          workflow.outcome.address = address;
          return workflow.emit('response');
        });
      }

    });

    workflow.emit('validate');    
  }


};
module.exports = account;