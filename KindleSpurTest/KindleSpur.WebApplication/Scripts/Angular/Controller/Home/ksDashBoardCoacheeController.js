app.controller('ksDashBoardCoacheeController', function ($rootScope, $scope, serverCommunication, $interval, $state) {
    window.cocc = $scope;
    $rootScope.currentModule = 'Coachee';
    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
    $scope.conversation = { Message: '' };
    $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
    $scope.ReceiverName = "";
    $scope.navigateToProfile = function () {
        $state.go('home.dashBoard.profile');
    };
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
                { notificationType: '3', name: 'MOHAN N.', profileImage: '' }
    ];
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                   //, { name: 'COACHING STATUS' }
                   , { name: 'KNOWLEDGE GARDEN' }
                   , { name: 'SELECT SKILLS' }
                    , { name: 'SEARCH COACH' }
                     , { name: 'KNOWLEDGE FEED' }
                   , { name: 'COMMUNICATION' }
               //    , { name: 'KNOWLEDGE FEED' }
                 //  , { name: 'RESOURCES' }
                  // , { name: 'SEARCH COACH' }
                   , { name: 'MY REWARDS' }
                     , { name: 'RESOURCES' }
                   // , { name: 'ADD SKILLS' }
    ];
    $scope.rightSideDashBoardArray = [
                { name: 'SELECT SKILLS', url: '../../Images/icons/coaching_status.png' },
               { name: 'SEARCH COACH', url: '../../Images/icons/search_mentor_coach.png  ' },
               { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png' },
               { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
               { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' },
               { name: 'RESOURCES', url: '../../Images/icons/resources1.png ' }


    ];
    $scope.displayAddress = function (iObj) {
        var _str = 'Location not available';
        if (iObj.City)
            _str = iObj.City + " ";
        if (iObj.State)
            _str += iObj.State + " ";
        if (iObj.Country)
            _str += iObj.Country + " ";
        console.error(_str);
      return _str;
    };
    //$scope.leftSideMenus = [{ name: 'DASHBOARD' },
    //                        { name: 'COACHING STATUS' },
    //                        { name: 'KNOWLEDGE GARDEN' },
    //                        { name: 'COMMUNICATION' },
    //                        { name: 'GRAPHS' },
    //                        { name: 'RESOURCES' },
    //                        { name: 'FIND COACH' }
    //];

    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }];
    $scope.showCoacheeProfile = false;
    $scope.userInfo = null;
    $scope.opencoachprofile = function (iOption) {
        $scope.showCoacheeProfile = true;
        $scope.userInfo = iOption;
        console.log(iOption)
    };
    

    $scope.closeProfilePic = function () {
        console.error('closeProfilePopup')
        $scope.showCoacheeProfile = false;
        $scope.userInfo = null;
    };
    $scope.Coaches = [];

    $scope.selectedMenu = 0;
    var _chatMessageTime = 30000;
    var _conversationTime = 60000;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.stopFight();
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray =[];
        $scope.loadingMiddleObject = { showLoading: true, loadingMessage: 'Loading' };
        switch (iIndex) {
            case 0: $scope.conversationRequest();  $scope.autoSyncRoutine(_conversationTime); break;
            case 4: $scope.getRssFeedData(); break;
            case 3: $scope.getCoachRecord(); break;
            case 1: $scope.generateGarden(); break;
                //case 6: $scope.getPointsRecord(); break;
            case 5: $scope.conversationLoading(); $scope.autoSyncRoutine(_chatMessageTime); break;
                //case 5:
                //    if ($scope.conversationListNew.length > 0) {
                //        $scope.ReceiverName = $scope.conversationListNew[0].FirstName + " " + $scope.conversationListNew[0].LastName;
                //        $scope.ReceiverEmail = $scope.conversationListNew[0].EmailAddress;
                //        $scope.conversationStartData($scope.loggedEmail);
                //        $scope.showSelectedConversation($scope.loggedEmail, $scope.ReceiverEmail);
                //    }
                //    break;
            case 2:
            case 7:
            case 6 : $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' }; break;
        }
    };
    $scope.selectedOption = function (iIndex, iCate) {
        for (var k = 0; k < $scope.leftSideMenus.length; k++) {
            if ($scope.leftSideMenus[k].name == iCate.name) {
                $scope.menuClick(k, $scope.leftSideMenus[k]);
            }
        }
    };
    $scope.feedBack = {}
    $scope.feedBack.askFeedback = false;
    $scope.feedBack.formValue = '0';
    $scope.feedBack.icloseFeedBack = false;
    $scope.feedBack.feedBackType = 'feedBack';
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
        //$scope.loadSlideData(1);
    }
    var _array = [
      { name: 'Was the sessions objective achieved ?  ', actionValue: '', type: 'rating', showLoad: false },
       { name: 'Was the session as per plan ? Was this session fine-tuned based on your previous session feedback ?', actionValue: '1', type: 'radio', showLoad: false },
       { name: 'What should have been avoided / What should have been better ? Describe ', actionValue: '', type: 'textArea', showLoad: false },
       { name: 'What was best about the session ? Describe  ', actionValue: '', type: 'textArea', showLoad: false },
       { name: ' Is the Mentor using the best practice of - continuous review and improvement ? ', actionValue: '', type: 'radio', showLoad: false },
       { name: 'Did you gain in confidence after the session ?', actionValue: '', type: 'radio', showLoad: false },
       { name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '', },
       { name: ' Rate the session ', sessionRating: true, type: 'rating', showLoad: false, actionValue: '', },
    ];
    var _arrayCloseSession = [
         { name: 'Have you gained from this program ?', actionValue: '', type: 'radio', showLoad: false },
         { name: 'Did you achieve all your stated objectives ?', actionValue: '1', type: 'radio', showLoad: false },
         { name: 'Did the Mentor/ Coach share any practically useful content (notes/docs/ppts/images/others) ?', actionValue: '', type: 'radio', showLoad: false },
         { name: 'How did you know about KindleSpur ?', actionValue: '', type: 'radio', showLoad: false },
         { name: 'Would you like to refer anyone to try KindleSpur ?', actionValue: '', type: 'radio', showLoad: false },
         { name: 'Would you take Mentoring/ Coaching again at KindleSpur (for another Objective/ Goal) ?', actionValue: '', type: 'radio', showLoad: false },
         { name: 'Overall rating for Mentor/ coach. ', type: 'rating', showLoad: false, actionValue: '', },
         { name: 'Overall rating for KindleSpur. ', sessionRating: true, type: 'rating', showLoad: false, actionValue: '', },
    ];
    var _presessionQuestion = [
       { name: 'What is the ultimate goal you want to accomplish by the end of this coaching/ mentoring session?', actionValue: '', type: 'textArea', showLoad: false },
       { name: 'Any issue/challenge/problem you would like your coach/mentor to work with you on it? Any steps your have taken so far to tackle these problem areas?', actionValue: '', type: 'textArea', showLoad: false },
       { name: 'Your preferred time and mode of communication', actionValue: '', type: 'checkBoxTime', showLoad: false },
       { name: 'Five attributes that you would like your coach/ mentor to know about you', actionValue: '', type: 'textArea', showLoad: false },
    ];
    $scope.feedBack.closeFeedBackPopup = function () {
        $scope.feedBack.askFeedback = false;
        $scope.feedBack.formValue = '1';
        $scope.feedBack.icloseFeedBack  = false;

    };


    $scope.redeemPointsClick = function () {

        $scope.feedBack.closeFeedBackPopup();
        $scope.menuClick(6);
    };

    $scope.feedBackSave = function () {
        $scope.menuClick(6);
    };
    $scope.closeCallBack = function () {
        $scope.feedBack.closeFeedBackPopup()
    };

    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
       // $scope.feedCategoryArray = [];
        serverCommunication.getMyCoacheeSelection({
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
                if (Object.keys(_skills).length > 0) {
                    $scope.feedCategoryArray = [];
                }
                for (var _skill in _skills) {
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
    $scope.availableSkills = [];
    $scope.searchKey = '';
    $scope.searching = false;
    $scope.selectedSkill = {};
    $scope.conversationList = [{ name: 'HARSHADA D' }
              , { name: 'SAGAR N' }
              , { name: 'SAGAR P' }
              , { name: 'MAYUR' }

    ]
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
            role: 'Coach',
            successCallBack: function (result) {
                console.log('Result - ', result);
                if (result.data) {
                    _createCoachArray(result);
            }
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
    $scope.generateGarden = function () {
        $scope.ctsDataForMolecule = null;
        serverCommunication.getCoachingWithStatus({
            loggedUserDetails: $rootScope.loggedDetail,
            role : 'coachee',
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

    var _createCoachArray = function (iResult) {
            $scope.timeSlots =[];
            var _coachFinalArr =[];
            for (var k = 0; k < iResult.data.length; k++) {
                for (var i = 0; i < iResult.data[k].Skills.length; i++) {
                    var _coach = angular.copy(iResult.data[k]);
                    _coach.Skill = { };
                    _coach.Skill = angular.copy(iResult.data[k].Skills[i]);
                        //  _coach.Skill = Object.assign(_coach.Skill, result.data[k].Skills[i]);
                    if ($scope.timeSlots.length > 0) {
                        $scope.flag = true;
                        var _index = $scope.timeSlots.indexOf(iResult.data[k].Skills[i].Name);
                        if (_index > -1) {
                            $scope.flag = false;
                        }
                        if ($scope.flag == true) {
                            $scope.timeSlots.push(iResult.data[k].Skills[i].Name);
                            $scope.flag = false;
                        }
                    } else {
                        $scope.flag = false;
                        $scope.timeSlots.push(iResult.data[k].Skills[i].Name);
                    }
                    _coach.showLoad = false;
                    _coachFinalArr.push(_coach);
                }
            }
            console.error(_coachFinalArr, $scope.timeSlots)
            $scope.Coaches = [].concat(_coachFinalArr);
            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            setTimeout(function () {
                for (var k = 0; k < $scope.Coaches.length; k++) {
                       $scope.Coaches[k].showLoad = true;
                }

                $scope.$apply();
            }, 500);
    };

    $scope.getCoachRecord = function () {
        serverCommunication.getRecommendedCoach({
            Role: 'Coach',
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
                    _createCoachArray(result);
                  //  $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                }
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                serverCommunication.getCTSFilters({
                    Role: 'Coach',
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


    /*START: Conversation Module Code*/


    $scope.objectForResourceTab = { deleteIcon: true, AttachMode: false, headingRequired: true, closeRequired: false, styleUI: { top: { 'height': '7%' }, middle: { 'height': '93%' }, bottom: {} } };
    var _afterAddCallBack = function (iObj) {
        //console.error('_afterAddCallBack --- ', iObj);
        $scope.conversation.SenderEmail = $scope.loggedEmail;
        $scope.conversation.Content = null;
        $scope.conversation.SendOrReceive = "Send";
        $scope.conversation.IsVerified = true;
        $scope.conversation.isRead = false;
        var _parentId = $scope.openConversation.ConversationParentId ? $scope.openConversation.ConversationParentId : $scope.openConversation.ConversationId;
        if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
            return false;
        var _id = _parentId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
        var _array = [];

        if (iObj.selectedData['Artifact']) {
            for (var _key in iObj.selectedData['Artifact']) {
                _array.push(iObj.selectedData['Artifact'][_key]);
            }
        }
        if (iObj.selectedData['bookMark']) {
            for (var _key in iObj.selectedData['bookMark']) {
                _array.push(iObj.selectedData['bookMark'][_key]);
            }
        }

        console.error(_array)
        var _object = {
            Content: iObj.message,
            SenderEmail: $scope.conversation.SenderEmail,
            ReceiverEmail: $scope.openConversation.ReceiverEmail,
            SendOrReceive: $scope.conversation.SendOrReceive,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            messageType: 'media',
            messages: _array,
            ConversationType: "Coaching",
            Skill: $scope.conversation.skill,
            //"8/7/2016"
            // CreateDate: (new Date().getMonth()+1)+"/"+new Date().getDate()+
            //UpdateDate: "2016-08-07T11:58:13.867Z"
            ConversationId: _id,
            ConversationParentId: _parentId,
        }

        //   console.debug(_object);
        var _replica = angular.copy(_object);
        _replica.UpdateDate = new Date();
        //  _replica.UpdateDate.setDate(6);
        _replica.UpdateDate = _replica.UpdateDate.toJSON();
        _replica.displayDate = _displayDate(_replica.UpdateDate);
        _resizeDateFilter(_replica);
        $scope.MailRecords.push(_replica);
        _object.FilesURLlink = [].concat(_array);
        serverCommunication.sendConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ReceiverName,
            Role: 'Coachee',
            successCallBack: function () {
                $scope.conversation.Message = "";

                console.debug('In successCallBack');

            },
            failureCallBack: function () {

                $scope.conversation.Message = "";

                console.debug('In failureCallBack');
            }
        });
    };


    $scope.loadAttachment = function () {
        $rootScope.$broadcast("refreshStateHomeView", {
            type: 'loadUpperSlider',
            subType: 'Attachment',
            data: {
                headingRequired: true, closeRequired: true, headingTitle: ('Send to ' + ($scope.openConversation.FirstName + " " + $scope.openConversation.LastName)),
                AttachMode: true, role: 'Mentee', afterAddCallBack: _afterAddCallBack, deleteIcon: false,
                styleUI: { chat: { 'height': '15%', 'background-color': 'white' }, top: { 'height': '12%', 'background-color': 'white' }, middle: { 'height': '59%', 'background-color': 'white' }, bottom: { 'height': '12%', 'background-color': 'white' } }
            }
        });
    };
    $scope.scheduleMeeting = function () {
        $rootScope.$broadcast("refreshStateHomeView", {
            type: 'loadUpperSlider',
            subType: 'Meeting',
            data: {
                headingRequired: true, closeRequired: true, headingTitle: ('Send to ' + ($scope.openConversation.FirstName + " " + $scope.openConversation.LastName)),
                AttachMode: true, role: 'Mentee', afterAddCallBack: _afterAddCallBack, deleteIcon: false,
                styleUI: { chat: { 'height': '15%', 'background-color': 'white' }, top: { 'height': '12%', 'background-color': 'white' }, middle: { 'height': '59%', 'background-color': 'white' }, bottom: { 'height': '12%', 'background-color': 'white' } }
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
      //  console.error('ge');
        $scope.conversationListNew = [];
        serverCommunication.getConversation({
            loggedEmail: $scope.loggedEmail,
            Role: "Coachee",
            ConversationType: 'Coaching',
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
        $scope.loadingMessageObject = { showLoading: true, loadingMessage: 'Loading' };
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
        var _fun = function(iVal) {
            switch(iVal) {
                  case "1": _prefix = 'st'; break;
                  case "2": _prefix = 'nd'; break;
                  case "3": _prefix = 'rd'; break;
                  }
        };
        if(iDate[1]) {
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
            ConversationType: "Coaching",
           
            ParentId: $scope.openConversation.ConversationParentId,
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }
            //    console.debug(ParentId)
                $scope.MailRecords = []
                var MailRecords = eval('(' + iObj.data.Result + ')');
                console.error(MailRecords);
                $scope.openConversation.sessionClosed = false;
                var _flag = false;
                $scope.timeSlots = [];
                MailRecords.some(function (dd) {
                    if (dd.ConversationClosed || dd.ConversationClosed == 'True') {
                        console.error(dd.ConversationClosed)
                        $scope.openConversation.sessionClosed = true;

                    } else {

                    }
                    if (dd.SenderEmail == $scope.loggedEmail) {
                        dd.Name = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
                        dd.Photo = $rootScope.loggedDetail.Photo;
                    } else {
                        dd.Name = $scope.openConversation.FirstName + " " + $scope.openConversation.LastName;
                        dd.Photo = $scope.openConversation.Photo;
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
                            $scope.timeSlots.push({ displayDate: dd.displayDate, compareDate: dd.UpdateDate
                        });
                            _flag = false;
                    }
                    } else {
                        _flag = false;
                        $scope.timeSlots.push({ displayDate: dd.displayDate, compareDate: dd.UpdateDate
                    });
                }
                    $scope.MailRecords.push(angular.copy(dd));
                });
                $scope.timeSlots.sort(function(a, b) {
                    a = new Date(a.compareDate);
                    b = new Date(b.compareDate);
                    return a -b;
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

        serverCommunication.getConversationRequest({
            successCallBack: function (iObj) {
                console.debug('In successCallBack getConversationRequest', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.notificationData = iObj.data.Result;
                $scope.loadingMessageObject = { showLoading: false, loadingMessage: 'Loading' };
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
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
                console.debug('In failureCallBack', iObj);
            }
        });

    };

    var _displayAlertMeesage = function (iObj) {
        var _displayAlert = {
            showAlert: true,
            message: iObj.message,
            formatType:  iObj.formatType,
        };
        $rootScope.$broadcast("refreshStateHomeView", {
            type: 'displayAlert',
           // subType: 'Meeting',
            data: _displayAlert
        });
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
            ConversationType: "Coaching",
            skill: iCoach.Skill.Name
        }
        console.debug(_object);
        serverCommunication.sendConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.conversation.ReceiverEmail,
            Role: 'Coachee',
            successCallBack: function (iObj) {
                $scope.conversation.Message = "";
                console.error(iObj)
                if (iObj.data && iObj.data && iObj.data.Message && iObj.data.Message != '') {
                    _displayAlertMeesage({ message: iObj.data.Message, formatType: '1' });
                } else {
                    _displayAlertMeesage({ message: "Your request has been sent", formatType: '1' });
                }

            },
            failureCallBack: function () {
                $scope.conversation.Message = "";
                console.debug('In failureCallBack');
            }
        });
       
    };
    var _setScrollPosition = function () {
        setTimeout(function () {
            var msgDiv = document.getElementById("messagebox");
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }, 400);
       
    }

    var _resizeDateFilter = function(iChatMessage) {
           if ($scope.timeSlots.length > 0) {
                    _flag = true;
                    for (var j = 0; j < $scope.timeSlots.length; j++) {
                         console.error(iChatMessage.displayDate, $scope.timeSlots[j].displayDate)
                        if (iChatMessage.displayDate == $scope.timeSlots[j].displayDate) {
                            _flag = false;
                        }
                    }
                    if (_flag == true) {
                        $scope.timeSlots.push({ displayDate: iChatMessage.displayDate, compareDate: iChatMessage.UpdateDate });
                        _flag = false;
                    }
            }else {
                    _flag = false;
                    $scope.timeSlots.push({ displayDate: iChatMessage.displayDate, compareDate: iChatMessage.UpdateDate });
            }            
    };

    var _sortArray = function() {
         $scope.timeSlots.sort(function (a, b) {
                    a = new Date(a.compareDate);
                    b = new Date(b.compareDate);
                    return a - b;
         });
         $scope.MailRecords.sort(function (a, b) {
                    a = new Date(a.UpdateDate);
                    b = new Date(b.UpdateDate);
                    return a -b;
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

                $scope.conversation.ReceiverEmail = $scope.openConversation.ReceiverEmail;
                $scope.conversation.SenderEmail = $scope.loggedEmail;
                $scope.conversation.Content = $scope.conversation.Message;
                $scope.conversation.SendOrReceive = "Send";
                $scope.conversation.IsVerified = true;
                $scope.conversation.isRead = false;
                var _parentId = $scope.openConversation.ConversationParentId ? $scope.openConversation.ConversationParentId : $scope.openConversation.ConversationId;
                if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
                    return false;
                var _id = _parentId + ":CHT#" +(Date.now()) +(Math.floor((Math.random() * 10) +1));
                var _object = {
                        Content: $scope.conversation.Content,
                        SenderEmail: $scope.conversation.SenderEmail,
                        ReceiverEmail: $scope.conversation.ReceiverEmail,
                        SendOrReceive: $scope.conversation.SendOrReceive,
                        IsVerified: $scope.conversation.IsVerified,
                    ConversationClosed: false,
                        ConversationType: "Coaching",
                        Skill: $scope.openConversation.skill,
                    //"8/7/2016"
                    // CreateDate: (new Date().getMonth()+1)+"/"+new Date().getDate()+
                    //UpdateDate: "2016-08-07T11:58:13.867Z"
                    ConversationId: _id,
                        ConversationParentId: _parentId,
            }

                //   console.debug(_object);
                var _replica = angular.copy(_object)
                _replica.UpdateDate = new Date();
               // _replica.UpdateDate.setDate(6);
                _replica.UpdateDate = _replica.UpdateDate.toJSON();
                _replica.displayDate = _displayDate(_replica.UpdateDate);
                 _resizeDateFilter(_replica);
                 $scope.MailRecords.push(_replica);
                _sortArray();
                //  console.error($scope.MailRecords)
                //  return;
                _setScrollPosition();
                serverCommunication.sendConversation({
                    loggedUserDetails: _object,
                        ReceiverName: $scope.ReceiverName,
                        Role: 'Coachee',
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
        var contentText = "";
        if (isVerfied != false)
            contentText = 'COACHING REQUEST BY ' + $scope.ApprovalName + ' HAS BEEN ACCEPTED';
        else
            contentText = null;
        var _id = iNotificationDash.ConversationId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
        var _object = {
            SenderEmail: SenderEmail,
            ReceiverEmail: ReceiverEmail,
            Content: contentText,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            ConversationType: "Coaching",
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
            Role: 'Coachee',
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
        $scope.MeetingSchedular.Role = "Coachee";

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

    $scope.init = function () {
        $scope.conversationRequest();
        $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading' };
        $scope.autoSyncRoutine(_conversationTime);
        serverCommunication.getMyCoacheeSelection({
            Role: 'Coach',
            successCallBack: function (iObj) {
                console.error('In getMyCoacheeSelection', iObj);
                var _myCtsInfo = seperateDataAsPerCTS(iObj);
                $rootScope.loggedDetail['coachee'] = _myCtsInfo;

            },
            failureCallBack: function (iObj) {
                console.error('In failuregetMySelectionCallBack', iObj);

            }
        });
    };
    $scope.init();

    $scope.$on("$destroy", function handleDestroyEvent() {
        $scope.stopFight();
    });
})

app.directive('ctsDropdown', function () {
    return {
        scope: {
            searching: '=',
            skill: '=',
            key: '=',
            clear: '&'
        },
        link: function (scope, element, attrs) {
            element.bind('keypress', function (evt) {
                showDropdown();
            });

            element.bind('blur', function (evt) {
                scope.searching = false;
            });

            function showDropdown() {
                if (!scope.skill.Name || scope.key.length != scope.skill.Name.length)
                    scope.searching = true;
            }
        }
    }
})
app.directive('ctsMentorCard', function () {
    return {
        link: function (scope, element, attrs) {

            element.bind('mouseenter', function (evt) {
                var info = $(element).find('div.mentor-info');
                $(info).addClass('grid-out')
                var position = $(info).position();
                var action = $(element).find('div.mentor-actions');
                $(action).css(position);
                $(action).show();
            });

            element.bind('mouseleave', function (evt) {
                var action = $(element).find('div.mentor-actions');
                var info = $(element).find('div.mentor-info');
                $(action).hide();
                $(info).removeClass('grid-out')
            });
        }
    }
})
;