app.controller('ksDashBoardMenteeController', function ($scope, serverCommunication) {
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ];
    $scope.selectedMenu = '0';
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                 , { name: 'MENTORING STATUS' }
                 , { name: 'KNOWLEDGE GARDEN' }
                 , { name: 'COMMUNICATION' }
                 , { name: 'KNOWLEDGE FEED' }
               //  , { name: 'RESOURCES' }
                 , { name: 'SEARCH MENTOR' }
                 , { name: 'REWARDS' }
                 , { name: 'ADD TOPICS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
               { name: 'ADD TOPICS', url: '../../Images/icons/book.png ' },
                { name: 'SEARCH MENTOR', url: '../../Images/icons/Knowledge.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/KnowledgeFeed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/Resources.png ' },
                { name: 'REWARDS', url: '../../Images/icons/Reword.png ' }
    ]
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;



        $scope.askFeedback = false;
        switch (iIndex) {
            case 1: $scope.getCoachRecord(); break;
            case 4: $scope.getRssFeedData(); break;
            case 7: $scope.getPointsRecord(); break;
        }
    };
    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
        $scope.feedCategoryArray = [
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
    $scope.init = function () {

        serverCommunication.getMenteeData({
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        });
    };
    $scope.init();
});