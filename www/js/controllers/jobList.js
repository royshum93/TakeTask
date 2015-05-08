/*global angular*/
/*global appNavi*/
/*global localStorage*/
(function () {
    'use strict';

    angular.module('TakeTask.jobListController', ['onsen', 'TakeTask.connection', 'TakeTask.mapService', 'TakeTask.Notification', 'TakeTask.config'])

        .controller('JobListController', function ($scope, $window, connectService, locationCheck, notificationService, NOTIFY_CONFIG) {
            var refreshpage = function () {
                    connectService.connect('taketask_login.php', {action: "renew", token: localStorage.getItem("userToken") }, function (data) {
                        if (data.length === 32) {
                            localStorage.setItem("userToken", data);
                            localStorage.setItem("require_auth", "");
                            connectService.connect('getData.php', {token: localStorage.getItem("userToken")}, function (data) {
                                localStorage.setItem("jobList", angular.toJson(data));
                                $scope.joblist = data;

                                locationCheck.getCoord().then(function (result) {

                                    angular.forEach($scope.joblist, function (job) {
                                        locationCheck.calulateDistance(result, job.jobCoordinates).then(function (distance) {

                                            if ((distance < NOTIFY_CONFIG.nearDistance) && (notificationService.lastNotify() > NOTIFY_CONFIG.lnInterval)) {
                                                //$window.alert(notificationService.lastNotify());
                                                notificationService.addNearTask(job, distance);
                                            }
                                        });
                                    });

                                }, function (error) {
                                    $window.alert(error);
                                });

                            });
                        } else {
                            $window.alert("Please Login to Continue...");
                            appNavi.resetToPage('login.html');
                            localStorage.setItem("userToken", "");
                        }
                    });
                };

            if ((!localStorage.getItem("userToken")) || (localStorage.getItem("userToken").length === 0)) {
                appNavi.resetToPage("login.html");
            }

            refreshpage();
            $scope.refresh = refreshpage;

            $scope.viewjob = function (job_num) {
                angular.forEach($scope.joblist, function(job) {
                    if (job.jobID === job_num) {
                        locationCheck.isNear(job.jobCoordinates).then(function (valid) {
                            if (valid || NOTIFY_CONFIG.GPS_ignoreLocation) {
                                localStorage.setItem("last_job", angular.toJson(job));
                                localStorage.setItem("capturePic", "");
                                localStorage.setItem("info_text", "");
                                appNavi.pushPage('detail.html');
                            } else {
                                $window.alert('Error: Location mismatch.');
                            }
                        }, function (error) {
                            $window.alert(error);
                        });
                    }
                });
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