﻿app.directive('invitesView', function ($rootScope, serverCommunication,$timeout,$interval) {
    return {
        scope: {
            role: '@?',
            requiredField : '='
        },
        templateUrl: 'Home/ksInboxView',
        link: function ($scope) {
           
            window.inbox = $scope;
            $scope.gridViewLoaded = false;
            var _conversationTime = 60000;
            $scope.autoSyncCounter = null;
            $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
            $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;

            $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail, iNotificationDash) {
                                       
                var contentText = "";
                if (isVerfied != false)
                    contentText = iNotificationDash.ConversationType+' Request by ' + $scope.ApprovalName + ' has been '+ (isVerfied == true ? 'accepted': 'Declined');
                else
                    contentText = null;
                var _id = iNotificationDash.ConversationId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                var _object = {
                    SenderEmail: SenderEmail,
                    ReceiverEmail: ReceiverEmail,
                    Content: contentText,
                    IsVerified: isVerfied,
                    ConversationClosed: false,
                    ConversationType: iNotificationDash.ConversationType,
                    IsRejected: isVerfied == false ? true : false,
                    Skill: iNotificationDash.skill,
                    ConversationId: _id,
                    ConversationParentId: iNotificationDash.ConversationId,
                }
                _autoClosePopup();
                serverCommunication.updateConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.ApprovalName,
                    Role: 'Coachee',
                    successCallBack: function () {
                                 
                      

                    },
                    failureCallBack: function (e) {
                       
                    }
                });
            };

            $scope.updateMeeting = function (isVerfied, iNotification) {
               
                serverCommunication.MeetingSchedularUpdate({
                    MeetingId: iNotification.Meeting.MeetingId,
                    flag: isVerfied,
                    successCallBack: function () {
                    
                        $scope.conversationRequest();
                    },
                    failureCallBack: function (e) {
                       
                    }
                });                
            };

            $scope.viewProfileCall = function (iEvent,iUser) {
                         
                serverCommunication.getProfileDetailsUserWise({
                    Role: iUser.ConversationType == 'Coaching' ? 'Coachee' : 'Mentee',
                    EmailAddress: iUser.EmailAddress,
                    successCallBack: function (iObj) {
                      
                        $rootScope.$broadcast("refreshStateHomeView", {
                            type: 'loadUpperSlider',
                            subType: 'Profile',
                            data: {
                                headingRequired: true, closeRequired: true,
                                //role: 'Mentee', 
                                userInfo: iObj.data
                            }
                        });
                    },
                    failureCallBack: function (e) {
                       
                    }
                });               
            };

            $scope.loadGridView = function (iEvent) {
                iEvent && iEvent.stopPrapagation();
                for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                    $scope.notificationData[k].showFlag = false;
                }
                $timeout(function () {
                    for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                        $scope.notificationData[k].showFlag = true;
                    }
                }, 600);
            };

            var _callForAllMeetingRequest = function () {
                if ($scope.requiredField.indexOf("MTG") > -1) {
                    serverCommunication.getAllMeetingRequest({
                        ConversationType: "Coaching",
                        successCallBack: function (iObj) {
                            if (iObj.data && iObj.data.Result) {
                                for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                                    iObj.data.Result[k].Meeting.StartDate = new Date(Number(iObj.data.Result[k].Meeting.StartDate.split('(')[1].split(')')[0]));
                                    iObj.data.Result[k].Meeting.EndDate = new Date(Number(iObj.data.Result[k].Meeting.EndDate.split('(')[1].split(')')[0]));
                                }
                                $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                            }
                            $timeout(function () {
                                for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                                    $scope.notificationData[k].showFlag = true;
                                }
                            }, 600);

                            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                        },
                        failureCallBack: function (iObj) {
                           
                        }
                    });
                }
            }
            $scope.notificationData = [];
            $scope.getAllConversationRequest = function () {
              
                $scope.notificationData = [];
                if ($scope.requiredField.indexOf("REQ") > -1) {
                    serverCommunication.getAllConversationRequest({
                        ConversationType: ($scope.role == 'Coach') ? 'Coaching': 'Mentoring',
                        successCallBack: function (iObj) {
                            if (iObj.data && iObj.data.Result) {
                                for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                                    iObj.data.Result[k].CreateDate = new Date(Number(iObj.data.Result[k].CreateDate.split('(')[1].split(')')[0]));
                                }
                                $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                            }
                           
                            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                            _callForAllMeetingRequest();
                        },
                        failureCallBack: function (iObj) {
                          
                        }
                    });
                } else {
                    _callForAllMeetingRequest();
                }
              
            };           
           
            var _callForMeetingRequest = function () {
                if ($scope.requiredField.indexOf("MTG") > -1) {
                    serverCommunication.getMeetingRequestAsPerRole({
                        Role: $scope.role,
                        successCallBack: function (iObj) {
                            if (iObj.data && iObj.data.Result) {
                                for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                                    iObj.data.Result[k].Meeting.StartDate = new Date(Number(iObj.data.Result[k].Meeting.StartDate.split('(')[1].split(')')[0]));
                                    iObj.data.Result[k].Meeting.EndDate = new Date(Number(iObj.data.Result[k].Meeting.EndDate.split('(')[1].split(')')[0]));
                                }
                                $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                            }
                            $timeout(function () {
                                for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                                    $scope.notificationData[k].showFlag = true;
                                }
                            }, 600);

                            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                        },
                        failureCallBack: function (iObj) {
                           
                        }
                    });
                }
            };

            $scope.notificationData = [];
            $scope.conversationRequest = function () {
              
                $scope.notificationData = [];
                if ($scope.requiredField.indexOf("REQ") > -1) {
                    serverCommunication.getConversationRequest({
                        ConversationType: ($scope.role == 'Coach') ? 'Coaching' : 'Mentoring',
                        successCallBack: function (iObj) {
                            if (iObj.data && iObj.data.Result) {
                                for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                                    iObj.data.Result[k].CreateDate = new Date(Number(iObj.data.Result[k].CreateDate.split('(')[1].split(')')[0]));
                                }
                                $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                            }
                            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                            _callForMeetingRequest();
                        },
                        failureCallBack: function (iObj) {
                           
                        }
                    });
                } else {
                    _callForMeetingRequest();
                }
            };            

            $scope.stopFight = function () {
                if (angular.isDefined($scope.autoSyncCounter)) {
                    $interval.cancel($scope.autoSyncCounter);
                    $scope.autoSyncCounter = undefined;
                }
            };

            $scope.autoSyncRoutine = function (iTime) {
             
                if ($scope.role == 'All') {
                    $scope.autoSyncCounter = $interval(function () {
                      
                        $scope.getAllConversationRequest();
                    }, _conversationTime);
                } else {
                    $scope.autoSyncCounter = $interval(function () {
                     
                        $scope.conversationRequest();
                    }, _conversationTime);
                }
               
            };
            
            $scope.init = function () {
                if ($scope.role == 'All') {                    
                    $scope.getAllConversationRequest();
                    $scope.autoSyncRoutine();
                } else {
                    $scope.conversationRequest();
                    $scope.autoSyncRoutine();
                }                
            };
            $scope.init();
            $scope.$on("$destroy", function handleDestroyEvent() {
                $scope.stopFight();
            });

            //Close Inbox view automatically
            var _autoClosePopup = function () {
                if ($scope.notificationData.length == 0) {
                    $rootScope.$broadcast("closeInbox", { closeInboxFlag: true });
                    $scope.gridViewLoaded = false;
                    $scope.loadGridView();
                }
            }
            $rootScope.$on("inboxListener", function (event, iObj) {
               
                $scope.gridViewLoaded = iObj.gridViewLoaded;
                $scope.loadGridView();
            });
        }
    }
});