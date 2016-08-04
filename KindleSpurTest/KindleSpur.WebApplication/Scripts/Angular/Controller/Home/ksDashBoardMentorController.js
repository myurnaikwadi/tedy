app.controller('ksDashBoardMentorController', function ($scope, serverCommunication) {
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ]
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                , { name: 'MENTORING STATUS' }
                   , { name: 'SELECT TOPICS' }
                , { name: 'KNOWLEDGE GARDEN' }
                 , { name: 'KNOWLEDGE FEED' }
                , { name: 'COMMUNICATION' }
              //  , { name: 'KNOWLEDGE FEED' }
              //  , { name: 'RESOURCES' }               
                , { name: 'MY REWARDS' }
                // , { name: 'VCS' }
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
                 { name: 'SELECT TOPICS', url: '../../Images/icons/book.png ' },
                { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/Knowledge.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/KnowledgeFeed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/Resources.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/Reword.png ' }
    ];

    $scope.selectedMenu = '0';
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        switch (iIndex) {
            case 4: $scope.getRssFeedData(); break;
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

    $scope.init = function () {

        serverCommunication.getMentorData({
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