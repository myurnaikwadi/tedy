﻿app.directive('pwdCheck', [function () {
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
    
//Display molecule design
app.directive('moleculeDesign', function ($timeout) {
    return {
        scope: { },
        template: ' <canvas></canvas>',      
        link: function ($scope, element, attrs) {
            $(function () {
                var canvas = document.querySelector('canvas'),
                ctx = canvas.getContext('2d')
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.lineWidth = .3;
                ctx.strokeStyle = (new Color(150)).style;

                var mousePosition = {
                    x: 30 * canvas.width / 100,
                    y: 30 * canvas.height / 100
                };

                var dots = {
                    nb: 250,
                    distance: 100,
                    d_radius: 150,
                    array: []
                };

                function colorValue(min) {
                    return Math.floor(Math.random() * 255 + min);
                }

                function createColorStyle(r, g, b) {
                    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
                }

                function mixComponents(comp1, weight1, comp2, weight2) {
                    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
                }

                function averageColorStyles(dot1, dot2) {
                    var color1 = dot1.color,
                        color2 = dot2.color;

                    var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
                        g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
                        b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
                    return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
                }

                function Color(min) {
                    min = min || 0;
                    this.r = colorValue(min);
                    this.g = colorValue(min);
                    this.b = colorValue(min);
                    this.style = createColorStyle(this.r, this.g, this.b);
                }

                function Dot() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;

                    this.vx = -.5 + Math.random();
                    this.vy = -.5 + Math.random();

                    this.radius = Math.random() * 2;

                    this.color = new Color();
                    //console.log(this);
                }

                Dot.prototype = {
                    draw: function () {
                        ctx.beginPath();
                        ctx.fillStyle = this.color.style;
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                        ctx.fill();
                    }
                };

                function createDots() {
                    for (i = 0; i < dots.nb; i++) {
                        dots.array.push(new Dot());
                    }
                }

                function moveDots() {
                    for (i = 0; i < dots.nb; i++) {

                        var dot = dots.array[i];

                        if (dot.y < 0 || dot.y > canvas.height) {
                            dot.vx = dot.vx;
                            dot.vy = -dot.vy;
                        }
                        else if (dot.x < 0 || dot.x > canvas.width) {
                            dot.vx = -dot.vx;
                            dot.vy = dot.vy;
                        }
                        dot.x += dot.vx;
                        dot.y += dot.vy;
                    }
                }

                function connectDots() {
                    for (i = 0; i < dots.nb; i++) {
                        for (j = 0; j < dots.nb; j++) {
                            i_dot = dots.array[i];
                            j_dot = dots.array[j];

                            if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
                                if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
                                    ctx.beginPath();
                                    ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                                    ctx.moveTo(i_dot.x, i_dot.y);
                                    ctx.lineTo(j_dot.x, j_dot.y);
                                    ctx.stroke();
                                    ctx.closePath();
                                }
                            }
                        }
                    }
                }

                function drawDots() {
                    for (i = 0; i < dots.nb; i++) {
                        var dot = dots.array[i];
                        dot.draw();
                    }
                }

                function animateDots() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    moveDots();
                    connectDots();
                    drawDots();

                    requestAnimationFrame(animateDots);
                }

                createDots();
                requestAnimationFrame(animateDots);
            });
        }
    }
});
app.directive('sglclick', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var fn = $parse(attr['sglclick']);
            var delay = 300, clicks = 0, timer = null;
            element.on('click', function (event) {
                clicks++;  //count clicks
                if (clicks === 1) {
                    timer = setTimeout(function () {
                        scope.$apply(function () {
                            fn(scope, { $event: event });
                        });
                        clicks = 0;             //after action performed, reset counter
                    }, delay);
                } else {
                    clearTimeout(timer);    //prevent single-click action
                    clicks = 0;             //after action performed, reset counter
                }
            });
        }
    };
}])
app.directive('focusMe', function ($timeout, $parse) {
    return {
        scope: {
            blur: '&',
            setFocus: '='
        },
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            
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
//Added Placeholder common directive
//Pass message to display
app.directive('placeHolder', function ($timeout) {
    return {
        scope: {
            message: '@'
        },
       
        template: '<div class="topicHeadingPlaceholdr"><h5 style="color:gray;margin: auto;font-size: 14px;" class="leftSideMenuLable fontClass">{{message}}</h5></div>',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
          
           
        }
    };
});

app.directive('allowPattern', [function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function (tElement, tAttrs) {
            return function (scope, element, attrs) {
                // I handle key events
                //console.error(attrs.noCheck)
                if (!attrs.noCheck || attrs.noCheck == 'true') {
                    element.bind("keypress", function (event) {
                        var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                        var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                        // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                     
                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {                           
                            event.preventDefault();
                            return false;
                        }

                    });
                }              
            };
        }
    }
}]);

app.directive('inputBox', function ($timeout) {
    return {
        scope: {
            inputField: '@',
            type: '@',
            inputModel: '=',
            onChange: '&',
            noCheck: '@',
            lableName : '@',
        },       
        template: '<div class="activityNameInputBox" style="width: 100%;"><input class="profileInputTag homeLogininput addTaskinputClass boldWhiteClass" no-Check="{{noCheck}}" allow-pattern="[a-z]" style="color: white  !important;font-size: 16px !important;letter-spacing: 1px; font-weight: 100 !important;" type="{{type}}" required ng-keydown="autoCompleteEmailId($event);" ng-blur="resetAutoComplete();closeAlertMessage()" ng-change="selectedIndexEmail=-1;changeOccPerInfo = true;" name="{{inputField}}" id="{{inputField}}" ng-model="inputModel" autocomplete="off"><span class="highlight"></span><span class="bar" style="background:rebeccapurple"></span><label class="addTaskLabel fontClass boldWhiteClass" style="">{{lableName}}<b style="color:red;margin-left: 5px;">*</b></label></div>',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {
          //  console.error($scope.inputModel)          
           
            var _resetStyles = function (iSelectId) {
                var txtBoxes = document.getElementsByTagName("INPUT");
                for (var i = 0; i < txtBoxes.length; i++) {
                    if (txtBoxes[i].id == iSelectId) {
                        document.getElementById(iSelectId).style.borderColor = "#dcdcdc";
                    }
                }
            };
            //focus on specific field
            var _setElementFocus = function (elementId, iApplyClass) {//AKP
                if (elementId && document.getElementById(elementId)) {
                    setTimeout(function () {
                        if (elementId && document.getElementById(elementId)) {
                            document.getElementById(elementId).focus();
                        }
                    }, 40);
                }
            };
            $scope.closeAlertMessage = function () {
                _resetStyles($scope.inputField);

            };

            //autocomplete user name
            $scope.resetAutoComplete = function () {
                if ($scope.removedIdName != true) {
                    $scope.selectedIndex = -1;
                }
                else {
                    _setElementFocus($scope.inputField); //to set focus on Password field in login page when error occurred at password.	
                    $scope.removedIdName = false;
                }
            };

            $scope.autoCompleteEmailId = function ($event) {
                if ($event.keyCode === 9 || $event.keyCode === 27) {//tab/Esc key press
                    //if tab is  pressed, set selectedIndex value to userId & focus to password field
                    if ($event.keyCode === 9) {
                        if ($scope.selectedIndex != -1) {

                            $scope.selectedIndex = -1;
                        }
                    }
                    $scope.resetAutoComplete($scope.inputField);
                }

            };
           
        }
    };
});
app.directive('topMainStrip', function ($state, $rootScope, authentification) {
    return {
        scope: {
            notification: '@'
        },
        templateUrl: '/Home/ksTopMainStrip',
       
        link: function (scope, element, attrs) {
            scope.loggedDetail = $rootScope.loggedDetail;
         
            scope.uiFlag = {
                notification: false,
                calendar: true,
                profileLogo: false,
                roleIcon: true
            }
            $rootScope.$on("refreshView", function () {
                scope.init();
            });

           
            scope.loadCalendarView = function (iEvent) {
                if (iEvent) iEvent.stopPropagation();
                $state.go('home.dashBoard.calendar');
            };

            scope.navigateToProfile = function (iEvent) {
             
                if (iEvent) iEvent.stopPropagation();
                $rootScope.currentModule = 'Profile';
                $state.go('home.dashBoard.profile');
            };
            scope.logout = function (iEvent) {
               
                if (iEvent) iEvent.stopPropagation();
            
                if (IN.User) IN.User.logout();
                authentification.logout({ loginObject: {} });
                $state.go('login', {}, { reload: true });
            };
            scope.toggleFlag = false;
            scope.loadProfleView = function () {
              
                if (scope.toggleFlag) scope.toggleFlag = false
                else scope.toggleFlag = true;
                
                $rootScope.$broadcast("refreshStateHomeView", {
                    type: 'loadProfileContain',
                    //subType: 'Attachment',
                    data: {
                        toggleFlag: scope.toggleFlag,
                        logout: scope.logout,
                        profile: scope.navigateToProfile
                    }
                });
            };
            scope.navigateAsPerRole = function (iRole) {
              
                scope.selectedRole = iRole;
                switch (iRole) {
                    case 0: $state.go('home.dashBoard.coachee'); break;
                    case 1: $state.go('home.dashBoard.coach'); break;
                    case 2: $state.go('home.dashBoard.mentee'); break;
                    case 3: $state.go('home.dashBoard.mentor'); break;
                    case 4: $state.go('home.dashBoard'); break;//navigate to home page
                }
            };
            scope.init = function () {
                switch ($rootScope.currentModule) {
                    case 'Profile':
                        scope.uiFlag.profileLogo = false;
                        scope.uiFlag.calendar = true;
                        scope.uiFlag.roleIcon = true;
                        scope.uiFlag.notification = true;
                        break;
                    case 'Calendar':
                        scope.uiFlag.calendar = false;
                        scope.uiFlag.roleIcon = true;
                        scope.uiFlag.profileLogo = true;
                        scope.uiFlag.notification = true;
                        break;
                    case 'DashBoard':
                        scope.uiFlag.calendar = true;
                        scope.uiFlag.roleIcon = false;
                        scope.uiFlag.profileLogo = true;
                        scope.uiFlag.notification = true;
                        break;
                    case 'Coach': scope.selectedRole = 1; break;
                    case 'Coachee': scope.selectedRole = 0; break;
                    case 'Mentee': scope.selectedRole = 2; break; 
                    case 'Mentor': scope.selectedRole = 3; break;
                        //   default :  break;
                }
            };
            scope.init();
        }
    };
});

app.directive('cubeStrct', function ($timeout) {
    return {
        scope: {
            loadingObject: '='
        },
        //template: '<div class="cubeContainer"><div id="cube" class="animate"><div></div><div></div><div></div><div></div><div></div><div></div></div><div style="margin-left: -25px;margin-top: 20px;"><h5 style="font-size: 11px;width: 100px;text-align: center;margin-top:5px;">{{loadingObject.loadingMessage}}</h5></div></div>',
        template: '<div class="cubeContainer"><div id="cube" class="animate"><div></div><div></div><div></div><div></div><div></div><div></div></div><div style="margin-left: -15px;margin-top: 20px;width: 100px;"><div class="inner" ng-hide="loadingObject.showSlogan == false"><span>I</span><span>g</span><span>n</span><span>i</span><span>t</span><span>e</span> <span>u</span><span>r</span><span>g</span><span>e</span></div></div></div>',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
           
            //  scope.messageArray = loadingObject
        }
    };
});
app.directive('bottomMainStrip', function ($timeout, $rootScope) {
    return {
        scope: {

        },
        template: '<div style="float: left;width: 100%;height: 100%;display: flex;"><div ng-style="styleToLeftStrip" style="float:left;position:relative;heigth:100%;"></div><div class="bottomStripOption"><h6 style="margin:10px;font-size: 11px;"class="fontClass biottomStripMargin genericPointerClass" ng-repeat = "option in bottomOptionArray" ng-click="loadPageClcik($index,option)">{{ option.name}}</h6></div></div>',
        //scope: true,   // optionally create a child scope
        controller: function ($scope) {
          
            $scope.styleToLeftStrip = { 'width': '0%' };
            var _color = 'white';
            var _width = 0;

            switch ($rootScope.currentModule) {
                case 'Coach': _color = 'rgb(231,120,23)'; _width = 18; break;
                case 'Mentor': _color = 'rgb(67,129,61)'; _width = 18; break;
                case 'Mentee': _color = 'rgb(187,217,0)'; _width = 18; break;
                case 'Coachee': _color = 'rgb(231,180,0)'; _width = 18; break;
            }
            $scope.styleToLeftStrip = {
                'width': _width + '%',
                'background': _color
            };
            // window.bottom = $scope;
         
            $scope.bottomOptionArray = [
                        { name: 'ABOUT' },
                        { name: 'PRIVACY POLICY' },
                        { name: 'TERMS AND CONDITIONS' },
            ];
            $scope.loadPageClcik = function (iIndex, iOption) {
                var _tempateUrl = '';
                switch (iIndex) {
                    case 0: _tempateUrl = '/Home/ksAboutUs'; break;
                 
                    case 1: _tempateUrl = '/Home/ksPrivacyPolicy'; break;
                    case 2: _tempateUrl = '/Home/ksTermsCondition'; break;
                }
                $rootScope.$broadcast("refreshStateHomeView", { type: 'loadBottomContain', data: { templateUrl: _tempateUrl } });
            };
        }
    }
});

app.directive('ctcRole', function ($state, serverCommunication, $timeout) {
    return {
        scope: {
            role: "@",
            skillRequired: "=",
        },
        templateUrl: '/Home/ksCtcRole',
      
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
            scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
            scope.skillsArray = [];
            scope.mySelection = true;
          
            scope.selectedTopic = -1;
            scope.selectedSkills = -1;
            scope.selectedCategoryValue = null;
            scope.categoryDisplay = true;

            /**
            *  Suggest Cts Panel
            * 
            */
            scope.suggestCts = {
                inputModel : { Category: '',  Description: '' },              
                displayArray : [],
                loadSuggestPopup : false,
            };
            scope.suggestCts.suggestPanelOpenClose = function (iEvent) {
                iEvent && iEvent.stopPropagation();
                scope.suggestCts.loadSuggestPopup = !scope.suggestCts.loadSuggestPopup;
                scope.suggestCts.inputModel.Category = '';
                scope.suggestCts.inputModel.Description = '';
                scope.suggestCts.displayArray = [];
            };
            
            scope.suggestCts.addSuggestedCategory = function () {
               
                scope.suggestCts.displayArray.push(angular.copy(scope.suggestCts.inputModel));
                scope.suggestCts.inputModel.Category = '';
                scope.suggestCts.inputModel.Description = '';
            };
            scope.suggestCts.sendCtsInfoToAdmin = function () {
             
                if (scope.suggestCts.displayArray.length > 0) {
                    serverCommunication.sendAddCtsInfoToAdmin({
                        displayArray: scope.suggestCts.displayArray,
                        successCallBack: function (iObj) {
                            scope.suggestCts.suggestPanelOpenClose();
                        },
                        failureCallBack: function (iObj) {
                         
                        }
                    });
                } else {
                    
                }               
            };
            
            var _deleteArray = {};
            var _updateArray = {};
            scope.styleToCTS = {};
            scope.styleToCTSText = {};
            scope.changeslider = function (iSkill) {              
                scope.createStyleArrayAsPerSelected(iSkill, true);
                scope.mouseOverEffectFlagSave = true;
                //if (iSkill.type == 'T') {
                //    if (!_topics[iSkill.Name]) {
                //         scope.mouseOverEffectFlagSave = true;
                //    }
                //} else {
                //    if (!_skills[iSkill.Name]) {
                //        scope.mouseOverEffectFlagSave = true;
                //    }
                //}
            };
            var _colorArray = {
                'coach': { '0': 'rgb(239,154,72)', '1': 'rgb(231,120,23)', '2': 'rgb(220,53,27)' },
                'coachee': { '0': 'rgb(255,249,116)', '1': 'rgb(248,195,0)', '2': 'rgb(241,164,0)' },
                'mentor': { '0': 'rgb(122,175,87)', '1': 'rgb(67,129,61)', '2': 'rgb(2,105,56)' },
                'mentee': { '0': 'rgb(218,232,102)', '1': 'rgb(187,217,0)', '2': 'rgb(132,194,37)' },
            };
            scope.createStyleArrayAsPerSelected = function (iSkill, iSelect) {
                if (iSelect) {
                 
                    var _width = 100;
                    var _color = 'transparent';
                    var _textColor = 'black';
                    switch (scope.role) {
                        case 'coach': _color = 'rgb(231,120,23)'; _textColor = 'white'; break;
                        case 'mentor': _color = 'rgb(67,129,61)'; _textColor = 'white'; break;
                        case 'mentee': _color = 'rgb(187,217,0)'; _textColor = 'black'; break;
                        case 'coachee': _color = 'rgb(248,195,0)'; _textColor = 'black'; break;
                    }
                    switch (iSkill.profiLevel) {
                        case '0': _width = 5; scope.styleToCTSText[iSkill.Name] = { 'color': 'black', 'transition': 'all 0.7s ease' }; break;
                        case '1': _width = 50; scope.styleToCTSText[iSkill.Name] = { 'color': 'black', 'transition': 'all 0.7s ease' }; break;
                        case '2': _width = 100; scope.styleToCTSText[iSkill.Name] = { 'color': _textColor, 'transition': 'all 0.7s ease' }; break;
                    }
                    if (scope.skillRequired) {
                        if (iSkill.type == 'T') {
                            _width = 100;
                            scope.styleToCTSText[iSkill.Name] = { 'color': _textColor, 'transition': 'all 0.7s ease' };
                        } else {
                            _color = _colorArray[scope.role][iSkill.profiLevel];
                        }
                    } else {
                        _color = _colorArray[scope.role][iSkill.profiLevel];
                    }

                    scope.styleToCTS[iSkill.Name] = { 'z-index':'3','position': 'absolute', 'height': '25px', 'width': (_width + "%"), 'background': _color, 'transition': 'all 0.7s ease' };
                } else {
                    // De select
                }
            };

            var _isotopeFuncForTopic = function () {
                if (scope.selectedTopicValue == iIndex) {
                    var _obj = {
                        iHeight: 40,
                        iWidth: 30,
                        iCol: 5,
                        iArray: scope.topicArray
                    };
                    msIsotopeFunc.prototype.genericHeightChange(_obj)
                    scope.selectedTopicValue = -1;
                } else {
                    var _heif = document.getElementById('topicParent').getBoundingClientRect().height;
                    var _obj = {
                        iHeight: _heif / 3.1,
                        index: iIndex,
                        iWidth: 49.8,
                        TotalColumns: 2,
                        column: 2,
                        row: 3,//expanded block height
                        array: scope.topicArray
                    };
                    msIsotopeFunc.prototype.expandForFloat(_obj);
                    scope.selectedTopicValue = iIndex;
                    scope.topicArray[iIndex].styleObj['margin-top'] = '0';

                }
            };

            scope.gridViewSkill = {gridViewLoaded : false, gridViewSkillLoaded : false };
            scope.selectedCategory = null;
            scope.selectedCategoryValue = -1;
            scope.selectedTopic = null;
            scope.selectedTopicValue = -1;
            scope.selectedSkill = null;
            scope.selectedSkillValue = -1;

            scope.closeIsotopeCategory = function (iEvent) {
                iEvent && iEvent.stopPropagation();
                var _obj = {
                    iHeight: 185,
                    iWidth: 50,
                    iCol: 3,
                    iArray: scope.catogoryArray
                };
                msIsotopeFunc.prototype.genericHeightChange(_obj)
                scope.selectedCategory = null;
                scope.selectedCategoryValue = -1;
                scope.selectedTopic = null;
                scope.selectedTopicValue = -1;
                scope.selectedSkill = null;
                scope.selectedSkillValue = -1;
                scope.categoryDisplay = true;
                scope.mouseOverEffectFlagSave = false;
                scope.selectAllTopic = false;
                scope.selectAllSkill = false;
            };
            scope.closeIsotopeTopic = function (iEvent,iSkill) {
                iEvent && iEvent.stopPropagation();
                var _obj = {
                    iHeight: 100,
                    iWidth: 100,
                    iCol: 5,
                    iArray: scope.topicArray
                };
                msIsotopeFunc.prototype.genericHeightChange(_obj);
                scope.selectedTopic = null;
                scope.selectedTopicValue = -1;
                scope.mouseOverEffectFlagSave = false;
                scope.selectAllTopic = false;               
            };
            scope.closeIsotopeSkills = function (iEvent) {
                iEvent && iEvent.stopPropagation();
                var _obj = {
                    iHeight: 100,
                    iWidth: 85,
                    iCol: 5,
                    iArray: scope.skillsArray
                };

                msIsotopeFunc.prototype.genericHeightChange(_obj)
                scope.selectedSkill = null;
                scope.selectedSkillValue = -1;
            };
            scope.gridViewSkill.selectAllTopic = false;
            scope.gridViewSkill.selectAllSkill = false;
            scope.selectAllTopicFunc = function (iEvent) {
              
                scope.gridViewSkill.selectAllTopic = !scope.gridViewSkill.selectAllTopic;
                for (var k = 0; k < scope.topicArray.length ; k++) {                   
                    if (!scope.topicArray[k].alreadySelected) {
                        scope.topicArray[k].profiLevel = (scope.role == 'coach' || scope.role == 'mentor') ? '1' : '0';
                        scope.topicSelection(iEvent, k, scope.topicArray[k]);
                        scope.createStyleArrayAsPerSelected(scope.topicArray[k], true);
                        scope.mouseOverEffectFlagSave = true;
                    }
                }
                if (scope.selectAllTopic == false && Object.keys(_topics).length == 0) {
                    scope.mouseOverEffectFlagSave = false;
                }
            };
            scope.selectAllSkillFunc = function (iEvent) {

                scope.gridViewSkill.selectAllSkill = !scope.gridViewSkill.selectAllSkill;
                for (var k = 0; k < scope.skillsArray.length ; k++) {
                    if (!scope.skillsArray[k].alreadySelected) {
                        scope.skillsArray[k].profiLevel = (scope.role == 'coach' || scope.role == 'mentor') ? '1' : '0';
                        scope.skillSelection(iEvent, k, scope.skillsArray[k]);
                        scope.createStyleArrayAsPerSelected(scope.skillsArray[k], true);
                        scope.mouseOverEffectFlagSave = true;
                    }
                }
                if (scope.selectAllTopic == false && Object.keys(_topics).length == 0) {
                    scope.mouseOverEffectFlagSave = false;
                }
            };
            scope.categoryClick = function (iEvent, iIndex, iCategory) {
                // scope.selectedCategory = iIndex;
                iCategory.type = 'C';
               
                iEvent && iEvent.stopPropagation();
                iCategory.selectedCategory = true;
                scope.categoryDisplay = false;
                
               // console.error('ddd')
                if (scope.selectedCategory == iIndex) {
                    scope.closeIsotopeCategory();
                } else {
                    var _obj = {
                        iHeight: 161,
                        index: iIndex,
                        iWidth: 50,
                        TotalColumns: 2,
                        column: 2,
                        row: 3,//expanded block height
                        array: scope.catogoryArray
                    };
                    msIsotopeFunc.prototype.expandForFloat(_obj);
                    scope.selectedCategory = iCategory;
                    scope.selectedCategoryValue = iIndex;
                    scope.catogoryArray[iIndex].styleObj['margin-top'] = '0';
                    scope.catogoryArray[iIndex].styleObj['background'] = 'white';
                }

                scope.topicArray = [].concat(iCategory.Topics);
             
                for (var k = 0 ; k < scope.topicArray.length ; k++) {
                    scope.topicArray[k].displayAnimation = false;
                    scope.topicArray[k].selected = false;
                    scope.topicArray[k].selectedCount = 0;
                    if (!scope.topicArray[k].profiLevel) scope.topicArray[k].profiLevel = '0';
                    if (_topics[scope.topicArray[k].Name]) {

                        scope.topicArray[k].alreadySelected = true;
                        if (_topics[scope.topicArray[k].Name].profiLevel)
                            scope.topicArray[k].profiLevel = _topics[scope.topicArray[k].Name].profiLevel;
                        if (scope.skillRequired) {
                            for (var h = 0; h < scope.topicArray[k].Skills.length ; h++) {
                                if (_skills[scope.topicArray[k].Skills[h].Name]) {
                                    scope.topicArray[k].selectedCount++;
                                }
                            }
                        } else {
                            scope.createStyleArrayAsPerSelected(scope.topicArray[k], true);
                            scope.topicSelection(iEvent, k, scope.topicArray[k]);
                        }
                      
                    }
                }
                scope.closeIsotopeTopic();
                $timeout(function () {
                    for (var k = 0 ; k < scope.topicArray.length ; k++) {
                        scope.topicArray[k].displayAnimation = true;
                    }
                }, 600);
                
            };


            scope.topicSelection = function (iEvent, iIndex, iTopic) {
                iEvent.stopPropagation();
                iTopic.type = 'T';
                
                if (iTopic.selected) {
                    iTopic.selected = false;
                   // scope.closeIsotopeTopic();

                    scope.mouseOverEffectFlagSave = true;
                    scope.styleToCTSText[iTopic.Name] = { 'color': 'black', 'transition': 'all 0.7s ease' };
                    if (iTopic.alreadySelected == true && !scope.skillRequired) {//make delete array
                        _deleteArray[iTopic.Name] = iTopic;
                    }
                    
                    if (scope.skillRequired) {
                        if (iTopic.Skills.length > 0) {
                            var _deleteArr = [];
                            for (var l = 0 ; l < scope.skillsArray.length; l++) {
                                for (var k = 0; k < iTopic.Skills.length ; k++) {
                                                           
                                    if (iTopic.Skills[k].alreadySelected == true) {
                                        _deleteArray[iTopic.Skills[k].Name] = iTopic.Skills[k];
                                    }
                                    if (scope.skillsArray[l] && scope.skillsArray[l].Name == iTopic.Skills[k].Name) {
                                        _deleteArr.push(l);
                                    }
                                }
                            }
                           
                            _deleteArr.sort(function (a, b) { return b - a })
                            for (var z = 0 ; z < _deleteArr.length ; z++) {
                                scope.skillsArray.splice(_deleteArr[z], 1);
                            }
                        }
                    }
                }
                else {
                    iTopic.selected = true;
                    if (scope.skillRequired) {
                        // var _heif = document.getElementById('topicParent').getBoundingClientRect().height;
                        var _obj = {
                            iHeight: 60,
                            index: iIndex,
                            iWidth: 49.8,
                            TotalColumns: 2,
                            column: 2,
                            row: 6,//expanded block height
                            array: scope.topicArray
                        };
                        msIsotopeFunc.prototype.expandForFloat(_obj);
                        scope.selectedTopic = iTopic;
                        scope.selectedTopicValue = iIndex;
                        scope.topicArray[iIndex].styleObj['margin-top'] = '0';
                    }
                     scope.mouseOverEffectFlagSave = true;
                    if (iTopic.alreadySelected == true && !scope.skillRequired) {
                        if (_deleteArray[iTopic.Name]) delete _deleteArray[iTopic.Name];                      
                    }                   
                                     
                    
                    if (scope.skillRequired) {
                        scope.createStyleArrayAsPerSelected(iTopic, true);
                        for (var k = 0; k < iTopic.Skills.length ; k++) {
                            if (!iTopic.Skills[k].profiLevel) iTopic.Skills[k].profiLevel = '0';
                            if (_skills[iTopic.Skills[k].Name]) {
                                iTopic.Skills[k].alreadySelected = true;

                                if (_skills[iTopic.Skills[k].Name].profiLevel)
                                    iTopic.Skills[k].profiLevel = _skills[iTopic.Skills[k].Name].profiLevel;
                                scope.createStyleArrayAsPerSelected(iTopic.Skills[k], true);
                                if (_deleteArray[iTopic.Skills[k].Name]) {
                                    delete _deleteArray[iTopic.Skills[k].Name];
                                } else {
                                    iTopic.Skills[k].selected = true;
                                }
                            }
                           
                        }
                        scope.skillsArray = [].concat(angular.copy(iTopic.Skills));
                        scope.closeIsotopeSkills();
                        $timeout(function () {
                            for (var k = 0 ; k < scope.skillsArray.length ; k++) {
                                scope.skillsArray[k].displayAnimation = true;
                            }
                        }, 600);
                    } else {
                        if (!iTopic.profiLevel) iTopic.profiLevel = '0';
                        scope.createStyleArrayAsPerSelected(iTopic, true);
                    }
                }
            };
            scope.mouseOverEffectFlagSave = false;
            scope.skillSelection = function (iEvent, iIndex, iSkills) {
                iEvent.stopPropagation();
                scope.mouseOverEffectFlagSave = true;
                iSkills.type = 'S';
                if (iSkills.selected) {
                    iSkills.selected = false;
                    scope.styleToCTSText[iSkills.Name] = { 'color': 'black', 'transition': 'all 0.7s ease' };
                    iSkills.profiLevel = '0';
                    if (_updateArray[iSkills.Name]) {
                        delete _updateArray[iSkills.Name];
                    }
                    if (iSkills.alreadySelected == true) {//make delete array
                        _deleteArray[iSkills.Name] = iSkills;
                    }
                } else {
                    iSkills.selected = true;
                    iSkills.profiLevel = '0';
                    scope.createStyleArrayAsPerSelected(iSkills, true);
                   
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
                scope.mouseOverEffectFlagSave = false;
                scope.gridViewSkill = {gridViewLoaded : false, gridViewSkillLoaded : false };
                if (scope.categoryDisplay == true) {
                    scope.mySelection = true;
                   
                    scope.selectedTopic = null;
                    scope.selectedSkills = -1;
                    scope.selectedCategoryValue = null;                    
                }
                else {
                    scope.styleToCTSText = { };
                    scope.categoryDisplay = true;
                    for (var k = 0; k < scope.catogoryArray.length ; k++) {
                        scope.catogoryArray[k].selectedCategory = false;
                        if (_category[scope.catogoryArray[k].Category]) {
                            scope.catogoryArray[k].selectedCategory = true;
                            scope.catogoryArray[k].alreadySelected = true;
                        }
                    }
                }
                scope.closeIsotopeCategory();
                scope.skillsArray = [];
                scope.topicArray = [];
                _updateArray = {};
                _deleteArray = {}
            };

            scope.savepublishClick = function () {
              
                //  debugger 
                if (scope.categoryDisplay) {
                    //publish check
                } else {
                    
                    var _dataArray = [];
                    var _dd = [];
                    for (var l = 0 ; l < scope.skillsArray.length; l++) {
                       
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
                    var _deleteArr = [];
                    for (var j = 0 ; j < _dd.length ; j++) {
                        if (_deleteArray[_dd[j].Name]) {
                            _deleteArr.push(j);
                        }
                    }
                    _deleteArr.sort(function (a, b) { return b - a })
                    for (var z = 0 ; z < _deleteArr.length ; z++) {
                        _dd.splice(_deleteArr[z], 1);
                    }
                   
                    _dataArray = _dataArray.concat(_dd);
                    scope.closeIsotopeCategory();
                    if (scope.skillRequired) {
                        serverCommunication.sendSelectedCTSDataToServer({
                            selectedArray: _dataArray,
                            role: scope.role,
                            successCallBack: function (iObj) {
                              
                                scope.mySelection = true;
                                scope.categoryDisplay = true;
                                scope.init();
                                scope.closeIsotopeCategory();
                            },
                            failureCallBack: function (iObj) {
                             
                            }
                        });
                    } else {

                        var _dataArray = [];
                        var _dd = [];
                        for (var l = 0 ; l < scope.topicArray.length; l++) {
                          
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
                      
                        // return
                        serverCommunication.sendSelectedCTSDataToServerMentor({
                            selectedArray: _dataArray,
                            role: scope.role,
                            successCallBack: function (iObj) {                             
                                
                                scope.mySelection = true;
                                scope.categoryDisplay = true;
                                scope.init();
                                scope.closeIsotopeCategory();
                            },
                            failureCallBack: function (iObj) {
                              
                            }
                        });
                    }
                    _updateArray = {};
                    _deleteArray = {}
                    //}
                }
            };

            scope.getTopicSkill = function (iCategory) {
               
            };

            scope.addSkill = function () {
                scope.mySelection = false;
                scope.selectedCategory = null;
                scope.selectedTopic = null;
                scope.selectedSkills = null;
                scope.selectedCategoryValue = null;
                scope.skillsArray = [];
                if (scope.role == "mentor" || scope.role == "mentee") {
                   
                    serverCommunication.getCategorysTopics({
                        successCallBack: function (iObj) {
                          
                            var _data = iObj.data;
                           
                            scope.catogoryArray = [].concat(_data);
                            for (var k = 0; k < scope.catogoryArray.length ; k++) {
                                if (_category[scope.catogoryArray[k].Category]) {
                                    scope.catogoryArray[k].selectedCategory = true;
                                    scope.catogoryArray[k].alreadySelected = true;
                                }
                            }
                            for (var k = 0 ; k < scope.catogoryArray.length ; k++) {
                                scope.catogoryArray[k].displayAnimation = false;
                            }
                            scope.closeIsotopeCategory();
                            $timeout(function () {
                                for (var k = 0 ; k < scope.catogoryArray.length ; k++) {
                                    scope.catogoryArray[k].displayAnimation = true;
                                }
                            }, 600);
                            
                        },
                        failureCallBack: function (iObj) {
                        

                        }
                    });
                } else {
                    serverCommunication.getCategorys({
                        successCallBack: function (iObj) {
                           
                            var _data = iObj.data;
                          
                            scope.catogoryArray = [].concat(_data);
                            for (var k = 0; k < scope.catogoryArray.length ; k++) {
                                if (_category[scope.catogoryArray[k].Category]) {
                                    scope.catogoryArray[k].selectedCategory = true;
                                    scope.catogoryArray[k].alreadySelected = true;
                                }
                            }
                            for (var k = 0 ; k < scope.catogoryArray.length ; k++) {
                                scope.catogoryArray[k].displayAnimation = false;
                            }
                            scope.selectedCategory = null;
                            scope.closeIsotopeCategory();
                            $timeout(function () {
                                for (var k = 0 ; k < scope.catogoryArray.length ; k++) {
                                    scope.catogoryArray[k].displayAnimation = true;
                                }
                            }, 600);
                        },
                        failureCallBack: function (iObj) {
                           

                        }
                    });
                }
            };
            scope.getImage = function (iOption) {
                var _image = '';

                switch (iOption.Category) {
                    case "Information Technology": _image = 'Images/information-icon.png'; break;
                    case "Management": _image = 'Images/management.png'; break;
                    case "Soft Skills": _image = 'Images/soft_Skill.png'; break;
                    case "Code Quality": _image = 'Images/cts/Code_Quality.png'; break;
                    case "Database": _image = 'Images/cts/Database.png'; break;
                    case "Process & Quality": _image = 'Images/cts/Process_Quality.png'; break;
                    case "Industry Domain": _image = 'Images/cts/Industry_Domain.png'; break;
                    case "Business Management": _image = 'Images/cts/Business_management.png'; break;
                    case "Finance Management": _image = 'Images/cts/Finance_management.png'; break;
                    case "Pre-Sales Management": _image = 'Images/cts/Presales.png'; break;
                    case "People Skills": _image = 'Images/cts/People_Skills.png'; break;
                    case "Virtual Team Skills": _image = 'Images/cts/Virtual_Teams.png'; break;
                    case "Cross Culture Skills": _image = 'Images/cts/Cross_Culture.png'; break;
                    case "Negotiation Skills": _image = 'Images/cts/Negotiation_Skills.png'; break;
                }
              //  console.error(_image, iOption)
                return _image;
            }
            var _createMoleculeStructure = function (iObj) {
                _category = {};
                _topics = {};
                _skills = {};
             

                if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
                    for (var k = 0; k < iObj.data.Categories.length ; k++) {
                        if (Object.keys(iObj.data.Categories[k]).length > 0) {

                           
                            if (iObj.data.Categories[k].Category) {
                                if (_category[iObj.data.Categories[k].Category]) {//if category is already present
                                    if (_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]) {//if topic is already present
                                       
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
                                    _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
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
               
                var _array = [];
                var _node = [];
                var _count = 1;
                var _color = 'transparent';
                var _textColor = 'black';

                switch (scope.role) {
                    case 'coach': _color = 'rgb(231,120,23)'; _textColor = 'white'; break;
                    case 'mentor': _color = 'rgb(67,129,61)'; _textColor = 'white'; break;
                    case 'mentee': _color = 'rgb(187,217,0)'; _textColor = 'black'; break;
                    case 'coachee': _color = 'rgb(248,195,0)'; _textColor = 'black'; break;
                }
                var _textColor = 'black';//temp purpose
               
                if (Object.keys(_category).length == 0) {
                    scope.loadingObject = { showLoading: false, loadingMessage: 'Loading' };
                } else {
                    _array.push({
                        "symbol": 'My Selection',
                        "size": 40,
                        'color': 'black',
                        "image": 'Images/icons/If no Profile photo.png',
                        "className": 'circleProfileImageClass',
                        "id": 0,
                        "bonds": 1
                    });
                    for (var _key in _category) {
                        _array.push({
                            "symbol": _key,
                            "size": 35,
                            "id": _count,
                            "type": 'C',
                          
                            'color': 'white',
                            'textColor': _textColor,
                            'border': _color,
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
                                    'color': scope.skillRequired ? 'white' : _colorArray[scope.role][_category[_key].topic[_topic].profiLevel],
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
                                            'color': _colorArray[scope.role][_category[_key].topic[_topic].skill[_skill].profiLevel],
                                        
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
                                      
                                        if (_levelSkill == (Object.keys(_category[_key].topic[_topic].skill).length)) {
                                          
                                            _topicId = _skillId;
                                        }
                                        _levelSkill++;
                                    }
                                }
                           
                                if (_dd == (Object.keys(_category[_key].topic).length - 1)) {
                                  
                                    _count = _skillId;
                                }
                            
                                _dd++;
                             
                            }
                        }
                        _count++;
                    }
                  
                    var _retu = {
                        "3-iodo-3-methylhexan-1,4-diamine": {
                            "nodes": _array,
                            "links": _node
                        }
                    }                   
                    scope.ctsDataForMolecule = _retu;
                    scope.loadingObject = { showLoading: false, loadingMessage: 'Loading' };
                }
            };

            var _category = {};         
            var _topics = {};
            var _skills = {};            
            scope.init = function () {
                scope.ctsDataForMolecule = null;

                switch (scope.role) {
                    case 'coach':
                        serverCommunication.getMySelection({
                            successCallBack: function (iObj) {                                
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {                               

                            }
                        });
                        break;
                    case 'mentor':
                   
                        serverCommunication.getMyMentorSelection({
                            successCallBack: function (iObj) {
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {
                             
                            }
                        });
                        break;
                    case 'mentee':
                        serverCommunication.getMyMenteeSelection({
                            successCallBack: function (iObj) {                             
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {
                               
                            }
                        });
                        break;
                    case 'coachee':
                        serverCommunication.getMyCoacheeSelection({
                            successCallBack: function (iObj) {                              
                                _createMoleculeStructure(iObj);
                            },
                            failureCallBack: function (iObj) {                             

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


            var width = 1100, height = 500
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
               
            };

            window.loadMoleculeExample = function () {
                newMoleculeSimulation(moleculeExamples, $('#moleculeExample').val().trim());
            };
           
            var _func = function () {

                return $scope.ctsData
            };

            moleculeExamples = _func();
         

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
                                         .attr("height", 100)
                                         .attr("width", 100)
                                         .attr("xlink:href", function (d) { return d.image; })
                                  
                                } else {
                                    d3.select(this)
                                            .append("image")
                                            .attr("xlink:href", function (d) { return d.image; })
                                            .attr("width", "75px")
                                            .attr("height", "75px");
                                    d3.select(this)
                                             .append("text")
                                             .attr("dy", ".35em")
                                             .attr("x", "40")
                                             .attr("y", "90")
                                             .attr("text-anchor", "middle")
                                             .style("font-size", function (d) { return Math.min(2 * (radius(d.size)), (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                                             .text(function (d) {
                                                 return d.symbol;
                                             });
                                    d3.select(this)
                                             .append("text")
                                             .attr("dy", ".35em")
                                             .attr("x", "40")
                                             .attr("y", "105")
                                             .attr("text-anchor", "middle")
                                             .style("font-size", function (d) { return Math.min(2 * (radius(d.size)), (2 * d.r -8) / this.getComputedTextLength() * 24) + "px"; })  
                                             .text(function (d) {
                                                 return d.Skill;
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


app.directive('rssFeed', function ($state, serverCommunication, $timeout, $rootScope) {
    return {
        scope: {
            skill: "=",
            role: "@"
        },
        templateUrl: '/Home/ksRssFeed',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {
            window.rss = $scope;
            $scope.feedContainArray = [];
            $scope.placeHolderString = 'Select ' +(($scope.role == "mentor" || $scope.role == "mentee") ? "Topics": "Skills") + ' to view Knowledge Feed';
            $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading Feed' };
            //var _selectedTagFed = [];
            $scope.selectedFeedTag = function (iIndex, iOption) {
              
                // _selectedTagFed = [];
                $scope.feedContainArray = [];
                $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading Feed' };
                for (var k = 0 ; k < $scope.skill.length ; k++) {
                    $scope.skill[k].selected = false;
                    if (iOption.name == $scope.skill[k].name) {
                        iOption.selected = true;
                        $scope.getRssFeedData(iOption.name);
                    }
                }
               
            };

            $scope.loadFeedOnNextTab = function (iFeed) {
                window.open(iFeed.url);
            };

            $scope.bookMarkLink = function (iEvent, iFeed) {
                iEvent && (iEvent.stopPropagation());
               
                var _obj = {
                    DocumentName: iFeed.name,
                    LinkUrl: iFeed.url,
                    BookMarkId: $rootScope.loggedDetail.EmailAddress + ":BMK#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1))
                }
                serverCommunication.bookMarkLink({
                    bookMarkObject: _obj,                   
                    successCallBack: function () {                        
                        $rootScope.$broadcast("refreshStateHomeView", {
                            type: 'displayAlert',
                            // subType: 'Meeting',
                            data: {
                                showAlert: true,
                                message: 'Link bookmarked successfully',
                                formatType: '1',
                            }
                        });
                    },
                    failureCallBack: function () {
                     
                      
                    }
                });
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

                    _feedContainArray.sort(function (a, b) {
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
                    $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 0);
                })
                .fail(function (data) {
                    //alert("error");
                  
                });
            };
            $scope.$watch('skill', function () {
               
                if ($scope.skill.length > 0) {
                    $scope.selectedFeedTag(0, $scope.skill[0]);
                }
            });
        }
    }
});


app.directive('feedbackPage', function ($state, serverCommunication, $timeout, $rootScope) {
    return {
        scope: {
            question: "=",
            submitFeedback: "&",
            role: "@",
            closeCallback: "&",
            convObject: "=",
            readOnly: "=",
            feedbackType: "=",
            feedbackClosed: "=",
        },
        templateUrl: '/Home/ksFeedBackPanel',
        //scope: true,   // optionally create a child scope
        link: function ($scope, element, attrs) {
          
           
            $scope.sender = ($scope.convObject.SenderEmail == $rootScope.loggedDetail.EmailAddress) ? $scope.convObject.ReceiverEmail : $scope.convObject.SenderEmail;
            window.feedbackPage = $scope;

            if (typeof $scope.feedbackClosed === 'undefined') {
                $scope.feedbackClosed = false;
            }

            $scope.feedBack = {
                feedBackDetails: {}
            };

            $scope.rewardsPoints = {
                mentorPoints: 0,
                menteePoints: 0,
                coachPoints: 0,
                coacheePoints: 0,
                invitePoints: 0,
                balancePoints: 0,
                redeemedPoints: 0,
                totalPoints: 0
            };
            $scope.myRewardsArray = [];
            $scope.getPointsRecord = function () {

                $scope.loadingRewardObject = { showLoading: true, loadingMessage: 'Loading', showSlogan: false };
                serverCommunication.getPointsRecord({
                    successCallBack: function (iObj) {
                     
                        $scope.rewardsPoints.mentorPoints = iObj.data.MentorRewardPoints ? iObj.data.MentorRewardPoints : 0;
                        $scope.rewardsPoints.menteePoints = iObj.data.MenteeRewardPoints ? iObj.data.MenteeRewardPoints : 0;
                        $scope.rewardsPoints.coachPoints = iObj.data.CoachRewardPoints ? iObj.data.CoachRewardPoints : 0;
                        $scope.rewardsPoints.coacheePoints = iObj.data.CoacheeRewardPoints ? iObj.data.CoacheeRewardPoints : 0;
                        $scope.rewardsPoints.invitePoints = iObj.data.InviteRewardPoints ? iObj.data.InviteRewardPoints : 0;
                        $scope.rewardsPoints.totalPoints = iObj.data.TotalRewardPoints ? iObj.data.TotalRewardPoints : 0;
                        $scope.rewardsPoints.balancePoints = iObj.data.BalanceRewardPoints ? iObj.data.BalanceRewardPoints : 0;
                        $scope.rewardsPoints.redeemedPoints = iObj.data.RedeemedPoints ? iObj.data.RedeemedPoints : 0;
                        $scope.myRewardsArray = iObj.data.PSRAndGames ? iObj.data.PSRAndGames : [];
                        $scope.loadingRewardObject = { showLoading: false, loadingMessage: 'Loading', showSlogan: false };

                    },
                    failureCallBack: function (iObj) {
                       

                    }
                });
            };

            $scope.generateSesstionClosedEntry = function () {
                var _parentId = $scope.convObject.ConversationParentId ? $scope.convObject.ConversationParentId : $scope.convObject.ConversationId;

                var _id = _parentId + ":CHT#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                var _message = '';

                if ($scope.feedbackType == 'preSession') {
                    _message = "Feedback Form has been filled by " + $rootScope.loggedDetail.EmailAddress;
                } else if ($scope.feedbackType == 'closeSession') {
                    _message = $scope.convObject.ConversationType + " " + $scope.convObject.skill + " " + 'was closed';
                }
                var _object = {
                    Content: _message,
                    SenderEmail: $scope.convObject.SenderEmail,//$rootScope.loggedDetail.EmailAddress,
                    ReceiverEmail: $scope.convObject.ReceiverEmail,// $scope.sender,
                    SendOrReceive: 'Send',
                    IsVerified: true,
                    ConversationClosed: $scope.feedbackType == 'closeSession' ? true : false,
                    ConversationType: $scope.convObject.ConversationType,
                    Skill: $scope.convObject.skill,
                    ConversationId: _id,
                    ConversationParentId: _parentId,
                }
              
                var _replica = angular.copy(_object)
                _replica.UpdateDate = new Date().toJSON();
               
                serverCommunication.sendConversation({
                    loggedUserDetails: _object,
                    ReceiverName: $scope.sender,
                    Role: $scope.role,
                    successCallBack: function () {
                       
                    },
                    failureCallBack: function () {
                       
                    }
                });
            };

            $scope.feedBack.sendFeedBackDetail = function () {
            
                var _checkValue = false;
                for (var k = 0; k < $scope.displayArray.length; k++) {
                    if($scope.displayArray[k].actionValue == '') {
                        _checkValue = true;
                    }
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name]= angular.copy($scope.displayArray[k]);
                };
                if (_checkValue) {
                    _displayAlertMeesage({
                            message: 'Please fill all questions', formatType: '2'
                    });
                    return;
                }
                for (var k = 0; k < $scope.displayArray.length; k++) {
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name] = '';
                  
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name] = $scope.displayArray[k];
                };
              
                // return
                var _counter = Math.floor((Math.random() * 10) + 1);
                var _id = $rootScope.loggedDetail.EmailAddress + (Date.now()) + _counter;
                var _rating = 5;
                var _feedBacks = []
                for (var _key in $scope.feedBack.feedBackDetails) {
                    if ($scope.feedBack.feedBackDetails[_key]) {
                        _feedBacks.push({ DataType: $scope.feedBack.feedBackDetails[_key].type, Question: _key, Answer: $scope.feedBack.feedBackDetails[_key].actionValue });
                    }
                        if ($scope.feedBack.feedBackDetails[_key].sessionRating) {
                            _rating = $scope.feedBack.feedBackDetails[_key].actionValue;
                        }
                }
            
                var _objectPassed = {
                    FeedbackType: $scope.feedbackType, FeedBacks: _feedBacks, FeedBackId: _id, FeedbackClosed: $scope.feedbackClosed, Sender: $scope.sender, Skill: $scope.convObject.skill, customerSatisfactionRating: _rating
                };
                
             
                serverCommunication.sendFeedback({
                    role: $scope.role,
                    loggedUserDetails: _objectPassed,
    
                    successCallBack: function (iObj) {
                    
                        $scope.generateSesstionClosedEntry();
                        $scope.feedBack.formValue = '5';                        
                        $scope.getPointsRecord();
                    },
                    failureCallBack: function (iObj) {
                     

                    }
                });
                
            };

            $scope.feedBack.sendPreSessionDetail = function () {
             
                var _checkValue = false;
                for (var k = 0; k < $scope.displayArray.length; k++) {
                    if($scope.displayArray[k].actionValue == '') {
                        _checkValue = true;
                    }
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name]= angular.copy($scope.displayArray[k]);
                };
                if (_checkValue) {
                    _displayAlertMeesage({
                            message: 'Please fill all questions', formatType: '2'
                    });
                    return;
                }
                for (var k = 0 ; k < $scope.displayArray.length ; k++) {
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name] = $scope.displayArray[k];
                };
            

                var _rating = 5;
                var _counter = Math.floor((Math.random() * 10) + 1);
                var _id = $rootScope.loggedDetail.EmailAddress + (Date.now()) + _counter;
                var _feedBacks = []
                for (var _key in $scope.feedBack.feedBackDetails) {
                    if ($scope.feedBack.feedBackDetails[_key]) {
                        _feedBacks.push({ DataType: $scope.feedBack.feedBackDetails[_key].type, Question: _key, Answer: $scope.feedBack.feedBackDetails[_key].actionValue });
                    }
                        if ($scope.feedBack.feedBackDetails[_key].sessionRating) {
                            _rating = $scope.feedBack.feedBackDetails[_key].actionValue;
                       }
                }
               
                var _objectPassed = {
                    FeedbackType: $scope.feedbackType, FeedBacks: _feedBacks, FeedBackId: _id, FeedbackClosed: $scope.feedbackClosed, Sender: $scope.sender, Skill: $scope.convObject.skill, customerSatisfactionRating: _rating
                };

             
                serverCommunication.sendFeedback({
                    role: $scope.role,
                    loggedUserDetails: _objectPassed,

                    successCallBack: function (iObj) {
                   
                     
                        $scope.generateSesstionClosedEntry();
                   

                        $scope.getPointsRecord();

                    },
                    failureCallBack: function (iObj) {
                     

                    }
                });
               
                $scope.feedBack.closeFeedBackPopup();
                return
                
                
            };

            $scope.displayArray = [];
            $scope.counter = 4;
            var _displayAlertMeesage = function (iObj) {
                var _displayAlert = {
                    showAlert: true,
                    message: iObj.message,
                    formatType: iObj.formatType,
                };
                $rootScope.$broadcast("refreshStateHomeView", {
                    type: 'displayAlert',
                  
                    data: _displayAlert
                });
            };

            $scope.loadSlideData = function (iMode, IcallfromHtml) {
             
                var _checkValue = false;
                for (var k = 0; k < $scope.displayArray.length; k++) {
                    if($scope.displayArray[k].actionValue == '') {
                        _checkValue = true;
                    }
                    $scope.feedBack.feedBackDetails[$scope.displayArray[k].name]= angular.copy($scope.displayArray[k]);
                };
                if (_checkValue && iMode == 1) {
                    _displayAlertMeesage({
                        message: 'Please fill all questions', formatType: '2'
                    });
                    return;
                }
                var _loadArray = [];
                $scope.indexArray = [];               
                $scope.displayArray = [];
                if (iMode == 0) {
                    if (IcallfromHtml)
                        $("#carousel-example").carousel('prev');
                    for (var k = 0 ; k < $scope.counter ; k++) {
                        _loadArray.push(angular.copy($scope.question[k]));
                        if (_loadArray.length == $scope.counter) {
                            break;
                        }
                    }
                } else {                   
                    $("#carousel-example").carousel('next');
                    for (var k = 4 ; k < $scope.question.length ; k++) {
                        _loadArray.push(angular.copy($scope.question[k]));
                        if (_loadArray.length == $scope.counter) {
                            break;
                        }
                    }

                }

                for (var l = 0; l < _loadArray.length ; l++) {
                    if ($scope.feedBack.feedBackDetails[_loadArray[l].name]) {                       
                        _loadArray[l].actionValue = $scope.feedBack.feedBackDetails[_loadArray[l].name].actionValue
                    }                       
                }
               
                $scope.displayArray = [].concat(_loadArray);
                setTimeout(function () {
                    for (var k = 0 ; k < $scope.displayArray.length ; k++) {
                        $scope.showRatingColor($scope.displayArray[k].actionValue, $scope.displayArray[k]);
                        $scope.displayArray[k].showLoad = true;
                    }
                    $scope.$apply();
                }, 500);
            };

            $scope.feedBack.closeFeedBackPopup = function () {
                $scope.feedBack.askFeedback = false;
                $scope.feedBack.formValue = '1';
                $scope.closeCallback();
            };
            $scope.redeemAction = { actionName: 'PSR' };

            $scope.redeemPointsClick = function () {
                $scope.feedBack.closeFeedBackPopup();
                serverCommunication.unlockGameCode({
                    //   loggedUserDetails: $rootScope.loggedDetail,
                    redeemAction: $scope.redeemAction,
                    successCallBack: function (iObj) {
                        $scope.submitFeedback();
                       

                    },
                    failureCallBack: function (iObj) {
                       

                    }
                });
            };
            $scope.indexArray = [];
            $scope.showRatingColor = function (iIndex, iQuestion) {
            
                
                iQuestion.indexArray = []
                for (var j = 1 ; j <= iIndex ; j++) {
                    if (iQuestion.indexArray.indexOf(j) == -1)
                        iQuestion.indexArray.push(j);
                }
                if (iQuestion.disbaled) {
                    return;
                }
                iQuestion.actionValue = iIndex;
                return
                var _index = $scope.indexArray.indexOf(iIndex);
                if (_index > -1) {
                 
                    for (var j = 1 ; j <= iIndex ; j++) {
                        $scope.indexArray.splice(j, 1);
                    }
                } else {
                    for (var j = 1 ; j <= iIndex ; j++) {
                        if ($scope.indexArray.indexOf(j) == -1)
                            $scope.indexArray.push(j);
                    }
                }
                $scope.indexArray.sort(function (a, b) { return b - a })
            };

            $scope.openRedeemPanel = function () {
                $scope.feedBack.askFeedback = true;
                $scope.feedBack.formValue = '7';
            };

            $scope.init = function () {
                $scope.feedBack.askFeedback = true;
                $scope.feedBack.formValue = '1';
             
                $scope.loadSlideData(0);
               
            };
            $scope.init();
        }
    }
});

app.filter('myFormat', function () {
    return function (x, a) {
      
        var _array = [];
        if (a.role == 'All') {
            _array = [].concat(x);
        } else {
            x.some(function (iTopic) {
             
                if (iTopic.role == a.role) {
                    iTopic.showSkill = false;
                    _array.push(iTopic);
                }
            });
        }

     
        return _array
    };
});

var fireEvent = function (element, event, iOptions) {
   
    var _bubble = true, _cancel = true;

    if (iOptions && 'bubble' in iOptions)
        _bubble = _bubble && iOptions.bubble;

    if (iOptions && 'cancel' in iOptions)
        _cancel = _cancel && iOptions.cancel;

    if (element) {
        if (event == "click") {
            element.click && element.click();
            return;
        }

        if (document.createEvent) {
          
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, _bubble, _cancel); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        } else {
            // dispatch for IE
            var evt = document.createEventObject();
            return element.fireEvent('on' + event, evt)
        }
    }
};

var uploadImageOnPage = function (iObj, iCallback) {
    var fileInputId = iObj.fileInputId;
    var imageElementId = iObj.imageElementId;
    var imagePath = "";
    fireEvent(document.getElementById(fileInputId), "click", { bubble: false });
    var _change = document.getElementById(fileInputId);
    _change.onchange = function () {
        if (iCallback) iCallback();
    };

};
