/*global angular*/
/*global OAuth*/
/*global localStorage*/

(function () {
    'use strict';

    angular.module('TakeTask.fbConnect', ['TakeTask.config'])
        .factory('fbConnectService', function ($q, $http, $window, OAUTH_CONFIG) {

            var oauthServerLocation = 'http://137.189.97.77:8080/oauth/testOAuth.php',
                connectOAuth = function (action, code) {
                    var token = localStorage.getItem("userToken"),
                        request = {},
                        deferred = $q.defer();

                    request.action = action;
                    request.token = token;
                    if (code !== undefined) {
                        request.code = code;
                    }
                    $window.alert("request: " + angular.toJson(request));
                    $http.post(oauthServerLocation, request).then(function (result) {
                        $window.alert("server: " + angular.toJson(result));
                        deferred.resolve(result.data);
                    }, function (error) {
                        $window.alert("server error: " + angular.toJson(error));
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };




            return {

                init: function () {
                    var deferred = $q.defer();

                    deferred.resolve(OAuth.initialize(OAUTH_CONFIG.publicKey));
                    /*connectOAuth("check").then(function (result) {
                        //if token not in db, request stateCode and do auth request in client
                        if (result === false) {
                            connectOAuth("code").then(function (params) {

                                $window.alert("fb before oauth: " + angular.toJson(params));
                                OAuth.popup('facebook', {
                                    state: params.token
                                }).done(function(result) {
                                    $window.alert("fb oauth: " + angular.toJson(result));
                                    connectOAuth("auth", result.code).then(function (result) {
                                        if (result === true) {
                                            deferred.resolve();
                                        } else {
                                            deferred.reject();
                                        }
                                    }, function (error) {
                                        deferred.reject(error);
                                    });
                                });
                            }, function (error) {
                                deferred.reject(error);
                            });
                        } else {
                            deferred.resolve();
                        }

                    });*/

                    return deferred.promise;
                },

                getFdList: function () {
                    var deferred = $q.defer();
                    OAuth.popup('facebook').done(function (result) {

                        result.get('/me/friends').done(function (response) {
                        //this will display "John Doe" in the console
                            $window.alert(angular.toJson(response));
                            deferred.resolve(response);
                        });

                    });

                    /*connectOAuth("get", "/v2.3/me/friends").then(function (result) {
                        deferred.resolve(result.data);
                    }, function (error) {
                        deferred.reject(error);
                    });*/
                    return deferred.promise;
                }

            };


        });

}());