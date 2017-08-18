/**
 * Created by Franklin on 8/11/2017.
 */
var app = angular.module('fieldwire', ['infinite-scroll', 'FBAngular', 'lvl.directives.dragdrop', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-lazy-loader']);

app.controller('imageController', function ($scope, $http, Fullscreen, $uibModal, $log) {

    var images = [];
    $scope.imagesView = [];
    $scope.cart = [];
    var load = true;
    var count = 1;
    var lastIndex = 0;

    $scope.newPage = function () {

         if (load == true ) {
             console.log("HERE");
            $http({
                method: "GET",
                url: 'https://api.imgur.com/3/gallery/search/' + count + '?q=' + $scope.searchText,
                headers: {Authorization: 'Client-ID 5a84da5f70cb884'},
                json: true
            }).then(function success(response) {
                for (var i = 0; i < response.data.data.length; i++) {
                    images.push(response.data.data[i]);
                    if(i<15){
                        $scope.imagesView.push(response.data.data[i]);
                        lastIndex++;
                    }
                }
                count++;
                load = !load;
                console.log("Images: " + images.length);
                console.log("images Viewed: " + $scope.imagesView.length);
            }, function error(response) {
                response.statusText;
            })
        } else {
            for (var i = 0; i < 15; i++) {
                $scope.imagesView.push(images[i + lastIndex])
                console.log("HERE");
            }
            lastIndex+=15;
            load = !load;
             console.log(images);

             console.log("Images: " + images.length);
             console.log("images Viewed: " + $scope.imagesView.length);
        }


    }

    //real-time refresh
    $scope.refresh = function () {
        load = false;
        images = [];
        $scope.imagesView = [];
        lastIndex = 0;
        $http({
            method: "GET",
            url: 'https://api.imgur.com/3/gallery/search/0?q=' + $scope.searchText + '&q_type=png',
            headers: {Authorization: 'Client-ID 5a84da5f70cb884'},
            json: true
        }).then(function success(response) {
            for (var i = 0; i < response.data.data.length; i++) {
                if(i<15){
                    $scope.imagesView.push(response.data.data[i]);
                    lastIndex++;
                }
                images.push(response.data.data[i]);
            }
            count++;
            load = !load;
            console.log("Images: " + images.length);
            console.log("images Viewed: " + $scope.imagesView.length);
        }, function error(response) {
            response.statusText;
        })
    }

    $scope.fullscreen = function (i) {
        Fullscreen.enable(document.getElementById(i.id));
    }

    $scope.getURL = function (i) {
        return (i.is_album) ? 'https://imgur.com/' + i.cover + '.png' : 'https://i.imgur.com/' + i.id + '.png';
    }


    $scope.dropped = function (dragEl, dropEl) {
        for (var i = 0; i < $scope.imagesView.length; i += 1) {
            var result = $scope.imagesView[i];
            if (result.id === dragEl) {
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




