/*global angular*/
/*global navigator*/
/*global localStorage*/
(function () {
    'use strict';

    angular.module('TakeTask.PrefController', ['onsen'])
        .controller('PrefController', function ($scope, $window) {

            $scope.changePref = function (pref_name, pref_value) {
                $window.alert(pref_value);
                localStorage.setItem(pref_name, angular.toJson(pref_value));
                $window.alert(localStorage.getItem(pref_name));
            };

            //nearTaskNotify.on('change', function (event) {
            //    $scope.changePref("nearTaskNotify", event.value);
            //});
        });
}());