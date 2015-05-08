/*global angular*/
/*global PositionError*/
/*global navigator*/
/*global CheckGPS*/
/*global cordova*/
(function () {
    'use strict';

    angular.module('TakeTask.mapService', ['TakeTask.config'])
        .factory('locationCheck', function ($q, $http, $window, TASK_CONFIG) {
            var googleAPIcall = function (page) {
                var deferred = $q.defer();
                $http.get('http://maps.googleapis.com/maps/api/' + page).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;

            }, getGPSServiceStatus = function () {
                var deferred = $q.defer();
                CheckGPS.check(function () {
                    deferred.resolve();
                }, function () {
                    navigator.notification.confirm(TASK_CONFIG.MSG_GPS_PROMPT_TEXT, function (buttonID) {
                        if (buttonID === 1) {
                            $window.plugins.GpsSettings.launch();
                        }
                    }, TASK_CONFIG.MSG_GPS_PROMPT_TITLE, [TASK_CONFIG.MSG_GPS_PROMPT_GOSETTING, TASK_CONFIG.MSG_GPS_PROMPT_CANCEL]);

                    deferred.reject(TASK_CONFIG.MSG_GPS_NOTAVAIL);
                });
                return deferred.promise;
            };

            return {
                calulateDistance: function (startCoord, endCoord) {
                    var deferred = $q.defer();
                    googleAPIcall("distancematrix/json?origins=" + startCoord + "&destinations=" + endCoord + "&sensor=true").then(function (result) {
                        if (result.status === "OK") {
                            if (result.rows[0].elements[0].distance.value === "undefined") {
                                deferred.reject(result);
                            } else {
                                deferred.resolve(result.rows[0].elements[0].distance.value);
                            }
                        } else {
                            deferred.resolve(result);
                        }
                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },

                getCoord: function () {
                    var deferred = $q.defer(),
                        options = {
                            enableHighAccuracy: TASK_CONFIG.GPS_enableHighAccuracy,
                            timeout: TASK_CONFIG.GPS_timeout,
                            maximumAge: TASK_CONFIG.GPS_maximumAge
                        };

                    getGPSServiceStatus().then(function () {
                        navigator.geolocation.getCurrentPosition(function (location) {
                            deferred.resolve(location.coords.latitude.toString() + "," + location.coords.longitude.toString());
                        }, function (error) {
                            var message;

                            if (error === PositionError.TIMEOUT) {
                                message = TASK_CONFIG.MSG_GPS_TIMEOUT;
                            } else {
                                message = TASK_CONFIG.MSG_GPS_NOTAVAIL;
                            }
                            deferred.reject(message);
                        }, options);
                    });

                    return deferred.promise;
                },

                isNear: function (targetCoord) {
                    var deferred = $q.defer(),
                        calD = this.calulateDistance;

                    this.getCoord().then(function (result) {
                        calD(result, targetCoord).then(function (distance) {
                            deferred.resolve(distance < TASK_CONFIG.validDistance);
                        }, function (error) {
                            deferred.reject('Error: ' + error);
                        });
                    }, function (error) {
                        deferred.reject('Error: ' + error);
                    });

                    return deferred.promise;
                }
            };
        });
}());