angular.module('app', [
  //'ngRoute', TODO change to ui.router
  'config',
  'base',
  'signup',
  'login',
  'account',
  'admin',
  'product',
  'widgets',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'services.productResource',
  'services.haailaUtils',
  'security',
  'templates.app',
  'templates.common',
  'ui.bootstrap',
  'ui.router'
]);


// Node.js Express backend csurf module csrf/xsrf token cookie name
angular.module('app').config(['$httpProvider', 'XSRF_COOKIE_NAME', function($httpProvider, XSRF_COOKIE_NAME){
  $httpProvider.defaults.xsrfCookieName = XSRF_COOKIE_NAME;
}]);

//From old haaila app (app.config.js) note app name changed from haailapp to app
angular.
  module('app').
  config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'securityAuthorizationProvider',
  function config($stateProvider, $urlRouterProvider, $locationProvider, securityAuthorizationProvider){
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });  


    $stateProvider
         // HOME STATES AND NESTED VIEWS ========================================
        .state('main', {
          url : '',
          abstract : true,
          views : {
            '': {templateUrl: 'layout/main.tpl.html'},
            'header' : {
              templateUrl : 'layout/haaila-header.tpl.html',
              controller : 'HeaderCtrl'
            },
            'footer' : {templateUrl : 'layout/haaila-footer.tpl.html' },
            'menu@main': { 
              template: "<menu></menu>",
              controller : function($rootScope, queries) {
                $rootScope.queries = queries;
           
              } 
            }
          },
          resolve : {
            queries : function(productResource) {
              return productResource.getAllQueryInfo();
            }
          }            
        }) 

        .state('main.home', {
          url : '/home', 
          views: {
            '@' : {templateUrl : 'layout/home.tpl.html'}    
          }
        })

        .state('main.productcategory', {
          url: '/category/:_id',
          views: {
            '@' : {templateUrl : 'layout/productcategory.tpl.html'},
            'productlist@main.productcategory': { 
              template: "<productlist></productlist>",
              controller: function($rootScope, products, haailaUtils){
                haailaUtils.deserializeProductData(products);
              },
            },
            'productquery@main.productcategory': { template: '<productquery></productquery>' }             
          },
          resolve: {
            products: ['$stateParams', 'queries', 'haailaUtils', function ($stateParams, queries, haailaUtils) {
              //set the queries and the active index before 
              haailaUtils.setQueries(queries);
              haailaUtils.setActiveCategoryIndex($stateParams._id);
              return haailaUtils.getProducts();
            }]
          },  
            
          reloadOnSearch : false,
        })

        .state('main.productcategory.product', {
          url: '/product/:productId',
          views: {
            '@': { templateUrl: 'layout/product.tpl.html'},
            'productdetail@main.productcategory.product': { 
              template: "<productdetail product='product'></productdetail>",
              controller: function($scope, product){
                $scope.product = product;
              }               
            }    
          },
          resolve: {
            product: ['$stateParams', 'haailaUtils', function ($stateParams, haailaUtils) {
              return haailaUtils.getProductDetail($stateParams._id, $stateParams.productId);
            }]
          }
        })

        .state('main.login', {
          url: '/login',
          views: {
            '@':  { templateUrl: 'layout/signinup.tpl.html'},
            'signin@main.login' : {
              templateUrl: 'login/login.tpl.html',
              controller: 'LoginCtrl'
            },
            'signup@main.login' : {
              templateUrl: 'signup/signup.tpl.html',
              controller: 'SignupCtrl'
            } 
          },
          resolve: {
              UnauthenticatedUser: ['$q', '$location', 'securityAuthorization', '$rootScope', '$state', function($q, $location, securityAuthorization, $rootScope, $state){
                //set the previous state to return to after the login is completed.
                $rootScope.previous = $state.href($state.current.name, $state.params);
                var promise = securityAuthorization.requireUnauthenticatedUser()
                .catch(function(){
                  // user is authenticated, redirect
                  $location.path('/home');

                  return $q.reject();
                });
              return promise;
            }]        
          }
        })

        .state('main.account', {
          url : '/account',
          views : {
            '@' : {
              templateUrl : 'account/account.tpl.html',
              controller : 'AccountCtrl'
            },
            'settings@main.account' : {
              templateUrl: 'account/settings/account-settings.tpl.html',
              controller: 'AccountSettingsCtrl'
            },
            'measurements@main.account' : {
              templateUrl: 'account/measurements/measurements.tpl.html',
              controller: 'accountMeasurementsCtrl'
            }
          },
          resolve : {
            authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
            accountDetails: ['$q', '$location', 'securityAuthorization', 'accountResource' ,function($q, $location, securityAuthorization, accountResource){
              //get account details only for verified-user, otherwise redirect to /account/verification
              var redirectUrl;
              var promise = securityAuthorization.requireVerifiedUser()
                .then(accountResource.getAccountDetails, function(reason){
                  //rejected either user is unverified or un-authenticated
                  redirectUrl = reason === 'unverified-client'? '/account/verification': '/login';
                  return $q.reject();
                })
                .catch(function(){
                  redirectUrl = redirectUrl || '/account';
                  $location.path(redirectUrl);
                  return $q.reject();
                });
              return promise;
            }],
            measurements: ['$q', '$location', '$log', 'securityAuthorization', 'accountResource', function($q, $location, $log, securityAuthorization, accountResource){
              //get app stats only for admin-user, otherwise redirect to /account
              var redirectUrl;
              var promise = securityAuthorization.requireAdminUser()
                .then(function(){
                  //handles url with query(search) parameter
                  return accountResource.getAccountMeasurements();
                }, function(reason){
                  //rejected either user is un-authorized or un-authenticated
                  redirectUrl = reason === 'unauthorized-client'? '/account': '/login';
                  return $q.reject();
                })
                .catch(function(){
                  redirectUrl = redirectUrl || '/account';
                  $location.search({});
                  $location.path(redirectUrl);
                  return $q.reject();
                });
              return promise;
            }]        
          }
        })


        .state( 'main.login.forgot', {
          url : '/login/forgot',
          views: {
            '@': { 
              templateUrl: 'login/forgot/login-forgot.tpl.html',
              controller: 'LoginForgotCtrl'
            } 
          },          
          title: 'Forgot Your Password?'
        })




        .state('main.checkout', {
          url: '/checkout',
          views: {
          '': { templateUrl: 'app/layout/checkout.html'},
          'menu': { template: '<menu></menu>'}    
          }

        }) 



        .state('main.contact', {
            url: '/contact',
            views: {
                '' : {
                    templateUrl : 'layout/contact.tpl.html',
                    controller  : 'ContactCtrl',
                    title: 'Contact Us'
                }
            }
        })

      .state('main.about', {
            url: '/about',
            views: {
                '' : {
                    templateUrl : 'layout/contact.tpl.html',
                    title: 'Contact Us'
                }
            }
        });
    }
  ]);



angular.module('app')
.run(['$location', '$rootScope', 'security', function($location, $rootScope, security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();

  // add a listener to $routeChangeSuccess
  // $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
  //   $rootScope.title = current.$$route && current.$$route.title? current.$$route.title: 'Drywall is Running';
  // });
}])

.run(["$rootScope", "$anchorScroll" , function ($rootScope, $anchorScroll) {
    //this scrolls the page to the top on location change
    $rootScope.$on("$locationChangeSuccess", function() {
      $anchorScroll();
      //hack to remove zoomer
      if ($('.zoomContainer')){
          $.removeData($('img'), 'elevateZoom');
          $('.zoomContainer').remove();
      }

      //DW....$rootScope.title = current.$$route && current.$$route.title? current.$$route.title: 'Drywall is Running';

      $rootScope.$on('$locationChangeStart', function (event, current, previous) {
         // $rootScope.previousUrl = previous;
      });


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

                  $rootScope.returnToState = toState.url;
                  $rootScope.returnToStateParams = toParams.Id;

          });



      $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams){
          $rootScope.title = to.title;
          $rootScope.previousState = from.name;
          $rootScope.currentState = to.name;   
          console.log('Previous state:'+$rootScope.previousState);
          console.log('Current state:'+$rootScope.currentState);                 
      });

    });
}]);






angular.module('app').controller('HHCtrl' ,['$rootScope', 'queries',
  function($rootScope, queries){
    $rootScope.queries = queries;
    console.log("$rootScope.queries"+$rootScope.queries);
}]); 





//todo tie this to the main template
angular.module('app').controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function($scope, i18nNotifications, localizedMessages) {

  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}]);
