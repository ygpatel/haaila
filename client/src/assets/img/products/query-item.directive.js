'use strict';
angular.
module('widgets.queryItem').
directive('queryItem', [function() {
                return{
                    restrict: 'EA',
                    replace:true,
                    //transclude:true,
                    //require : '^dynamicQuery',
                    scope: {
                        queryconfig : "="
                    },
                    //templateUrl: 'app/widgets/query-item/query-item.template.html',
                    
                    link : function(scope, element, attrs, cartCtrl){
                        var queryName
                        var queryData
                        var queryComponent
                        var htmlText = '<div>'
                        for (var i= 0; i<scope.queryconfig.length; i++) {

                            
                            queryName = scope.queryconfig[i].code
                            queryData = scope.queryconfig[i].data
                            queryComponent = scope.queryconfig[i].querycomponent
                            htmlText += '<span>'+queryName+':'+queryData+':'+queryComponent+'</span><br/>'
                        }
                       htmlText += '</div>'
                    
                        element.html(htmlText);    
                    }
                }
            }]);



