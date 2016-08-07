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
    ];

    $scope.availableSkills = [];
    $scope.searchKey = '';
    $scope.searching = false;
    $scope.selectedSkill = {};
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
            Role: 'Mentor',
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
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        // $scope.askFeedback = false;
        switch (iIndex) {
            case 3: $scope.getCoachRecord(); break;
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
    $scope.Coaches = [];
    $scope.getCoachRecord = function () {
        serverCommunication.getRecommendedCoach({
            Role: 'Mentor',
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
    $scope.feedBack = {}
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
        { name: 'Was the sessions objective achieved ?  ', actionValue: '', type: 'rating', showLoad: false },
            {name: 'Was the session as per plan ? Was this session fine-tuned based on your previous session feedback ?', actionValue: '1', type: 'radio', showLoad: false},
                {name: 'What should have been avoided / What should have been better ? Describe ', actionValue: '', type: 'textArea', showLoad: false},
                        {name: 'What was best about the session ? Describe  ', actionValue: '', type: 'textArea', showLoad: false},
                        {name: ' Is the Mentor using the best practice of - continuous review and improvement ? ', actionValue: '', type: 'radio', showLoad: false},
                        {name: 'Did you gain in confidence after the session ?', actionValue: '', type: 'radio', showLoad: false},
                        {name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '',},
                            {name: ' Rate the session ', sessionRating: true, type: 'rating', showLoad: false, actionValue: '',},
    ];

    $scope.displayArray = [];
    $scope.counter = 4;
    $scope.loadSlideData = function (iMode) {
        $scope.feedBackloaded.showLoad = false;
        var _loadArray = [];
        $scope.displayArray = [];
        if (iMode == 0) {
            for (var k = 0; k < $scope.counter; k++) {
                _loadArray.push(angular.copy($scope.array[k]));
                if (_loadArray.length == $scope.counter) {
                    break;
                }
            }
        } else {
            for (var k = 4; k < $scope.array.length; k++) {
                _loadArray.push(angular.copy($scope.array[k]));
                if (_loadArray.length == $scope.counter) {
                    break;
                }
            }

        }
        console.error($scope.displayArray, _loadArray);
        $scope.displayArray = [].concat(_loadArray);
        setTimeout(function () {
            for (var k = 0; k < $scope.displayArray.length; k++) {
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

    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
        $scope.feedCategoryArray = [];
        serverCommunication.getMyMenteeSelection({
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
    //$scope.getCoachRecord = function () {
    //    serverCommunication.getCoachingWithStatus({
    //        loggedUserDetails: $rootScope.loggedDetail,
    //        successCallBack: function (iObj) {
    //            console.error('In successCallBack', iObj);

    //        }
    //    }
    //    }
    //            console.error('In getMySelection', _category, _topics, _skills);
    //            if (Object.keys(_topics).length > 0) {
    //                $scope.feedCategoryArray = [];
    //            }
    //            for (var _skill in _topics) {
    //                $scope.feedCategoryArray.push({ selected: false, name: _skill });
    //            }
    //            if (!$scope.$$phase) $scope.$digest();
    //        },
    //        failureCallBack: function (iObj) {
    //            console.error('In failuregetMySelectionCallBack', iObj);

    //        }
    //    });

    //};

    $scope.init = function () {

        serverCommunication.getCTSFilters({
            Role: 'Mentor',
            successCallBack: function (result) {
                console.error(result)
                result.data.Filters.some(function (iCts) {
                    if (iCts.Type == 1) {
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
});