'use strict';

/**
 * @ngdoc function
 * @name siteAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the siteAppApp
 */
angular.module('webplugApp')
.controller('MainCtrl', ['$scope','$http',function ($scope,$http) {
    $scope.projectTree = [];
    $scope.aceLoaded = function(_editor){
        console.log(_editor);
        console.log("Aced loaded.");
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/files'
        }).then(function success(response){
            console.log(response.data);
            $scope.projectTree = response.data;
        },function error(response){
            console.log(response);
        });
    }

    $scope.aceChanged = function(e){
        console.log("Aced changed.");
    }

    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: false,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    }
    // $scope.dataForTheTree =
    //     [
    //     { "name" : "Joe", "age" : "21", "children" : [
    //         { "name" : "Smith", "age" : "42", "children" : [] },
    //         { "name" : "Gary", "age" : "21", "children" : [
    //             { "name" : "Jenifer", "age" : "23", "children" : [
    //                 { "name" : "Dani", "age" : "32", "children" : [] },
    //                 { "name" : "Max", "age" : "34", "children" : [] }
    //                 ]}
    //             ]}
    //         ]},
    //     { "name" : "Albert", "age" : "33", "children" : [] },
    //     { "name" : "Ron", "age" : "29", "children" : [] }
    // ];
    $scope.showSelected = function(sel) {
         $scope.selectedNode = sel;
         console.log($scope.selectedNode);
     };
}]);
