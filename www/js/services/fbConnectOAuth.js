/*global angular*/
/*global OAuth*/
/*global localStorage*/

(function () {
    'use strict';

    angular.module('TakeTask.fbConnect', ['TakeTask.config'])
        .factory('fbConnectService', function ($q, $http, OAUTH_CONFIG) {

            var connectFB = function (url) {

            };

            return {
                init: function () {
                    OAuth.initialize(OAUTH_CONFIG.publicKey);
                }
            };

        });

}());