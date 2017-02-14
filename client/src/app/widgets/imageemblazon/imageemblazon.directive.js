(function () {
  'use strict';
  angular
  .module('widgets.imageemblazon', [])
  .directive('imageemblazon', function ($rootScope) {
    return {
      restrict: 'AE',
      templateUrl: 'widgets/imageemblazon/imageemblazon.tpl.html',
      controller: function($scope){
        $scope.selectThumb = function(imgIndex){
          $scope.imgobj.smallimg = "img/products/small/"+$scope.product.images[imgIndex]; 
          $scope.imgobj.largeimg = "img/products/large/"+$scope.product.images[imgIndex];     
          
          var zoomImage = $('img#zoomImage');
          
          // Remove old instance od EZ
          $('.zoomContainer').remove();
          zoomImage.removeData('elevateZoom');
          // Update source for images
          zoomImage.attr('src', $scope.imgobj.smallimg);
          zoomImage.data('zoom-image', $scope.imgobj.largeimg);
          // Reinitialize EZ
          //zoomImage.elevateZoom(zoomConfig);
          $scope.$broadcast('update-image', $scope.item.images[imgIndex]);                           
        };
      },
      link: function (scope, element, attrs) {
          scope.$on('$routeChangeSuccess', function() {
          //var target = element.children('div.zoomContainer').remove();
        });
      }    
    };
  });
}());