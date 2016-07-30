app.controller('ksDashBoardCoacheeController', function ($scope, serverCommunication) {
    window.cocc = $scope;
    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
                { notificationType: '3', name: 'MOHAN N.', profileImage: '' }
    ];
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                   , { name: 'COACHING STATUS' }
                   , { name: 'KNOWLEDGE GARDEN' }
                   , { name: 'COMMUNICATION' }
                   , { name: 'KNOWLEDGE FEED' }
                 //  , { name: 'RESOURCES' }
                   , { name: 'FIND COACH' }
                   , { name: 'REWARDS' }
                    , { name: 'ADD SkILLS' }
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
    $scope.rightSideDashBoardArray = [
                 { name: 'ADD SkILLS', url: '../../Images/icons/book.png ' },
                { name: 'SEARCH COACH', url: '../../Images/icons/Knowledge.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/KnowledgeFeed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/Resources.png ' },
                { name: 'REWORDS', url: '../../Images/icons/Reword.png ' }

    ]
    $scope.Coaches = [
       { Name: 'Amit Devgan', Skill: 'Storage Engineer', City: 'Pune', Country: 'India' },
       { Name: 'Srinivas R', Skill: 'MVC Devloper', City: 'Pune', Country: 'India' },
       { Name: 'Srinivas R', Skill: 'MVC Devloper', City: 'Pune', Country: 'India' },
       { Name: 'Manjay D', Skill: 'ASP.NET', City: 'Pune', Country: 'India' },
       { Name: 'Rajan', Skill: 'Networking', City: 'Pune', Country: 'India' },
       { Name: 'Abhishek', Skill: 'Java', City: 'Pune', Country: 'India' },
       { Name: 'Abhishek', Skill: 'Java', City: 'Pune', Country: 'India' },
       { Name: 'Keerti', Skill: 'Pharma', City: 'Pune', Country: 'India' },
       { Name: 'Kunal', Skill: 'Accounts', City: 'Pune', Country: 'India' },
       { Name: 'Kunal', Skill: 'Accounts', City: 'Pune', Country: 'India' },
       { Name: 'Gaurav', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
       { Name: 'Shankar', Skill: 'CA', City: 'Pune', Country: 'India' },
    ];

    $scope.loadCommunication = function () {
        $scope.menuClick(3);
    };

    $scope.selectedMenu = 0;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        switch (iIndex) {
            case 5: $scope.getCoachRecord(); break;
                //case 2: $scope.generateGarden(); break;
                //case 6: $scope.getPointsRecord(); break;
        }
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
            successCallBack: function (result) {
                console.log('Result - ' , result);
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
            successCallBack: function (result) {
                console.error(result);

            },
            failureCallBack: function () {
                // console.error('In failureCallBack');

            }
        });
    };
    $scope.init = function () {
        serverCommunication.getCTSFilters({
            successCallBack: function (result) {
                console.error(result)
                $scope.availableSkills.splice(0, $scope.availableSkills.length);
                $scope.availableSkills.push.apply($scope.availableSkills, result.data.Filters);
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