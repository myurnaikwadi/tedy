
//MKN - Added
app.directive('vcsDir', function ($state, serverCommunication,$rootScope) {
    return {
        scope: {
            //role: "@",
            //skillRequired: "=",
        },
        templateUrl: '/Home/ksVcs',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {  
            window.vcs = $scope;//mkn
            $scope.leftSideMenus = [{ name: 'Higher Revenue' }
					, { name: 'Lower costs' }
					, { name: 'Improved Brand' }
					, { name: 'Certainty of Success' }
                    , { name: 'Scale of Successs' }
					, { name: 'Turn Around' }
					, { name: 'Customer Delight' }
                    , { name: 'Peer Success' }
                    , { name: 'Team Success' }
                    , { name: 'Subordinate Success' }
            ]
            var _resetStyles = function () {
                var txtBoxes = document.getElementsByTagName("INPUT");
                for (var i = 0; i < txtBoxes.length; i++) {
                    if (txtBoxes[i].id == "userId") {
                        document.getElementById('userId').style.borderColor = "#dcdcdc";
                    } else if (txtBoxes[i].id == "userIdTask") {
                        document.getElementById('userIdTask').style.borderColor = "#dcdcdc";
                    }
                }
            };
            //focus on specific field
            var _setElementFocus = function (elementId, iApplyClass) {//AKP
                if (elementId && document.getElementById(elementId)) {
                    setTimeout(function () {
                        if (elementId && document.getElementById(elementId)) {
                            document.getElementById(elementId).focus();
                        }
                    }, 40);
                }
            };
            $scope.closeAlertMessage = function () {
                _resetStyles();
                if ($scope.toFocusUserId == "true") {
                    _setElementFocus('userId'); //To set focus on UserId in login page when error occurred at UerId.  
                    $scope.toFocusUserId = "false";
                }
                else if ($scope.toFocusPwd == "true") {
                    _setElementFocus('userIdTask'); //to set focus on Password field in login page when error occurred at password.
                    $scope.toFocusPwd = "false";
                }
            };

            //autocomplete user name
            $scope.resetAutoComplete = function () {
                if ($scope.removedIdName != true) {
                    //$scope.recentlyLoggedUsersAutoSuggestArr = [];
                    $scope.selectedIndex = -1;
                }
                else {
                    _setElementFocus('userId'); //to set focus on Password field in login page when error occurred at password.	
                    $scope.removedIdName = false;
                }
            };

            $scope.autoCompleteEmailId = function ($event) {
                if ($event.keyCode === 9 || $event.keyCode === 27) {//tab/Esc key press
                    //if tab is  pressed, set selectedIndex value to userId & focus to password field
                    if ($event.keyCode === 9) {
                        if ($scope.selectedIndex != -1) {
                            //  $scope.credentials.username= $scope.recentlyLoggedUsersAutoSuggestArr[$scope.selectedIndex];
                            // $scope.recentlyLoggedUsersAutoSuggestArr = [];
                            $scope.selectedIndex = -1;
                        }
                    }
                    $scope.resetAutoComplete();
                }

            };
            $scope.measureOfImpact = [{ name: 'LOW' }, { name: 'MEDIUM' }, { name: 'HIGH' }];
            $scope.typeOfImpact = [{ name: 'DIRECT' }, { name: 'INDIRECT' }];

            $scope.addTaskObject = { eventTitle: '', impactZone: -1, measureImapact: -1, typeImapact: -1, description: '' };

            $scope.impactZoneSelection = function (iIndex, iOption) {
                $scope.addTaskObject.impactZone = iIndex;
            };

            $scope.typeOfImapactSelection = function (iIndex, iOption) {
                $scope.addTaskObject.typeImapact = iIndex;
            };
            $scope.measureOfImapactSelection = function (iIndex, iOption) {
                $scope.addTaskObject.measureImapact = iIndex;
            };
            $scope.dummyTaskArray = [];

            $scope.saveTask = function () {
                if ($scope.activity.eventTitle == '') {
                    alert('Please Enter Activity Name');
                    $scope.setFocusToActivityPart();
                    return;
                }
                console.error($scope.addTaskObject)
                if ($scope.addTaskObject.eventTitle == '' || $scope.addTaskObject.description == '' || $scope.addTaskObject.typeImapact == -1 || $scope.addTaskObject.measureImapact == -1) {
                    alert('Please fill Blank field');
                    return;
                }
                $scope.addTaskObject.date = new Date().toJSON();
                $scope.dummyTaskArray.push($scope.addTaskObject);
                $scope.addTaskObject = { eventTitle: '', impactZone: -1, measureImapact: -1, typeImapact: -1, description: '' };
            }

            $scope.toggleAddActivityPopup = function (iFlag) {
             
                $scope.addActivityShowFlag = iFlag;
                $scope.editModeActivate = null;
                $scope.dummyTaskArray = [];
                $scope.activity = { eventTitle: '' };
            };

            $scope.activity = { eventTitle: '' };
            $scope.activityMainArray = [];
            $scope.editModeActivate = null;
            $scope.saveActvity = function () {
                //console.error($scope.addTaskObject)
                if ($scope.activity.eventTitle == '') {
                    alert('Please Enter Activity Name and score');
                    $scope.setFocusToActivityPart();
                    return;
                }
                if ($scope.dummyTaskArray.length == 0 ) {
                    alert('Please add atlist one score');
                    return;
                }
                var _counter = Math.floor((Math.random()*10)+1);
                $scope.activity.VSCSId = $rootScope.loggedDetail.EmailAddress + (Date.now()) + _counter;
                $scope.activity.Tasks = [].concat($scope.dummyTaskArray);
                if ($scope.editModeActivate) {
                    for (var k = 0 ; k < $scope.activityMainArray.length ; k++) {
                        if ($scope.activityMainArray[k].VSCSId == $scope.editModeActivate.VSCSId) {
                            var _tempObj = angular.copy($scope.activityMainArray[k]);
                            _tempObj.eventTitle = $scope.activity.eventTitle;
                            _tempObj.Tasks = [].concat($scope.activity.Tasks);
                            $scope.activity=$scope.activityMainArray[k] = _tempObj;

                            break;
                        }
                    }
                } else {
                    $scope.activityMainArray.push($scope.activity);
                }
                
                serverCommunication.saveActivity({
                    activity: angular.copy($scope.activity),
                    successCallBack: function (iObj) {
                        console.error('In Success CallBack', iObj);
                        //  _createMoleculeStructure(iObj);
                      
                    },
                    failureCallBack: function (iObj) {
                        console.error('In failuregetMySelectionCallBack', iObj);

                    }
                });
                $scope.toggleAddActivityPopup(false);
                
            };

            $scope.editActivity = function (iActivity) {

                $scope.addActivityShowFlag = true;
                $scope.editModeActivate = angular.copy(iActivity);
                $scope.activity.eventTitle = iActivity.eventTitle;
                $scope.dummyTaskArray = [].concat(iActivity.Tasks);
                $scope.setFocusToActivityPart();
            };

            $scope.deleteActivity = function (iIndex,iActivity) {
                var x = confirm("Are you sure, Do you want to delete Activity");
                if (x == true) {
                   
                    serverCommunication.deleteActivity({
                        activity: angular.copy(iActivity),
                        successCallBack: function (iObj) {
                            console.error('In Success CallBack', iObj);
                            //  _createMoleculeStructure(iObj);

                        },
                        failureCallBack: function (iObj) {
                            console.error('In failuregetMySelectionCallBack', iObj);

                        }
                    });
                    $scope.activityMainArray.splice(iIndex, 1);
                } else {
                   
                }
            };
            $scope.setFocusToActivityPart = function () {
                setTimeout(function () {
                    _setElementFocus('userId');
                }, 400);
            };
                    
            var _displayActivity = function (iObj) {
                if (typeof iObj.data === 'string')
                    iObj.data = JSON.parse(iObj.data);
                console.error(iObj.data)
                //var _data = JSON.parse(_data);
                if (iObj.data)
                    $scope.activityMainArray = [].concat(iObj.data);
            };

            var _init = function () {
                serverCommunication.getActivityByUser({
                    loggedUserDetails: $rootScope.loggedDetail,
                    successCallBack: function (iObj) {
                        console.error('In getMySelection', iObj);
                       _displayActivity(iObj);
                    },
                    failureCallBack: function (iObj) {
                        console.error('In failuregetMySelectionCallBack', iObj);

                    }
                });
            };
            _init();
        }
    }
});

app.directive('myReward', function ($state, serverCommunication, $rootScope) {
    return {
        scope: {
            //role: "@",
            //skillRequired: "=",
        },
        templateUrl: '/Home/ksMyReward',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {
            window.ff = $scope;
            $scope.feedBack = {
                redeemPoint: false,
                redeemAction: {}
            }
            $scope.feedBack.redeemPointsClick = function () {
                $scope.feedBack.closeFeedBackPopup();
              //  console.error($scope.feedBack.redeemAction)
                serverCommunication.unlockGameCode({
                    //   loggedUserDetails: $rootScope.loggedDetail,
                    redeemAction: $scope.feedBack.redeemAction,
                    successCallBack: function (iObj) {
                        $scope.init();
                        console.error('In successCallBack', iObj);

                    },
                    failureCallBack: function (iObj) {
                        console.error('In failureCallBack', iObj);

                    }
                });
               
            };
            $scope.loadFeedOnNextTab = function (iFeed) {
                console.error('http://www.brainhq.com/')
                window.open('http://www.brainhq.com/');
            };
          //  $scope.redeemAction
            $scope.feedBack.closeFeedBackPopup = function () {
                $scope.feedBack.redeemPoint = false;
                $scope.feedBack.formValue = '1';
            };
            $scope.rewardsPoints = {
                mentorPoints    : 0,
                menteePoints    : 0,
                coachPoints     : 0,
                coacheePoints   : 0,
                balancePoints   : 0,
                redeemedPoints  : 0,
                totalPoints     : 0,
                myRewardsArray  : []
            };

            $scope.feedBack.openRedeemPanel = function () {
                $scope.feedBack.redeemPoint = true;
                $scope.feedBack.formValue = '1';
            };

            $scope.getPointsRecord = function () {
                serverCommunication.getPointsRecord({
                    successCallBack: function (iObj) {
                        console.error('In successCallBack', iObj);
                        $scope.rewardsPoints.mentorPoints = iObj.data.MentorRewardPoints ? iObj.data.MentorRewardPoints : 0;
                        $scope.rewardsPoints.menteePoints = iObj.data.MenteeRewardPoints ? iObj.data.MenteeRewardPoints : 0;
                        $scope.rewardsPoints.coachPoints = iObj.data.CoachRewardPoints ? iObj.data.CoachRewardPoints : 0;
                        $scope.rewardsPoints.coacheePoints = iObj.data.CoacheeRewardPoints ? iObj.data.CoacheeRewardPoints : 0;
                        $scope.rewardsPoints.totalPoints = iObj.data.TotalRewardPoints ? iObj.data.TotalRewardPoints : 0;
                        $scope.rewardsPoints.balancePoints = iObj.data.BalanceRewardPoints ? iObj.data.BalanceRewardPoints : 0;
                        $scope.rewardsPoints.redeemedPoints = iObj.data.RedeemedPoints ? iObj.data.RedeemedPoints : 0;
                        $scope.rewardsPoints.myRewardsArray = iObj.data.PSRAndGames ? iObj.data.PSRAndGames : [];

                    },
                    failureCallBack: function (iObj) {
                        //console.error('In failureCallBack', iObj);
                    }
                });
            };

            $scope.init = function () {
                $scope.getPointsRecord();
            };
            $scope.init();

        }
    }
});
