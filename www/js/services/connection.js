//js for connecting server
/*global angular*/
/*global localStorage*/
/*global ActivityIndicator*/

(function () {
    'use strict';

    var connection = angular.module('TakeTask.connection', []);


    connection.factory('connectService', ['$http', '$window', function ($http, $window) {

        var server_url = "http://137.189.97.77:8080/cgi/",
            timeoutMsg = function () {
                $window.alert("Connection Timeout. Please Check your network connection");
            },
            connectServerPost = function (page, data, callback) {
                ActivityIndicator.show("Loading");
                $http.post(server_url + page, data, {timeout: 30000})
                    .success(function (data) {
                        ActivityIndicator.hide();
                        if (callback) { callback(data); }
                    }).error(function () {
                        ActivityIndicator.hide();
                        timeoutMsg();
                    });
            };


        return {

            login : function (login_data, callback) {
                login_data.action = "login";
                connectServerPost('taketask_login.php', login_data, function (data) {
                    if (data.length === 32) {
                        localStorage.setItem("userToken", data);
                        if (callback) { callback(); }
                    } else if (data.length < 10) {
                        $window.alert(data + " is incorrect, please login again.");
                    } else { timeoutMsg(); }
                });
            },

            logout : function (callback) {
                $http.post('http://137.189.97.77:8080/cgi/taketask_login.php', {action: "logout", token: localStorage.getItem("userToken")});
                localStorage.setItem("userToken", "");
                if (callback) { callback(); }
            },

            connect: function (page, data, callback) {
                return connectServerPost(page, data, callback);
            }
        };

    }]);

}());