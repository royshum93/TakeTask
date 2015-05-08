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
        nearDistance: 1500,
        GPS_ignoreLocation: true
    })

    .constant('TASK_CONFIG', {
        validDistance: 20,
        MSG_GPS_TIMEOUT: 'GPS tracking timeout!',
        MSG_GPS_NOTAVAIL: 'Please ensure that location Service is enabled before proceed.',

        MSG_GPS_PROMPT_TITLE: 'Turn on GPS',
        MSG_GPS_PROMPT_TEXT: 'Turning on GPS is required for TakeTask.',
        MSG_GPS_PROMPT_GOSETTING: 'Goto Setting',
        MSG_GPS_PROMPT_CANCEL: 'Cancel',

        GPS_enableHighAccuracy: true,
        GPS_timeout: 5000,
        GPS_maximumAge: 2000
    })

    .constant('OAUTH_CONFIG', {
        publicKey: 'jL2XFF-yscMEV66uQDrwy4p3btU'
    });