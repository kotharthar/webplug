'use strict';

/**
 * @ngdoc function
 * @name webplugApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webplugApp
 */
angular.module('webplugApp')
.controller('MainCtrl', ['$scope','$http','api',function ($scope,$http,api) {

    function isHostSet(){
        if(api.hostURL() == ""){
            if ($scope.hostURL == ""){
            alert("API host URL is not defined.");
            return false;
            }else{
                api.setHost($scope.hostURL);
                loadFileList();
            }
        }
        return true;
    }

    function openSelectedFile(){
        if(!isHostSet()){return;} // API existence check

        api.openFile($scope.selectedNode.filepath).then(function success(response){
             console.log(response.data);
             $scope.editorContent = response.data.content;
         },function error(response){
             console.log(response);
        });
    }

    function loadFileList(){
        if(!isHostSet()){return;} // API existence check

        api.getFiles().then(function success(response){
            $scope.projectTree = response.data;
        },function error(response){
            console.log(response);
        });

    }

    function saveFile(targetFile,content,isnew){
        if(!isHostSet()){return;} // API existence check

        api.saveFile(targetFile,content).then(function success(response){
            console.log(response);
            if (isnew == true)
                loadFileList();
        },function error(response){
            console.log(response);
        });
    }

    $scope.hostURL = $('#hostURL').val();
    $scope.editorContent = "";
    $scope.projectTree = [];
    $scope.aceLoaded = function(_editor){
        console.log(_editor);
    console.log("Aced loaded.");
        loadFileList();
    }

    $scope.setHostURL = function(){
        api.setHost($scope.hostURL);
        loadFileList();
    }

    $scope.saveNewFile = function(){
        console.log($scope.newFilePath);
        saveFile($scope.newFilePath,"",true);
    }

    $scope.aceChanged = function(e){
        //console.log("Aced changed.");
    }

    $scope.saveChanges = function(){
        saveFile($scope.selectedNode.filepath,$scope.editorContent,false);
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
         openSelectedFile();         
     };
}]);
