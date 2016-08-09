app.controller('ksDashBoardMenteeController', function ($rootScope, $scope, serverCommunication, $interval, $state) {
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ];
    $scope.navigateToProfile = function () {
        $state.go('profile');
    };
    $scope.selectedMenu = '0';
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                 //, { name: 'MENTORING STATUS' }
                 , { name: 'KNOWLEDGE GARDEN' }
                 , { name: 'SELECT TOPICS' }
                  , { name: 'SEARCH MENTOR' }
                   , { name: 'KNOWLEDGE FEED' }
                 , { name: 'COMMUNICATION' }

               //  , { name: 'RESOURCES' }

                 , { name: 'MY REWARDS' }
                 //, { name: 'ADD TOPICS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
               { name: 'SELECT TOPICS', url: '../../Images/icons/coaching_status.png ' },
                { name: 'SEARCH MENTOR', url: '../../Images/icons/search_mentor_coach.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' }
    ];

    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
    $scope.conversation = {};
    $scope.ReceiverName = "";



    $scope.availableSkills = [];
    $scope.searchKey = '';
    $scope.searching = false;
    $scope.selectedSkill = {};
    $scope.skillFilter = function (skill) {
        var regExp = new RegExp($scope.searchKey, 'i');
        return !$scope.searchKey || regExp.test(skill.Name);
    };

    $scope.selectSkill = function (skill) {
        $scope.selectedSkill = skill;
        $scope.searchKey = skill.Name;
        $scope.searching = false;
        serverCommunication.getCoaches({
            filter: skill,
            Role: 'Mentor',
            successCallBack: function (result) {
                console.log('Result - ', result);
                if (result.data)
                    $scope.Coaches = [].concat(result.data);
            },
            failureCallBack: function () {
                console.error('In failureCallBack');
            }
        });
    };

    $scope.clearSearch = function (skill) {
        $scope.searchKey = '';
        $scope.selectedSkill = {};
        $scope.searching = true;
    }
    var _chatMessageTime = 30000;
    var _conversationTime = 60000;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray = [];
        $scope.stopFight();
        switch (iIndex) {
            case 0: $scope.autoSyncRoutine(_conversationTime); $scope.conversationRequest(); break;
            case 1: $scope.generateGarden(); break;
            case 3: $scope.getCoachRecord(); break;
            case 4: $scope.getRssFeedData(); break;
            case 5: $scope.autoSyncRoutine(_chatMessageTime); $scope.conversationLoading(); break;
          //  case 6: $scope.getPointsRecord(); break;
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
            loggedUserDetails: $rootScope.loggedDetail,
            role: 'mentee',
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

            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
    };
    $scope.Coaches = [];
    $scope.getCoachRecord = function () {
        serverCommunication.getRecommendedCoach({
            Role: 'Mentor',
            successCallBack: function (result) {
                console.error(result);
                var _mySkill = [];
                if ($rootScope.loggedDetail.coachee) {
                    for (var _key in $rootScope.loggedDetail.coachee.skills) {
                        _mySkill.push(_key);
                    }
                    // _mySkill = [].concat(angular.copy($rootScope.loggedDetail.coachee.skills));
                }
                if (result.data) {
                    $scope.timeSlots = [];
                    var _coachFinalArr = [];
                    for (var k = 0; k < result.data.length; k++) {

                        for (var i = 0; i < result.data[k].Topics.length; i++) {
                            var _coach = angular.copy(result.data[k]);
                            _coach.Skill = {};
                            _coach.Skill = angular.copy(result.data[k].Topics[i]);
                            //  _coach.Skill = Object.assign(_coach.Skill, result.data[k].Skills[i]);
                            if ($scope.timeSlots.length > 0) {
                                $scope.flag = true;
                                var _index = $scope.timeSlots.indexOf(result.data[k].Topics[i].Name);
                                if (_index > -1) {
                                    $scope.flag = false;
                                }
                                if ($scope.flag == true) {
                                    $scope.timeSlots.push(result.data[k].Topics[i].Name);
                                    $scope.flag = false;
                                }
                            } else {
                                $scope.flag = false;
                                $scope.timeSlots.push(result.data[k].Topics[i].Name);
                            }
                            _coachFinalArr.push(_coach);
                        }

                    }

                    console.error(_coachFinalArr, $scope.timeSlots)
                    $scope.Coaches = [].concat(_coachFinalArr);
                }
                serverCommunication.getCTSFilters({
                    Role: 'Mentor',
                    successCallBack: function (iResult) {
                        console.error(iResult)
                        iResult.data.Filters.some(function (iCts) {
                            if (iCts.Type == 2) {
                                $scope.availableSkills.push(iCts);
                            }
                        });
                        // $scope.availableSkills.splice(0, $scope.availableSkills.length);
                        //$scope.availableSkills.push.apply($scope.availableSkills, result.data.Filters);
                    },
                    failureCallBack: function () {
                        // console.error('In failureCallBack');

                    }
                });
            },
            failureCallBack: function () {
                // console.error('In failureCallBack');

            }
        });
    };
    $scope.generateGarden = function () {
        $scope.ctsDataForMolecule = null;
        serverCommunication.getCoachingWithStatus({
            loggedUserDetails: $rootScope.loggedDetail,
            role: 'mentee',
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

            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
    };
    $scope.feedBack = {}
    $scope.feedBack.askFeedback = false;
    $scope.feedBack.formValue = '0';
    $scope.feedBack.icloseFeedBack = false;
    $scope.askFeedBackFunc = function (icloseFeedBack) {
        $scope.feedBack.askFeedback = true;
        $scope.feedBack.formValue = '1';
        $scope.feedBack.icloseFeedBack = false;
        $scope.feedBackloaded = { showLoad: false };
       // $scope.loadSlideData(1);
    }
    $scope.array = [
        { name: 'Was the sessions objective achieved ?  ', actionValue: '', type: 'rating', showLoad: false },
            {name: 'Was the session as per plan ? Was this session fine-tuned based on your previous session feedback ?', actionValue: '1', type: 'radio', showLoad: false},
                {name: 'What should have been avoided / What should have been better ? Describe ', actionValue: '', type: 'textArea', showLoad: false},
                        {name: 'What was best about the session ? Describe  ', actionValue: '', type: 'textArea', showLoad: false},
                        {name: ' Is the Mentor using the best practice of - continuous review and improvement ? ', actionValue: '', type: 'radio', showLoad: false},
                        {name: 'Did you gain in confidence after the session ?', actionValue: '', type: 'radio', showLoad: false},
                        {name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '',},
                            {name: ' Rate the session ', sessionRating: true, type: 'rating', showLoad: false, actionValue: '',},
    ];

   
    $scope.feedBack.closeFeedBackPopup = function () {
        $scope.feedBack.askFeedback = false;
        $scope.feedBack.formValue = '1';

    };


    $scope.redeemPointsClick = function () {

        $scope.feedBack.closeFeedBackPopup();
        serverCommunication.unlockGameCode({
            //   loggedUserDetails: $rootScope.loggedDetail,
            redeemAction: $scope.redeemAction,
            successCallBack: function (iObj) {
                $scope.menuClick(6);
                console.error('In successCallBack', iObj);

            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
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
        $scope.feedCategoryArray = [];
        serverCommunication.getMyMenteeSelection({
            successCallBack: function (iObj) {
                console.error('In getMySelection', iObj);
                _category = {};
                _topics = {};
                _skills = {};
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
                if (!$scope.$$phase) $scope.$digest();
            },
            failureCallBack: function (iObj) {
                console.error('In failuregetMySelectionCallBack', iObj);

            }
        });

    };
    //$scope.getCoachRecord = function () {
    //    serverCommunication.getCoachingWithStatus({
    //        loggedUserDetails: $rootScope.loggedDetail,
    //        successCallBack: function (iObj) {
    //            console.error('In successCallBack', iObj);

    //        }
    //    }
    //    }
    //            console.error('In getMySelection', _category, _topics, _skills);
    //            if (Object.keys(_topics).length > 0) {
    //                $scope.feedCategoryArray = [];
    //            }
    //            for (var _skill in _topics) {
    //                $scope.feedCategoryArray.push({ selected: false, name: _skill });
    //            }
    //            if (!$scope.$$phase) $scope.$digest();
    //        },
    //        failureCallBack: function (iObj) {
    //            console.error('In failuregetMySelectionCallBack', iObj);

    //        }
    //    });

    //};
    /*START: Conversation Module Code*/

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
            loggedEmail: $scope.loggedEmail,
            Role: "Mentee",
            ConversationType : 'Mentoring',
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
                        $scope.conversationListNew.push(_coach[_key].user[_user]);
                    }
                    //var _con = angular.copy(_coach[_key])
                    // $scope.conversationListNew.push(_con);
                }
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

    $scope.showSelectedConversation = function (SenderEmail, ReceiverEmail) {
        serverCommunication.getConversationDetails({
            //senderEmail: SenderEmail,
            //receiverEmail: ReceiverEmail,
            ConversationType: "Mentoring",
            ParentId: $scope.openConversation.ConversationParentId,
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }
                $scope.MailRecords = []
                var MailRecords = eval('(' + iObj.data.Result + ')');
                console.error(MailRecords);
                $scope.openConversation.sessionClosed = false;
                MailRecords.some(function (dd) {
                    if (dd.ConversationClosed || dd.ConversationClosed == 'True') {
                        console.error(dd.ConversationClosed)
                        $scope.openConversation.sessionClosed = true;
                        console.error('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
                    }
                    $scope.MailRecords.push(angular.copy(dd));
                });
                $scope.MailRecords.sort(function (a, b) {
                    a = new Date(a.UpdateDate);
                    b = new Date(b.UpdateDate);
                    return a - b;
                });
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });
    };


    $scope.conversationRequest = function () {

        serverCommunication.getConversationRequest({
            successCallBack: function (iObj) {
                console.debug('In successCallBack getConversationRequest', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.notificationData = iObj.data.Result;
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });

        serverCommunication.getAllMeetingRequest({
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.notificationRequestData = iObj.data.Result;
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });

    };
    $scope.displayAlert = {
        showAlert: false,
        message: '',
        formatType: '1'
    };
    $scope.sendCoachingRequest = function (isVerified, iCoach) {

        $scope.conversation.SenderEmail = $scope.loggedEmail;
        var _emailId = iCoach.EmailAddress;
        if (_emailId != "")
            $scope.ReceiverEmail = $scope.conversation.ReceiverEmail = _emailId;
        else
            $scope.conversation.ReceiverEmail = $scope.ReceiverEmail;

        $scope.conversation.Content = null;
        $scope.conversation.SendOrReceive = "Send";
        $scope.conversation.IsVerified = isVerified;
        $scope.conversation.isRead = false;

        if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
            return false;
        var _id = $rootScope.loggedDetail.EmailAddress + ":CON#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
        var _object = {
            Content: $scope.conversation.Content,
            SenderEmail: $scope.conversation.SenderEmail,
            ReceiverEmail: $scope.conversation.ReceiverEmail,
            SendOrReceive: $scope.conversation.SendOrReceive,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            ConversationId: _id,
            ConversationType: "Mentoring",
            skill: iCoach.Skill.Name
        }
        console.debug(_object);
        serverCommunication.sendConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.conversation.ReceiverEmail,
            Role: 'Mentee',
            successCallBack: function (iObj) {
                $scope.conversation.Message = "";
                console.error(iObj)
                if (iObj.data && iObj.data && iObj.data.Message && iObj.data.Message != '') {
                    $scope.displayAlert.showAlert = true;
                    $scope.displayAlert.message = iObj.data.Message;
                    $scope.displayAlert.formatType = '1';
                }
            },
            failureCallBack: function () {
                $scope.conversation.Message = "";
                console.debug('In failureCallBack');
            }
        });

    };
    $scope.conversationClick = function (isVerified, iCoach) {

        if ($scope.openConversation) {

            $scope.conversation.ReceiverEmail = $scope.openConversation.ReceiverEmail;
            $scope.conversation.SenderEmail = $scope.loggedEmail;
            $scope.conversation.Content = $scope.conversation.Message;
            $scope.conversation.SendOrReceive = "Send";
            $scope.conversation.IsVerified = isVerified;
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
                //"8/7/2016"
                // CreateDate: (new Date().getMonth()+1)+"/"+new Date().getDate()+
                //UpdateDate: "2016-08-07T11:58:13.867Z"
                ConversationId: _id,
                ConversationParentId: _parentId,
            }

            //   console.debug(_object);
            var _replica = angular.copy(_object)
            _replica.UpdateDate = new Date().toJSON();
            $scope.MailRecords.push(_replica);
            //  console.error($scope.MailRecords)
            //  return;
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

    };

    $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail, iNotificationDash) {
        $scope.conversation.IsVerified = isVerfied;
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
            //"8/7/2016"
            // CreateDate: (new Date().getMonth()+1)+"/"+new Date().getDate()+
            //UpdateDate: "2016-08-07T11:58:13.867Z"
            ConversationId: _id,
            ConversationParentId: iNotificationDash.ConversationId,
        }

        serverCommunication.updateConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ApprovalName,
            Role: 'Mentee',
            successCallBack: function () {
                //  $scope.menuClick(5, "CONVERSATIONS");
                //   $scope.showSelectedConversation($scope.loggedEmail, $scope.ApprovalName);
                //  console.debug('In successCallBack');

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
        $scope.MeetingSchedular.Role = "Mentee";

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

    //$scope.conversationStartData($scope.loggedEmail);
    //$scope.conversationRequest();
    /*END: Conversation Module Code*/

    $scope.$on("$destroy", function handleDestroyEvent() {
        $scope.stopFight();
    });
    $scope.init = function () {

        $scope.conversationRequest();
        $scope.autoSyncRoutine(_conversationTime);
        serverCommunication.getCTSFilters({
            Role: 'Mentor',
            successCallBack: function (result) {
                console.error(result)
                result.data.Filters.some(function (iCts) {
                    if (iCts.Type == 1) {
                        $scope.availableSkills.push(iCts);
                    }
                });
                // $scope.availableSkills.splice(0, $scope.availableSkills.length);
                //$scope.availableSkills.push.apply($scope.availableSkills, result.data.Filters);
            },
            failureCallBack: function () {
                // console.error('In failureCallBack');

            }
        });
    };
    $scope.init();
});