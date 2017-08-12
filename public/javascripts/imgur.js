/**
 * Created by Franklin on 8/11/2017.
 */
var app = angular.module('fieldwire', ['infinite-scroll', 'FBAngular']);

app.controller('imageController', function ($scope, $http, Fullscreen) {

    $scope.images = [];
    var count=1;
    $scope.start = function(){
        $scope.images = [];
        count = 1;
        console.log($scope.searchText);
        $http({
            method:"GET",
            url: 'https://api.imgur.com/3/gallery/search/1?q=' + $scope.searchText,
            headers: { Authorization: 'Client-ID 4071f54a38b614d'},
            json: true
        }).then(function success(response){
            for(var i=0;i<response.data.data.length;i++){
                $scope.images.push(response.data.data[i]);
            }
            console.log(response);
            count++;
        }, function error(response){
            response.statusText;
        })
    }

    $scope.newPage = function () {
        $http({
            method:"GET",
            url: 'https://api.imgur.com/3/gallery/search/'+count+'?q=' + $scope.searchText,
            headers: { Authorization: 'Client-ID 5a84da5f70cb884'},
            json: true
        }).then(function success(response){
            for(var i=0;i<response.data.data.length;i++){
                $scope.images.push(response.data.data[i]);
            }
            count++;
        }, function error(response){
            response.statusText;
        })
    }

    $scope.fullscreen = function(i){
        Fullscreen.enable(document.getElementById(i.id));
    }

    $scope.getURL=function(i){
        return (i.is_album) ? 'https://imgur.com/'+i.cover+'.jpg' : 'https://i.imgur.com/'+i.id + '.jpg';
    }
})


