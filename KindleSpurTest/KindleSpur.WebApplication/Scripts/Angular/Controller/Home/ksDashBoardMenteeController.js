app.controller('ksDashBoardMenteeController', function ($timeout,$rootScope, $scope, serverCommunication, $interval, $state) {
    $rootScope.currentModule = 'Mentee';
    $scope.notifications =[

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ];
    $scope.objectForResourceTab = { deleteIcon : true, AttachMode: false, headingRequired: true, closeRequired: false, styleUI: { top: { 'height': '7%' }, middle: { 'height': '93%' }, bottom: {} } };
    $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
    $scope.navigateToProfile = function () {
        $rootScope.currentModule = 'Profile';   
        $state.go('home.dashBoard.profile');
    };
    $scope.searchCoachObj = {}
    $scope.selectedMenu = '0';
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                 //, { name: 'MENTORING STATUS' }
                  , { name: 'SELECT TOPICS' }
                  , { name: 'SEARCH MENTOR' }
                  , { name: 'KNOWLEDGE FEED' }
                  , { name: 'COMMUNICATION' }
                  , { name: 'MY REWARDS' }
                  , { name: 'KNOWLEDGE WORKSPACE' }
                  , { name: 'KNOWLEDGE GARDEN' }
                 //, { name: 'ADD TOPICS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.showMenteeProfile = false;
    $scope.userInfo = null;
    $scope.openmentorprofile = function (iOption) {
        $scope.showMenteeProfile = true;
        $scope.userInfo = iOption;
      
    };
    $scope.displayAddress = function (iObj) {
        var _str = 'Location not available';
        if (iObj.City)
            _str = iObj.City + " ";
        if (iObj.State)
            _str += iObj.State + " ";
        if (iObj.Country)
            _str += iObj.Country + " ";
     
        return _str;
    };
    $scope.closeProfilePic = function () {
     

        $scope.showMenteeProfile = false;
        $scope.userInfo = null;
    };
    $scope.rightSideDashBoardArray = [
                   {
                       name: 'SELECT TOPICS', url: '../../Images/icons/coaching_status.png '
                   },
                    {
                        name: 'SEARCH MENTOR', url: '../../Images/icons/search_mentor_coach.png '
                    },
                    {
                        name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png '
                    },
                    {
                        name: 'COMMUNICATION', url: '../../Images/icons/communication.png '
                    },
                    {
                        name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png '
                    },
                    { name: 'KNOWLEDGE WORKSPACE', url: '../../Images/icons/resources1.png ' }

    ];

    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
    $scope.conversation = {
        Message: ''
    };
    $scope.ReceiverName = "";


    $scope.objFormat = { firstName: 'Name', id: 'Id', email: 'Name', imgPath: 'img' } //format needed for autosuggest

    $scope.callBackInTyping = function (iObj) {
       
        $scope.searchCoachObj.searchKey = iObj.searchText;
     
    };
    $scope.callBackBeforeAdd = function (iObj, iCallBack) {
       
        iCallBack()
    };
    $scope.callBackAfterChangeValue = function (iSkill) {
        var _skill = iSkill;
        $scope.availableSkills.some(function (iSkillLoop) {
            if (iSkillLoop.Id == iSkill.Id) {
                _skill = { Id: iSkill.Id, Name: iSkill.Name, Type: iSkill.Type, ParentId: iSkill.ParentId };
            }
        });
        $scope.searchCoachObj.searchKey = iSkill.Name;
        $scope.searching = false;
        serverCommunication.getCoaches({
            filter: _skill,
            role: 'Mentor',
            successCallBack: function (result) {
             
                if (result.data) {
                    $scope.searchCoachObj.searchingActive = true;
                    _createCoachArray(result);
                }
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                if (!$scope.$$phase) $scope.$digest();
            },
            failureCallBack: function () {
                
            }
        });
    }
    $scope.callBackBeforeRemove = function (iObj) {
      
    }
    $scope.availableSkills = [];
    $scope.searchCoachObj.searchKey = '';
    $scope.searching = false;
    $scope.selectedSkill = {
    };
    $scope.skillFilter = function (skill) {
        var regExp = new RegExp($scope.searchCoachObj.searchKey, 'i');
        return !$scope.searchCoachObj.searchKey || regExp.test(skill.Name);
    };

    $scope.searchCoachObj.selectSkill = function (skill) {
        $scope.selectedSkill = skill;
        $scope.searchCoachObj.searchKey = skill.Name;
        $scope.searching = false;
        serverCommunication.getCoaches({
            filter: skill,
            role: 'Mentor',
            successCallBack: function (result) {
                      
                if (result.data) {
                    $scope.searchCoachObj.searchingActive = true;
                    _createCoachArray(result);
                }
            },
            failureCallBack: function () {
              
            }
        });
    };

    $scope.clearSearch = function (IAvoidCall) {
        $scope.searchCoachObj.searchKey = '';
        $scope.selectedSkill = {};
        $scope.searchCoachObj.searchingActive = false;
        if (!IAvoidCall) $scope.getCoachRecord();
        $scope.searching = false;
    }
    var _chatMessageTime = 30000;
    var _conversationTime = 60000;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray = [];
        $scope.stopFight();
        $scope.loadingMiddleObject = { showLoading: true, loadingMessage: 'Loading' };
        switch (iIndex) {
            case 0: $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' }; break;
            case 7: $scope.generateGarden(); break;
            case 2: $scope.clearSearch(); $scope.getCoachRecord(); break;
            case 3: $scope.getRssFeedData(); break;
            case 4: $scope.autoSyncRoutine(_chatMessageTime); $scope.conversationLoading(); break;
            case 1:
            case 5:
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
        serverCommunication.generateGarden({
            loggedUserDetails: $rootScope.loggedDetail,
            role: 'mentee',
            successCallBack: function (iObj) {
              
                $scope.coachingStatusArray = iObj.data.Filters;
                var _array = [];
                for (var k = 0; k < $scope.coachingStatusArray.length ; k++) {
                    var _str = $scope.coachingStatusArray[k].FirstName + " " + $scope.coachingStatusArray[k].LastName;
                    _array.push({
                        "symbol": _str.toUpperCase(),
                        "image": $scope.coachingStatusArray[k].TreeURL,
                        "size": 45,
                        "Skill": $scope.coachingStatusArray[k].Skill,
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
               
                $scope.ctsDataForMolecule = _retu;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
              

            }
        });
    };
    $scope.Coaches = [];
    var _createCoachArray = function (iResult) {
        $scope.timeSlots = [];
        var _coachFinalArr = [];
        for (var k = 0; k < iResult.data.length; k++) {
        
            for (var i = 0; i < iResult.data[k].Topics.length; i++) {
                if ($scope.searchCoachObj.searchKey != '') {
                    if ($scope.searchCoachObj.searchKey != iResult.data[k].Topics[i].Name)
                         continue;
                }
                var _coach = angular.copy(iResult.data[k]);
                _coach.Skill = {};
                _coach.Skill = angular.copy(iResult.data[k].Topics[i]);
               
                if ($scope.timeSlots.length > 0) {
                    $scope.flag = true;
                    var _index = $scope.timeSlots.indexOf(iResult.data[k].Topics[i].Name);
                    if (_index > -1) {
                        $scope.flag = false;
                    }
                    if ($scope.flag == true) {
                        $scope.timeSlots.push(iResult.data[k].Topics[i].Name);
                        $scope.flag = false;
                    }
                } else {
                    $scope.flag = false;
                    $scope.timeSlots.push(iResult.data[k].Topics[i].Name);
                }
                _coach.showLoad = false;
                _coachFinalArr.push(_coach);
            }
        }
      
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
            Role: 'Mentor',
            successCallBack: function (result) {
             
                var _mySkill = [];
                if ($rootScope.loggedDetail.coachee) {
                    for (var _key in $rootScope.loggedDetail.coachee.skills) {
                        _mySkill.push(_key);
                    }
                   
                }
                $scope.timeSlots = [];
                if (result.data) {
                    _createCoachArray(result);
                }
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                serverCommunication.getCTSFilters({
                    Role: 'Mentor',
                    successCallBack: function (iResult) {
                    
                        iResult.data.Filters.some(function (iCts) {
                            if (iCts.Type == 2) {
                                $scope.availableSkills.push(iCts);
                            }
                        });
                       
                    },
                    failureCallBack: function () {
                       

                    }
                });
            },
            failureCallBack: function () {
               

            }
        });
    };
    $scope.generateGarden = function () {
        $scope.ctsDataForMolecule = null;
        serverCommunication.getCoachingWithStatus({
            loggedUserDetails: $rootScope.loggedDetail,
            role: 'mentee',
            successCallBack: function (iObj) {
              
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
              
                $scope.ctsDataForMolecule = _retu;
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function (iObj) {
              

            }
        });
    };
    $scope.feedBack = {
        feedBackMode : false
    }
    $scope.feedBack.askFeedback = false;
    $scope.feedBack.formValue = '0';
    $scope.feedBack.icloseFeedBack = false;
    $scope.feedBack.feedBackType = 'feedBack';
    $scope.askFeedBackFunc = function (icloseFeedBack, iArray) {
        $scope.feedBack.askFeedback = true;
        $scope.feedBack.formValue = '1';
        $scope.feedBack.icloseFeedBack = false;
        $scope.feedBackloaded = { showLoad: false };
        $scope.feedBack.feedBackMode = false;
        if (iArray)
            $scope.feedBack.feedBackMode = true;
        if (icloseFeedBack == 3) {
           
            $scope.feedBack.feedBackType = 'preSession';
            if (iArray)
                $scope.array = [].concat(angular.copy(iArray));
            else
              $scope.array = [].concat(angular.copy(_presessionQuestion));
        } else {
            if (icloseFeedBack) {
                $scope.feedBack.feedBackType = 'closeSession';
                if (iArray)
                    $scope.array = [].concat(angular.copy(iArray));
                else
                    $scope.array = [].concat(angular.copy(_arrayCloseSession));
            } else {
                $scope.feedBack.feedBackType = 'feedBack';
                if (iArray)
                    $scope.array = [].concat(angular.copy(iArray));
                else
                    $scope.array = [].concat(angular.copy(_array));
            }
        }
    }
    var _array = [
            {
                name: 'Was the sessions objective achieved ?  ', actionValue: '1', type: 'rating', showLoad: false
            },
            {
                name: 'Was the session as per plan ? Was this session fine-tuned based on your previous session feedback ?', actionValue: '1', type: 'radio', showLoad: false
            },
            {
                name: 'What should have been avoided / What should have been better ? Describe ', actionValue: '', type: 'textArea', showLoad: false
            },
            {
                name: 'What was best about the session ? Describe  ', actionValue: '', type: 'textArea', showLoad: false
            },
            {
                name: ' Is the Mentor using the best practice of - continuous review and improvement ? ', actionValue: '', type: 'radio', showLoad: false
            },
            {
                name: 'Did you gain in confidence after the session ?', actionValue: '', type: 'radio', showLoad: false
            },
            {
                name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '',
            },
            { name: ' Rate the session ', sessionRating: true, type: 'rating', showLoad: false, actionValue: '1', },
    ];
    var _arrayCloseSession = [
             {
                 name: 'Have you gained from this program ?', actionValue: '', type: 'radio', showLoad: false
             },
             {
                 name: 'Did you achieve all your stated objectives ?', actionValue: '1', type: 'radio', showLoad: false
             },
             {
                 name: 'Did the Mentor/ Coach share any practically useful content (notes/docs/ppts/images/others) ?', actionValue: '', type: 'radio', showLoad: false
             },
             {
                 name: 'How did you know about KindleSpur ? ', actionValue: '', type: 'radio', showLoad: false
             },
             {
                 name: 'Would you like to refer anyone to try KindleSpur ?', actionValue: '', type: 'radio', showLoad: false
             },
             {
                 name: 'Would you take Mentoring/ Coaching again at KindleSpur (for another Objective/ Goal) ?', actionValue: '', type: 'radio', showLoad: false
             },
             {
                 name: 'Overall rating for Mentor/ coach.', type: 'rating', showLoad: false, actionValue: '1',
             },
             { name: ' Overall rating for KindleSpur .', sessionRating: true, type: 'rating', showLoad: false, actionValue: '1', },
    ];
    var _presessionQuestion = [
            {
                name: 'What is the ultimate goal you want to accomplish by the end of this coaching/ mentoring session?', actionValue: '', type: 'textArea', showLoad: false
            },
            {
                name: 'Any issue/challenge/problem you would like your coach/mentor to work with you on it? Any steps your have taken so far to tackle these problem areas?', actionValue: '', type: 'textArea', showLoad: false
            },
            {
                name: 'Your preferred time and mode of communication- Time Box for time,mode of communication ', actionValue: '', type: 'textArea', showLoad: false
            },
            { name: 'Five attributes that you would like your coach/ mentor to know about you', actionValue: '', type: 'textArea', showLoad: false },
    ];
    $scope.feedBack.closeFeedBackPopup = function () {
        $scope.feedBack.askFeedback = false;
        $scope.feedBack.formValue = '1';

    };


    $scope.redeemPointsClick = function () {

        $scope.feedBack.closeFeedBackPopup();
        serverCommunication.unlockGameCode({
          
            redeemAction: $scope.redeemAction,
            successCallBack: function (iObj) {
                $scope.menuClick(6);
             

            },
            failureCallBack: function (iObj) {
              
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
      
        serverCommunication.getMyMenteeSelection({
            successCallBack: function (iObj) {
              
                _category = {
                };
                _topics = {
                };
                _skills = {
                };
            

                if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
                    for (var k = 0; k < iObj.data.Categories.length; k++) {
                        if (Object.keys(iObj.data.Categories[k]).length > 0) {

                         
                            if (iObj.data.Categories[k].Category) {
                                if (_category[iObj.data.Categories[k].Category]) {//if category is already present
                                    if (_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]) {//if topic is already present
                                        
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = {Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {
                                            }
                                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = {
                                                Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                            }
                                        }
                                    } else {
                                        _topics[iObj.data.Categories[k].Topic] = {
                                            Name: iObj.data.Categories[k].Topic, skill: {
                                            }, profiLevel: iObj.data.Categories[k].profiLevel
                                        };
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = {Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = {Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {
                                            }
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
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {
                                        }
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = {
                                            Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
              
                if (Object.keys(_topics).length > 0) {
                    $scope.feedCategoryArray = [];
                }
                for (var _skill in _topics) {
                    $scope.feedCategoryArray.push({selected: false, name: _skill  });
                }
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                if (!$scope.$$phase) $scope.$digest();
            },
            failureCallBack: function (iObj) {
              

            }
        });

    };
   

  
    /*START: Conversation Module Code*/
    $scope.loadFeedOnNextTab = function (iFeed) {
        window.open(iFeed.FilePath);
    };
    var _afterAddCallBack = function (iObj) {
      
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
                var _idAth = _parentId + ":ATH#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                iObj.selectedData['Artifact'][_key].FileId = _idAth;
                _array.push(iObj.selectedData['Artifact'][_key]);
            }
        }
        if (iObj.selectedData['bookMark']) {
            for (var _key in iObj.selectedData['bookMark']) {
                var _idAth = _parentId + ":ATH#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                iObj.selectedData['bookMark'][_key].FileId = _idAth;
                _array.push(iObj.selectedData['bookMark'][_key]);
            }
        }
        var _receiverName = $scope.openConversation.ReceiverEmail;
        if ($scope.openConversation.SenderEmail == $scope.loggedEmail)
            _receiverName = $scope.openConversation.ReceiverEmail;
        if ($scope.openConversation.ReceiverEmail == $scope.loggedEmail)
            _receiverName = $scope.openConversation.SenderEmail;
     
        var _object = {
            Content: iObj.message,
            SenderEmail: $scope.loggedEmail,
            ReceiverEmail: _receiverName,
            SendOrReceive: 'send',
            IsVerified: true,
            ConversationClosed: false,
            messageType: 'media',
            FilesURLlink: _array,
            ConversationType: "Mentoring",
            Skill: $scope.openConversation.skill,
          
            ConversationId: _id,
            ConversationParentId: _parentId,
        }

      
        var _replica = angular.copy(_object);
        if (_replica.SenderEmail == $scope.loggedEmail) {
            _replica.Name = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
            _replica.Photo = $rootScope.loggedDetail.Photo;
        } else {
            _replica.Name = $scope.openConversation.FirstName + " " + $scope.openConversation.LastName;
            _replica.Photo = $scope.openConversation.Photo;
        }
        _replica.UpdateDate = new Date();
     
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

              
            },
            failureCallBack: function () {

                $scope.conversation.Message = "";

              
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
                openConversation: $scope.openConversation, headingRequired: true, closeRequired: true, headingTitle: ('Send to ' + ($scope.openConversation.FirstName + " " + $scope.openConversation.LastName)),
                AttachMode: true, role: 'Mentee', afterAddCallBack: _saveSchedule, deleteIcon: false,
                styleUI: { chat: { 'height': '15%', 'background-color': 'white' }, top: { 'height': '12%', 'background-color': 'white' }, middle: { 'height': '59%', 'background-color': 'white' }, bottom: { 'height': '12%', 'background-color': 'white' } }
            }
        });
    };

    var _saveSchedule = function (iMeetingData) {
       
        var _startDate = new Date(iMeetingData.selectedData.MeetingDate);
        _startDate.setHours(new Date(iMeetingData.selectedData.TimeFrom).getHours());
        _startDate.setMinutes(new Date(iMeetingData.selectedData.TimeFrom).getMinutes());
        _startDate.setSeconds(0);
        var _endDate = new Date(iMeetingData.selectedData.MeetingDate);
        _endDate.setHours(new Date(iMeetingData.selectedData.TimeTo).getHours());
        _endDate.setMinutes(new Date(iMeetingData.selectedData.TimeTo).getMinutes());
        _endDate.setSeconds(0);

        var _parentId = $scope.openConversation.ConversationParentId ? $scope.openConversation.ConversationParentId : $scope.openConversation.ConversationId;
        var _id = _parentId + ":MTG#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));

        var _Obj = {
            MeetingId: _id,
            From: $scope.loggedEmail,
            To: $scope.openConversation.ReceiverEmail,
            Subject: iMeetingData.selectedData.Subject,
            SkillName: $scope.openConversation.skill,
            //TopicName
            Role: 'Mentor',
            Status: iMeetingData.selectedData.UserId,
            StartDate: _startDate,
            EndDate: _endDate,
            TimeSlot: "Mentoring",
            IsVerified: false
        }
      
        serverCommunication.saveMeeting({
            loggedUserDetails: { _obj: _Obj, ReceiverName: $scope.openConversation.ReceiverEmail, Role: 'Coachee', ContentText: $scope.openConversation.skill },
            successCallBack: function () {
               
                $scope.myMeetingSchedular.close();
            },
            failureCallBack: function () {
               

            }
        });
    };

    $scope.updateMeeting = function (isVerfied, iNotification) {

     
        serverCommunication.MeetingSchedularUpdate({
            MeetingId: iNotification.Meeting.MeetingId,
            flag: isVerfied,
            successCallBack: function () {
               
               
            },
            failureCallBack: function (e) {
              
            }
        });

        return;
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
               
            },
            failureCallBack: function (e) {
              
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

    $scope.saveBookmark = function (iCate) {
       
        serverCommunication.bookMarkLink({
            bookMarkObject: { ParentFileId: iCate.FileId, DocumentName: iCate.FileName, LinkUrl: iCate.FilePath },
            successCallBack: function () {
               
            },
            failureCallBack: function () {
             
            }
        });
    };
    $scope.autoSyncRoutine = function (iTime) {
     
      
    };
    $scope.conversationLoading = function () {
        $scope.conversationListNew = [];
        serverCommunication.getConversation({
            loggedEmail: $scope.loggedEmail,
            Role: "Mentee",
            ConversationType: 'Mentoring',
            successCallBack: function (iObj) {
             
                $scope.conversationListNew = [];
                var _coach = {
                };
                for (var k = 0; k < iObj.data.Result.length; k++) {
                   
                    if (_coach[iObj.data.Result[k].skill]) {
                        _coach[iObj.data.Result[k].skill].user[iObj.data.Result[k].ReceiverEmail] = iObj.data.Result[k];
                    } else {
                        _coach[iObj.data.Result[k].skill] = { user: {}};
                        _coach[iObj.data.Result[k].skill].user[iObj.data.Result[k].ReceiverEmail] = iObj.data.Result[k];
                    }
                }

             
                for (var _key in _coach) {
                    for (var _user in _coach[_key].user) {
                        _coach[_key].user[_user].skillName = _key;
                        _coach[_key].user[_user].sessionClosed = false;
                        $scope.conversationListNew.push(_coach[_key].user[_user]);
                    }
                   
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
             
            }
        });
    };
    $scope.openConversation = null;
    $scope.conversationLoad = function (iIndex, iCategory) {
        $scope.loadingMessageObject = {showLoading: false, loadingMessage: 'Loading'   };
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

       

        $scope.showSelectedConversation($scope.loggedEmail, $scope.ReceiverEmail);
    };
    $scope.allFeedBack = {};
    $scope.getFeedBackFromServer = function () {
        $scope.allFeedBack = {};
        serverCommunication.getFeedback({
            openConversation: $scope.openConversation,
            role: 'Mentee',
            senderEmail: $scope.openConversation.SenderEmail == $scope.loggedEmail ? $scope.openConversation.ReceiverEmail : $scope.openConversation.SenderEmail,
            successCallBack: function (iObj) {
              
                if (iObj.data) {
                    var _feedBack = {};
                    var _self = {};
                    var _other = {};
                    for (var k = 0 ; k < iObj.data.length ; k++) {
                        if (iObj.data[k].Skill == $scope.openConversation.skill) {
                            iObj.data[k].CreateDate = new Date(Number(iObj.data[k].CreateDate.split('(')[1].split(')')[0]));
                            iObj.data[k].FeedBackGiver = 'Other';
                            if (iObj.data[k].Sender == $scope.loggedEmail) {
                                iObj.data[k].FeedBackGiver = 'Self';
                                if (!_self[iObj.data[k].FeedbackStatus]) {
                                    _self[iObj.data[k].FeedbackStatus] = [];
                                }
                                _self[iObj.data[k].FeedbackStatus].push(iObj.data[k]);
                            } else {
                                if (!_other[iObj.data[k].FeedbackStatus]) {
                                    _other[iObj.data[k].FeedbackStatus] = [];
                                }
                                _other[iObj.data[k].FeedbackStatus].push(iObj.data[k]);
                            }
                        }
                                         
                    }
                    for (var _key in _self) {
                        _self[_key].sort(function (a, b) {
                            var _date = new Date(a.CreateDate);
                            var _secondDate = new Date(b.CreateDate);
                            return _date - _secondDate;
                        });
                        if (!$scope.allFeedBack[_key]) {
                            $scope.allFeedBack[_key] = {};
                        }

                        for (var k = 0 ; k < _self[_key].length; k++) {
                            var _count = k + 1;
                            if (!$scope.allFeedBack[_key][_count]) {
                                $scope.allFeedBack[_key][_count] = {};
                            }
                            $scope.allFeedBack[_key][_count]['Self'] = _self[_key][k];
                        }
                    }
                    for (var _key in _other) {
                        _other[_key].sort(function (a, b) {
                            var _date = new Date(a.CreateDate);
                            var _secondDate = new Date(b.CreateDate);
                            return _date - _secondDate;
                        });
                        if (!$scope.allFeedBack[_key]) {
                            $scope.allFeedBack[_key] = {};
                        }
                        for (var k = 0 ; k < _other[_key].length; k++) {
                            var _count = k + 1;
                            if (!$scope.allFeedBack[_key][_count]) {
                                $scope.allFeedBack[_key][_count] = {};
                            }
                            $scope.allFeedBack[_key][_count]['Other'] = _other[_key][k];
                        }

                    }
                    
                    $scope.feedbackDisplayIcon = [];
                    //Pre seesion block                   
                    var _presessionBlock = {
                        Name: 'Pre',
                        feedBackArr: ($scope.allFeedBack['PRESESSION'] && $scope.allFeedBack['PRESESSION'][1]) ? $scope.allFeedBack['PRESESSION'][1] : {},
                        replaceNameI: ($scope.allFeedBack['PRESESSION'] && $scope.allFeedBack['PRESESSION'][1] && $scope.allFeedBack['PRESESSION'][1]['Self']) ? 'Click to see the given Pre-session' : 'Click to Give Pre-session',
                        replaceNameU: ($scope.allFeedBack['PRESESSION'] && $scope.allFeedBack['PRESESSION'][1] && $scope.allFeedBack['PRESESSION'][1]['Other']) ? 'Click to see the given Pre-session' : 'No Pre-session form received',
                        selected: false,
                        activate: true,
                        styleI: { 'transition': 'all 1s ease','opacity':'1' },
                        styleU: { 'transition': 'all 1s ease','opacity':'0.5' }
                    };
                    
                    if (($scope.allFeedBack['PRESESSION'] && $scope.allFeedBack['PRESESSION'][1] && $scope.allFeedBack['PRESESSION'][1]['Self'])) {
                        _presessionBlock.styleI['font-weight'] = '900';
                        _presessionBlock.styleI['color'] = '#4dc725';
                        _presessionBlock.styleI['opacity'] = '1';
                    }
                    if (($scope.allFeedBack['PRESESSION'] && $scope.allFeedBack['PRESESSION'][1] && $scope.allFeedBack['PRESESSION'][1]['Other'])) {
                        _presessionBlock.styleU['font-weight'] = '900';
                        _presessionBlock.styleU['color'] = '#4dc725';
                        _presessionBlock.styleU['opacity'] = '1';
                    }
                    $scope.feedbackDisplayIcon.push(angular.copy(_presessionBlock));

                    //Normal FeedBack Block
                    var _colorArray = ['', '#9400D3', '#0000FF', '#C70039', '#A04000', '#9400D3', '#0000FF', '#C70039'];
                    var _previousActivate = false;
                    for (var k = 1; k < 7; k++) {
                       
                        var _normalFeedBack = {
                            Name: 'F - '+k,
                            feedBackArr: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k]) ? $scope.allFeedBack['FEEDBACK'][k] : {},
                            replaceNameI: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Self']) ? 'Click to see the given feedBack' : 'Click to give feedback',
                            replaceNameU: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Other']) ? 'Click to see the given feedBack' : 'No feedback received',
                            selected: false,
                            activate: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Self']) ? true : false,
                            styleI: { 'transition': 'all 1s ease','opacity':'0.5' },
                            styleU: { 'transition': 'all 1s ease','opacity':'0.5' }
                        };
                       
                         _normalFeedBack.nextToBeFilled = false;
                        if (_previousActivate) {
                            _normalFeedBack.activate = true;
                            _normalFeedBack.nextToBeFilled = true;
                            _normalFeedBack.styleI['color'] = 'orange';
                            _normalFeedBack.styleI['opacity'] = '1';
                        }
                        if ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Self']) {
                            _previousActivate = true;
                            _normalFeedBack.filledFeedback = true;
                            _normalFeedBack.styleI['font-weight'] = '900';
                            _normalFeedBack.styleI['opacity'] = '1';
                            _normalFeedBack.styleI['color'] = '#4dc725';
                        } else
                            _previousActivate = false;

                        if ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k]&& $scope.allFeedBack['FEEDBACK'][k]['Other']) {
                            _normalFeedBack.styleU['font-weight'] = '900';
                            _normalFeedBack.styleU['color'] = '#4dc725';
                            _normalFeedBack.styleU['opacity'] = '1';
                        }
                        if (k == 1 && _previousActivate == false) {
                            _normalFeedBack.activate = true;
                            _normalFeedBack.nextToBeFilled = true;
                            _normalFeedBack.styleI['opacity']= '1';
                            _normalFeedBack.styleI['color'] = 'orange';
                        }
                        $scope.feedbackDisplayIcon.push(angular.copy(_normalFeedBack));
                    }
                   

                    //Close session feedBack - closeSession - CLOSESESSION
                    var _closeSessionBlock = {
                        Name: 'Close',
                        feedBackArr: ($scope.allFeedBack['CLOSESESSION'] && $scope.allFeedBack['CLOSESESSION'][1]) ? $scope.allFeedBack['CLOSESESSION'][1] : {},
                        replaceNameI: ($scope.allFeedBack['CLOSESESSION'] && $scope.allFeedBack['CLOSESESSION'][1] && $scope.allFeedBack['CLOSESESSION'][1]['Self']) ? 'Click to see the given feedBack' : 'Click to Give close session feedback',
                        replaceNameU: ($scope.allFeedBack['CLOSESESSION'] && $scope.allFeedBack['CLOSESESSION'][1] && $scope.allFeedBack['CLOSESESSION'][1]['Other']) ? 'Click to see the given feedBack' : 'No feedback received',
                        selected: false,
                        activate: true,
                        styleI: { 'transition': 'all 1s ease','opacity':'1' },
                        styleU: { 'transition': 'all 1s ease','opacity':'0.5' }
                    };
                    
                    if (($scope.allFeedBack['CLOSESESSION'] && $scope.allFeedBack['CLOSESESSION'][1] && $scope.allFeedBack['CLOSESESSION'][1]['Self'])) {
                        _closeSessionBlock.styleI['font-weight'] = '900';
                        _closeSessionBlock.styleI['opacity'] = '1';
                        _closeSessionBlock.styleI['color'] = '#4dc725';
                    }
                    if (($scope.allFeedBack['CLOSESESSION'] && $scope.allFeedBack['CLOSESESSION'][1] && $scope.allFeedBack['CLOSESESSION'][1]['Other'])) {
                        _closeSessionBlock.styleU['font-weight'] = '900';
                        _closeSessionBlock.styleU['color'] = '#4dc725';
                        _closeSessionBlock.styleU['opacity'] = '1';
                    }
                    $scope.feedbackDisplayIcon.push(angular.copy(_closeSessionBlock));
                   
                    $timeout(function () {
                       
                        $scope.showFeedBack = true;
                       
                    }, 900);

                }
            },
            failureCallBack: function (iObj) {
              
            }
        });
    };

    $scope.applyAnimatonToFeedBack = false;
    $scope.iUClickFunc = function () {

        if ($scope.applyAnimatonToFeedBack)
            $scope.applyAnimatonToFeedBack = false;
        else
            $scope.applyAnimatonToFeedBack = true;

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
        var _getDate = {
        };
        var _date = new Date(iDate);
        var _currentDate = new Date();
        var _yesterdaysDt = new Date();
        _yesterdaysDt.setDate(_yesterdaysDt.getDate() -1);
        var _prefix = '';
        if (new Date(_date).setHours(0, 0, 0, 0) == new Date(_currentDate).setHours(0, 0, 0, 0)) {
            _prefix = "Today";
        } else if (new Date(_date).setHours(0, 0, 0, 0) == _yesterdaysDt.setHours(0, 0, 0, 0)) {
            _prefix = "Yesterday";
        } else {
            _getDate = _date.getDate().toString();
            _prefix = _setPrefixDate(_getDate);
            _prefix = _date.getDate() + _prefix + " " +_getMonthNames(_date.getMonth(), 1, 1) + "," + _date.getFullYear();
        }
        return _prefix;
    };
    $scope.iconMgmt = { iIconClicked: false, uIconClicked: false };
    $scope.showSelectedConversation = function (SenderEmail, ReceiverEmail) {
        serverCommunication.getConversationDetails({
            
            ConversationType: "Mentoring",
            Role: 'Mentee',
            ParentId: $scope.openConversation.ConversationParentId,
            successCallBack: function (iObj) {
                          
                $scope.MailRecords = [];
                function ObjectId(id) { return id; }
                function ISODate(d) { return d; }
                var MailRecords = eval('(' +iObj.data.Result + ')');
             
                $scope.openConversation.sessionClosed = false;
                var _flag = false;
                $scope.applyAnimatonToFeedBack = false;
                $scope.iconMgmt = { iIconClicked: false, uIconClicked  : false };

                $scope.timeSlots =[];
                MailRecords.some(function (dd) {
                    if (dd.ConversationClosed || dd.ConversationClosed == 'True') {
                       
                        $scope.openConversation.sessionClosed = true;

                    }
                    if (dd.SenderEmail == $scope.loggedEmail) {
                        dd.Name = $rootScope.loggedDetail.FirstName + " " +$rootScope.loggedDetail.LastName;
                        dd.Photo = $rootScope.loggedDetail.Photo;
                    } else {
                        dd.Name = $scope.openConversation.FirstName + " " +$scope.openConversation.LastName;
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
                            $scope.timeSlots.push({displayDate: dd.displayDate, compareDate: dd.UpdateDate});
                            _flag = false;
                        }
                    } else {
                        _flag = false;
                        $scope.timeSlots.push({ displayDate: dd.displayDate, compareDate: dd.UpdateDate});
                    }
                    $scope.MailRecords.push(angular.copy(dd));
                });
                $scope.timeSlots.sort(function (a, b) {
                    a = new Date(a.compareDate);
                    b = new Date(b.compareDate);
                    return a -b;
                });
                $scope.MailRecords.sort(function (a, b) {
                    a = new Date(a.UpdateDate);
                    b = new Date(b.UpdateDate);
                    return a -b;
                });
                $scope.loadingMessageObject = { showLoading: false, loadingMessage: 'Loading' };
               
                _setScrollPosition();
                $scope.showFeedBack = false;
                $scope.getFeedBackFromServer();
                        
            },
            failureCallBack: function (iObj) {
               
            }
        });
    };

    $scope.closeEx = function (iEvent) {
        if (iEvent) iEvent.stopPropagation();
        for (var k = 0 ; k < $scope.feedbackDisplayIcon.length ; k++)
            $scope.feedbackDisplayIcon[k].style['width'] = '100%';
        $scope.expandIndex = -1;
        var _obj = {
            iHeight: 27,
            iCol: 8,
            row: 1,
            iArray: $scope.feedbackDisplayIcon
        };
        $scope.selectedMode = '';
        msIsotopeFunc.prototype.genericHeightChange(_obj);
    }

    $scope.selectedMode = '';
    $scope.openFeedBackFormOnAction = function (iObj) {
       
        if ($scope.feedBack.askFeedback == true)
            return;
        if (iObj.icon.activate == false && iObj.mode == 'Self') {
            $scope.displayAlert.showAlert = true;
            $scope.displayAlert.message = 'You can not perform this operation as previous feedback is not filled';
            $scope.displayAlert.formatType = '2';
            return;
        }

        if (iObj.event) iObj.event.stopPropagation();
        switch (iObj.icon.Name) {
            case 'P':
            case 'Pre':
                if (Object.keys(iObj.icon.feedBackArr).length > 0) {
                    if (iObj.icon.feedBackArr[iObj.mode]) {
                        $scope.selectedMode = iObj.mode;
                        var _feedBackArr = []
                        for (var k = 0 ; k < iObj.icon.feedBackArr[iObj.mode].QueAndAns.length ; k++) {
                            var _feed = { name: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Question, actionValue: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Answer, type: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].DataType, disbaled: true, showLoad: false };
                            _feedBackArr.push(_feed);
                        }
                        $scope.askFeedBackFunc(3, _feedBackArr);
                    } else if (iObj.mode == 'Self') {
                        $scope.selectedMode = iObj.mode;
                        $scope.askFeedBackFunc(3);
                    }
                } else if (iObj.mode == 'Self') {
                    $scope.selectedMode = iObj.mode;
                    $scope.askFeedBackFunc(3);
                }
                break;
            case 'C':
            case 'Close':
                if (Object.keys(iObj.icon.feedBackArr).length > 0) {
                    if (iObj.icon.feedBackArr[iObj.mode]) {
                        $scope.selectedMode = iObj.mode;
                        var _feedBackArr = []
                        for (var k = 0 ; k < iObj.icon.feedBackArr[iObj.mode].QueAndAns.length ; k++) {
                            var _feed = { name: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Question, actionValue: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Answer, type: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].DataType, disbaled: true, showLoad: false };
                            _feedBackArr.push(_feed);
                        }
                        $scope.askFeedBackFunc(true, _feedBackArr);
                    } else if (iObj.mode == 'Self') {
                        $scope.selectedMode = iObj.mode;
                        $scope.askFeedBackFunc(true);
                    }
                } else if (iObj.mode == 'Self') {
                    $scope.selectedMode = iObj.mode;
                    $scope.askFeedBackFunc(true);
                }
                break;
            case 'G':
            case 'F - 1':
            case 1:
            case 'F - 2':
            case 2:
            case 'F - 3':
            case 3:
            case 'F - 4':
            case 4:
            case 'F - 5':
            case 5:
            case 'F - 6':
            case 6:

                if (Object.keys(iObj.icon.feedBackArr).length > 0) {
                    if (iObj.icon.feedBackArr[iObj.mode]) {
                        iObj.icon.selectedModeInner = iObj.mode;
                        var _feedBackArr = []
                        for (var k = 0 ; k < iObj.icon.feedBackArr[iObj.mode].QueAndAns.length ; k++) {
                            var _feed = { name: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Question, actionValue: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].Answer, type: iObj.icon.feedBackArr[iObj.mode].QueAndAns[k].DataType, disbaled: true, showLoad: false };
                            _feedBackArr.push(_feed);
                        }
                        $scope.askFeedBackFunc(false, _feedBackArr);
                    } else if (iObj.mode == 'Self') {
                        iObj.icon.selectedModeInner = iObj.mode;
                        $scope.askFeedBackFunc(false);
                    }
                } else if (iObj.mode == 'Self') {
                    iObj.icon.selectedModeInner = iObj.mode;
                    $scope.askFeedBackFunc(false);
                }
                break;
              
        }
        return
        if (iObj.event) iObj.event.stopPropagation();
        if ($scope.feedbackDisplayIcon[iObj.index].activate) {
            $scope.feedbackDisplayIcon[iObj.index].activate = true;
            $scope.selectedMode = iObj.mode;
            switch (iObj.icon.Name) {
                case 'P': $scope.askFeedBackFunc(3); break;
                case 'C': $scope.askFeedBackFunc(true); break;
                case 'G':;
                case '1':;
                case '2':;
                case '3':;
                case '4':;
                case '5':;
                case '6': $scope.askFeedBackFunc(false); break;
            }
         
        }

    };
    $scope.expandInboxFlag = false;
    $scope.loadExpandModeInbox = function () {
        $scope.expandInboxFlag = true;
    };
    var _colorArray = ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000', 'brown'];
    $scope.cliked = -1
    $scope.expandIndex = -1;
    $scope.iconCLicked = function (iEvent, iIndex, iIcon) {
      
        if (iEvent) iEvent.stopPropagation();
        $scope.expandIndex = iIndex;
        var _tempHeight = document.getElementById('monthlycontroller').getBoundingClientRect().height;
        $scope.expandDay = iIcon;
     
        var _object = {
            iHeight: 30,
            index: iIndex,
            iWidth: 100 / 8,
            TotalColumns: 8,
            column: 8,
            row: 1,
            array: $scope.feedbackDisplayIcon
        };
        if (iIcon.Name == 'F') {
            _object.iHeight = 250;
            $scope.displayFeedBack = [];
            var _arr = ['', 'st', 'nd', 'rd', 'th', 'th','th' ]
            for (var k = 1; k < 7; k++) {
                    var _normalFeedBack = {
                        Name: k,
                        feedBackArr: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k]) ? $scope.allFeedBack['FEEDBACK'][k] : {},
                        replaceNameI: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Self']) ? 'Click to see the given ' + k + _arr[k] + ' feedBack' : 'Click to give ' + k + _arr[k] + ' feedback',
                        replaceNameU: ($scope.allFeedBack['FEEDBACK'] && $scope.allFeedBack['FEEDBACK'][k] && $scope.allFeedBack['FEEDBACK'][k]['Other']) ? 'Click to see the given ' + k + _arr[k] + ' feedBack' : 'No feedback received',
                        selected: false,
                        activate: true,
                        style: { 'border-right': '1px solid', 'border-bottom': '1px solid', 'overflow': 'hidden', 'color': '#999', 'transition': 'all 1s ease', 'transform': 'scale(1)', 'width': '50%', 'height': '100%' }
                    };
                    $scope.displayFeedBack.push(_normalFeedBack);
            }
      
        }
        msIsotopeFunc.prototype.expandForFloat(_object);
    
        $scope.feedbackDisplayIcon[iIndex].styleObj['background'] = 'white';
        $scope.feedbackDisplayIcon[iIndex].styleObj['z-index'] = '1';
        $scope.feedbackDisplayIcon[iIndex].style['width'] = '50%';
        //background: white;
        for (var k = 0 ; k < $scope.feedbackDisplayIcon.length ; k++)
            $scope.feedbackDisplayIcon[k].styleObj['margin-top'] = '0';
    };

    $scope.gridViewLoaded = false;
    $scope.loadGridView = function () {
        //debugger
        $scope.gridViewLoaded = !$scope.gridViewLoaded;
    
        $rootScope.$broadcast("inboxListener", { gridViewLoaded: $scope.gridViewLoaded });
    };
    $rootScope.$on("closeInbox", function (event, iObj) {
      
        $scope.gridViewLoaded = false;
      
    });
    $scope.notificationData = [];
    $scope.conversationRequest = function () {
        $scope.notificationData = [];
        serverCommunication.getAllMeetingRequest({
            ConversationType: "Mentoring",
            successCallBack: function (iObj) {
            
                for (var k = 0 ; k < iObj.data.Result.length ; k++) {
                    iObj.data.Result[k].Meeting.StartDate = new Date(Number(iObj.data.Result[k].Meeting.StartDate.split('(')[1].split(')')[0]));
                    iObj.data.Result[k].Meeting.EndDate = new Date(Number(iObj.data.Result[k].Meeting.EndDate.split('(')[1].split(')')[0]));
                }
                $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                $timeout(function () {
                    for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                        $scope.notificationData[k].showFlag = true;
                    }
                }, 600);                
            },
            failureCallBack: function (iObj) {
               
            }
        });     
    };

    //$rootScope.$broadcast("refreshStateHomeView", {
    //    type: 'loadAppAlertBox',
    //    data: {
    //        alertType: 'Alert',
    //        alertMessage : 'You will not recover this bookmark after performing ok action',
    //        buttonArray : [
    //            {
    //                buttonName: 'Ok',
    //                color: '#A5DC86',
    //                callBackParam : null,
    //                buttonSuccessCallBack: function () {
    //                    alert('ok')
    //                },
                   
    //            },
    //             {
    //                 buttonName: 'Cancel',
    //                 callBackParam: null,
    //                 color: '#D60500',
    //                 buttonSuccessCallBack: function () {
    //                     alert('Cancel')
    //                 },

    //             }
    //        ]            
    //    }
    //});


    var _displayAlertMeesage = function (iObj) {
        var _displayAlert = {
            showAlert: true,
            message: iObj.message,
            formatType:iObj.formatType,
        };
        $rootScope.$broadcast("refreshStateHomeView", {
            type: 'displayAlert',
          
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
        var _id = $rootScope.loggedDetail.EmailAddress + ":CON#" +(Date.now()) +(Math.floor((Math.random() * 10) +1));
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
    
        iCoach.loadingSearchCoach = { loadingEffectCss: { position: 'absolute', background: 'rgba(0,0,0,.48)' }, showLoading: true, loadingMessage: 'Loading' };
        serverCommunication.sendConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.conversation.ReceiverEmail,
            Role: 'Mentee',
            successCallBack: function (iObj) {
                $scope.conversation.Message = "";
              
                if (iObj.data && iObj.data && iObj.data.Message && iObj.data.Message != '') {
                    _displayAlertMeesage({ message: iObj.data.Message, formatType: '1' });
                } else {
                    _displayAlertMeesage({ message: "Your request has been sent", formatType: '1' });
                }
                iCoach.loadingSearchCoach = { showLoading: false, loadingMessage: 'Loading' };
            },
            failureCallBack: function () {
                $scope.conversation.Message = "";
              
            }
        });

    };
    var _setScrollPosition = function () {
        setTimeout(function () {
            var msgDiv = document.getElementById("messagebox");
            msgDiv.scrollTop = msgDiv.scrollHeight;
        }, 400);

    }
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
        } else {
            _flag = false;
            $scope.timeSlots.push({ displayDate: iChatMessage.displayDate, compareDate: iChatMessage.UpdateDate });
        }
    };
    var _sortArray = function () {
        $scope.timeSlots.sort(function (a, b) {
            a = new Date(a.compareDate);
            b = new Date(b.compareDate);
            return a -b;
        });
        $scope.MailRecords.sort(function (a, b) {
            a = new Date(a.UpdateDate);
            b = new Date(b.UpdateDate);
            return a -b;
        });
    };
    $scope.conversationClick = function (iEvent, iClickFlag) {
        iEvent && iEvent.stopPropagation();
     
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
                    ConversationType: "Mentoring",
                    Skill: $scope.openConversation.skill,
                   
                    ConversationId: _id,
                    ConversationParentId: _parentId,
                }

             
                var _replica = angular.copy(_object);
                if (_replica.SenderEmail == $scope.loggedEmail) {
                    _replica.Name = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
                    _replica.Photo = $rootScope.loggedDetail.Photo;
                } else {
                    _replica.Name = $scope.openConversation.FirstName + " " + $scope.openConversation.LastName;
                    _replica.Photo = $scope.openConversation.Photo;
                }
                _replica.UpdateDate = new Date();
              
                _replica.UpdateDate = _replica.UpdateDate.toJSON();
                _replica.displayDate = _displayDate(_replica.UpdateDate);
                _resizeDateFilter(_replica);
                $scope.MailRecords.push(_replica);
                _sortArray();
                _setScrollPosition();
              
                serverCommunication.sendConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.ReceiverName,
                    Role: 'Mentee',
                    successCallBack: function () {
                        $scope.conversation.Message = "";

                       

                    },
                    failureCallBack: function () {

                        $scope.conversation.Message = "";

                     
                    }
                });
            }
        }

    };

    $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail, iNotificationDash) {
        $scope.conversation.IsVerified = isVerfied;
        var contentText = "";
        if (isVerfied != false)
            contentText = 'Mentoring Request by ' +$scope.ApprovalName + ' has been accepted';
        else
            contentText = null;

        var _id = iNotificationDash.ConversationId + ":CHT#" +(Date.now()) +(Math.floor((Math.random() * 10) +1));
        var _object = {
            SenderEmail: SenderEmail,
            ReceiverEmail: ReceiverEmail,
            Content: contentText,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            ConversationType: "Mentoring",
            IsRejected: isVerfied == false ? true : false,
            Skill: iNotificationDash.skill,
           
            ConversationId: _id,
            ConversationParentId: iNotificationDash.ConversationId,
        }

        serverCommunication.updateConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ApprovalName,
            Role: 'Mentee',
            successCallBack: function () {
                
            },
            failureCallBack: function (e) {
              
            }
        });
    };

    $scope.saveSchedular = function (isVerified, emailId) {
     
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
       

        serverCommunication.saveMeeting({
            loggedUserDetails: _object,
            successCallBack: function () {
               
                $scope.myMeetingSchedular.close();
            },
            failureCallBack: function () {
              

            }
        });
    };

   

    $scope.$on("$destroy", function handleDestroyEvent() {
        $scope.stopFight();
    });
    $scope.init = function () {
        $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading'};
     
        $scope.menuClick(0, $scope.leftSideMenus[0]);
        serverCommunication.getCTSFilters({
            Role: 'Mentor',
            successCallBack: function (result) {
             
                 $scope.availableSkills = [];
                result.data.Filters.some(function (iCts) {
                    if (iCts.Type == 1) {
                        $scope.availableSkills.push(iCts);
                    }
                });
              
            },
            failureCallBack: function () {
                

            }
        });
    };
    $scope.init();
});