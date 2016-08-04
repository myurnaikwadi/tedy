app.controller('ksDashBoardMenteeController', function ($scope, serverCommunication) {
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },

    ];
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
    ]
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
       // $scope.askFeedback = false;
        switch (iIndex) {
           // case 3: $scope.getCoachRecord(); break;
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