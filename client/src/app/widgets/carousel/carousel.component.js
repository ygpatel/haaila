(function () {
  'use strict';
angular
.module('widgets.carousel', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
.component('carousel', {
    templateUrl: 'widgets/carousel/carousel.tpl.html',
    controller: ["$scope", function CarouselController($scope) {
      $scope.myInterval = 3000;
      $scope.noWrapSlides = false;
      $scope.active = 0;
      $scope.slides = [
        {
            image: 'img/home/made-lehenga_1.jpg',
            text: ['Top Indian Garment'],
            id: 1    
        },
        {
            image: 'img/home/brides-made-lehenga_2.jpg',
            text: ['Top Indian Garment'],
            id: 2     
        },
        {
            image: 'img/home/festive-saree-s_2.jpg',
            text: ['Top Indian Garment'],
            id: 3 
        }
      ];
    }]
  });
}());