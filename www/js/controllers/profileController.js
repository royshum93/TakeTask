/*global angular*/
/*global appNavi*/
/*global localStorage*/

(function () {
    'use strict';

    angular.module('TakeTask.ProfileController', ['TakeTask.connection', 'TakeTask.fbConnect'])
        .controller('profileController', function ($scope, $window, connectService, fbConnectService) {
            $scope.bkjob = 0;

            connectService.connect('taketask_login.php', {action: "show", token: localStorage.getItem("userToken") }, function (data) {
                if (data === "Fail") {
                    $window.alert("There is a problem when retrieving your profile...");
                } else {
                    var profile = angular.fromJson(data);
                    $scope.userdisplayName = profile.agentName;
                    $scope.userloginName = profile.loginName;
                    $scope.userBalance = profile.balance;
                    $scope.completedJob = profile.completedJob;
                }
            });

            $scope.connectfb = function () {
                $window.alert("connectfb");

                fbConnectService.init().then(function () {
                    fbConnectService.getFdList().then(function (result) {
                        $scope.fds = result;
                        $scope.$apply();
                    });
                }, function (error) {
                    $window.alert("report error : " + error);
                });
            };
        });
}());