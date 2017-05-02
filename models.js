'use strict';

exports = module.exports = function(app, mongoose) {
  //Drywall schemas
	//embeddable docs first
  require('./schema/Note')(app, mongoose);
  require('./schema/Status')(app, mongoose);
  require('./schema/StatusLog')(app, mongoose);
  require('./schema/Category')(app, mongoose);

  //then regular docs
  require('./schema/User')(app, mongoose);
  require('./schema/Admin')(app, mongoose);
  require('./schema/AdminGroup')(app, mongoose);
  require('./schema/Account')(app, mongoose);
  require('./schema/LoginAttempt')(app, mongoose);

  //haaila schemas
  require('./schema/ProductCategory')(app, mongoose);
  require('./schema/Product')(app, mongoose);
	require('./schema/Service')(app, mongoose);	
	require('./schema/Variation')(app, mongoose);	
	require('./schema/Measurement')(app, mongoose);	
  require('./schema/AccountMeasurement')(app, mongoose);
  require('./schema/AccountAddress')(app, mongoose);  
    
};
