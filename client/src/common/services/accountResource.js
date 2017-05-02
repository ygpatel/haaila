angular.module('services.accountResource', ['security.service']).factory('accountResource', ['$http', '$q', '$log', 'security', function ($http, $q, $log, security) {
  // local variable
  var baseUrl = '/api';
  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
  resource.sendMessage = function(data){
    return $http.post(baseUrl + '/sendMessage', data).then(processResponse, processError);
  };

  resource.getAccountDetails = function(){
    return $http.get(baseUrl + '/account/settings').then(processResponse, processError);
  };
  resource.setAccountDetails = function(data){
    return $http.put(baseUrl + '/account/settings', data).then(processResponse, processError);
  };


  resource.setIdentity = function(data){
    return $http.put(baseUrl + '/account/settings/identity', data).then(processResponse, processError);
  };
  resource.setPassword = function(data){
    return $http.put(baseUrl + '/account/settings/password', data).then(processResponse, processError);
  };

  resource.resendVerification = function(email){
    return $http.post(baseUrl + '/account/verification', {email: email}).then(processResponse, processError);
  };

  resource.upsertVerification = function(){
    return $http.get(baseUrl + '/account/verification').then(processResponse, processError);
  };

  resource.verifyAccount = function(token){
    return $http.get(baseUrl + '/account/verification/' + token)
      .then(processResponse, processError)
      .then(function(data){
        //this saves us another round trip to backend to retrieve the latest currentUser obj
        if(data.success && data.user){
          security.setCurrentUser(data.user);
        }
        return data;
      });
  };

  //haaila need
  resource.getAccountMeasurements = function(measurementId) {
    return $http.get(baseUrl + '/account/settings/measurements/' + measurementId).then(processResponse, processError);
  };

  resource.setAccountMeasurements = function(data){
    return $http.put(baseUrl + '/account/settings/measurements', data).then(processResponse, processError);
  };

  //haaila need
  resource.getAccountAddresses = function() {
    return $http.get(baseUrl + '/account/settings/addresses').then(processResponse, processError);
  };

  resource.setAccountAddress = function(data){
    return $http.put(baseUrl + '/account/settings/address', data).then(processResponse, processError);
  };  

  resource.setDefaultAddress = function(data){
    return $http.put(baseUrl + '/account/settings/default-address', data).then(processResponse, processError);
  };


  resource.getStates = function(country) {
  //temporary hardcoding. For international addresses get it from a server side service/db
  return [
        {
            name: "Alabama",
            abb: "AL"
        },
        {
            name: "Alaska",
            abb: "AK"
        },
        {
            name: "Arizona",
            abb: "AZ"
        },
        {
            name: "Arkansas",
            abb: "AR"
        },
        {
            name: "California",
            abb: "CA"
        },
        {
            name: "Colorado",
            abb: "CO"
        },
        {
            name: "Connecticut",
            abb: "CT"
        },
        {
            name: "Delaware",
            abb: "DE"
        },
        {
            name: "District Of Columbia",
            abb: "DC"
        },
        {
            name: "Florida",
            abb: "FL"
        },
        {
            name: "Georgia",
            abb: "GA"
        },
        {
            name: "Hawaii",
            abb: "HI"
        },
        {
            name: "Idaho",
            abb: "ID"
        },
        {
            name: "Illinois",
            abb: "IL"
        },
        {
            name: "Indiana",
            abb: "IN"
        },
        {
            name: "Iowa",
            abb: "IA"
        },
        {
            name: "Kansas",
            abb: "KS"
        },
        {
            name: "Kentucky",
            abb: "KY"
        },
        {
            name: "Louisiana",
            abb: "LA"
        },
        {
            name: "Maine",
            abb: "ME"
        },
        {
            name: "Maryland",
            abb: "MD"
        },
        {
            name: "Massachusetts",
            abb: "MA"
        },
        {
            name: "Michigan",
            abb: "MI"
        },
        {
            name: "Minnesota",
            abb: "MN"
        },
        {
            name: "Mississippi",
            abb: "MS"
        },
        {
            name: "Missouri",
            abb: "MO"
        },
        {
            name: "Montana",
            abb: "MT"
        },
        {
            name: "Nebraska",
            abb: "NE"
        },
        {
            name: "Nevada",
            abb: "NV"
        },
        {
            name: "New Hampshire",
            abb: "NH"
        },
        {
            name: "New Jersey",
            abb: "NJ"
        },
        {
            name: "New Mexico",
            abb: "NM"
        },
        {
            name: "New York",
            abb: "NY"
        },
        {
            name: "North Carolina",
            abb: "NC"
        },
        {
            name: "North Dakota",
            abb: "ND"
        },
        {
            name: "Ohio",
            abb: "OH"
        },
        {
            name: "Oklahoma",
            abb: "OK"
        },
        {
            name: "Oregon",
            abb: "OR"
        },
        {
            name: "Pennsylvania",
            abb: "PA"
        },
        {
            name: "Rhode Island",
            abb: "RI"
        },
        {
            name: "South Carolina",
            abb: "SC"
        },
        {
            name: "South Dakota",
            abb: "SD"
        },
        {
            name: "Tennessee",
            abb: "TN"
        },
        {
            name: "Texas",
            abb: "TX"
        },
        {
            name: "Utah",
            abb: "UT"
        },
        {
            name: "Vermont",
            abb: "VT"
        },
        {
            name: "Virginia",
            abb: "VA"
        },
        {
            name: "Washington",
            abb: "WA"
        },
        {
            name: "West Virginia",
            abb: "WV"
        },
        {
            name: "Wisconsin",
            abb: "WI"
        },
        {
            name: "Wyoming",
            abb: "WY"
        }
      ];
  };


  return resource;
}]);
