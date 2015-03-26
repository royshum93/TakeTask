//js for notification
/*global angular*/
/*global cordova*/

(function () {
    'use strict';

    var noti = angular.module('TakeTask.notification', []);

    noti.factory('notifyService', ['$window', function($window) {

        return {
            notifyNew : function(task_id) {
                cordova.plugins.notification.local.schedule({
                    id: task_id,
                    title: "You have a new Mission!",
                    text: "Click here to check details",
                    data: "{" + task_id.toString() + "}"
                });

                cordova.plugins.notification.local.on("click", function(n) {
                    $window.alert("clicked: " + n.id);
                });
            }
        };
    }]);

}());


