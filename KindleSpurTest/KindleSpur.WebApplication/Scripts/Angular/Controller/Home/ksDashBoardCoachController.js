app.controller('ksDashBoardCoachController', function ($rootScope, $scope, serverCommunication, $stateParams) {
    console.error($stateParams)
    $scope.passedData = $stateParams;
    $scope.redeemAction = { actionName: "GAME" };
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
               ,{name: 'VALUE FEEDS'}
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [

                 { name: 'SELECT SKILLS', url: '../../Images/icons/book.png ' },
            //    { name: 'COACHING STATUS', url: '../../Images/icons/book.png ' },
                { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/Knowledge.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/KnowledgeFeed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/Resources.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/Reword.png ' }

    ];

    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.closeFeedBackPopup();
        $scope.feedContainArray =[];
        switch (iIndex) {
            case 1: $scope.getCoachRecord(); break;
            case 3: $scope.generateGarden(); break;
            case 4: $scope.getRssFeedData(); break;
            case 6: $scope.getPointsRecord(); break;
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
        $scope.feedCategoryArray =[
                       {
        name: 'C', selected: false
                       },
                       {
        name: 'C++', selected: false
                       },
                       {
        name: 'JAVA', selected: false
                       },
                           {
        name: 'C#', selected: false
                           },
                       {
              name: 'ANGULAR JS', selected: false
                       },

                       ];
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
                        // console.error('In successCallBack', iObj);
                $scope.rewardsPoints.mentorPoints = iObj.data.MentorRewardPoints;
                $scope.rewardsPoints.menteePoints = iObj.data.MenteeRewardPoints;
                $scope.rewardsPoints.coachPoints = iObj.data.CoachRewardPoints;
                $scope.rewardsPoints.coacheePoints = iObj.data.CoacheeRewardPoints;
                $scope.rewardsPoints.totalPoints = iObj.data.TotalRewardPoints;
                $scope.rewardsPoints.balancePoints = iObj.data.BalanceRewardPoints;
                $scope.rewardsPoints.redeemedPoints = iObj.data.RedeemedPoints;
                $scope.myRewardsArray = iObj.data.PSRAndGames;

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
                                "size": 25,
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

    $scope.conversationLoad = function (iIndex, iCategory) {
        for (var i = 0; i < $scope.conversationList.length ; i++) {
            $scope.conversationList[i].selectedConversation = false;
    }
    if (iCategory.selectedConversation == true) {
            iCategory.selectedConversation = false;
    } else {
            iCategory.selectedConversation = true;
    }
    };
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

    }

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
                    $scope.menuClick(7);
                    console.error('In successCallBack', iObj);

        },
                failureCallBack: function (iObj) {
                    console.error('In failureCallBack', iObj);

}
});
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
});