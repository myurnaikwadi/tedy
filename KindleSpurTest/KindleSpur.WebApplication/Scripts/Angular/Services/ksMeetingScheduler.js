app.directive('scheduleMeeting', function ($state, serverCommunication) {
    return {
        scope: {
            extraParam: "="
        },
        templateUrl: '/Conversation/ksMeetingSchdule',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.MeetingSchedular = {};
            scope.MeetingSchedular.MeetingDate = new Date();
            scope.MeetingSchedular.TimeFrom = new Date(scope.MeetingSchedular.MeetingDate);
            scope.MeetingSchedular.TimeTo = new Date(scope.MeetingSchedular.MeetingDate);
            scope.MeetingSchedular.TimeTo.setHours(scope.MeetingSchedular.TimeFrom.getHours()+1);
            //scope.MeetingSchedular.Subject
            //scope.MeetingSchedular.MeetingDate
            //scope.MeetingSchedular.TimeFrom
            //scope.MeetingSchedular.TimeTo
            //scope.MeetingSchedular.PlatformType
            //scope.MeetingSchedular.UserId
            scope.saveSchedular = function () {
                console.error(scope)            
                
                var _startDate = new Date(scope.MeetingSchedular.MeetingDate);
                _startDate.setHours(new Date(scope.MeetingSchedular.TimeFrom).getHours());
                _startDate.setMinutes(new Date(scope.MeetingSchedular.TimeFrom).getMinutes());
                _startDate.setSeconds(0);
                var _endDate = new Date(scope.MeetingSchedular.MeetingDate);
                _endDate.setHours(new Date(scope.MeetingSchedular.TimeTo).getHours());
                _endDate.setMinutes(new Date(scope.MeetingSchedular.TimeTo).getMinutes());
                _endDate.setSeconds(0);

                var _endDayTIme = new Date(23,59,59,999);
                if(_startDate < new Date()){
                    alert('Start Time should be greator than current time');                
                } else if (_endDate > _endDayTIme) {
                    alert('Meeting duration should be less than 24 hrs');
                }


                return;

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