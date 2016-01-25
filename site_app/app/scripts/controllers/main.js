'use strict';

/**
 * @ngdoc function
 * @name siteAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the siteAppApp
 */
angular.module('webplugApp')
  .controller('MainCtrl', ['$scope',function ($scope) {
      $scope.aceLoaded = function(_editor){
          console.log(_editor);
          console.log("Aced loaded.");
      }
      $scope.aceChanged = function(e){
          console.log("Aced changed.");
      }
  }]);
