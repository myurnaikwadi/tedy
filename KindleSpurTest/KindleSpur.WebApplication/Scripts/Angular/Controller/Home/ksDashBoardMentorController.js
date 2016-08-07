app.controller('ksDashBoardMentorController', function ($scope, serverCommunication, $rootScope) {
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
               { name: 'SELECT TOPICS', url: '../../Images/icons/coaching_status.png ' },
                { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/knowledge_garden.png ' },
                { name: 'KNOWLEDGE FEED', url: '../../Images/icons/Knowledge_feed.png ' },
                { name: 'COMMUNICATION', url: '../../Images/icons/communication.png ' },
                { name: 'MY REWARDS', url: '../../Images/icons/my_rewords.png ' }

    ];

    $scope.selectedMenu = '0';
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        switch (iIndex) {
            case 1 : $scope.getCoachRecord(); break;
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
      $scope.getCoachRecord = function () {
        serverCommunication.getCoachingWithStatus({
              role  : 'mentor',
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
          { name: 'What do you appreciate the most in your interactions with the mentee ? ', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Is the coachee/mentee able to grasp the ideas discussed?', actionValue: '1', type: 'rating', showLoad: false },
          { name: 'What are the Strong Qualities of the Mentee/ Coachee ?', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'What are the areas where the Mentee needs to Improve ? ', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Are there any critical areas where Mentee/ Coachee needs serious and urgent help/ support ?', actionValue: '', type: 'textArea', showLoad: false },
          { name: 'Do you believe that the Mentee will be Successful in the targeted areas after the Mentoring is complete ?', actionValue: '', type: 'radio', showLoad: false },
          { name: 'Was it worth your time, energy and interest ?', type: 'radio', showLoad: false, actionValue: '', },
          { name: 'Rate the session', sessionRating: true, type: 'rating', showLoad: false, actionValue: '', },
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
          console.error($scope.displayArray, _loadArray);
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

    $scope.feedCategoryArray = [];
    $scope.getRssFeedData = function () {
        //feedback
        $scope.feedCategoryArray = [];
        serverCommunication.getMyMentorSelection({  
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