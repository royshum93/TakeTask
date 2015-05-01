/*global angular*/
/*global cordova*/
/*global appNavi*/
/*global localStorage*/

(function () {
    'use strict';

    angular.module('TakeTask.Notification', [])
        .factory('notificationService', function () {
            var self = this;

            self.lastNotify = function () {
                var last_ts = localStorage.getItem("lastNotifyTS") || 0;
                return (Date.now() - last_ts) / 1000;
            };

            self.addNearTask = function (job, distance) {

                if (localStorage.getItem("nearTaskNotify") !== null) {
                    if (angular.fromJson(localStorage.getItem("nearTaskNotify")) === false) {
                        return;
                    }
                }

                localStorage.setItem("lastNotifyTS", Date.now());

                cordova.plugins.notification.local.on("click", function(notification) {
                    localStorage.setItem("last_job", notification.data);

                    localStorage.setItem("capturePic", "");
                    localStorage.setItem("info_text", "");
                    appNavi.pushPage('detail.html');
                });

                cordova.plugins.notification.local.schedule({
                    text: "A task location is only " + distance + "m ahead !",
                    data: job
                });
            };

            return self;
        });
}());