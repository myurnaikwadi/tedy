app.controller('ksDashBoardCoachController', function ($rootScope,$scope, serverCommunication, $stateParams) {
    console.error($stateParams) 
    $scope.passedData = $stateParams;
    window.ddd = $scope;
    $scope.coachingStatusArray = [{ Sender : '', FirstName: 'MAYUR', LastName: 'N',PhotoURL :'', Rating : '', TreeURL : '', FeedbackCount: 5, Skill: 'ANGULAR JS' }
					, { Sender: '', FirstName: 'SAGAR N', LastName: 'N', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 3, Skill: 'C# MVC' }
					, { Sender: '', FirstName: 'SAGAR P', LastName: 'P', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 1, Skill: 'C# MVC' }
					, { Sender: '', FirstName: 'SHILPA', LastName: 'M', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 6, Skill: 'BUSINESS' }
					, { Sender: '', FirstName: 'SHANTANU', LastName: 'P', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 5, Skill: 'BUSINESS' }
					, { Sender: '', FirstName: 'SONALI', LastName: 'J', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 5, Skill: 'PROGRAM' }
					, { Sender: '', FirstName: 'ISHWAR', LastName: 'J', PhotoURL: '', Rating: '', TreeURL: '', FeedbackCount: 1, Skill: 'DEV', }
    ];


    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
               
    ]
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                , { name: 'COACHING STATUS' }
                , { name: 'KNOWLEDGE GARDEN' }
                , { name: 'BRAIN GAMES' }
                , { name: 'GRAPHS' }
                , { name: 'RESOURCES' }
                , { name: 'Add Skills' }
                , { name: 'REWARDS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
                { name: 'COACHING STATUS' },
                { name: 'KNOWLEDGE GARDEN' },
                { name: 'FEED YOU SHOULD READ' },
                { name: 'GRAPHS' },
                { name: 'BRAIN GAMES' },
                { name: 'RESOURCES' }
    ];
  
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        $scope.feedBack.selectedComparioson = 1;
        $scope.feedBack.selectedAttractive = 1;
        $scope.feedBack.selectedstar = 1;
        $scope.feedBack.likeMostMessage = '';
          
        
        $scope.askFeedback = false;
        switch (iIndex) {
            case 1: $scope.getCoachRecord(); break;
            case 7: $scope.getPointsRecord(); break;
        }
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
    $scope.myRewardsArray = [
                   { name: 'www.yryr.com', Key: 'NUF783F' },
                   { name: 'PSR', Key: 'UF783GF' },
                   { name: 'www.cdd.com', Key: 'F783F33' },
                   { name: 'www.fff.com', Key: 'N3FF789' }
    ];
    $scope.getPointsRecord = function () {
        serverCommunication.getPointsRecord({
        
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
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
    $scope.selectedOption = function (iIndex, iCate) {

        if (iCate.name == 'BRAIN GAMES') {
            iCate.selectedOption = !iCate.selectedOption;
            serverCommunication.unlockGameCode({
             //   loggedUserDetails: $rootScope.loggedDetail,
                successCallBack: function (iObj) {
                    debugger;
                    $scope.getPointsRecord();
                    alert(iObj.data);
                    $scope.gameKey = iObj.data;
                    console.error('In successCallBack', iObj);

                },
                failureCallBack: function (iObj) {
                    alert('Sorry......, You do not have sufficient point to unlock games!!!');
                    console.error('In failureCallBack', iObj);

                }
            });
        }
    }

    $scope.init = function () {
        console.error( $scope.passedData)
        if( $scope.passedData &&  $scope.passedData.param){

            $scope.selectedMenu = '6';
        }else{
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



    $scope.conversationList = [{ name: 'HARSHADA D' }
                , { name: 'SAGAR N' }
                , { name: 'SAGAR P' }
                , { name: 'MAYUR' }

    ]

    $scope.conversationLoad = function (iIndex, iCategory) {
        for (var i = 0 ; i < $scope.conversationList.length ; i++) {
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
            sender : "patilsagar28290@gmail.com",
            selectedComparioson: {
                question : 'HOW DO YOU COMPARE THE VALUE WE PROVIDE YOU AGAINST OUR COMPETITOR',
                answer   : $scope.feedBack.selectedComparioson,
            },
            selectedAttractive: { 
                question: 'WHAT DO YOU FIND MOST ATTRACTIVE ABOUT OUR COMPANY?',
                answer   : $scope.feedBack.selectedAttractive,
            },
            customerSatisfactionRating: $scope.feedBack.selectedstar,
            FeedbackText: $scope.feedBack.likeMostMessage
        }
        console.error(_object);
        
        serverCommunication.sendFeedback({
            loggedUserDetails: _object,
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.points = iObj.data;
            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
    };

    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
                { name: 'COACHING STATUS' },
                { name: 'KNOWLEDGE GARDEN' },
                { name: 'FEED YOU SHOULD READ' },
                { name: 'GRAPHS' },
                { name: 'BRAIN GAMES' },
                { name: 'RESOURCES' }
    ]
    $scope.catogoryArray = [
                { name: 'Advertising' },
                { name: 'Education' },
                { name: 'Engineering' },
                { name: 'Marketing' },
                { name: 'BRAIN GAMES' },
                { name: 'RESOURCES' }
    ];

    $scope.askFeedback = false;
    $scope.formValue = '0';
    $scope.askFeedBackFunc= function () {
        $scope.askFeedback = true;  
        $scope.formValue = '1';
        $scope.feedBack.selectedComparioson = 1;
        $scope.feedBack.selectedAttractive = 1;
        $scope.feedBack.selectedstar = 1;
        $scope.feedBack.likeMostMessage = '';

    }

    $scope.redeemPointsClick = function () {
        $scope.askFeedback = false;
        $scope.formValue = '1';
        $scope.menuClick(7);
        serverCommunication.unlockGameCode({
            //   loggedUserDetails: $rootScope.loggedDetail,
            successCallBack: function (iObj) {

                alert(iObj.data);
                $scope.gameKey = iObj.data;
                console.error('In successCallBack', iObj);

            },
            failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

            }
        });
    };

    $scope.openRedeemPanel = function () {
        $scope.askFeedback = true;
        $scope.formValue = '6';
    };

});