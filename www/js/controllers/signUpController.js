/*global angular*/
/*global appNavi*/
/*global localStorage*/

(function () {
    'use strict';

    angular.module('TakeTask.SignUpController', ['TakeTask.connection'])
        .controller('signUpController', function ($scope, $window, connectService) {


            $scope.addAC = function (email, pass, name) {
                var data = {};
                data.action = 'signup';
                data.user = email;
                data.pass = pass;
                data.token = {dname : name};

                connectService.connect('taketask_login.php', data, function (result) {
                    if (result === 'true') {
                        appNavi.popPage();
                    } else {
                        $window.alert('The account registration has failed.');
                    }
                });
            };

        });

}());