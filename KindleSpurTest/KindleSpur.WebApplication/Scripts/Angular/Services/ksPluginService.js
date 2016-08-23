app.directive('monthly', function (dateServiceForMonthlyCalendar) {
    return {
        scope: {

        },
        templateUrl: 'Home/ksMonthlyView',
        link: function ($scope) {
            console.error('monthlyController');
            $scope.monthDate = new Date();
            $scope.dateNavigation = function (iValue) {
                if (iValue == '1') {
                    $scope.monthDate.setMonth($scope.monthDate.getMonth() + 1);
                } else {
                    $scope.monthDate.setMonth($scope.monthDate.getMonth() - 1);
                }
                $scope.init();
            };

            $scope.init = function () {
                $scope.monthlyArray = [].concat(dateServiceForMonthlyCalendar.initializeMonthlyCell($scope.monthDate));
                $scope.dayName = [{ name: "Sun" }, { name: "Mon" }, { name: "Tue" }, { name: "Wed" }, { name: "Thu" }, { name: "Fri" }, { name: "Sat" }];//day name array reqiured for weekly view
                var _tempHeight = document.getElementById('monthlycontroller').getBoundingClientRect().height;
                var _obj = {
                    iHeight: _tempHeight / 6,
                    iCol: 7,
                    iArray: $scope.monthlyArray
                };
                msIsotopeFunc.prototype.genericHeightChange(_obj);
               var _indexArr = [1,21,13,35,38,28,40]
                for (var k = 0 ; k < $scope.monthlyArray.length ; k++) {
                    if (k % 2 == 0) {
                        if (_indexArr.indexOf(k) > -1)
                            $scope.monthlyArray[k].meetingArray = [{ role: 'Coach', Name: 'Meeting With Alex Ward' }, { role: 'Coachee', Name: 'Request with Will Watson' }];
                      
                           

                    } else {
                        if (_indexArr.indexOf(k) == -1)
                            $scope.monthlyArray[k].meetingArray = [{ role: 'Mentor', Name: 'Request with  John Allens' }, { role: 'Mentor', Name: 'Request with  Mike Howard' }, { role: 'Coach', Name: 'Request with  Mike Howard' }, { role: 'Mentee', Name: 'Meeting With Jo Wood' }];
                        else {

                        }
                    }

                }
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

