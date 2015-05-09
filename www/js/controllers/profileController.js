/*global angular*/
/*global appNavi*/
/*global localStorage*/
/*global navigator*/
(function () {
    'use strict';

    angular.module('TakeTask.ProfileController', ['TakeTask.connection', 'TakeTask.fbConnect'])
        .controller('profileController', function ($scope, $window, connectService, fbConnectService) {
            $scope.bkjob = 0;
            $scope.fds = [];
            $scope.hideFBbtn = localStorage.getItem("AutoFb") == 1;

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

            if ($scope.hideFBbtn === true) {
                fbConnectService.init().then(function () {
                    fbConnectService.getFdList().then(function (result) {
                        $scope.fds = result;
                    });
                });
            }

            $scope.connectfb = function () {
                $window.alert("connectfb");
                localStorage.setItem("AutoFb", 1);

                fbConnectService.init().then(function () {
                    fbConnectService.getFdList().then(function (result) {
                        $window.alert(result);
                        $scope.fds = result;
                    }, function (error) {
                        $window.alert("report error : " + error);
                    });
                }, function (error) {
                    $window.alert("report error : " + error);
                });
            };

            $scope.withdraw = function () {

                navigator.notification.prompt('Enter Points to withdraw', function (results) {
                    if (results.buttonIndex === 2) {
                        return;
                    }

                    if ((results.input1 === '') || (isFinite(results.input1) === false) || (parseInt(results.input1, 10) > $scope.userBalance)) {
                        $window.alert('Please check the amount to withdraw is valid.');
                        return;
                    }

                    var data = {};
                    data.token = localStorage.getItem('userToken');
                    data.amount = parseInt(results.input1, 10);

                    connectService.connectOAuth('testPaypal.php', data, function (result) {
                        if (result.status === true) {
                            $window.alert('Converted ' + result.point + ' points to USD$' + result.money + ' in your PayPal account. Enjoy!');
                        } else {
                            $window.alert('There is an error. Status: ' + result.status);
                        }
                    });
                }, 'Withdraw');

            };

        });
}());