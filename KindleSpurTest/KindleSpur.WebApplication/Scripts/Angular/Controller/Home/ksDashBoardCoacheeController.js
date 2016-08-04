app.controller('ksDashBoardCoacheeController', function ($scope, serverCommunication) {
    window.cocc = $scope;
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
            case 4: $scope.getRssFeedData(); break;
            case 3: $scope.getCoachRecord(); break;
                //case 2: $scope.generateGarden(); break;
                //case 6: $scope.getPointsRecord(); break;
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