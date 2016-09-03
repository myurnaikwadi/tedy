﻿app.directive('invitesView', function ($rootScope, serverCommunication,$timeout,$interval) {
    return {
        scope: {
            role: '@?',
            requiredField : '='
        },
        templateUrl: 'Home/ksInboxView',
        link: function ($scope) {
            console.error('invitesView');
            window.inbox = $scope;
            $scope.gridViewLoaded = false;
            var _conversationTime = 60000;
            $scope.autoSyncCounter = null;
            $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
            $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
            $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail, iNotificationDash) {
                //$scope.conversation.IsVerified = isVerfied;
                debugger
                console.error(iNotificationDash);
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

                serverCommunication.updateConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.ApprovalName,
                    Role: 'Coachee',
                    successCallBack: function () {
                        //$scope.menuClick(5, "CONVERSATIONS");               
                        console.debug('In successCallBack');

                    },
                    failureCallBack: function (e) {
                        console.debug('In failureCallBack' + e);
                    }
                });
            };

            $scope.updateMeeting = function (isVerfied, iNotification) {
                //console.error(iNotification)
                serverCommunication.MeetingSchedularUpdate({
                    MeetingId: iNotification.Meeting.MeetingId,
                    flag: isVerfied,
                    successCallBack: function () {
                        console.debug('In successCallBack');
                        $scope.conversationRequest();
                    },
                    failureCallBack: function (e) {
                        console.debug('In failureCallBack' + e);
                    }
                });                
            };

            $scope.viewProfileCall = function (iEvent,iUser) {
                console.error(iUser);               
                serverCommunication.getProfileDetailsUserWise({
                    Role: iUser.skill,
                    EmailAddress: iUser.EmailAddress,
                    successCallBack: function (iObj) {
                        console.log('In getProfileDetailsUserWise', iObj);
                        $rootScope.$broadcast("refreshStateHomeView", {
                            type: 'loadUpperSlider',
                            subType: 'Profile',
                            data: {
                                headingRequired: true, closeRequired: true,
                                //role: 'Mentee', 
                                userInfo: $rootScope.loggedDetail
                            }
                        });
                    },
                    failureCallBack: function (e) {
                        console.debug('In failureCallBack' + e);
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

            $scope.notificationData = [];
            $scope.getAllConversationRequest = function () {
                console.error('Conversation Request Call');
                $scope.notificationData = [];
                serverCommunication.getAllConversationRequest({
                    ConversationType: "Coaching",
                    successCallBack: function (iObj) {
                        console.debug('Conversation Request Call', iObj);
                        for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                            iObj.data.Result[k].CreateDate = new Date(Number(iObj.data.Result[k].CreateDate.split('(')[1].split(')')[0]));
                        }
                        $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                        $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                        if ($scope.requiredField.indexOf("MTG") > -1) {
                            serverCommunication.getAllMeetingRequest({
                                ConversationType: "Coaching",
                                successCallBack: function (iObj) {
                                    console.debug('In getAllMeetingRequest', iObj);
                                    for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                                        iObj.data.Result[k].Meeting.StartDate = new Date(Number(iObj.data.Result[k].Meeting.StartDate.split('(')[1].split(')')[0]));
                                        iObj.data.Result[k].Meeting.EndDate = new Date(Number(iObj.data.Result[k].Meeting.EndDate.split('(')[1].split(')')[0]));
                                    }
                                    $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                                    $timeout(function () {
                                        for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                                            $scope.notificationData[k].showFlag = true;
                                        }
                                    }, 600);

                                    $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                                },
                                failureCallBack: function (iObj) {
                                    console.debug('In failureCallBack', iObj);
                                }
                            });
                        }                        
                    },
                    failureCallBack: function (iObj) {
                        console.debug('In failureCallBack', iObj);
                    }
                });
            };           
           
            $scope.stopFight = function () {
                if (angular.isDefined($scope.autoSyncCounter)) {
                    $interval.cancel($scope.autoSyncCounter);
                    $scope.autoSyncCounter = undefined;
                }
            };

            $scope.autoSyncRoutine = function (iTime) {
                console.error('autoSyncRoutine')
                if ($scope.role == 'All') {
                    $scope.autoSyncCounter = $interval(function () {
                        console.error('autoSyncRoutine - CallBack -- ')
                        $scope.getAllConversationRequest();
                    }, _conversationTime);
                } else {
                    $scope.autoSyncCounter = $interval(function () {
                        console.error('autoSyncRoutine - CallBack -- ')
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
           
            $rootScope.$on("inboxListener", function (event, iObj) {
                console.error('refreshStateHomeView ---- ', iObj);
                $scope.gridViewLoaded = iObj.gridViewLoaded;
                $scope.loadGridView();
            });
        }
    }
});