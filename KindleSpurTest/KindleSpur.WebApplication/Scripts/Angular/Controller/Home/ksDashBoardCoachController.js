app.controller('ksDashBoardCoachController', function ($rootScope, $scope, serverCommunication, $stateParams) {
    console.error($stateParams)
    $scope.passedData = $stateParams;
    $scope.redeemAction = { actionName: "GAME" };

    $scope.loggedEmail = $rootScope.loggedDetail.EmailAddress;
    $scope.ApprovalName = $rootScope.loggedDetail.FirstName + " " +$rootScope.loggedDetail.LastName;
    $scope.conversation = {
    };
    window.ddd = $scope;
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
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ]
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                , { name: 'COACHING STATUS' }
                 , { name: 'SELECT SKILLS' }
                , { name: 'KNOWLEDGE GARDEN' }
                 , { name: 'KNOWLEDGE FEED'  }
                , { name: 'COMMUNICATION' }
             //   , { name: 'KNOWLEDGE FEED' }
              //  , { name: 'RESOURCES' }
             //   , { name: 'ADD SKILLS' }
                , { name: 'MY REWARDS' }
                // , { name: 'VCS' }
              
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
                { name: 'SELECT SKILLS', url: '../../Images/icons/coaching_status.png ' },
                { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/knowledge_garden.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' }

    ];

   $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray = [];
        switch (iIndex) {
            case 0: $scope.conversationStartData($scope.loggedEmail); break;
            case 1: $scope.getCoachRecord(); break;
            case 3: $scope.generateGarden(); break;
            case 4: $scope.getRssFeedData(); break;
            case 6: $scope.getPointsRecord(); break;
            case 5 :
                if ($scope.conversationListNew.length > 0)
                { 
                    $scope.ReceiverName = $scope.conversationListNew[0].FirstName + " " +$scope.conversationListNew[0].LastName;
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
    $scope.feedCategoryArray =[];
    $scope.getRssFeedData = function () {
            //feedback
        $scope.feedCategoryArray = [];
        serverCommunication.getMySelection({
                successCallBack: function (iObj) {
                console.error('In getMySelection', iObj);
                _category = {
        };
                _topics = { };
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
                                        _skills[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                        if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = { }
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                }
                                }
                                    } else {
                                        _topics[iObj.data.Categories[k].Topic]= { Name: iObj.data.Categories[k].Topic, skill: {
                                }, profiLevel: iObj.data.Categories[k].profiLevel };
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]= { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                if (iObj.data.Categories[k].Skill) {
                                    _skills[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                    if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = { }
                                    _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                                }
                            }
                            }
                                } else {
                                    _category[iObj.data.Categories[k].Category]= {
                                Name: iObj.data.Categories[k].Category, topic: { } };
                                _topics[iObj.data.Categories[k].Topic]= { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]= { Name: iObj.data.Categories[k].Topic, skill: {
                            }, profiLevel: iObj.data.Categories[k].profiLevel
                            };
                            if (iObj.data.Categories[k].Skill) {
                                _skills[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = { }
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill]= { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel
                            }
                    }
                }
        }

                        }
                        }
                        }
                console.error('In getMySelection', _category, _topics, _skills);
                if (Object.keys(_skills).length > 0) {
                    $scope.feedCategoryArray =[];
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
      
    $scope.rewardsPoints = {
        mentorPoints: 0,
        menteePoints: 0,
        coachPoints: 0,
        coacheePoints: 0,
        balancePoints: 0,
        redeemedPoints: 0,
        totalPoints: 0
    };
    $scope.myRewardsArray =[
                           { Name: 'www.yryr.com', date: '12/12/2011', Key: 'NUF783F', PSR: false
    },
    ];


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
                $scope.myRewardsArray = iObj.data.PSRAndGames  ? iObj.data.PSRAndGames : [];

            },
                    failureCallBack: function (iObj) {
                        //console.error('In failureCallBack', iObj);

        }
        });
    };

    $scope.generateGarden = function () {
        $scope.ctsDataForMolecule = null;
        serverCommunication.getCoachingWithStatus({
                loggedUserDetails: $rootScope.loggedDetail,
                successCallBack: function (iObj) {
                     console.error('In successCallBack', iObj);
                    $scope.coachingStatusArray = iObj.data.Filters;

                    var _array =[];
                    for (var k = 0; k < $scope.coachingStatusArray.length ; k++) {
                        //$scope.coachingStatusArray[k]
                            var _str = $scope.coachingStatusArray[k].FirstName +" "+$scope.coachingStatusArray[k].LastName;
                            _array.push({
                                "symbol": _str.toUpperCase(),
                                "image": $scope.coachingStatusArray[k].TreeURL,
                                "size": 45,
                                "id": Math.random() +k,
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
    $scope.getCoachRecord = function () {
        serverCommunication.getCoachingWithStatus({
              role  : 'coach',
              loggedUserDetails: $rootScope.loggedDetail,
              successCallBack: function (iObj) {
                   console.error('In successCallBack', iObj);
                   $scope.coachingStatusArray = iObj.data.Filters;
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
        });
    };
   
    $scope.init = function () {
        console.error($scope.passedData)
        if($scope.passedData &&  $scope.passedData.param) {

            $scope.selectedMenu = '6';
        } else {
            $scope.selectedMenu = '0';
            serverCommunication.getCoachData({
                    successCallBack: function (iObj) {
                    console.error('In successCallBack', iObj);

            },
                    failureCallBack: function (iObj) {
                    console.error('In failureCallBack', iObj);

            }
        });
    }

            };
    $scope.init();



    $scope.conversationList =[{ name: 'HARSHADA D'
    }
                , { name: 'SAGAR N'
    }
                , { name: 'SAGAR P'
    }
                , { name: 'MAYUR'
    }

    ]

    //$scope.conversationLoad = function (iIndex, iCategory) {
    //    for (var i = 0; i < $scope.conversationList.length ; i++) {
    //        $scope.conversationList[i].selectedConversation = false;
    //}
    //if (iCategory.selectedConversation == true) {
    //        iCategory.selectedConversation = false;
    //} else {
    //        iCategory.selectedConversation = true;
    //}
    //};
    $scope.feedBack = {
        selectedComparioson: 1,
        selectedAttractive: 1,
        selectedstar: 1,
        likeMostMessage: '',
    };

    $scope.feedBack.competitorSelected = function (iIndex) {
        $scope.feedBack.selectedComparioson = iIndex;
    };

    $scope.feedBack.findAttractiveSelected = function (iIndex) {
        $scope.feedBack.selectedAttractive = iIndex;
    };

    $scope.feedBack.starSelected = function (iIndex) {
        $scope.feedBack.selectedstar = iIndex;
    };

    $scope.points = 0;
    $scope.feedBack.sendFeedBackDetail = function () {
        //$scope.askFeedback = false;
        var _object = {
                sender: "patilsagar28290@gmail.com",
                selectedComparioson: {
                        question: 'HOW DO YOU COMPARE THE VALUE WE PROVIDE YOU AGAINST OUR COMPETITOR',
                        answer: $scope.feedBack.selectedComparioson,
        },
                selectedAttractive: {
                        question: 'WHAT DO YOU FIND MOST ATTRACTIVE ABOUT OUR COMPANY?',
                        answer: $scope.feedBack.selectedAttractive,
        },
                customerSatisfactionRating: $scope.feedBack.selectedstar,
                FeedbackText: $scope.feedBack.likeMostMessage
    }
    console.error(_object);

        serverCommunication.sendFeedback({
                loggedUserDetails: _object,
                successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.getPointsRecord();
        },
                failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

    }
    });
    };


        $scope.catogoryArray =[
                        { name: 'Advertising'
        },
                        { name: 'Education'
        },
                        { name: 'Engineering'
        },
                        { name: 'Marketing'
        },
                        { name: 'BRAIN GAMES'
        },
                        { name: 'RESOURCES'
    }
    ];

    $scope.feedBack.askFeedback = false;
    $scope.feedBack.formValue = '0';
    $scope.askFeedBackFunc = function () {
        $scope.feedBack.askFeedback = true;
        $scope.feedBack.formValue = '1';
        $scope.feedBack.selectedComparioson = 1;
        $scope.feedBack.selectedAttractive = 1;
        $scope.feedBack.selectedstar = 1;
        $scope.feedBack.likeMostMessage = '';
        $scope.feedBackloaded = { showLoad: false };
        $scope.loadSlideData(1);
    }

    $scope.array = [
        { name: 'What do you appreciate the most in your interactions with the mentee ? ', actionValue : '', type: 'textArea', showLoad: false },
        { name: 'Is the coachee/mentee able to grasp the ideas discussed?', actionValue: '1', type: 'rating', showLoad: false },
        { name: 'What are the Strong Qualities of the Mentee/ Coachee ?', actionValue: '', type: 'textArea', showLoad: false },
        { name: 'What are the areas where the Mentee needs to Improve ? ', actionValue: '', type: 'textArea', showLoad: false },
        { name: 'Are there any critical areas where Mentee/ Coachee needs serious and urgent help/ support ?', actionValue: '', type: 'textArea', showLoad: false },
        { name: 'Do you believe that the Mentee will be Successful in the targeted areas after the Mentoring is complete ?', actionValue: '', type: 'radio', showLoad: false },
        { name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false ,actionValue : '', },
        { name: 'Rate the session', sessionRating :true, type: 'rating', showLoad: false,actionValue : '',  },
    ];

    $scope.displayArray = [];
    $scope.counter = 4;
    $scope.loadSlideData = function (iMode) {
        $scope.feedBackloaded.showLoad = false;
        var _loadArray = [];
        $scope.displayArray = [];
        if (iMode == 0) {
            for (var k = 0 ; k < $scope.counter ; k++) {
                _loadArray.push(angular.copy($scope.array[k]));
                if (_loadArray.length == $scope.counter) {
                    break;
                }
            }
        } else {
            for (var k = 4 ; k < $scope.array.length ; k++) {
                _loadArray.push(angular.copy($scope.array[k]));
                if (_loadArray.length == $scope.counter) {
                    break;
                }
            }
            
        }
        console.error($scope.displayArray,_loadArray);
        $scope.displayArray = [].concat(_loadArray);
        setTimeout(function () {                 
            for (var k = 0 ; k < $scope.displayArray.length ; k++) {
                $scope.displayArray[k].showLoad = true;
            }
            $scope.$apply();
        }, 500);
    };

    $scope.feedBack.closeFeedBackPopup = function () {
        $scope.feedBack.askFeedback = false;
        $scope.feedBack.formValue = '1';
        $scope.feedBack.selectedComparioson = 1;
        $scope.feedBack.selectedAttractive = 1;
        $scope.feedBack.selectedstar = 1;
        $scope.feedBack.likeMostMessage = '';
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
     
    $scope.openRedeemPanel = function () {
        $scope.feedBack.askFeedback = true;
        $scope.feedBack.formValue = '7';
    };

    $scope.GetPrfileView = function () {
        serverCommunication.getMySelection({
            loggedUserDetails: $rootScope.loggedDetail,
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.coachingStatusArray = iObj.data.Filters;

            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

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
                console.debug('In successCallBack', iObj);

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
            ConversationClosed: false,
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
        $scope.MeetingSchedular.Role = "Coach";

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
   
});