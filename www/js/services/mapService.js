/*global angular*/
/*global navigator*/

(function () {
    'use strict';

    angular.module('TakeTask.mapService', [])
        .factory('locationCheck', function ($q, $http) {
            var googleAPIcall = function (page) {
                return $http.get('http://maps.googleapis.com/maps/api/' + page);
            };

            return {
                calulateDistance: function (startCoord, endCoord) {
                    var deferred = $q.defer();
                    googleAPIcall("distancematrix/json?origins=" + startCoord + "&destinations=" + endCoord + "&sensor=true").then(function (result) {
                        if (result.status === "OK") {
                            deferred.resolve(result.row[0].elements[0].distance.value);
                        } else {
                            deferred.reject(result);
                        }
                    }, function (error) {
						deferred.reject(error);
					});
                    return deferred.promise;
                },
                getCoord: function () {
                    var deferred = $q.defer(),
                        options = {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        };
                    navigator.geolocation.getCurrentPosition(function (location) {
                        deferred.resolve(location.coords.latitude.toString() + "," + location.coords.longitude.toString());
                    }, function (error) {
                        deferred.reject(error.message);
                    }, options);
                    return deferred.promise;
                }
            };
        });
}());