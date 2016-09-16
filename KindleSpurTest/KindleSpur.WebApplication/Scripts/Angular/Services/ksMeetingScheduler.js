app.directive('scheduleMeeting', function ($state, serverCommunication,$rootScope) {
    return {
        scope: {
            extraParam: "="
        },
        templateUrl: '/Conversation/ksMeetingSchdule',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.MeetingSchedular = { Subject: '', PlatformType: '', UserId  : ''};
            scope.MeetingSchedular.MeetingDate = new Date();
            scope.MeetingSchedular.TimeFrom = new Date(scope.MeetingSchedular.MeetingDate);
            scope.MeetingSchedular.TimeTo = new Date(scope.MeetingSchedular.MeetingDate);
            scope.MeetingSchedular.TimeTo.setHours(scope.MeetingSchedular.TimeFrom.getHours()+1);
            scope.conflictAlert = { showAlert  : false, message : ''};
            scope.saveSchedular = function () {
                //console.error(scope)

               


                //scope.conflictAlert = true;
                var _date = new Date(scope.MeetingSchedular.MeetingDate);
                var _startDate = new Date(_date);
                _startDate.setHours(new Date(scope.MeetingSchedular.TimeFrom).getHours());
                _startDate.setMinutes(new Date(scope.MeetingSchedular.TimeFrom).getMinutes());
                _startDate.setSeconds(0);
                var _endDate = new Date(_date);
                _endDate.setHours(new Date(scope.MeetingSchedular.TimeTo).getHours());
                _endDate.setMinutes(new Date(scope.MeetingSchedular.TimeTo).getMinutes());
                _endDate.setSeconds(0);
                var _endDayTIme = new Date(scope.MeetingSchedular.MeetingDate);
                _endDayTIme.setHours(23, 59, 59, 999);

               // var _endDayTIme = new Date(23,59,59,999);
                if(_startDate < new Date()){
                    alert('Start Time should be greator than current time');
                    return;
                } else if (_endDate > _endDayTIme) {
                    alert('Meeting duration should be less than 24 hrs');
                    return;
                }
                
                if (scope.MeetingSchedular.Subject == '') {
                    alert('Please enter meeting subject');
                    return;
                }
                if (scope.MeetingSchedular.UserId == '') {
                    alert('Please specify communication mode');
                    return;
                }
                //;
                var _startTimeForSelectedDay = new Date(_startDate);
                _startTimeForSelectedDay.setHours(0, 0, 0)
                var _endTimeForSelectedDay = new Date(_startDate);
                _endTimeForSelectedDay.setHours(23,59,999)
                _getMeetingFromServer({
                    StartDate: _startTimeForSelectedDay,
                    EndDate: _endTimeForSelectedDay,
                    callBack: function (iResult) {
                        if (iResult.length > 0) {
                            for (var k = 0 ; k < iResult.length ; k++) {
                                if (new Date(iResult[k].StartDate) > new Date(_startDate) || new Date(_startDate) < new Date(iResult[k].EndDate)) {
                                    scope.conflictAlert = { showAlert: true, message:  ''};
                                    if(iResult[k].From != $rootScope.loggedDetail.EmailAddress){
                                        scope.conflictAlert.message = (iResult[k].FromFirstName+" "+ iResult[k].FromLastName)+" regarding subject "+iResult[k].Subject;
                                    }else if(iResult[k].To != $rootScope.loggedDetail.EmailAddress){
                                        scope.conflictAlert.message = (iResult[k].ToFirstName + " " + iResult[k].ToLastName) + " regarding subject " + iResult[k].Subject;
                                    }
                                    break;
                                } else if (new Date(iResult[k].StartDate) > new Date(_endDate) || new Date(_endDate) < new Date(iResult[k].EndDate)) {
                                    scope.conflictAlert = { showAlert: true, message: '' };
                                    if(iResult[k].From != $rootScope.loggedDetail.EmailAddress){
                                        scope.conflictAlert.message = (iResult[k].FromFirstName + " " + iResult[k].FromLastName) + " regarding subject " + iResult[k].Subject;
                                    }else if(iResult[k].To != $rootScope.loggedDetail.EmailAddress){
                                        scope.conflictAlert.message = (iResult[k].ToFirstName + " " + iResult[k].ToLastName) + " regarding subject " + iResult[k].Subject;
                                    }
                                    break;
                                }
                            }
                            if (scope.conflictAlert.showAlert == false) {
                                if (scope.extraParam && scope.extraParam.afterAddCallBack)
                                    scope.extraParam.afterAddCallBack({ selectedData: scope.MeetingSchedular });
                                if (scope.extraParam && scope.extraParam.closeCallBack)
                                    scope.extraParam.closeCallBack();
                            }
                           
                        }else{
                            if (scope.extraParam && scope.extraParam.afterAddCallBack)
                                scope.extraParam.afterAddCallBack({ selectedData: scope.MeetingSchedular });
                            if (scope.extraParam && scope.extraParam.closeCallBack)
                                scope.extraParam.closeCallBack();
                        }                        
                        
                    }
                });
            };

            scope.closePopup = function () {
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };
            var _renderMeeting = function (iObj) {
               // console.error(iObj)                
                for (var k = 0 ; k < iObj.data.length ; k++) {
                    iObj.data[k].StartDate && (iObj.data[k].StartDate = new Date(Number(iObj.data[k].StartDate.split('(')[1].split(')')[0])));
                    iObj.data[k].EndDate && (iObj.data[k].EndDate = new Date(Number(iObj.data[k].EndDate.split('(')[1].split(')')[0])));
                }
                iObj.callBack && (iObj.callBack(iObj.data));
            };
            var _getMeetingFromServer = function (iDateObj) {
                serverCommunication.GetAllMeetingPerMonth({
                    //  ConversationType: "Mentoring",
                    Value : 'Meeting',
                    FromDate: iDateObj.StartDate.toJSON(),
                    ToDate: iDateObj.EndDate.toJSON(),
                    successCallBack: function (iObj) {
                        console.debug('In GetAllMeetingPerMonth', iObj);
                        if (iObj.data) {
                            if (iObj.data['meeting'] && iObj.data['meeting'].length > 0) {
                                _renderMeeting({ callBack: iDateObj.callBack, data: iObj.data['meeting'], Meeting: true });
                            } else {
                                iDateObj.callBack && (iDateObj.callBack([]));
                            }
                        }
                    },
                    failureCallBack: function (iObj) {
                        console.debug('In failureCallBack', iObj);
                    }
                });
            };            
        }
    }
});