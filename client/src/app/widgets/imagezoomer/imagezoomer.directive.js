(function () {
  'use strict';
  angular
  .module('widgets.imagezoomer', [])
  .directive('imagezoomer', function () {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        //Will watch for changes on the attribute
        attrs.$observe('zoomImage', function () {
            linkElevateZoom();
        });
        
        scope.$on('$routeChangeSuccess', function() {
        var target = this.children('div.zoomContainer').remove();
        });
        
        scope.$on('update-image', function(e,imageName) {
            linkElevateZoom();
        });             


        function linkElevateZoom() {
          //Check if its not empty\
          
          if (!attrs.zoomImage) {
            return;
          }  
          //alert(attrs.zoomImage);
          element.attr('data-zoom-image', attrs.zoomImage);
          $(element).elevateZoom( {   
            scrollZoom    : false,
            borderSize    : 1,
            borderColour    : "rgb(136,136,136)",
            tintColour    : "#e7e7e7",
            zoomWindowWidth   : 580,
            zoomWindowHeight  : 580,
            zoomWindowPosition  : 1,
            zoomWindowOffetx  : 10,
            zoomWindowOffety  : -50,
            zoomWindowFadeIn  : 500,
            zoomWindowFadeOut : 500,
            lensFadeIn    : 500,
            lensFadeOut   : 500, 
          });
        }
        linkElevateZoom();
      }
    };
  })
  .directive('widgets.zoomContainer', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              scope.$on('$routeChangeSuccess', function() {
                  var target = element.children('div.zoomContainer').remove();
              });
          }
      };
  });
}());