/**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : login and Signup controller - Manage all data related to  login and signup page
     */
app.controller('monthlyParent', ['$scope', 'authentification', '$location', '$rootScope', '$state', '$stateParams', function ($scope, authentification, $location, $rootScope, $state, $stateParams) {
    $rootScope.currentModule = 'Calendar';
   
}]);
app.directive('monthly', function (dateServiceForMonthlyCalendar, $rootScope, serverCommunication) {
    return {
        scope: {
            moduleName : '@?'
        },
        templateUrl: 'Home/ksMonthlyView',        
        link: function ($scope) {
          
            if ($scope.moduleName)
                $rootScope.currentModule = $scope.moduleName;
            $scope.monthDate = new Date();
            $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
            $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
            $scope.dateNavigation = function (iValue) {
                if (iValue == '1') {
                    $scope.monthDate.setMonth($scope.monthDate.getMonth() + 1);
                } else {
                    $scope.monthDate.setMonth($scope.monthDate.getMonth() - 1);
                }
                $scope.init();
            };
            $scope.closeExpandDateView = function (iEvent) {
                if(iEvent) iEvent.stopPropagation();
               
                $scope.expandIndex = -1;
                $scope.expandDay = null;
                var _tempHeight = document.getElementById('monthlycontroller').getBoundingClientRect().height;
                var _obj = {
                    iHeight: _tempHeight / 6,
                    iCol: 7,
                    iArray: $scope.monthlyArray
                };
                msIsotopeFunc.prototype.genericHeightChange(_obj);
            };
            $scope.expandRequestFlag = -1;           
            $scope.expandRequest = function (iEvent, iIndex) {               
                if (iEvent) iEvent.stopPropagation();
                if ($scope.expandRequestFlag == iIndex) {
                    $scope.expandRequestFlag = -1;
                } else {
                    $scope.expandRequestFlag = iIndex;
                }
                
            };
            $scope.expandRequestScheduledMeetingFlag = -1;
            $scope.expandRequestScheduledMeeting = function (iEvent, iIndex) {
                if (iEvent) iEvent.stopPropagation();
                if ($scope.expandRequestScheduledMeetingFlag == iIndex) {
                    $scope.expandRequestScheduledMeetingFlag = -1;
                } else {
                    $scope.expandRequestScheduledMeetingFlag = iIndex;
                }

            };
            $scope.expandRequestUpcomingMeetingFlag = -1;
            $scope.expandRequestUpcomingMeeting = function (iEvent, iIndex) {
                if (iEvent) iEvent.stopPropagation();
                if ($scope.expandRequestUpcomingMeetingFlag == iIndex) {
                    $scope.expandRequestUpcomingMeetingFlag = -1;
                } else {
                    $scope.expandRequestUpcomingMeetingFlag = iIndex;
                }

            };
            $scope.updateConversation = function (iObj) {
                
                var contentText = "";
                if (iObj.verified != false)
                    contentText = iObj.notification.ConversationType + ' Request by ' + $scope.ApprovalName + ' has been ' + (iObj.verified == true ? 'accepted' : 'Declined');
                else
                    contentText = null;
                var _id = iObj.notification.ConversationId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                var _object = {
                    SenderEmail: iObj.SenderEmail,
                    ReceiverEmail: iObj.notification.SenderEmail,
                    Content: contentText,
                    IsVerified: iObj.verified,
                    ConversationClosed: false,
                    ConversationType: iObj.notification.ConversationType,
                    IsRejected: iObj.verified == false ? true : false,
                    Skill: iObj.notification.skill,
                    ConversationId: _id,
                    ConversationParentId: iObj.notification.ConversationId,
                }
                $scope.invitesRequest.splice(iObj.index, 1);
                if ($scope.monthlyArray[$scope.expandIndex] && $scope.monthlyArray[$scope.expandIndex].meetingArray) {
                    for (var k = 0 ; k < $scope.monthlyArray[$scope.expandIndex].meetingArray.length ; k++) {
                        if ($scope.monthlyArray[$scope.expandIndex].meetingArray[k].ConversationId == iObj.notification.ConversationId) {
                            $scope.monthlyArray[$scope.expandIndex].meetingArray.splice(k, 1);
                            break;
                        }
                    }
                }
                if ($scope.monthlyArray[$scope.expandIndex].inviteObject && $scope.monthlyArray[$scope.expandIndex].inviteObject['invite'] && $scope.monthlyArray[$scope.expandIndex].inviteObject['invite'][iObj.notification.ConversationId]) {
                    delete $scope.monthlyArray[$scope.expandIndex].inviteObject['invite'][iObj.notification.ConversationId];
                }
                serverCommunication.updateConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.ApprovalName,
                    Role: iObj.notification.ConversationType == "Coaching" ? 'Coachee' : 'Mentee',
                    successCallBack: function () {
                      
                        
                    },
                    failureCallBack: function (e) {
                      
                    }
                });
            };

            $scope.updateMeeting = function (index,isVerfied, iNotification) {
               
                $scope.invitesRequest.splice(index, 1);
                if ($scope.monthlyArray[$scope.expandIndex] && $scope.monthlyArray[$scope.expandIndex].meetingArray) {
                    for (var k = 0 ; k < $scope.monthlyArray[$scope.expandIndex].meetingArray.length ; k++) {
                        if ($scope.monthlyArray[$scope.expandIndex].meetingArray[k].MeetingId == iNotification.MeetingId) {
                            $scope.monthlyArray[$scope.expandIndex].meetingArray.splice(k, 1);
                            break;
                        }
                    }
                }
                if ($scope.monthlyArray[$scope.expandIndex].inviteObject && $scope.monthlyArray[$scope.expandIndex].inviteObject['meeting'] && $scope.monthlyArray[$scope.expandIndex].inviteObject['meeting'][iNotification.MeetingId]) {
                    delete $scope.monthlyArray[$scope.expandIndex].inviteObject['meeting'][iNotification.MeetingId];
                }
                serverCommunication.MeetingSchedularUpdate({
                    MeetingId: iNotification.MeetingId,
                    flag: isVerfied,
                    successCallBack: function () {
                       
                    },
                    failureCallBack: function (e) {
                      
                    }
                });
            };
            $scope.expandIndex = -1;
            $scope.expandDay = null;
            $scope.cellClickFunc = function (iCell, iIndex, iEvent) {
                if (iEvent) iEvent.stopPropagation();
                $scope.expandIndex = iIndex;
                var _tempHeight = document.getElementById('monthlycontroller').getBoundingClientRect().height;
                $scope.expandDay = iCell;
                $scope.invitesRequest = [];
                $scope.meetingRequest = [];
                $scope.upcomingMeetingRequest = [];
               
                var _object = {
                    iHeight: _tempHeight / 6,
                    index: iIndex,
                    iWidth: 100 / 7,
                    TotalColumns: 7,
                    column: 7,
                    row: 6,
                    array: $scope.monthlyArray
                };
                msIsotopeFunc.prototype.expandForFloat(_object);
               
                $scope.monthlyArray[iIndex].styleObj['margin-top'] = '0';
                if (iCell.inviteObject && Object.keys(iCell.inviteObject).length > 0) {
                    if (iCell.inviteObject.invite && Object.keys(iCell.inviteObject.invite).length > 0) {
                        $scope.invitesRequest = [];
                        for (var key in iCell.inviteObject.invite) {
                            $scope.invitesRequest.push(iCell.inviteObject.invite[key]);
                        }
                    }
                    if (iCell.inviteObject.meeting && Object.keys(iCell.inviteObject.meeting).length > 0) {
                        $scope.meetingRequest = [];
                        for (var key in iCell.inviteObject.meeting) {
                            if (iCell.inviteObject.meeting[key].IsVerified) {
                                var _data = angular.copy(iCell.inviteObject.meeting[key]);
                                $scope.meetingRequest.push(_data);
                                if (new Date(iCell.inviteObject.meeting[key].StartDate) > new Date()) {
                                    $scope.upcomingMeetingRequest.push(_data);
                                }
                               
                            } else {
                                iCell.inviteObject.meeting[key].expiredMeeting = false;
                                if (new Date(iCell.inviteObject.meeting[key].StartDate) < new Date()) {
                                    iCell.inviteObject.meeting[key].expiredMeeting = true;
                                }
                                if (iCell.inviteObject.meeting[key].From != $scope.loggedEmail)
                                    $scope.invitesRequest.push(iCell.inviteObject.meeting[key]);
                                else {
                                    var _data = angular.copy(iCell.inviteObject.meeting[key]);
                                    $scope.meetingRequest.push(_data);
                                    if (new Date(iCell.inviteObject.meeting[key].StartDate) > new Date()) {
                                        $scope.upcomingMeetingRequest.push(_data);
                                    }
                                }
                            }
                        }
                    }
                }
                  
            };

            var _renderMeeting = function (iObj) {
              
              //  debugger
                for (var k = 0 ; k < iObj.data.length ; k++) {
                    iObj.data[k].UpdateDate && (iObj.data[k].UpdateDate = new Date(Number(iObj.data[k].UpdateDate.split('(')[1].split(')')[0])));
                    iObj.data[k].StartDate && (iObj.data[k].StartDate = new Date(Number(iObj.data[k].StartDate.split('(')[1].split(')')[0])));
                    iObj.data[k].EndDate && (iObj.data[k].EndDate = new Date(Number(iObj.data[k].EndDate.split('(')[1].split(')')[0])));
                    var _indexForCheck = -1;
                    if (iObj.data[k].StartDate)
                        _indexForCheck = dateServiceForMonthlyCalendar.getDayDifference({ startTime: new Date($scope.monthlyArray[0].cellDate), endTime: new Date(iObj.data[k].StartDate) })
                    else if (iObj.data[k].UpdateDate)
                        _indexForCheck = dateServiceForMonthlyCalendar.getDayDifference({ startTime: new Date($scope.monthlyArray[0].cellDate), endTime: new Date(iObj.data[k].UpdateDate) })
                    var _arrayIndex = _indexForCheck -1;
               
                    if (_arrayIndex > -1) {
                        if (iObj.data[k].ConversationType == "Coaching" || iObj.data[k].ConversationType == "Mentoring") {
                            iObj.data[k].Role = iObj.data[k].ConversationType == "Coaching" ? 'Coach' : 'Mentor';
                        }
                        if (!$scope.monthlyArray[_arrayIndex].meetingArray) $scope.monthlyArray[_arrayIndex].meetingArray = [];
                        $scope.monthlyArray[_arrayIndex].meetingArray.push(iObj.data[k]);
                        if (!$scope.monthlyArray[_arrayIndex].inviteObject) $scope.monthlyArray[_arrayIndex].inviteObject = { invite: {}, meeting: {}};
                        if (iObj.invite) {
                            $scope.monthlyArray[_arrayIndex].inviteObject['invite'][iObj.data[k].ConversationId] = iObj.data[k];
                        }
                        if (iObj.Meeting) {
                            $scope.monthlyArray[_arrayIndex].inviteObject['meeting'][iObj.data[k].MeetingId] = iObj.data[k];
                        }
                    }
                }
              
            };
            var _getMeetingFromServer = function () {
                serverCommunication.GetAllMeetingPerMonth({
                   
                    Value: 'All',
                    FromDate: $scope.monthlyArray[0].cellDate.toJSON(),
                    ToDate: $scope.monthlyArray[$scope.monthlyArray.length - 1].cellDate.toJSON(),
                    successCallBack: function (iObj) {
                      
                        if(iObj.data){
                            if (iObj.data['invite'] && iObj.data['invite'].length > 0) {
                                _renderMeeting({ data: iObj.data['invite'], invite: true });
                            }
                            if (iObj.data['meeting'] && iObj.data['meeting'].length > 0) {
                                _renderMeeting({ data: iObj.data['meeting'] ,Meeting : true });
                            }
                        }
                       
                       
                    },
                    failureCallBack: function (iObj) {
                    
                    }
                });
            };

            $scope.init = function () {
                $rootScope.$broadcast("refreshView", { type : 'refreshUI' });
                $scope.monthlyArray = [].concat(dateServiceForMonthlyCalendar.initializeMonthlyCell($scope.monthDate));
                $scope.dayName = [{ name: "Sun" }, { name: "Mon" }, { name: "Tue" }, { name: "Wed" }, { name: "Thu" }, { name: "Fri" }, { name: "Sat" }];//day name array reqiured for weekly view
                $scope.closeExpandDateView();              
                _getMeetingFromServer();
            };
            $scope.init();
           
            window.mon = $scope;
        }
    }
});

app.factory("dateServiceForMonthlyCalendar", function () {
    return {
        initializeMonthlyCell: function (dateObjAr, iObjFlag) {
            var isCurrentMonth = false;
            var _dateCount = 1;
            var _monthNumber =  "";
            var _year = "";
            var dateObjArgu = new Date(dateObjAr);
            var _nextMonthDateCount = 1;
            _dateCounter = 1;
            dateObjArgu.setDate(1);
            var _startDay = dateObjArgu.getDay();
            var _monthArray = new Array();
            var _monthObj = {};
            var _arrayForYearly = new Array();

            for (var i = 0 ; i < 6 ; i++) {
                for (var j = 0 ; j < 7 ; j++) {
                    var rowNumber = i;
                    var colNumber = j;
                    var _refDate = new Date();
                    _dateCounter = _dateCount;

                    if (colNumber < _startDay && rowNumber == 0) {
                        _dateCounter = this.getMaxDateOfMonth(dateObjArgu.getMonth() - 1, dateObjArgu.getFullYear()) - (_startDay - colNumber - 1);
                        if ((dateObjArgu.getMonth() - 1) == -1)
                            _dateCounter = this.getMaxDateOfMonth(11, dateObjArgu.getFullYear() - 1) - (_startDay - colNumber - 1);
                        _monthNumber = dateObjArgu.getMonth();
                        _year = dateObjArgu.getFullYear();
                        if (_monthNumber == 0) {
                            _monthNumber = 12;
                            _year--;
                        }
                        var obj = {
                            dateNumber: _dateCounter,
                            selectFlag: false,
                            value: "",
                            flag: 0,
                            clickedFlag: false,
                            cellDate: new Date(_year, _monthNumber - 1, _dateCounter),
                            weekDay: new Date(_year, _monthNumber - 1, _dateCounter).getDay()
                        };
                        _monthObj[new Date(_year, _monthNumber, _dateCounter)] = [];
                        _monthArray.push(obj);
                        _arrayForYearly.push(obj);
                    }
                    else if (_dateCounter <= this.getMaxDateOfMonth(dateObjArgu.getMonth(), dateObjArgu.getFullYear())) { //current month
                        if ((_dateCounter < _refDate.getDate() && dateObjArgu.getMonth() == _refDate.getMonth() && dateObjArgu.getFullYear() == _refDate.getFullYear()) || ((dateObjArgu.getMonth() < _refDate.getMonth() && dateObjArgu.getFullYear() == _refDate.getFullYear()) || dateObjArgu.getFullYear() < _refDate.getFullYear())) {
                            _year = dateObjArgu.getFullYear();
                            _monthNumber = dateObjArgu.getMonth();
                            var obj = {
                                dateNumber: _dateCounter,
                                selectFlag: false,
                                flag: 1,
                                value: "",
                                currentMonth: true,
                                clickedFlag: false,
                                cellDate: new Date(_year, _monthNumber, _dateCounter),
                                weekDay: new Date(_year, _monthNumber, _dateCounter).getDay()
                            };
                            _monthObj[new Date(_year, _monthNumber, _dateCounter)] = [];
                            _monthArray.push(obj);
                            _arrayForYearly.push(obj);
                        } else {
                            _monthNumber = dateObjArgu.getMonth() + 1;
                            _year = dateObjArgu.getFullYear();
                            var obj = {
                                dateNumber: _dateCounter,
                                selectFlag: false,
                                value: "",
                                currentMonth: true,
                                clickedFlag: false,
                                cellDate: new Date(_year, _monthNumber - 1, _dateCounter),
                                weekDay: new Date(_year, _monthNumber - 1, _dateCounter).getDay(),
                                flag: 1
                            };
                            _monthObj[new Date(_year, _monthNumber - 1, _dateCounter)] = [];
                            _monthArray.push(obj);
                            _arrayForYearly.push(obj);
                        }
                        isCurrentMonth = true;
                    }
                    else {

                        isCurrentMonth = false;
                        _dateCounter = _nextMonthDateCount;
                        _monthNumber = (dateObjArgu.getMonth()) + 1;
                        _year = dateObjArgu.getFullYear();

                        if (_monthNumber == 13) {
                            _monthNumber = 1;
                            _year++;
                        }
                        var obj = {
                            dateNumber: _dateCounter,
                            value: "",
                            selectFlag: false,
                            flag: 0,
                            clickedFlag: false,
                            cellDate: new Date(_year, _monthNumber, _dateCounter),
                            weekDay: new Date(_year, _monthNumber, _dateCounter).getDay()
                        };
                        _monthObj[new Date(_year, _monthNumber, _dateCounter)] = [];
                        _monthArray.push(obj);
                        _arrayForYearly.push(obj);
                        _nextMonthDateCount = _nextMonthDateCount + 1;
                    }


                    if (isCurrentMonth && _refDate.getDate() == _dateCounter && (_refDate.getMonth() + 1) == _monthNumber && _refDate.getFullYear() == _year) {
                        _monthArray[_monthArray.length - 1].flag = 1;
                        _monthArray[_monthArray.length - 1].flagAgenda = true;
                        _monthArray[_monthArray.length - 1].flagMonthly = true;
                        _monthArray[_monthArray.length - 1].value = 'TODAY';

                    }
                    if (isCurrentMonth)
                        _dateCount = _dateCount + 1;

                    _dateCounter = _dateCounter + 1;

                }
            }
            if (iObjFlag)
                return {
                    monthObj: _monthObj,
                    monthArray: _monthArray
                }
            else
                return _monthArray;
        }, getMaxDateOfMonth: function (iMonth, iYear) {
            if (iMonth == 0 || iMonth == 2 || iMonth == 4 || iMonth == 6 || iMonth == 7 || iMonth == 9 || iMonth == 11)
                return 31;
            else if (iMonth == 3 || iMonth == 5 || iMonth == 8 || iMonth == 10)
                return 30;
            else if (iMonth == 1 && ((iYear % 4 == 0) && (iYear % 100 != 0)) || (iYear % 400 == 0))
                return 29;
            else
                return 28;
        }, getDayDifference: function (iObj, onlyTimeFlag) {
            var oneDayInMilliseconds = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date(iObj.startTime);
            var secondDate = new Date(iObj.endTime);
            if (onlyTimeFlag)
                return Math.abs(firstDate.getTime() - secondDate.getTime());

            if (firstDate.getTime() > secondDate.getTime())
                return -1;
            else
                return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDayInMilliseconds)));
        },

        initializeWeeklyCell: function (dateObjAr, $scope, iFlag) {

            var _date = new Date(dateObjAr);
            var _offset = _date.getDay();
            var _startWeek = new Date(dateObjAr);
            var _weekArr = new Array();
            var _currdate = new Date();
            for (var i = 0; i < 7; i++) {
                var _lDate = new Date(_startWeek);               
                var _obj = {
                    cellDate: _lDate,
                    currentDate: false,
                    clickedDate: "0",
                    dateNumber: _lDate.getDate()
                }
                if (_currdate.getDate() == _lDate.getDate() && _currdate.getMonth() == _lDate.getMonth() && _currdate.getFullYear() == _lDate.getFullYear()) {
                    _obj.currentDate = true;
                }
                _weekArr.push(_obj);
                _startWeek.setDate(_startWeek.getDate() + 1);
            }
            return _weekArr;
        }
    };
});

