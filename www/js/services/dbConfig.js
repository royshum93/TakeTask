/*global angular*/

angular.module('TakeTask.config', [])
.constant('DB_CONFIG', {
    name: 'TestTask1',
    version: '0.1',
    displayName: 'bookmarked',
    size: 65535,
    tables: [
      {
            name: 'bookmarked',
            columns: [
                {name: 'jobID', type: 'integer primary key'},
                {name: 'job', type: 'text'},
                {name: 'jobPhoto', type: 'text'},
                {name: 'jobDescription', type: 'text'},
                {name: 'jobDeadline', type: 'DateTime'}
            ]
        }
    ]
})
.constant('NOTIFY_CONFIG', {
    lnInterval: 30,
    NOTIFY_CONFIG.nearDistance: 1500

})
.constant('OAUTH_CONFIG', {
    publicKey: 'jL2XFF-yscMEV66uQDrwy4p3btU'
});