app.directive('scheduleMeeting', function ($state, serverCommunication) {
    return {
        scope: {
            extraParam: "="
        },
        templateUrl: '/Conversation/ksMeetingSchdule',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.meetingSchedular = {};

            //scope.MeetingSchedular.Subject
            //scope.MeetingSchedular.MeetingDate
            //scope.MeetingSchedular.TimeFrom
            //scope.MeetingSchedular.TimeTo
            //scope.MeetingSchedular.PlatformType
            //scope.MeetingSchedular.UserId
            scope.saveSchedular = function () {
                console.error(scope)                
                if (scope.extraParam && scope.extraParam.afterAddCallBack)
                    scope.extraParam.afterAddCallBack({ selectedData: scope.MeetingSchedular });
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };

            scope.closePopup = function () {
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };
        }
    }
});