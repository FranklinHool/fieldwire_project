/**
 * Created by Franklin on 8/11/2017.
 */
var app = angular.module('fieldwire', ['infinite-scroll', 'FBAngular', 'lvl.directives.dragdrop', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-lazy-loader']);

app.controller('imageController', function ($scope, $http, Fullscreen, $uibModal, $log) {

    var images = [];
    $scope.imagesView = [];
    $scope.cart = [];
    var load = true;
    var count = 0;
    var lastIndex = 0;

    //Scrolling search function
    $scope.newPage = function () {

        if (load == true) {
            console.log("HERE");
            $http({
                method: "GET",
                url: 'https://api.imgur.com/3/gallery/search/' + count + '?q=' + $scope.searchText,
                headers: {Authorization: 'Client-ID 5a84da5f70cb884'},
                json: true
            }).then(function success(response) {
                for (var i = 0; i < response.data.data.length; i++) {
                    images.push(response.data.data[i]);
                }
                for(var j=0;j<response.data.data.length/2;j++){
                    $scope.imagesView.push(images[lastIndex]);
                    lastIndex++;
                }
                count++;
                load = !load;
                console.log("Last Index: " + lastIndex);
            }, function error(response) {
                response.statusText;
            })
        } else {
            for (var i = 0; i < 25; i++) {
                $scope.imagesView.push(images[lastIndex])
                lastIndex++;
            }
            console.log("Last Index: " + lastIndex);
            load = !load;
            console.log(images);
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
                images.push(response.data.data[i]);
        }
            for(var j=0;j<response.data.data.length/2;j++){
                $scope.imagesView.push(images[lastIndex]);
                lastIndex++;
            }
            count++;
            load = !load;
            console.log("LAST INDEX: " + lastIndex);
        }, function error(response) {
            response.statusText;
        })
    }

    //Allows fullscreen on click of photo
    $scope.fullscreen = function (i) {
        Fullscreen.enable(document.getElementById(i.id));
    }

    //Gets the URL of the image
    $scope.getURL = function (i) {
        return (i.is_album) ? 'https://imgur.com/' + i.cover + '.png' : 'https://i.imgur.com/' + i.id + '.png';
    }

    //Drag and Drop logic
    $scope.dropped = function (dragEl, dropEl) {
        for (var i = 0; i < $scope.imagesView.length; i += 1) {
            var result = $scope.imagesView[i];
            if (result.id === dragEl) {
                $scope.cart.push(result);
            }
        }
        console.log("The element " + dragEl + " has been dropped on " + dropEl + "!");
        console.log($scope.cart);
    };

    //Modal controller for data movement and opening
    $scope.animationsEnabled = true;
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return $scope.cart;
                }
            }
        });

        modalInstance.result.then(function (cart) {
            $scope.cart = cart;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
})

//Controller for pop up modal. Controls the cart data.
app.controller('ModalInstanceCtrl', function ($uibModalInstance, items, $scope, Fullscreen) {
    $scope.items = items;
    console.log(items);
    $scope.ok = function () {
        $uibModalInstance.close($scope.items);

    };

    $scope.getURL = function (i) {
        return (i.is_album) ? 'https://imgur.com/' + i.cover + '.png' : 'https://i.imgur.com/' + i.id + '.png';
    }

    $scope.fullscreen = function (i) {
        Fullscreen.enable(document.getElementById(i.id));
    }

    $scope.remove = function (i) {
        $scope.items.splice(i, 1);
    }
});




