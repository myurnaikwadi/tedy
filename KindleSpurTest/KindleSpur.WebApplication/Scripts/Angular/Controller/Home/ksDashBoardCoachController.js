app.controller('ksDashBoardCoachController', function ($rootScope,$scope, serverCommunication, $stateParams) {
    console.error($stateParams) 
    $scope.passedData = $stateParams;
    window.ddd = $scope;
    $scope.coachingStatusArray = [{ name: 'MAYUR N', progressBar: 50, skills: 'ANGULAR JS', status: 'NOT STARTED' }
					, { name: 'SAGAR N', progressBar: 30, skills: 'C# MVC', status: 'JUST PROGRESS' }
					, { name: 'SAGAR P', progressBar: 90, skills: 'C# MVC', status: 'JUST PROGRESS' }
					, { name: 'SHILPA M', progressBar: 60, skills: 'BUSINESS', status: 'NOT STARTED' }
					, { name: 'SHANTANU P', progressBar: 05, skills: 'BUSINESS', status: 'JUST PROGRESS' }
					, { name: 'SONALI J', progressBar: 50, skills: 'PROGRAM', status: 'JUST PROGRESS' }
					, { name: 'ISHWAR J', progressBar: 100, skills: 'DEV', status: 'SESSION OVER' }
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
        }
    };
    $scope.getCoachRecord = function () {
        serverCommunication.getCoachingWithStatus({
            loggedUserDetails: $rootScope.loggedDetail,
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);

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
                    
                    alert(iObj.data);
                    $scope.gameKey = iObj.data;
                    console.error('In successCallBack', iObj);

                },
                failureCallBack: function (iObj) {
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

    $scope.myRewardsArray = [
					{ name: 'www.yryr.com', unlockKey : 'NUF783F' },
					{ name: 'PSR', unlockKey: 'UF783GF' },
					{ name: 'www.cdd.com', unlockKey: 'F783F33' },
					{ name: 'www.fff.com', unlockKey: 'N3FF789' }
    ];

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