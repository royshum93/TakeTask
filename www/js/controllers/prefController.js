/*global angular*/
/*global navigator*/
/*global appNavi*/
/*global localStorage*/
(function () {
    'use strict';

    angular.module('TakeTask.PrefController', ['onsen', 'TakeTask.connection'])
        .controller('PrefController', function ($scope, $window, connectService) {

            $scope.changePref = function (pref_name, pref_value) {
                $window.alert(pref_value);
                localStorage.setItem(pref_name, angular.toJson(pref_value));
                $window.alert(localStorage.getItem(pref_name));
            };

            //nearTaskNotify.on('change', function (event) {
            //    $scope.changePref("nearTaskNotify", event.value);
            //});
            $scope.logout = function () {
                connectService.logout(function () {
                    appNavi.resetToPage('login.html');
                });
            };
        });
}());