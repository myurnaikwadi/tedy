app.directive('pwdCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);
app.directive('focusMe', function ($timeout, $parse) {
    return {
        scope: {
            blur: '&',
            setFocus: '='
        },
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            console.error(scope.setFocus);
            if (element[0] && scope.setFocus) element[0].focus();
            element.bind('blur', function () {
                scope.$apply(function () {
                    if ('undefined' !== typeof scope.blur) {
                        scope.blur();
                    }
                });
            });
        }
    };
});

app.directive('topMainStrip', function ($state) {
    return {
        scope: {
            notification: '@'
        },
        templateUrl: '/Home/ksTopMainStrip',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.selectedRole = 0;
            scope.notification = (scope.notification || scope.notification == false) ? scope.notification : true;
            scope.logout = function () {
                console.error(IN.User)
                if (IN.User) IN.User.logout();
                $state.go('login');
                authentification.logout({ loginObject: {} });
            };
            scope.navigateAsPerRole = function (iRole) {
                console.error(iRole);
                scope.selectedRole = iRole;
                switch (iRole) {
                    case 0: $state.go('dashBoardCoachee'); break;
                    case 1: $state.go('dashBoardCoach'); break;
                    case 2: $state.go('dashBoardMentee'); break;
                    case 3: $state.go('dashBoardMentor'); break;
                    case 4: $state.go('landingPage'); break;//navigate to home page
                }
            };
        }
    };
});
app.directive('bottomMainStrip', function ($timeout) {
    return {
        scope: {

        },
        template: '<div style="float: left;width: 100%;height: 100%;display: flex;"><ul class="bottomStripOption"><li class="fontClass" ng-repeat = "option in bottomOptionArray">{{ option.name}}</li></ul></div>',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            console.error(scope);
            scope.bottomOptionArray = [
               { name: 'ABOUT' },
               { name: 'FEEDBACK' },
               { name: 'PRIVACY POLICY' },
               { name: 'TERMS AND CONDITIONS' },
             ];
        }
    };
});

app.directive('ctcRole', function ($state, serverCommunication) {
    return {
        scope: {
            role: "@",
            skillRequired: "=",
        },
        templateUrl: '/Home/ksCtcRole',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.cts = scope;
            scope.catogoryArray = [];
            scope.topicArray = [
                 { name: 'Advertising' },
                 { name: 'Education' },
                 { name: 'Engineering' },
                 { name: 'Marketing' },
                 { name: 'BRAIN GAMES' },
                 { name: 'RESOURCES' }
            ];
            scope.skillsArray = [];
            scope.mySelection = true;
            // scope.selectedCategory = -1;
            scope.selectedTopic = -1;
            scope.selectedSkills = -1;
            scope.selectedCategoryValue = null;
            scope.categoryDisplay = true;
            var _deleteArray = {};
            var _updateArray = {};
            scope.categoryClick = function (iEvent, iIndex, iCategory) {
                // scope.selectedCategory = iIndex;
                iCategory.type = 'C';
                //if(iCategory.selectedCategory == true){//already select
                //    if (iCategory.alreadySelected == true) {//make delete array
                //        _deleteArray[iCategory.Name] = iCategory;
                //    }
                //}

                iCategory.selectedCategory = true;
                scope.categoryDisplay = false;
                scope.selectedCategoryValue = iCategory;
                //if (iCategory.alreadySelected == true) {
                //    if (_deleteArray[iCategory.Name]) delete _deleteArray[iCategory.Name];
                //} else {
                //    if (_updateArray[iCategory.Name]) {
                //        _updateArray[iCategory.Name] = iCategory;
                //    }
                //}
                scope.topicArray = [].concat(iCategory.Topics)
                for (var k = 0; k < scope.topicArray.length ; k++) {
                    scope.topicArray[k].selected = false;
                    // console.error('1')
                    if (!scope.topicArray[k].profiLevel) scope.topicArray[k].profiLevel = '0';
                    if (_topics[scope.topicArray[k].Name]) {
                        //console.error('12')
                        scope.topicArray[k].alreadySelected = true;
                        scope.topicSelection(iEvent, k, scope.topicArray[k]);
                    }

                }
            };


            scope.topicSelection = function (iEvent, iIndex, iTopic) {
                iEvent.stopPropagation();
                iTopic.type = 'T';
                //debugger                               

                if (iTopic.selected) {
                    iTopic.selected = false;
                    if (iTopic.alreadySelected == true) {//make delete array
                        _deleteArray[iTopic.Name] = iTopic;
                    }
                    //if (_updateArray[iTopic.Name]) {
                    //    delete _updateArray[iTopic.Name];
                    //}
                    if (scope.skillRequired) {
                        if (iTopic.Skills.length > 0) {
                            var _deleteArr = [];
                            for (var l = 0 ; l < scope.skillsArray.length; l++) {
                                for (var k = 0; k < iTopic.Skills.length ; k++) {
                                    //if (_updateArray[iTopic.Skills[k].Name]) 
                                    //    delete _updateArray[iTopic.Skills[k].Name];                                   
                                    if (iTopic.Skills[k].alreadySelected == true) {
                                        _deleteArray[iTopic.Skills[k].Name] = iTopic.Skills[k];
                                    }
                                    if (scope.skillsArray[l] && scope.skillsArray[l].Name == iTopic.Skills[k].Name) {
                                        _deleteArr.push(l);
                                    }
                                }
                            }
                            // console.error(_deleteArray)
                            _deleteArr.sort(function (a, b) { return b - a })
                            for (var z = 0 ; z < _deleteArr.length ; z++) {
                                scope.skillsArray.splice(_deleteArr[z], 1);
                            }
                        }
                    }
                }
                else {
                    iTopic.selected = true;

                    if (iTopic.alreadySelected == true) {
                        if (_deleteArray[iTopic.Name]) delete _deleteArray[iTopic.Name];
                        //    if (_updateArray[iTopic.Name]) delete _updateArray[iTopic.Name];
                    } //else {                    
                    //        _updateArray[iTopic.Name] = iTopic;                     
                    //}
                    if (scope.skillRequired) {

                        for (var k = 0; k < iTopic.Skills.length ; k++) {
                            if (!iTopic.Skills[k].profiLevel) iTopic.Skills[k].profiLevel = '0';
                            if (_skills[iTopic.Skills[k].Name]) {
                                iTopic.Skills[k].alreadySelected = true;
                                if (_deleteArray[iTopic.Skills[k].Name]) {
                                    delete _deleteArray[iTopic.Skills[k].Name];
                                } else {
                                    iTopic.Skills[k].selected = true;
                                }
                            }// else {
                            //    //if (_updateArray[iTopic.Skills[k].Name]) {
                            //    //    _updateArray[iTopic.Skills[k].Name] = iTopic.Skills[k];
                            //    //}
                            //}                           
                        }
                        scope.skillsArray = scope.skillsArray.concat(iTopic.Skills);
                    }
                }
            };
            scope.skillSelection = function (iEvent, iIndex, iSkills) {
                iEvent.stopPropagation();
                iSkills.type = 'S';
                if (iSkills.selected) {
                    iSkills.selected = false;
                    iSkills.profiLevel = 0;
                    if (_updateArray[iSkills.Name]) {
                        delete _updateArray[iSkills.Name];
                    }
                    if (iSkills.alreadySelected == true) {//make delete array
                        _deleteArray[iSkills.Name] = iSkills;
                    }
                } else {
                    iSkills.selected = true;
                    iSkills.profiLevel = 0;
                    //  _updateArray[iSkills.Name] = iSkills;
                    if (iSkills.alreadySelected == true) {
                        if (_deleteArray[iSkills.Name]) delete _deleteArray[iSkills.Name];
                        if (_updateArray[iSkills.Name]) delete _updateArray[iSkills.Name];
                    } else {
                        if (_updateArray[iSkills.Name]) {
                            _updateArray[iSkills.Name] = iSkills;
                        }
                    }
                }
            };

            scope.backButtonClick = function () {
                console.error(scope.categoryDisplay)
                if (scope.categoryDisplay == true) {
                    scope.mySelection = true;
                    //  scope.selectedCategory = -1;
                    scope.selectedTopic = -1;
                    scope.selectedSkills = -1;
                    scope.selectedCategoryValue = null;
                }
                else {
                    scope.categoryDisplay = true;
                    for (var k = 0; k < scope.catogoryArray.length ; k++) {
                        scope.catogoryArray[k].selectedCategory = false;
                        if (_category[scope.catogoryArray[k].Category]) {
                            scope.catogoryArray[k].selectedCategory = true;
                            scope.catogoryArray[k].alreadySelected = true;
                        }
                    }
                }

                scope.skillsArray = [];
                scope.topicArray = [];
                _updateArray = {};
                _deleteArray = {}
            };

            scope.savepublishClick = function () {
                console.error(_updateArray, _deleteArray);
                //  return 
                if (scope.categoryDisplay) {
                    //publish check
                } else {
                    // console.error(_updateArray);
                    //if (Object.keys(_updateArray).length > 0 || Object.keys(_deleteArray).length > 0 ){
                    var _dataArray = [];
                    var _dd = [];
                    for (var l = 0 ; l < scope.skillsArray.length; l++) {
                        console.error(scope.skillsArray[l].Name)
                        if (scope.skillsArray[l].selected) {
                            _dataArray.push(scope.skillsArray[l]);
                        } else {
                            if (_skills[scope.skillsArray[l].Name]) {
                                delete _skills[scope.skillsArray[l].Name];
                            }
                        }
                    }
                    for (var _key in _skills) {
                        for (var j = 0 ; j < scope.catogoryArray.length ; j++) {
                            for (var y = 0 ; y < scope.catogoryArray[j].Topics.length ; y++) {
                                for (var w = 0 ; w < scope.catogoryArray[j].Topics[y].Skills.length ; w++) {
                                    if (_key == scope.catogoryArray[j].Topics[y].Skills[w].Name) {
                                        _skills[_key].Id = scope.catogoryArray[j].Topics[y].Skills[w].Id;
                                        _dd.push(_skills[_key]);
                                    }
                                }
                            }
                        }

                    }
                    console.error(_dd)
                    console.error(_category);
                    console.error(_topics);
                    console.error(_skills);

                    _dataArray = _dataArray.concat(_dd);
                    //return
                    if (scope.skillRequired) {
                        serverCommunication.sendSelectedCTSDataToServer({
                            selectedArray: _dataArray,
                            role: scope.role,
                            successCallBack: function (iObj) {
                                scope.mySelection = true;
                                scope.categoryDisplay = true;
                                // scope.selectedCategory = -1;
                                scope.selectedTopic = -1;
                                scope.selectedSkills = -1;
                                scope.selectedCategoryValue = null;
                                scope.init();
                                console.error('In successCallBack', iObj);
                            },
                            failureCallBack: function (iObj) {
                                console.error('In failureCallBack', iObj);
                            }
                        });
                    } else {                       

                        var _dataArray = [];
                        var _dd = [];
                        for (var l = 0 ; l < scope.topicArray.length; l++) {
                            console.error(scope.topicArray[l].Name)
                            if (scope.topicArray[l].selected) {
                                _dataArray.push(scope.topicArray[l]);
                            } else {
                                if (_topics[scope.topicArray[l].Name]) {
                                    delete _topics[scope.topicArray[l].Name];
                                }
                            }
                        }
                        for (var _key in _topics) {
                            for (var j = 0 ; j < scope.catogoryArray.length ; j++) {
                                for (var y = 0; y < scope.catogoryArray[j].Topics.length; y++) {
                                        if (_key == scope.catogoryArray[j].Topics[y].Name) {
                                                _topics[_key].Id = scope.catogoryArray[j].Topics[y].Id;
                                                _dd.push(_topics[_key]);
                                         }
                                   
                                }
                            }

                        }
                        _dataArray = _dataArray.concat(_dd);
                        console.error(_dd)
                        console.error(_dataArray)
                        console.error(_category);
                        console.error(_topics);
                        console.error(_skills);
                       // return
                        serverCommunication.sendSelectedCTSDataToServerMentor({
                            selectedArray: _dataArray,
                            role: scope.role,
                            successCallBack: function (iObj) {
                                console.error('In successCallBack', iObj);
                                scope.mySelection = true;
                                scope.categoryDisplay = true;
                                // scope.selectedCategory = -1;
                                scope.selectedTopic = -1;
                                scope.selectedSkills = -1;
                                scope.selectedCategoryValue = null;
                                scope.init();
                            },
                            failureCallBack: function (iObj) {
                                console.error('In failureCallBack', iObj);
                            }
                        });
                    }
                    _updateArray = {};
                    _deleteArray = {}
                    //}
                }
            };

            scope.getTopicSkill = function (iCategory) {
                //serverCommunication.getTopicSkill({
                //    cateGoryObject: iCategory,
                //    successCallBack: function (iObj) {
                //        console.error('In successCallBack', iObj);


                //    },
                //    failureCallBack: function () {
                //        console.error('In failureCallBack', iObj);

                //    }
                //});
            };


            scope.addSkill = function () {
                scope.mySelection = false;
                scope.selectedCategory = -1;
                scope.selectedTopic = -1;
                scope.selectedSkills = -1;
                scope.selectedCategoryValue = null;
                scope.skillsArray = [];
                if (scope.role == "mentor") {
                    console.error('get data for mentor')
                    serverCommunication.getCategorys({
                        successCallBack: function (iObj) {
                            console.error('In successCallBack', iObj);
                            var _data = iObj.data;
                            console.error(_data)
                            scope.catogoryArray = [].concat(_data);
                            for (var k = 0; k < scope.catogoryArray.length ; k++) {
                                if (_category[scope.catogoryArray[k].Category]) {
                                    scope.catogoryArray[k].selectedCategory = true;
                                    scope.catogoryArray[k].alreadySelected = true;
                                }
                            }

                        },
                        failureCallBack: function (iObj) {
                            console.error('In failureCallBack', iObj);

                        }
                    });
                } else {
                    serverCommunication.getCategorys({
                        successCallBack: function (iObj) {
                            console.error('In successCallBack', iObj);
                            var _data = iObj.data;
                            console.error(_data)
                            scope.catogoryArray = [].concat(_data);
                            for (var k = 0; k < scope.catogoryArray.length ; k++) {
                                if (_category[scope.catogoryArray[k].Category]) {
                                    scope.catogoryArray[k].selectedCategory = true;
                                    scope.catogoryArray[k].alreadySelected = true;
                                }
                            }

                        },
                        failureCallBack: function (iObj) {
                            console.error('In failureCallBack', iObj);

                        }
                    });
                }

            };

            var _createMoleculeStructure = function (iObj) {
                _category = {};
                _topics = {};
                _skills = {};
                console.error(angular.copy(iObj.data));

                if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
                    for (var k = 0; k < iObj.data.Categories.length ; k++) {
                        if (Object.keys(iObj.data.Categories[k]).length > 0) {

                            // _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category };
                            if (iObj.data.Categories[k].Category) {
                                if (_category[iObj.data.Categories[k].Category]) {//if category is already present
                                    if (_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]) {//if topic is already present
                                        //  _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {} };
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                                        }
                                    } else {
                                        _topics[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {}, profiLevel: iObj.data.Categories[k].profiLevel };
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                        if (iObj.data.Categories[k].Skill) {
                                            _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                            if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                                        }
                                    }
                                } else {
                                    _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category, topic: {} };
                                    _topics[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                                    _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {}, profiLevel: iObj.data.Categories[k].profiLevel};
                                    if (iObj.data.Categories[k].Skill) {
                                        _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                                    }
                                }
                            }

                        }
                    }
                }
                console.error('In getMySelection', _category, _topics, _skills);
                var _array = [];
                var _node = [];
                var _count = 1;
                var _color = 'transparent';
                var _textColor = 'black';
                
                switch (scope.role) {
                    case 'coach': _color = 'rgb(231,120,23)'; _textColor = 'white'; break;
                    case 'mentor': _color = 'rgb(0,73,45)';  _textColor = 'white';  break;
                    case 'mentee': _color = 'rgb(132,194,37)'; _textColor = 'black'; break;
                    case 'coachee': _color = 'rgb(248,195,0)'; _textColor = 'black'; break;
                }
                var _textColor = 'black';//temp purpose
                // var _idArray = [];
                if (Object.keys(_category).length == 0) {

                } else {
                    _array.push({
                        "symbol": 'My Selection',
                        "size": 40,
                        'color': 'black',
                        "image": 'Images/icons/profile.png',
                        "className" : 'circleProfileImageClass',
                        "id": 0,
                        "bonds": 1
                    });
                    for (var _key in _category) {
                        _array.push({
                            "symbol": _key,
                            "size": 35,
                            "id": _count,
                            "type" : 'C',
                            'color': 'white',
                            'textColor' : _textColor,
                            'border' : _color,
                            "bonds": 1
                        });
                        _node.push({
                            "source": 0,
                            "target": _count,
                            "id": 'link_' + _count,
                            "bondType": 1

                        });
                        if (_category[_key].topic) {
                            var _level = 1;
                            var _dd = 0;
                            var _topicId = _count;
                            for (var _topic in _category[_key].topic) {
                                var _topicId = _topicId + _level;
                                _array.push({
                                    "symbol": _topic,
                                    "size": 25,
                                    "id": _topicId,
                                    "type": 'T',
                                    'textColor': scope.skillRequired ? 'black' : _textColor, 
                                    'color': scope.skillRequired ? 'white' : _color,
                                    'border': _color,
                                    "bonds": 1
                                });

                                _node.push({
                                    "source": _count,
                                    "target": _topicId,
                                    "id": 'link_' + _topicId,
                                    "bondType": 1

                                });

                                var _levelSkill = 1;
                                var _skillId = 0;
                                if (!_category[_key].topic[_topic].skill) {
                                    _skillId = _topicId;
                                } else {
                                    var _finalLevelVaue = 0;
                                    for (var _skill in _category[_key].topic[_topic].skill) {
                                        var _skillId = _topicId + _levelSkill;
                                            
                                        _array.push({
                                            "symbol": _skill,
                                            "size": 15,
                                            "id": _skillId,
                                            "type": 'S',
                                            'color': _color,
                                            'textColor': _textColor,
                                            'border': _color,
                                            "bonds": 1
                                        });
                            
                                        _node.push({
                                            "source": _topicId,
                                            "target": _skillId,
                                            "id": 'link_' + _skillId,
                                            "bondType": 1

                                        });
                                        // console.error(_levelSkill, Object.keys(_category[_key].topic[_topic].skill).length)
                                        if (_levelSkill == (Object.keys(_category[_key].topic[_topic].skill).length)) {
                                            // console.error(_skillId)
                                            _topicId = _skillId;
                                        }
                                        _levelSkill++;
                                    }
                                }
                                //console.error(Object.keys(_category[_key].topic).length)
                                if (_dd == (Object.keys(_category[_key].topic).length - 1)) {
                                    console.error(_skillId)
                                    _count = _skillId;
                                }
                                // _level = _finalLevelVaue;
                                //  _level++;
                                _dd++;
                                // console.error(_level)
                            }
                        }
                        _count++;
                    }
                    console.error(_node, _array)
                    var _retu = {
                        "3-iodo-3-methylhexan-1,4-diamine": {
                            "nodes": _array,
                            "links": _node
                        }
                    }
                    console.error(_retu)
                    scope.ctsDataForMolecule = _retu;
                }
            };

            var _category = {};
            //var _categoryArray = {};
            var _topics = {};
            var _skills = {};


            scope.init = function () {
                scope.ctsDataForMolecule = null;

                switch (scope.role) {
                    case 'coach':
                            serverCommunication.getMySelection({
                                successCallBack: function (iObj) {
                                    console.error('In getMySelection', iObj);
                                    _createMoleculeStructure(iObj);
                                },
                                failureCallBack: function (iObj) {
                                    console.error('In failuregetMySelectionCallBack', iObj);

                                }
                            });
                            break;
                    case 'mentor':
                            console.error('get data for mentor')
                            serverCommunication.getMyMentorSelection({
                                successCallBack: function (iObj) {
                                    console.error('In getMyMentorSelection', iObj);
                                    _createMoleculeStructure(iObj);
                                },
                                failureCallBack: function (iObj) {
                                    console.error('In failuregetMySelectionCallBack', iObj);

                                }
                            });
                         break;
                    case 'mentee':
                        serverCommunication.getMyMenteeSelection({
                            successCallBack: function (iObj) {
                                console.error('In getMyMenteeSelection', iObj);
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {
                                console.error('In failuregetMySelectionCallBack', iObj);

                            }
                        });
                                break;
                    case 'coachee':
                        serverCommunication.getMyCoacheeSelection({
                            successCallBack: function (iObj) {
                                console.error('In getMyCoacheeSelection', iObj);
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {
                                console.error('In failuregetMySelectionCallBack', iObj);

                            }
                        });
                        break;
                }                
            };
            scope.init();
        }
    };
});

app.factory('commonFunction', function ($http) {
    return {
        fireEvent: function (element, event, iOptions) {

            var _bubble = true, _cancel = true;

            if (iOptions && 'bubble' in iOptions)
                _bubble = _bubble && iOptions.bubble;

            if (iOptions && 'cancel' in iOptions)
                _cancel = _cancel && iOptions.cancel;

            if (element) {
                if (event == "click" && (typeof InstallTrigger !== 'undefined')) {
                    element.click && element.click();
                    return;
                }

                if (document.createEvent) {
                    // dispatch for firefox + others
                    //console.log("in fireEvent");
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent(event, _bubble, _cancel); // event type,bubbling,cancelable
                    return !element.dispatchEvent(evt);
                } else {
                    // dispatch for IE
                    var evt = document.createEventObject();
                    return element.fireEvent('on' + event, evt)
                }
            }
        }
    }
});

app.directive('moleculeMap', function ($rootScope) {
    return {
        scope: {
            ctsData: "="
        },
        template: '<div id="moleculeDisplay" style="float:left;width : 100%;height:100%;"></div>',// template will be different
        restrict: 'EAC',
        link: function ($scope, element, attrs) {


            var width = 994, height = 454
            var color = d3.scale.category20();
            var moleculeExamples = {};
            var radius = d3.scale.sqrt().range([0, 6]);
            var selectionGlove = glow("selectionGlove").rgb("#0000A0").stdDeviation(7);
            var atomSelected;


            var atomClicked = function (dataPoint) {
                if (dataPoint.symbol === "H")
                    return;

                if (atomSelected)
                    atomSelected.style("filter", "");

                atomSelected = d3.select(this).select("circle").style("filter", "url(#selectionGlove)");
            };

            var bondSelected;
            var bondClicked = function (dataPoint) {
                alert('New Bond Selected')
                if (bondSelected)
                    bondSelected.style("filter", "");

                bondSelected = d3.select(this).select("line").style("filter", "url(#selectionGlove)");
            };

            var generateRandomID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            var svg = d3.select("#moleculeDisplay").append("svg").attr("width", width).attr("height", height).call(selectionGlove);

            var getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            window.loadMolecule = function () {
                alert('loadMolecule')
                /*vex.dialog.open({
						message: 'Copy your saved molecule data:',
						input: "Molecule: <br/>\n<textarea id=\"molecule\" name=\"molecule\" value=\"\" style=\"height:150px\" placeholder=\"Saved Molecule Data\" required></textarea>",
						buttons: [
							$.extend({}, vex.dialog.buttons.YES, {
							text: 'Load'
						}), $.extend({}, vex.dialog.buttons.NO, {
							text: 'Cancel'
						})
						],
						callback: function(data) {
							if (data !== false) {
								
								newMoleculeSimulation(JSON.parse(data.molecule));
							}
						}
					});*/
            };

            var newMoleculeSimulation = function (newMolecule, example) {
                // Might be super dirty, but it works!
                $('#moleculeDisplay').empty();
                svg = d3.select("#moleculeDisplay").append("svg")
						    .attr("width", width)
						    .attr("height", height)
						    .call(selectionGlove);
                if (example)
                    newMolecule = newMolecule[example];
                newMolecule = $.extend(true, {}, newMolecule);
                orgoShmorgo(newMolecule);
                //alert('New Molecule Loaded')
                /*Messenger().post({
				  message: 'New Molecule Loaded',
				  type: 'success',
				  showCloseButton: true,
				  hideAfter: 2
				});*/
            };

            window.loadMoleculeExample = function () {
                newMoleculeSimulation(moleculeExamples, $('#moleculeExample').val().trim());
            };
            console.error($scope)
            var _func = function () {

                return $scope.ctsData
            };

            moleculeExamples = _func();
            console.error(moleculeExamples)

            var orgoShmorgo = function (graph) {
                var nodesList, linksList;
                nodesList = graph.nodes;
                linksList = graph.links;

                var force = d3.layout.force()
                                          .nodes(nodesList)
                                          .links(linksList)
                                          .size([width, height])
                                          .charge(-400)
                                          .linkStrength(function (d) { return d.bondType * 1; })
                                          .linkDistance(function (d) { return radius(d.source.size) + radius(d.target.size) + 20; })
                                          .on("tick", tick);

                var links = force.links(),
                      nodes = force.nodes(),
                      link = svg.selectAll(".link"),
                      node = svg.selectAll(".node");

                buildMolecule();

                function buildMolecule() {
                    // Update link data
                    link = link.data(links, function (d) { return d.id; });

                    // Create new links
                    link.enter().insert("g", ".node")
                        .attr("class", "link")
                        .each(function (d) {
                            // Add bond line
                            d3.select(this)
                                .append("line")
                                        .style("stroke-width", function (d) { return (d.bondType * 3 - 2) * 2 + "px"; });

                            // If double add second line
                            d3.select(this)
                                .filter(function (d) { return d.bondType >= 2; }).append("line")
                                .style("stroke-width", function (d) { return (d.bondType * 2 - 2) * 2 + "px"; })
                                .attr("class", "double");

                            d3.select(this)
                                .filter(function (d) { return d.bondType === 3; }).append("line")
                                .attr("class", "triple");

                            // Give bond the power to be selected
                            d3.select(this)
                                .on("click", bondClicked);
                        });

                    // Delete removed links
                    link.exit().remove();

                    // Update node data
                    node = node.data(nodes, function (d) { return d.id; });

                    // Create new nodes
                    node.enter().append("g")
                        .attr("class", "node")
                        .each(function (d) {
                            // Add node circle
                            //d3.select(this)
                            //  .append("circle")
                            //  .attr("r", function (d) { return radius(d.size); })
                            //  .style("fill", function (d) { return color(d.symbol); });

                            // Add atom symbol
                            // Add atom symbol
                            if (d.image) {

                                if (d.className) {
                                    var defs = d3.select(this).append("defs").attr("id", "imgdefs")
                                    var clipPath = defs.append('clipPath').attr('id', 'clip-circle')
                                        .append("circle")
                                        .attr("r", function (d) {
                                           return radius(d.size);
                                        })
                                        .attr("cy", 86)
                                        .attr("cx", 100)
                                        .style("stroke", "red")
                                    d3.select(this).append("image")
                                         .attr("x", 0)
                                         .attr("y", 0)
                                         .attr("height", 75)
                                         .attr("width", 75)
                                         .attr("xlink:href", function (d) { return d.image; })
                                         .attr("clip-path", "url(#clip-circle)")
                                } else {
                                    d3.select(this)
                                            .append("image")
                                            .attr("xlink:href", function (d) { return d.image; })
                                            .attr("width", "75px")
                                            .attr("height", "75px");
                                    d3.select(this)
                                             .append("text")
                                             .attr("dy", ".35em")
                                             .attr("x", "20")
                                             .attr("y", "20")
                                             .attr("text-anchor", "middle")
                                             .style("font-size", function(d) { return Math.min(2 * (radius(d.size)), (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                                             .text(function (d) {
                                                 return d.symbol;
                                             });
                                }                                                       

                            } else {
                                d3.select(this)
                                 .append("circle")
                                 .attr("r", function (d) {
                                     return radius(d.size);
                                 })
                                 .style("stroke-dasharray", function (d) {
                                     return d.type == 'C' ? ("10,3") : ("0,0")
                                 }) // make the stroke dashed
                                 .style("fill", function (d) {
                                     return d.color ? d.color : color(d.symbol);
                                 })
                                
                                 .style("stroke", d.border ? d.border : 'black');
                                d3.select(this)
                                  .append("text")
                                  .attr("dy", ".35em")
                                  .attr("x", 20)
                                  .attr("y", 0)
                                  .attr("text-anchor", "middle")
                                  .style('fill', d.textColor ? d.textColor : 'black')
                                    .style("font-size", function (d) { return Math.min(2 * (radius(d.size)), (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                                  .text(function (d) {
                                      return d.symbol;
                                  });
                            }

                            // Give atom the power to be selected
                            d3.select(this)
                                .on("click", atomClicked);

                            // Grant atom the power of gravity	
                            d3.select(this)
                                .call(force.drag);
                        });

                    // Delete removed nodes
                    node.exit().remove();
                    force.start();
                }

                $scope.saveMolecule = function () {
                    var specialLinks = [], specialNodes = [], nodeIdArr = [];
                    for (var i = nodes.length - 1; i >= 0; i--) {
                        specialNodes.push({
                            symbol: nodes[i].symbol,
                            size: nodes[i].size,
                            x: nodes[i].x,
                            y: nodes[i].y,
                            id: nodes[i].id,
                            bonds: nodes[i].bonds
                        });
                        nodeIdArr.push(nodes[i].id);
                    }
                    for (var i = links.length - 1; i >= 0; i--) {
                        specialLinks.push({
                            source: nodeIdArr.indexOf(links[i].source.id),
                            target: nodeIdArr.indexOf(links[i].target.id),
                            id: links[i].id,
                            bondType: links[i].bondType
                        });
                    }
                    molecule = {
                        nodes: specialNodes,
                        links: specialLinks
                    };
                    /*  	vex.dialog.open({
                                message: 'To save your current molecule, copy the data below. Next time you visit click on the load molecule and input your saved data:',
                                input: "Molecule: <br/>\n<textarea id=\"atoms\" name=\"atoms\" value=\"\" style=\"height:150px\" placeholder=\"Molecule Data\">" + JSON.stringify(molecule) + "</textarea>",
                                buttons: [
                                    $.extend({}, vex.dialog.buttons.YES, {
                                        text: 'Ok'
                                    })
                                ],
                                callback: function(data) {}
                            });*/
                };

                $scope.changeBond = function (newBondType) {
                    if (!bondSelected) {
                        Messenger().post({
                            message: 'No Bond Selected',
                            type: 'error',
                            showCloseButton: true
                        });
                        return;
                    }
                    var bondData = getAtomData(bondSelected);
                    var changeInCharge = newBondType - bondData.bondType;
                    var bondChangePossible = function (bond) {
                        return (bond.target.bonds + changeInCharge <= atomDB[bond.target.symbol].lonePairs && bond.source.bonds + changeInCharge <= atomDB[bond.source.symbol].lonePairs);
                    };

                    if (!newBondType || newBondType < 1 || newBondType > 3) {
                        alert('Internal error :(')
                        return;
                    } else if (!bondChangePossible(bondData, newBondType)) {
                        alert('That type of bond cannot exist there!')
                        /*Messenger().post({
						  message: 'That type of bond cannot exist there!',
						  type: 'error',
						  showCloseButton: true
						});*/
                        return;
                    }

                    for (var i = links.length - 1; i >= 0; i--) {
                        if (links[i].id === bondData.id) {
                            var changeInCharge = newBondType - bondData.bondType;
                            var source = retriveAtom(links[i].source.id),
                                    target = retriveAtom(links[i].target.id);
                            if (changeInCharge === 2) {
                                removeHydrogen(source);
                                removeHydrogen(source);
                                removeHydrogen(target);
                                removeHydrogen(target);
                            }
                            else if (changeInCharge === 1) {
                                removeHydrogen(source);
                                removeHydrogen(target);
                            }
                            else if (changeInCharge === -1) {
                                addHydrogens(source, 1);
                                addHydrogens(target, 1);
                            }
                            else if (changeInCharge === -2) {
                                addHydrogens(source, 1);
                                addHydrogens(source, 1);
                                addHydrogens(target, 1);
                                addHydrogens(target, 1);
                            }
                            source.bonds += changeInCharge;
                            target.bonds += changeInCharge;

                            // Remove old bond, create new one and add it to links list
                            // Simple change of bond value is buggy
                            links.splice(i, 1);
                            var newBond = {
                                source: bondData.source,
                                target: bondData.target,
                                bondType: newBondType,
                                id: generateRandomID()
                            };
                            links.push(newBond);

                            // Clear previous bond selection
                            bondSelected.style("filter", "");
                            bondSelected = null;

                            break;
                        }
                    }
                    buildMolecule();
                };

                $scope.addAtom = function (atomType) {
                    if (!atomType) {
                        alert('Internal error :(')
                        return;
                    } else if (!atomSelected) {
                        alert('No Atom Selected')
                        return;
                    }
                    else if (!canHaveNewBond(getAtomData(atomSelected))) {
                        alert('Atom Can\'t Take Anymore Bonds')
                    }
                    else
                        addNewAtom(atomType, atomDB[atomType].size);
                };

                function canHaveNewBond(atom) {
                    return atom.bonds < atomDB[atom.symbol].lonePairs;
                }

                function getAtomData(d3Atom) {
                    return d3Atom[0][0].parentNode.__data__;
                }

                function addHydrogens(atom, numHydrogens) {
                    var newHydrogen = function () {
                        return {
                            symbol: 'H',
                            size: '1',
                            bonds: 1,
                            id: generateRandomID(),
                            x: atom.x + getRandomInt(-15, 15),
                            y: atom.y + getRandomInt(-15, 15)
                        };
                    };
                    var tempHydrogen;
                    for (var i = 0; i < numHydrogens; i++) {
                        tempHydrogen = newHydrogen();
                        nodes.push(tempHydrogen);
                        links.push({
                            source: atom,
                            target: tempHydrogen,
                            bondType: 1,
                            id: generateRandomID()
                        });
                    }
                }

                function removeHydrogen(oldAtom) {
                    var target, source, bondsArr = getBonds(oldAtom.id);
                    for (var i = bondsArr.length - 1; i >= 0; i--) {
                        target = bondsArr[i].target, source = bondsArr[i].source;
                        if (target.symbol === 'H' || source.symbol === 'H') {
                            var hydroId = source.symbol === 'H' ?
																				source.id :
																				target.id;
                            removeAtom(hydroId);
                            return;
                        }
                    }
                }

                function removeAtom(id) {
                    var atomToRemove = retriveAtom(id);
                    var bondsArr = getBonds(id);
                    var atomsArr = [atomToRemove.id];

                    for (var i = bondsArr.length - 1; i >= 0; i--) {
                        // Add atom that is a hydrogen
                        if (bondsArr[i].source.symbol === 'H')
                            atomsArr.push(bondsArr[i].source.id);
                        else if (bondsArr[i].target.symbol === 'H')
                            atomsArr.push(bondsArr[i].target.id);
                        else {
                            // Give non-hydrogen bonded atom it's lone pairs back
                            var nonHydrogenAtom = bondsArr[i].target.id !== id ?
                                                                                                            'target' :
                                                                                                            'source';

                            bondsArr[i][nonHydrogenAtom].bonds -= bondsArr[i].bondType;
                            addHydrogens(bondsArr[i][nonHydrogenAtom], bondsArr[i].bondType);
                        }
                        // Convert atom obj to id for later processing
                        bondsArr[i] = bondsArr[i].id;
                    }

                    var spliceOut = function (arr, removeArr) {
                        for (var i = arr.length - 1; i >= 0; i--) {
                            if (removeArr.indexOf(arr[i].id) !== -1) {
                                arr.splice(i, 1);
                            }
                        }
                        return arr;
                    };

                    // Remove atoms marked
                    nodes = spliceOut(nodes, atomsArr);

                    // Remove bonds marked
                    links = spliceOut(links, bondsArr);

                };

                var retriveAtom = function (atomID) {
                    for (var i = nodes.length - 1; i >= 0; i--) {
                        if (nodes[i].id === atomID)
                            return nodes[i];
                    }
                    return null;
                };

                function addNewAtom(atomType, atomSize) {
                    var newAtom = {
                        symbol: atomType,
                        size: atomSize,
                        x: getAtomData(atomSelected).x + getRandomInt(-15, 15),
                        y: getAtomData(atomSelected).y + getRandomInt(-15, 15),
                        id: generateRandomID(), // Need to make sure is unique
                        bonds: 1
                    },
				  		n = nodes.push(newAtom);

                    getAtomData(atomSelected).bonds++; // Increment bond count on selected atom
                    addHydrogens(newAtom, atomDB[atomType].lonePairs - 1); // Adds hydrogens to new atom
                    removeHydrogen(getAtomData(atomSelected)); // Remove hydrogen from selected atom

                    links.push({
                        source: newAtom,
                        target: getAtomData(atomSelected),
                        bondType: 1,
                        id: generateRandomID()
                    }); // Need to make sure is unique

                    buildMolecule();
                }

                var getBonds = function (atomID) {
                    var arr = [];
                    for (var i = links.length - 1; i >= 0; i--) {
                        if (links[i].source.id === atomID || links[i].target.id === atomID)
                            arr.push(links[i]);
                    }
                    return arr;
                }

                $scope.deleteAtom = function () {
                    var oneNonHydrogenBond = function (atom) {
                        var atomBonds = getBonds(atom.id);
                        var counter = 0;
                        for (var i = atomBonds.length - 1; i >= 0; i--) {
                            if (atomBonds[i].source.symbol !== 'H' && atomBonds[i].target.symbol !== 'H')
                                counter++;
                        }
                        return counter === 1;
                    };

                    if (!atomSelected) {
                        alert('No Atom Selected')
                        return;
                    }
                    else if (!oneNonHydrogenBond(getAtomData(atomSelected))) {
                        alert('Atom Must have only one non-hydrogen bond to be removed')
                        return;
                    }

                    removeAtom(getAtomData(atomSelected).id);
                    atomSelected = null;
                    buildMolecule();
                };

                function tick() {
                    //Update old and new elements
                    link.selectAll("line")
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
                }
            };
            newMoleculeSimulation(moleculeExamples, '3-iodo-3-methylhexan-1,4-diamine');

        }
    }
});


app.directive('rssFeed', function ($state, serverCommunication, $timeout) {
    return {
        scope: {
           skill: "=",
        },
        templateUrl: '/Home/ksRssFeed',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {
            window.rss = $scope;
            $scope.feedContainArray = [];
            
            //var _selectedTagFed = [];
            $scope.selectedFeedTag = function (iIndex, iOption) {
                console.error(iOption.selected)
               // _selectedTagFed = [];
                $scope.feedContainArray = [];
                for (var k = 0 ; k < $scope.skill.length ; k++) {
                    $scope.skill[k].selected = false;
                    if (iOption.name == $scope.skill[k].name) {
                        iOption.selected = true;
                        $scope.getRssFeedData(iOption.name);                        
                    }
                }
                //if (iOption.selected) {
                //    iOption.selected = false;
                //    var _index = _selectedTagFed.indexOf(iOption.name);
                //    if (_index > -1)
                //        _selectedTagFed.splice(_index, 1);
                //} else {
                //    _selectedTagFed.push(iOption.name);
                //    iOption.selected = true;
                //}
               
               
                //var _rec = function (iArr, iNdex) {
                //    $scope.getRssFeedData(iArr[iNdex]);
                //    iNdex++;
                //    if (iNdex == iArr.length) {
                //        console.error('final callBack');
                //        $timeout(function(){},0);
                //    }else {
                //        _rec(iArr, iNdex)
                //    }
                //}
                //_rec(_selectedTagFed, 0);
            };

            $scope.loadFeedOnNextTab = function (iFeed) {
                window.open(iFeed.url);
            };

            $scope.getRssFeedData = function (iString) {
                var params = {
                    // Request parameters
                    "q": iString ? iString : 'Live Wire Project',
                    "count": "10",
                    "offset": "0",
                    "mkt": "en-us",
                    "safesearch": "Moderate",
                };

                $.ajax({
                    url: "https://api.cognitive.microsoft.com/bing/v5.0/search?" + $.param(params),
                    beforeSend: function (xhrObj) {
                        // Request headers
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "5e3cfc43cfeb4f5499ed80126dd1b08b");
                    },
                    type: "GET",
                    // Request body
                    data: "{body}",
                })
                .done(function (data) {
                     // alert("success");
                     console.error(data)
                    var _feedContainArray = $scope.feedContainArray.concat(data.webPages.value);
                    // $scope.feedContainArray
                     var _book = [
                         'Images/icons/books icon 1.png',
                         'Images/icons/books icon 2.png',
                         'Images/icons/books icon 3.png',
                         'Images/icons/books icon 4.png',
                         'Images/icons/books icon 5.png',
                         'Images/icons/books icon 6.png',
                     ];
                     
                     _feedContainArray.sort(function(a, b) {
                         a = new Date(a.dateLastCrawled);
                         b = new Date(b.dateLastCrawled);
                         return a > b ? -1 : a < b ? 1 : 0;
                     });
                     var _count = 0;
                     for (var k = 0 ; k < _feedContainArray.length; k++) {
                         _feedContainArray[k].imagePath = _book[_count];
                         _count++;
                         if (_count == 6) _count = 0;
                     }
                     $scope.feedContainArray = [].concat(_feedContainArray);
                     // if (!$scope.$$phase) $scope.$digest();
                     $timeout(function () { }, 0);
                 })
                .fail(function (data) {
                    //alert("error");
                    console.error(data)
                });
            };

            if ($scope.skill) {
                if ($scope.skill.length > 0) {
                    $scope.selectedFeedTag(0,$scope.skill[0]);
                }
            }
            
        }
    }
});

app.directive('valueFeed', function ($state, serverCommunication) {
    return {
        scope: {

        },
        templateUrl: '/Home/ksCtcRole',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.valueFeed = scope;
        }
    }
});