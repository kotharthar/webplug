'use strict';

/**
 * @ngdoc service
 * @name webplugApp.api
 * @description
 * # api
 * Service in the webplugApp.
 */
angular.module('webplugApp')
.service('api', ['$http',function ($http) {

    var api = {};

    // API Host
    var hostURL = "";

    api.hostURL = function(){
        return hostURL;
    }

    api.setHost = function(url){
        hostURL = url;
    }

    api.getFiles = function(){
        return $http({
            method: 'GET',
               url: hostURL + 'api/files'
        });
    }

    api.openFile = function(targetFile){
        return $http({
            "method": "GET",
               "url": hostURL + 'api/files/open',
               "params": {"target": targetFile}
        });
    }

    api.saveFile = function(targetFile,content){
        return $http({
            "method": "POST",
            "url": hostURL + 'api/files/save',
            data: {"filepath": targetFile, "content": content, "children":[]}
        })
    }

    return api;
}]);
