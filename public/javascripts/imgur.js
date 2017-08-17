/**
 * Created by Franklin on 8/11/2017.
 */
var app = angular.module('fieldwire', ['infinite-scroll', 'FBAngular', 'lvl.directives.dragdrop', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-lazy-loader' ] );

app.controller('imageController', function ($scope, $http, Fullscreen, $uibModal, $log) {

    $scope.images = [];
    $scope.cart = [];
    var count = 1;
    //Submit button refresh
    // $scope.start = function () {
    //     $scope.images = [];
    //     count = 1;
    //     console.log($scope.searchText);
    //     $http({
    //         method: "GET",
    //         url: 'https://api.imgur.com/3/gallery/search/1?q=' + $scope.searchText,
    //         headers: {Authorization: 'Client-ID 4071f54a38b614d'},
    //         json: true
    //     }).then(function success(response) {
    //         for (var i = 0; i < response.data.data.length; i++) {
    //             $scope.images.push(response.data.data[i]);
    //         }
    //         console.log(response);
    //         count++;
    //     }, function error(response) {
    //         response.statusText;
    //     })
    // }
    //Scroll down refresh
    $scope.newPage = function () {
        $http({
            method: "GET",
            url: 'https://api.imgur.com/3/gallery/search/' + count + '?q=' + $scope.searchText,
            headers: {Authorization: 'Client-ID 5a84da5f70cb884'},
            json: true
        }).then(function success(response) {
            for (var i = 0; i < response.data.data.length; i++) {
                $scope.images.push(response.data.data[i]);
            }
            count++;
        }, function error(response) {
            response.statusText;
        })
    }

    //real-time refresh
    $scope.refresh = function () {
        $scope.images = [];
        $http({
            method: "GET",
            url: 'https://api.imgur.com/3/gallery/search/0?q=' + $scope.searchText + '&q_type=png',
            headers: {Authorization: 'Client-ID 5a84da5f70cb884'},
            json: true
        }).then(function success(response) {
            for (var i = 0; i < response.data.data.length; i++) {
                $scope.images.push(response.data.data[i]);
            }
            count++;
        }, function error(response) {
            response.statusText;
        })
    }
    
    $scope.fullscreen = function (i) {
        Fullscreen.enable(document.getElementById(i.id));
    }

    $scope.getURL = function (i) {
        return (i.is_album) ? 'https://imgur.com/' + i.cover + '.jpg' : 'https://i.imgur.com/' + i.id + '.jpg';
    }


    $scope.dropped = function(dragEl, dropEl) {
        for(var i = 0; i < $scope.images.length; i += 1){
            var result = $scope.images[i];
            if(result.id === dragEl){
                //$scope.images.splice(i,1);
                $scope.cart.push(result);
            }
        }
        console.log("The element " + dragEl + " has been dropped on " + dropEl + "!");
    };

    $scope.animationsEnabled = true;
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: 'scope'
        });

        modalInstance.result.then(function () {
            console.log($scope.cart);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
})

app.controller('ModalInstanceCtrl', function ($uibModalInstance, $scope) {
    $scope.ok = function () {
        console.log($scope.cart);
        $uibModalInstance.dismiss();
    };

});




