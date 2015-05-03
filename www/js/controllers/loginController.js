/*global angular*/
/*global localStorage*/
/*global appNavi*/
(function () {
    'use strict';

    angular.module('TakeTask.LoginController', ['onsen', 'TakeTask.connection'])
        .controller('LoginController', function ($scope, connectService) {
            $scope.loginData = {};

            if (localStorage.getItem("savedUser") !== null) {
                $scope.loginData.user = localStorage.getItem("savedUser");
                $scope.loginData.remember = true;
            }
            if (localStorage.getItem("savedPass") !== null) {
                $scope.loginData.pass = localStorage.getItem("savedPass");
                $scope.loginData.remember = true;
            }


            $scope.login = function (id, password) {
                if ($scope.loginData.remember === true) {
                    localStorage.setItem("savedUser", id);
                    localStorage.setItem("savedPass", password);
                } else {
                    localStorage.setItem("savedUser", "");
                    localStorage.setItem("savedPass", "");
                }

                connectService.login({user: id, pass: password}, function () {
                    $scope.appNavi.resetToPage('tabBar.html');
                });
            };

        });
}());