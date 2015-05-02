//js for connecting server
/*global angular*/
/*global DB_CONFIG*/
/*global window*/

(function () {
    'use strict';

    angular.module('TakeTask.taskDb', ['TakeTask.config'])

        .factory('DB', function ($q, $window, DB_CONFIG) {
            var self = this;
            self.db = null;

            self.init = function () {
                self.db = window.openDatabase(DB_CONFIG.name, DB_CONFIG.version, DB_CONFIG.displayName, DB_CONFIG.size);

                angular.forEach(DB_CONFIG.tables, function(table) {
                    var columns = [],
                        query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (';

                    angular.forEach(table.columns, function(column) {
                        columns.push(column.name + ' ' + column.type);
                    });

                    query += columns.join(',') + ')';
                    self.query(query);
                });
            };


            self.query = function(query, bindings) {
                bindings = bindings === 'undefined' ? [] : bindings;
                var deferred = $q.defer();

                self.db.transaction(function(transaction) {
                    /*jslint unparam: true*/
                    transaction.executeSql(query, bindings, function(transaction, result) {
                        deferred.resolve(result);
                    }, function(transaction, error) {
                        deferred.reject(error);
                    });
                    /*jslint unparam: false*/
                });

                return deferred.promise;
            };


            self.fetchAll = function(result) {
                var output = [],
                    i;

                for (i = 0; i < result.rows.length; i += 1) {
                    output.push(result.rows.item(i));
                }

                return output;
            };


            self.fetch = function(result) {
                return result.rows.item(0);
            };

            return self;
        })


        .factory('taskDb', function (DB, $q) {
            var self = this,
                removeOutdated = function () {
                    return DB.query("delete from bookmarked where jobDeadline <= datetime('now')");
                };

            self.all = function() {
                return removeOutdated.then(function () {
                    DB.query('SELECT * from bookmarked')
                        .then(function (result) {
                            return DB.fetchAll(result);
                        });
                });
            };

            self.getById = function (id) {
                return DB.query('SELECT * from bookmarked WHERE jobID = ?', [id])
                    .then(function(result) {
                        return DB.fetch(result);
                    });
            };

            self.exist = function (id) {
                return DB.query('SELECT * from bookmarked WHERE jobID = ?', [id])
                    .then(function(result) {
                        return (result.rows.length !== 0);
                    });
            };

            self.saveTask = function (id, jobJSON, jobPic, jobText, jobDeadline) {
                var deferred = $q.defer();

                DB.query('SELECT * from bookmarked WHERE jobID = ?', [id])
                    .then(function(result) {
                        if (result.rows.length > 0) {
                        //record in db already
                            DB.query("Update bookmarded set 'job' = ?, 'jobPhoto' =? , 'jobDescription' =?, 'jobDeadline' =? WHERE 'jobID' = ?",
                                    [jobJSON, jobPic, jobText, jobDeadline, id]).then(function(result) {
                                deferred.resolve(result);
                            }, function(error) {
                                deferred.reject(error);
                            });
                        } else {
                            //record not in db
                            DB.query("insert into bookmarked values(?,?,?,?,?)", [id, jobJSON, jobPic, jobText, jobDeadline]).then(function(result) {
                                deferred.resolve(result);
                            }, function(error) {
                                deferred.reject(error);
                            });
                        }
                    }, function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            return self;
        });
}());