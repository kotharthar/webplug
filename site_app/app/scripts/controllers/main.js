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
    $scope.editorContent = "";
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

    $scope.saveNewFile = function(){
        console.log($scope.newFilePath);
        $http({
            "method": "POST",
            url: 'http://localhost:3000/api/files/save',
            data: {"filepath": $scope.newFilePath, "content": "", "children":[]}
        }).then(function success(response){
            console.log(response);
            //Reload tree
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/files'
            }).then(function success(response){
                console.log(response.data);
                $scope.projectTree = response.data;
            },function error(response){
                console.log(response);
            });

        },function error(response){
            console.log(response);
        });

    }

    $scope.aceChanged = function(e){
        //console.log("Aced changed.");
    }

    $scope.saveChanges = function(){
        $http({
            "method": "POST",
            url: 'http://localhost:3000/api/files/save',
            data: {"filepath": $scope.selectedNode.filepath, "content": $scope.editorContent, "children":[]}
        }).then(function success(response){
            console.log(response);
        },function error(response){
            console.log(response);
        });
               
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
         $http({
            "method": "GET",
            "url": 'http://localhost:3000/api/files/open',
            "params": {"target": sel.filepath}
         }).then(function success(response){
             console.log(response.data);
             $scope.editorContent = response.data.content;
         },function error(response){
             console.log(response);
        });
     };
}]);
