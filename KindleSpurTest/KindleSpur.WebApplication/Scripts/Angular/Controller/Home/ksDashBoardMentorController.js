﻿app.controller('ksDashBoardMentorController', function ($rootScope, $scope, serverCommunication, $interval,$state) {
    $rootScope.currentModule = 'Mentor';
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ];
    $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
    $scope.navigateToProfile = function () {
        $state.go('home.dashBoard.profile');
    };
    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
    $scope.conversation = {};



    $scope.coachingStatusArray = [{ Sender: '', FirstName: 'MAYUR', LastName: 'N', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 5, Skill: 'ANGULAR JS' }
                 , { Sender: '', FirstName: 'SAGAR N', LastName: 'N', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 3, Skill: 'C# MVC' }
                 , { Sender: '', FirstName: 'SAGAR P', LastName: 'P', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 1, Skill: 'C# MVC' }
                 , { Sender: '', FirstName: 'SHILPA', LastName: 'M', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 6, Skill: 'BUSINESS' }
                 , { Sender: '', FirstName: 'SHANTANU', LastName: 'P', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 5, Skill: 'BUSINESS' }
                 , { Sender: '', FirstName: 'SONALI', LastName: 'J', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 5, Skill: 'PROGRAM' }
                 , { Sender: '', FirstName: 'ISHWAR', LastName: 'J', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 1, Skill: 'DEV', }
    ];

    $scope.showCoacheeProfile = false;
    $scope.userInfo = null;
    $scope.showCoacheeProfileStatus = function (iOption) {
        console.error('showeCoacheeProfileClass')
        $scope.showCoacheeProfile = true;
        $scope.userInfo = iOption;
    };

    $scope.closeProfilePic = function () {
        console.error('closeProfilePopup')
        $scope.showCoacheeProfile = false;
        $scope.userInfo = null;
    };


    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                , { name: 'MENTORING STATUS' }
                   , { name: 'SELECT TOPICS' }
                , { name: 'KNOWLEDGE GARDEN' }
                 , { name: 'KNOWLEDGE FEED' }
                , { name: 'COMMUNICATION' }
              //  , { name: 'KNOWLEDGE FEED' }
                , { name: 'MY REWARDS' }
                   , { name: 'RESOURCES' }
                // , { name: 'VCS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
               { name: 'SELECT TOPICS', url: '../../Images/icons/coaching_status.png ' },
                { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/knowledge_garden.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' },
                 { name: 'RESOURCES', url: '../../Images/icons/resources1.png' }


    ];

    $scope.selectedMenu = '0';
    var _chatMessageTime = 30000;
    var _conversationTime = 60000;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray = [];
        $scope.stopFight();
        $scope.loadingMiddleObject = { showLoading: true, loadingMessage: 'Loading' };
        switch (iIndex) {
            case 0: $scope.autoSyncRoutine(_conversationTime); $scope.conversationRequest(); break;
            case 1: $scope.getCoachRecord(); break;
            case 3: $scope.generateGarden(); break;
            case 4: $scope.getRssFeedData(); break;
            case 5: $scope.autoSyncRoutine(_chatMessageTime); $scope.conversationLoading(); break;
            case 2:
            case 7:
            case 6: $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' }; break;
        }
    };

    $scope.selectedOption = function (iIndex, iCate) {
        for (var k = 0; k < $scope.leftSideMenus.length; k++) {
            if ($scope.leftSideMenus[k].name == iCate.name) {
                $scope.menuClick(k, $scope.leftSideMenus[k]);
            }
        }
    };

    $scope.generateGarden = function () {
        $scope.ctsDataForMolecule = null;
        serverCommunication.getCoachingWithStatus({
            role: 'mentor',
            loggedUserDetails: $rootScope.loggedDetail,
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.coachingStatusArray = iObj.data.Filters;
                var _array = [];
                for (var k = 0; k < $scope.coachingStatusArray.length ; k++) {
                    var _str = $scope.coachingStatusArray[k].FirstName + " " + $scope.coachingStatusArray[k].LastName;
                    _array.push({
                        "symbol": _str.toUpperCase(),
                        "image": $scope.coachingStatusArray[k].TreeURL,
                        "size": 45,
                        "id": Math.random() + k,
                        "bonds": 1
                    });
                }
                var _retu = {
                    "3-iodo-3-methylhexan-1,4-diamine": {
                        "nodes": _array,
                        "links": []
                    }
                }
                console.error(_retu)
                $scope.ctsDataForMolecule = _retu;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
    };

    $scope.getCoachRecord = function () {
        serverCommunication.getCoachingWithStatus({
              role: 'mentor',
              loggedUserDetails: $rootScope.loggedDetail,
              successCallBack: function (iObj) {
                   console.error('In successCallBack', iObj);
                   $scope.coachingStatusArray = iObj.data.Filters;
                   $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
        });
      };
      $scope.feedBack = {}
      $scope.feedBack.askFeedback = false;
      $scope.feedBack.formValue = '0';
      $scope.feedBack.icloseFeedBack = false
      $scope.askFeedBackFunc = function (icloseFeedBack) {
          $scope.feedBack.askFeedback = true;
          $scope.feedBack.formValue = '1';
          $scope.feedBack.icloseFeedBack = icloseFeedBack;         
          $scope.feedBackloaded = { showLoad: false };
          if (icloseFeedBack == 3) {
              $scope.feedBack.feedBackType = 'preSession';
              $scope.array = [].concat(angular.copy(_presessionQuestion));
          } else {
              if (icloseFeedBack) {
                  $scope.feedBack.feedBackType = 'closeSession';
                  $scope.array = [].concat(angular.copy(_arrayCloseSession));
              } else {
                  $scope.feedBack.feedBackType = 'feedBack';
                  $scope.array = [].concat(angular.copy(_array));
              }
          }
      }

      var _array = [
          { name: 'What do you appreciate the most in your interactions with the mentee ? ', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Is the coachee/mentee able to grasp the ideas discussed?', actionValue: '1', type: 'rating', showLoad: false },
          { name: 'What are the Strong Qualities of the Mentee/ Coachee ?', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'What are the areas where the Mentee needs to Improve ? ', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Are there any critical areas where Mentee/ Coachee needs serious and urgent help/ support ?', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Do you believe that the Mentee will be Successful in the targeted areas after the Mentoring is complete ?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '', },
          { name: 'Rate the session', sessionRating: true, type: 'rating', showLoad: false, actionValue: '', },
      ];
      var _arrayCloseSession = [
          { name: 'Was the mentee/coachee receptive and well prepared for the sessions.', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Do you believe the mentee/coachee has accomplished the objectives.', actionValue: '1', type: 'radio', showLoad: false },
          { name: 'Did this program enrich you as an individual?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'How did you know about KindleSpur ?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Would you like to refer anyone to try KindleSpur ?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Would you take Mentoring/ Coaching again at KindleSpur (for another Objective/ Goal) ?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Overall rating for Mentee/ coachee.', type: 'rating', showLoad: false, actionValue: '', },
          { name: ' Overall rating for KindleSpur.', sessionRating: true, type: 'rating', showLoad: false, actionValue: '', },
      ];
      var _presessionQuestion = [
        { name: 'The broad level areas that will get covered under these sessions', actionValue: '', type: 'textArea', showLoad: false },
        { name: 'Knowledge areas you would like the recipient to aware of before the session', actionValue: '', type: 'textArea', showLoad: false },
        { name: 'Your preferred time and mode of communication', actionValue: '', type: 'checkBoxTime', showLoad: false },
        { name: 'Five attributes that you would like your coachee/ mentee to know about you', actionValue: '', type: 'textArea', showLoad: false },
      ];

      $scope.feedBack.closeFeedBackPopup = function () {
          $scope.feedBack.askFeedback = false;
          $scope.feedBack.formValue = '1';
          $scope.feedBack.icloseFeedBack = false;
      };


      $scope.redeemPointsClick = function () {

          $scope.feedBack.closeFeedBackPopup();
          $scope.menuClick(6);
      };

      $scope.feedBackSave = function () {
          //alert('')
          $scope.menuClick(6);
      };
      $scope.closeCallBack = function () {
          //  alert('closeCallBack')

          $scope.feedBack.closeFeedBackPopup()
      };

    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
      //  $scope.feedCategoryArray = [];
        serverCommunication.getMyMentorSelection({  
            successCallBack: function (iObj) {
                console.error('In getMySelection', iObj);
                _category = {
                };
                _topics = {};
                _skills = {
                };
                console.error(angular.copy(iObj.data));

                if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
                    for (var k = 0; k < iObj.data.Categories.length; k++) {
                        if (Object.keys(iObj.data.Categories[k]).length > 0) {

                            // _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category };
                            if (iObj.data.Categories[k].Category) {
                                if (_category[iObj.data.Categories[k].Category]) {//if category is already present
                                    if (_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]) {//if topic is already present
                                        //  _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {} };
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = {
                                                Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                            }
                                        }
                                    } else {
                                        _topics[iObj.data.Categories[k].Topic] = {
                                            Name: iObj.data.Categories[k].Topic, skill: {
                                            }, profiLevel: iObj.data.Categories[k].profiLevel
                                        };
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = {
                                                Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                            }
                                        }
                                    }
                                } else {
                                    _category[iObj.data.Categories[k].Category] = {
                                        Name: iObj.data.Categories[k].Category, topic: {}
                                    };
                                    _topics[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                    _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = {
                                        Name: iObj.data.Categories[k].Topic, skill: {
                                        }, profiLevel: iObj.data.Categories[k].profiLevel
                                    };
                                    if (iObj.data.Categories[k].Skill) {
                                        _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = {
                                            Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
                console.error('In getMySelection', _category, _topics, _skills);
                if (Object.keys(_topics).length > 0) {
                    $scope.feedCategoryArray = [];
                }
                for (var _skill in _topics) {
                    $scope.feedCategoryArray.push({ selected: false, name: _skill });
                }
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                if (!$scope.$$phase) $scope.$digest();
            },
            failureCallBack: function (iObj) {
                console.error('In failuregetMySelectionCallBack', iObj);

            }
        });

    };

    $scope.autoSyncCounter = null;
    $scope.stopFight = function () {
        if (angular.isDefined($scope.autoSyncCounter)) {
            $interval.cancel($scope.autoSyncCounter);
            $scope.autoSyncCounter = undefined;
        }
    };


    $scope.autoSyncRoutine = function (iTime) {
        console.error('autoSyncRoutine')
        $scope.autoSyncCounter = $interval(function () {
            console.error('autoSyncRoutine - CallBack -- ')
            if (iTime == _chatMessageTime) {
                console.error('auto sync call for chat Message');
                $scope.conversationLoading();
            } else {
                console.error('auto sync call for conversation');
                $scope.conversationRequest();
            }
        }, iTime);
    };

    $scope.conversationLoading = function () {
        $scope.conversationListNew = [];
        serverCommunication.getConversation({
            Role: "Mentor",
            ConversationType: "Mentoring",
            loggedEmail: $scope.loggedEmail,
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);
                function ObjectId(id) { return id; }
                function ISODate(d) { return d; }

                $scope.conversationListNew = [];
                var _coach = {};
                for (var k = 0; k < iObj.data.Result.length; k++) {
                    if (_coach[iObj.data.Result[k].skill]) {
                        _coach[iObj.data.Result[k].skill].user[iObj.data.Result[k].SenderEmail] = iObj.data.Result[k];
                    } else {
                        _coach[iObj.data.Result[k].skill] = { user: {} };
                        _coach[iObj.data.Result[k].skill].user[iObj.data.Result[k].SenderEmail] = iObj.data.Result[k];
                    }
                }

                // console.error(_coach)
                for (var _key in _coach) {
                    for (var _user in _coach[_key].user) {
                        _coach[_key].user[_user].skillName = _key;
                        _coach[_key].user[_user].sessionClosed = false;
                        $scope.conversationListNew.push(_coach[_key].user[_user]);
                    }
                    //var _con = angular.copy(_coach[_key])
                    // $scope.conversationListNew.push(_con);
                }
                //  $scope.conversationListNew = iObj.data.Result;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                if ($scope.conversationListNew && $scope.conversationListNew.length > 0) {
                    if ($scope.openConversation) {
                        for (var i = 0 ; i < $scope.conversationListNew.length ; i++) {
                            if ($scope.conversationListNew[i].ConversationParentId == $scope.openConversation.ConversationParentId) {
                                $scope.conversationLoad(i, $scope.conversationListNew[i]);
                                break;
                            }
                        }

                    } else {
                        $scope.conversationLoad(0, $scope.conversationListNew[0]);
                    }
                }
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });
    };



    $scope.openConversation = null;
    $scope.conversationLoad = function (iIndex, iCategory) {
        $scope.loadingMessageObject = { showLoading: false, loadingMessage: 'Loading' };
        for (var i = 0 ; i < $scope.conversationListNew.length ; i++) {
            $scope.conversationListNew[i].selectedConversation = false;
        }
        if (iCategory.selectedConversation == true) {
            iCategory.selectedConversation = false;
        } else {
            iCategory.selectedConversation = true;
        }
        $scope.openConversation = iCategory;
        $scope.ReceiverName = iCategory.FirstName + " " + iCategory.LastName;
        $scope.ReceiverEmail = iCategory.EmailAddress;
        //if ($scope.ReceiverEmail !== "") {
        //    $scope.ReceiverName = iCategory.FirstName + " " + iCategory.LastName;
        //    $scope.ReceiverEmail = iCategory.EmailAddress;
        //}
        //else {
        //    $scope.ReceiverName = $scope.conversationListNew[0].FirstName + " " + $scope.conversationListNew[0].LastName;
        //    $scope.ReceiverEmail = $scope.conversationListNew[0].EmailAddress;
        //}

        $scope.showSelectedConversation($scope.loggedEmail, $scope.ReceiverEmail);
    };
    var _getMonthNames = function (iMonth, iFull, iSingleMonth) {
        var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (iFull == 1)
            monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (iSingleMonth)
            return monthArray[iMonth];
        else
            return monthArray;
    };
    var _setPrefixDate = function (iDate) {
        var _prefix = 'th';
        var _fun = function (iVal) {
            switch (iVal) {
                case "1": _prefix = 'st'; break;
                case "2": _prefix = 'nd'; break;
                case "3": _prefix = 'rd'; break;
            }
        };
        if (iDate[1]) {
            if (Number(iDate) >= 11 && Number(iDate) <= 20) {

            } else {
                _fun(iDate[1]);
            }
        } else {
            _fun(iDate[0]);
        }
        return _prefix;
    };
    var _displayDate = function (iDate) {
        var _getDate = {};
        var _date = new Date(iDate);
        var _currentDate = new Date();
        var _yesterdaysDt = new Date();
        _yesterdaysDt.setDate(_yesterdaysDt.getDate() - 1);
        var _prefix = '';
        if (new Date(_date).setHours(0, 0, 0, 0) == new Date(_currentDate).setHours(0, 0, 0, 0)) {
            _prefix = "Today";
        } else if (new Date(_date).setHours(0, 0, 0, 0) == _yesterdaysDt.setHours(0, 0, 0, 0)) {
            _prefix = "Yesterday";
        } else {
            _getDate = _date.getDate().toString();
            _prefix = _setPrefixDate(_getDate);
            _prefix = _date.getDate() + _prefix + " " + _getMonthNames(_date.getMonth(), 1, 1) + "," + _date.getFullYear();
        }
        return _prefix;
    };
    $scope.showSelectedConversation = function (SenderEmail, ReceiverEmail) {
        serverCommunication.getConversationDetails({
            //senderEmail: SenderEmail,
            //receiverEmail: ReceiverEmail,
            ConversationType: "Mentoring",
            ParentId: $scope.openConversation.ConversationParentId,
            successCallBack: function (iObj) {
                console.debug('In showSelectedConversation ----- ', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.MailRecords = []
                var MailRecords = eval('(' + iObj.data.Result + ')');

                $scope.openConversation.sessionClosed = false;
                var _flag = false;
                $scope.timeSlots = [];
                MailRecords.some(function (dd) {
                    if (dd.ConversationClosed || dd.ConversationClosed == 'True') {
                        console.error(dd.ConversationClosed)
                        $scope.openConversation.sessionClosed = true;

                    }
                    dd.displayDate = _displayDate(dd.UpdateDate);
                    if ($scope.timeSlots.length > 0) {
                        _flag = true;
                        for (var j = 0; j < $scope.timeSlots.length; j++) {
                            if (dd.displayDate == $scope.timeSlots[j].displayDate) {
                                _flag = false;
                            }
                        }
                        if (_flag == true) {
                            $scope.timeSlots.push({ displayDate: dd.displayDate, compareDate: dd.UpdateDate });
                            _flag = false;
                        }
                    } else {
                        _flag = false;
                        $scope.timeSlots.push({ displayDate: dd.displayDate, compareDate: dd.UpdateDate });
                    }
                    $scope.MailRecords.push(angular.copy(dd));
                });
                $scope.timeSlots.sort(function (a, b) {
                    a = new Date(a.compareDate);
                    b = new Date(b.compareDate);
                    return a - b;
                });
                $scope.MailRecords.sort(function (a, b) {
                    a = new Date(a.UpdateDate);
                    b = new Date(b.UpdateDate);
                    return a - b;
                });
                $scope.loadingMessageObject = { showLoading: false, loadingMessage: 'Loading' };
                //  console.error('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
                _setScrollPosition();

            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });
    };


    $scope.conversationRequest = function () {
        console.error('Conversation Request Call');
        serverCommunication.getConversationRequest({
            ConversationType: "Mentoring",
            successCallBack: function (iObj) {
                console.debug('Conversation Request Call', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.notificationData = iObj.data.Result;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });

        serverCommunication.getAllMeetingRequest({
            ConversationType: "Mentoring",
            successCallBack: function (iObj) {
                console.debug('In getAllMeetingRequest', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.notificationRequestData = iObj.data.Result;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });

    };

    var _setScrollPosition = function () {
        setTimeout(function () {
            var msgDiv = document.getElementById("messagebox");
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }, 400);

    };
    var _resizeDateFilter = function (iChatMessage) {
        if ($scope.timeSlots.length > 0) {
            _flag = true;
            for (var j = 0; j < $scope.timeSlots.length; j++) {
               
                if (iChatMessage.displayDate == $scope.timeSlots[j].displayDate) {
                    _flag = false;
                }
            }
            if (_flag == true) {
                $scope.timeSlots.push({ displayDate: iChatMessage.displayDate, compareDate: iChatMessage.UpdateDate });
                _flag = false;
            }
        }else{
            _flag = false;
            $scope.timeSlots.push({ displayDate: iChatMessage.displayDate, compareDate: iChatMessage.UpdateDate });
        }
    };
    var _sortArray = function () {
        $scope.timeSlots.sort(function (a, b) {
            a = new Date(a.compareDate);
            b = new Date(b.compareDate);
            return a - b;
        });
        $scope.MailRecords.sort(function (a, b) {
            a = new Date(a.UpdateDate);
            b = new Date(b.UpdateDate);
            return a - b;
        });
    };
    $scope.conversationClick = function (iEvent, iClickFlag) {
        iEvent && iEvent.stopPropagation();
        console.error(arguments)
        if ($scope.conversation.Message.trim() == '') {
            return;
        }
        if ((iEvent && iEvent.keyCode == 13) || iClickFlag) {
            if ($scope.openConversation) {

                $scope.conversation.ReceiverEmail = $scope.openConversation.SenderEmail;
                $scope.conversation.SenderEmail = $scope.loggedEmail;
                $scope.conversation.Content = $scope.conversation.Message;
                $scope.conversation.SendOrReceive = "Send";
                $scope.conversation.IsVerified = true;
                $scope.conversation.isRead = false;
                var _parentId = $scope.openConversation.ConversationParentId ? $scope.openConversation.ConversationParentId : $scope.openConversation.ConversationId;
                if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
                    return false;
                var _id = _parentId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                var _object = {
                    Content: $scope.conversation.Content,
                    SenderEmail: $scope.conversation.SenderEmail,
                    ReceiverEmail: $scope.conversation.ReceiverEmail,
                    SendOrReceive: $scope.conversation.SendOrReceive,
                    IsVerified: $scope.conversation.IsVerified,
                    ConversationClosed: false,
                    ConversationType: "Mentoring",
                    Skill: $scope.openConversation.skill,
                    ConversationId: _id,
                    ConversationParentId: _parentId,
                }
                // console.debug(_object);
                var _replica = angular.copy(_object);
                _replica.UpdateDate = new Date();
              //  _replica.UpdateDate.setDate(6);
                _replica.UpdateDate = _replica.UpdateDate.toJSON();
                _replica.displayDate = _displayDate(_replica.UpdateDate);
                _resizeDateFilter(_replica);
                $scope.MailRecords.push(_replica);
                _sortArray();
                _setScrollPosition();
                // $scope.MailRecords.push(_object);
                serverCommunication.sendConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.ReceiverName,
                    Role: 'Mentee',
                    successCallBack: function () {
                        $scope.conversation.Message = "";

                        console.debug('In successCallBack');

                    },
                    failureCallBack: function () {

                        $scope.conversation.Message = "";

                        console.debug('In failureCallBack');
                    }
                });
            }
        }
    };

    $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail, iNotificationDash) {
        $scope.conversation.IsVerified = isVerfied;
        console.error(iNotificationDash);
        var contentText = "";
        if (isVerfied != false)
            contentText = 'MENTORING REQUEST BY ' + $scope.ApprovalName + ' HAS BEEN ACCEPTED';
        else
            contentText = null;
        var _id = iNotificationDash.ConversationId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
        var _object = {
            SenderEmail: SenderEmail,
            ReceiverEmail: ReceiverEmail,
            Content: contentText,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            ConversationType: "Mentoring",
            Skill: iNotificationDash.skill,
            ConversationId: _id,
            ConversationParentId: iNotificationDash.ConversationId,
        }

        //   return
        serverCommunication.updateConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ApprovalName,
            Role: 'Mentee',
            successCallBack: function () {
                //$scope.menuClick(5, "CONVERSATIONS");               
                console.debug('In successCallBack');

            },
            failureCallBack: function (e) {
                console.debug('In failureCallBack' + e);
            }
        });
    };

    $scope.saveSchedular = function (isVerified, emailId) {
        console.log("Test");
        $scope.MeetingSchedular.SenderEmail = $scope.loggedEmail;
        if (emailId != "")
            $scope.MeetingSchedular.ReceiverEmail = $scope.ReceiverEmail;
        else
            $scope.MeetingSchedular.ReceiverEmail = emailId;

        $scope.MeetingSchedular.Subject = $scope.MeetingSchedular.Subject;
        $scope.MeetingSchedular.MeetingDate = $scope.MeetingSchedular.MeetingDate;
        $scope.MeetingSchedular.TimeFrom = $scope.MeetingSchedular.TimeFrom;
        $scope.MeetingSchedular.TimeTo = $scope.MeetingSchedular.TimeTo;
        $scope.MeetingSchedular.PlatformType = $scope.MeetingSchedular.PlatformType;
        $scope.MeetingSchedular.UserId = $scope.MeetingSchedular.UserId;
        $scope.MeetingSchedular.Role = "Mentor";

        $scope.MeetingSchedular.IsVerified = isVerified;

        if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
            return false;

        var _object = {
            SenderEmail: $scope.MeetingSchedular.SenderEmail,
            ReceiverEmail: $scope.MeetingSchedular.ReceiverEmail,
            Subject: $scope.MeetingSchedular.Subject,
            MeetingDate: $scope.MeetingSchedular.MeetingDate,
            TimeFrom: $scope.MeetingSchedular.TimeFrom,
            TimeTo: $scope.MeetingSchedular.TimeTo,
            PlatformType: $scope.MeetingSchedular.PlatformType,
            UserId: $scope.MeetingSchedular.UserId,
            Role: $scope.MeetingSchedular.Role,
            IsVerified: $scope.MeetingSchedular.IsVerified
        }
        console.log(_object);

        serverCommunication.saveMeeting({
            loggedUserDetails: _object,
            successCallBack: function () {
                console.log('In successCallBack');
                $scope.myMeetingSchedular.close();
            },
            failureCallBack: function () {
                console.log('In failureCallBack');

            }
        });
    };

    $scope.updateMeeting = function (isVerfied, SenderEmail, ReceiverEmail, Role) {
        $scope.conversation.IsVerified = isVerfied;

        var _object = {
            SenderEmail: SenderEmail,
            ReceiverEmail: ReceiverEmail,
            Role: Role,
            IsVerified: $scope.conversation.IsVerified
        }

        serverCommunication.updateMeeting({
            loggedUserDetails: _object,
            ReceiverName: $scope.ApprovalName,
            Reason: "",
            successCallBack: function () {
                console.debug('In successCallBack');
                $scope.conversationRequest();
            },
            failureCallBack: function (e) {
                console.debug('In failureCallBack' + e);
            }
        });
    };

    $scope.init = function () {
        console.error($scope.passedData)
        $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading' };
        if ($scope.passedData && $scope.passedData.param) {
            $scope.selectedMenu = '6';
        } else {
            $scope.selectedMenu = '0';
            // $scope.conversationStartData($scope.loggedEmail);
            $scope.conversationRequest();
            $scope.autoSyncRoutine(_conversationTime);
        }
    };

    $scope.init();
    /*END: Conversation Module Code*/

    $scope.$on("$destroy", function handleDestroyEvent() {
        $scope.stopFight();
    });

});