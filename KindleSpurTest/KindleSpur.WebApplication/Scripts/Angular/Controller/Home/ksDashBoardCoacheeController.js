app.controller('ksDashBoardCoacheeController', function ($rootScope, $scope, serverCommunication) {
    window.cocc = $scope;
    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " + $rootScope.loggedDetail.LastName;
    $scope.conversation = {};
    $scope.ReceiverName = "";

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
                   // , { name: 'ADD SKILLS' }
    ];
    $scope.rightSideDashBoardArray = [
                { name: 'SELECT SKILLS', url: '../../Images/icons/coaching_status.png' },
               { name: 'SEARCH COACH', url: '../../Images/icons/search_mentor_coach.png  ' },
               { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png' },
               { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
               { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' }

    ]
    //$scope.leftSideMenus = [{ name: 'DASHBOARD' },
    //                        { name: 'COACHING STATUS' },
    //                        { name: 'KNOWLEDGE GARDEN' },
    //                        { name: 'COMMUNICATION' },
    //                        { name: 'GRAPHS' },
    //                        { name: 'RESOURCES' },
    //                        { name: 'FIND COACH' }
    //];

    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
   
    $scope.Coaches = [];

    $scope.loadCommunication = function () {
        $scope.menuClick(3);
    };

    $scope.selectedMenu = 0;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        switch (iIndex) {
            case 0: $scope.conversationStartData($scope.loggedEmail); break;
            case 4: $scope.getRssFeedData(); break;
            case 3: $scope.getCoachRecord(); break;
                //case 2: $scope.generateGarden(); break;
                //case 6: $scope.getPointsRecord(); break;
            case 5:
                if ($scope.conversationListNew.length > 0)
                {
                    $scope.ReceiverName = $scope.conversationListNew[0].FirstName + " " + $scope.conversationListNew[0].LastName;
                    $scope.ReceiverEmail = $scope.conversationListNew[0].EmailAddress;
                    $scope.conversationStartData($scope.loggedEmail);
                    $scope.showSelectedConversation($scope.loggedEmail, $scope.ReceiverEmail);
                }
                    break;
        }
    };
    $scope.selectedOption = function (iIndex, iCate) {
        for (var k = 0; k < $scope.leftSideMenus.length; k++) {
            if ($scope.leftSideMenus[k].name == iCate.name) {
                $scope.menuClick(k, $scope.leftSideMenus[k]);
            }
        }
    };
    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
        $scope.feedCategoryArray = [];
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
            role : 'Coach',
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

    $scope.getCoachRecord = function () {
        serverCommunication.getRecommendedCoach({
            Role : 'Coach',
            successCallBack: function (result) {
                console.error(result);
                if (result.data)
                    $scope.Coaches = [].concat(result.data);
            },
            failureCallBack: function () {
                // console.error('In failureCallBack');

            }
        });
    };

    /*START: Conversation Module Code*/
    $scope.conversationStartData = function (loggedEmail) {

        serverCommunication.getConversation({
            loggedEmail: loggedEmail,
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);
                function ObjectId(id) { return id; }
                function ISODate(d) { return d; }
                $scope.conversationListNew = iObj.data.Result;
                if ($scope.conversationListNew && $scope.conversationListNew.length > 0)
                     $scope.conversationListNew[0].selectedConversation = true;
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
    
    $scope.conversationLoad = function (iIndex, iCategory) {
        for (var i = 0 ; i < $scope.conversationListNew.length ; i++) {
            $scope.conversationListNew[i].selectedConversation = false;
        }
        if (iCategory.selectedConversation == true) {
            iCategory.selectedConversation = false;
        } else {
            iCategory.selectedConversation = true;
        }

        if ($scope.ReceiverEmail !== "") {
            $scope.ReceiverName = iCategory.FirstName + " " + iCategory.LastName;
            $scope.ReceiverEmail = iCategory.EmailAddress;
        }
        else {
            $scope.ReceiverName = $scope.conversationListNew[0].FirstName + " " + $scope.conversationListNew[0].LastName;
            $scope.ReceiverEmail = $scope.conversationListNew[0].EmailAddress;
        }

        $scope.showSelectedConversation($scope.loggedEmail, $scope.ReceiverEmail);
    };

    $scope.showSelectedConversation = function (SenderEmail, ReceiverEmail) {
        serverCommunication.getConversationDetails({
            senderEmail: SenderEmail,
            receiverEmail: ReceiverEmail,
            successCallBack: function (iObj) {
                console.debug('In successCallBack', iObj);

                function ObjectId(id) { return id; }
                function ISODate(d) {
                    return d;
                }

                $scope.MailRecords = eval('(' + iObj.data.Result + ')');
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

    $scope.conversationClick = function (isVerified, emailId) {
        $scope.conversation.SenderEmail = $scope.loggedEmail;
        if (emailId != "")
            $scope.conversation.ReceiverEmail = emailId;
        else
            $scope.conversation.ReceiverEmail = $scope.ReceiverEmail;

        $scope.conversation.Content = $scope.conversation.Message;
        $scope.conversation.SendOrReceive = "Send";
        $scope.conversation.IsVerified = isVerified;
        $scope.conversation.isRead = false;

        if ($scope.conversation.SenderEmail === "" || $scope.conversation.ReceiverEmail === "")
            return false;

        var _object = {
            Content: $scope.conversation.Content,
            SenderEmail: $scope.conversation.SenderEmail,
            ReceiverEmail: $scope.conversation.ReceiverEmail,
            SendOrReceive: $scope.conversation.SendOrReceive,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed : false,
            ConversationType:'Coaching',
            Skill: 'Finance Management'
        }
        console.debug(_object);

        serverCommunication.sendConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ReceiverName,
            Role: 'Coachee',          
            successCallBack: function () {
                $scope.conversation.Message = "";
                if (_object.Content != null) {
                    $scope.menuClick(5, "CONVERSATIONS");
                    $scope.showSelectedConversation(_object.SenderEmail, _object.ReceiverEmail);
                }
                console.debug('In successCallBack');

            },
            failureCallBack: function () {

                $scope.conversation.Message = "";
                if (_object.Content != null) {
                    $scope.menuClick(5, "CONVERSATIONS");
                    $scope.showSelectedConversation(_object.SenderEmail, _object.ReceiverEmail);
                }
                console.debug('In failureCallBack');
            }
        });

    };

    $scope.updateConversation = function (isVerfied, SenderEmail, ReceiverEmail) {
        $scope.conversation.IsVerified = isVerfied;
        var contentText = "";
        if (isVerfied != false)
            contentText = 'SESSION REQUEST BY ' + $scope.ApprovalName + ' HAS BEEN ACCEPTED';
        else
            contentText = null;
            
        var _object = {
            SenderEmail: SenderEmail,
            ReceiverEmail: ReceiverEmail,
            Content: contentText,
            IsVerified: $scope.conversation.IsVerified,
            ConversationClosed: false,
            ConversationType:'Coaching',
            Skill: 'Finance Management'
        }

        serverCommunication.updateConversation({
            loggedUserDetails: _object,
            ReceiverName: $scope.ApprovalName,
            Role: 'Coachee',
            successCallBack: function () {
                $scope.menuClick(5, "CONVERSATIONS");
                $scope.showSelectedConversation($scope.loggedEmail, $scope.ApprovalName);
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

    $scope.conversationStartData($scope.loggedEmail);
    $scope.conversationRequest();
    /*END: Conversation Module Code*/

    $scope.init = function () {
        serverCommunication.getCTSFilters({
            Role: 'Mentor',
            successCallBack: function (result) {
                console.error(result)
                result.data.Filters.some(function (iCts) {
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
    };
    $scope.init();
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