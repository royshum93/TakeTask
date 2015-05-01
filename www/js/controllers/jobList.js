/*global angular*/
/*global appNavi*/
/*global localStorage*/
(function () {
    'use strict';

    angular.module('TakeTask.jobListController', ['onsen', 'TakeTask.connection'])
        .controller('JobListController', function ($scope, $window, connectService) {
            var refreshpage = function () {
                    connectService.connect('taketask_login.php', {action: "renew", token: localStorage.getItem("userToken") }, function (data) {
                        if (data.length === 32) {
                            localStorage.setItem("userToken", data);
                            localStorage.setItem("require_auth", "");
                            connectService.connect('getData.php', {token: localStorage.getItem("userToken")}, function (data) {
                                localStorage.setItem("jobList", angular.toJson(data));
                                $scope.joblist = data;
                            });
                        } else {
                            $window.alert("Please Login to Continue...");
                            appNavi.resetToPage('login.html');
                        }
                    });
                },
                i;

            refreshpage();
            $scope.refresh = refreshpage;

            $scope.viewjob = function (job_num) {
                for (i = 0; i < $scope.joblist.length; i += 1) {
                    if ($scope.joblist[i].jobID === job_num) {
                        localStorage.setItem("last_job", angular.toJson($scope.joblist[i]));
                    }
                }

                localStorage.setItem("capturePic", "");
                localStorage.setItem("info_text", "");
                appNavi.pushPage('detail.html');
            };


            $scope.saveTask = function (job_num) {
                var job_var, i;

                for (i = 0; i < $scope.joblist.length; i += 1) {
                    if ($scope.joblist[i].jobID === job_num) {
                        job_var = angular.toJson($scope.joblist[i]);
                        break;
                    }
                }
                $window.alert(job_var);
                /*if (taskDb.exist(job_var.jobID) == false) {
                    taskDb.saveTask(job_var.jobID, job_var, "", "", $scope.joblist[i].jobDeadline);
                }*/
            };
        });
}());