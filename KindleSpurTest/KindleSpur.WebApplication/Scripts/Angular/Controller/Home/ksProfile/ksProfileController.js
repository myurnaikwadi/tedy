app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication, $rootScope, $state, $timeout, $filter,authentification) {
    $scope.editModeProfile = false;
    // $rootScope.currentModule = 'Profile';
    //console.error($scope.userInfo);
    if ($scope.moduleName)
        $rootScope.currentModule = $scope.moduleName;
    
    if ($scope.loadOutside == 'true')
        $scope.loadOutside = true;
    window.profile = $scope;
    $scope.topicArray = $scope.mySkill = [];
    $scope.profileMenuArr = [{ name: 'OVERVIEW' }, { name: 'FEEDBACKS' }, { name: 'SETTINGS' }];
    if ($scope.editRequired == 'false') {
        $scope.profileMenuArr = [{ name: 'OVERVIEW' }, { name: 'FEEDBACKS' }];
    }

    $scope.slideCar = function (iIndex) {
        //console.error($scope.userInfo);
        $("#carousel").carousel(iIndex);
    };
    // $scope.topicArray = [{ Name: 'OVERVIEW' }, { Name: 'OVERVIEW' }, { Name: 'OVERVIEW' }, { Name: 'OVERVIEW' }, { Name: 'OVERVIEW' }, { Name: 'OVERVIEW' },{ Name: 'OVERVIEW' }, { Name: 'FEEDBACKS' }, { Name: 'SETTINGS' }];
    $scope.myInfo = {
        mobileNumber: $scope.userInfo.Mobile ? $scope.userInfo.Mobile : null,
        linkedInLink: $scope.userInfo.LinkdinURL ? $scope.userInfo.LinkdinURL : null,
        firstName: $scope.userInfo.FirstName.toUpperCase(),
        lastName: $scope.userInfo.LastName.toUpperCase(),
        State: $scope.userInfo.State ? $scope.userInfo.State : '',// ? $scope.userInfo.State : 'No Description Available',
        City: $scope.userInfo.City ? $scope.userInfo.City : '',// ? $scope.userInfo.City : 'No Description Available',
        Country: $scope.userInfo.Country ? $scope.userInfo.Country : '', //? $scope.userInfo.Country : 'No Description Available',
        profileImage: $scope.userInfo.Photo ? $scope.userInfo.Photo : 'Images/icons/If no Profile photo.png',
        profileBackgroundImage: $scope.userInfo.coverphoto ? $scope.userInfo.coverphoto : 'Images/profile.png',
        descriptiontoDisplay: '',
        description: $scope.userInfo.description ? $scope.userInfo.description : 'No Description Available'
    };
    $scope.displayAlert = {
        showAlert: false,
        message: '',
        formatType: '1'
    };

    $scope.displayAddress = function () {
        var _str = 'Location not available';
        if ($scope.myInfo.City)
            _str = $scope.myInfo.City + " ";
        if ($scope.myInfo.State)
            _str += $scope.myInfo.State + " ";
        if($scope.myInfo.Country)
            _str += $scope.myInfo.Country + " ";
        console.error(_str);
        $scope.myInfo.displayAddress = _str;
    };

    $scope.selectedMenuIndex = -1;
    $scope.switchRoleDropDown = 'All';
    $scope.switchRoleDropDowns = { role: 'All' };
    $scope.roleDropdownChange = function () {
        //| myFormat:switchRoleDropDowns
        for (var k = 0; k < $scope.mySkill.length ; k++) {
            $scope.mySkill[k].showSkill = false;
        }
        console.error($scope.switchRoleDropDown)
        $scope.switchRoleDropDowns = { role: $scope.switchRoleDropDown };
        //console.error($scope.switchRoleDropDowns)
        var _array = [].concat($filter('myFormat')($scope.topicArray, $scope.switchRoleDropDowns));
        //$scope.mySkill = [].concat(_array);
        $scope.mySkill = [].concat(angular.copy(_array));
        $timeout(function () {           
            for (var k = 0; k < $scope.mySkill.length ; k++) {
                $scope.mySkill[k].showSkill = true;
            }
        }, 600);
    };

    $scope.selectedMenuProfile = function (iIndex) {
        $scope.selectedMenuIndex = iIndex;
        $scope.animationActicvate = false;
        $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading Feed' };
        $scope.localModel = {};
        $scope.profileHoverFlag =false;
        for (var k = 0; k < $scope.topicArray.length ; k++) {
            $scope.topicArray[k].showSkill = false;
        }
        //   console.error( $scope.selectedMenuIndex)
        switch (iIndex) {
            case 0: $scope.loadPersonalInfoAndSkill(); break;
            case 1: $scope.loadFeedBacks(); break;
            case 2: $scope.loadSettingDetail(); break;
        }
    };
    $scope.uiFlag = {
        
        ConfirmPassword: { flagName : -1, styleToPassword : { 'position': 'absolute', 'height': '100%', 'width': "0%", 'background': 'white', 'transition': 'all 0.7s ease' } }, 
        Password: { flagName : -1, styleToPassword : { 'position': 'absolute', 'height': '100%', 'width': "0%", 'background': 'white', 'transition': 'all 0.7s ease' } }

    }
    $scope.fun = function (iObj,iModel) {
        console.log($scope.localModel.Password)
        if (iModel.length > 8 && iModel.length < 13) {
            iObj.flagName = 1;
            iObj.styleToPassword = { 'position': 'absolute', 'height': '100%', 'width': "5%", 'background': 'red', 'transition': 'all 0.7s ease' };
            
        }
        else if (iModel.length > 12 && iModel.length < 16) {
            iObj.flagName = 2;
            iObj.styleToPassword = { 'position': 'absolute', 'height': '100%', 'width': "50%", 'background': 'orange', 'transition': 'all 0.7s ease' };
        }
        else if (iModel.length > 15 && iModel.length < 20) {
            iObj.flagName = 3;
            iObj.styleToPassword = { 'position': 'absolute', 'height': '100%', 'width': "100%", 'background': 'green', 'transition': 'all 0.7s ease' };
        }
    }


    $scope.loadPersonalInfoAndSkill = function () {
        $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 1000);
        $timeout(function () { $scope.animationActicvate = true; console.error($scope.animationActicvate) }, 1500);
        $scope.mySkill = [].concat(angular.copy($scope.topicArray));
      //  console.error($scope.mySkill);
        $timeout(function () {
            $scope.displayAddress();
            for (var k = 0; k < $scope.mySkill.length ; k++) {
                $scope.mySkill[k].showSkill = true;
            }
        }, 1900);
    };

    $scope.loadFeedBacks = function () {

        $scope.feedBackArray = [
             { name: 'What do you appreciate the most in your interactions with the mentee ? ', showLoad: false, rating: 4, AsPerRole: 'Coach', ratingArray: [] },
             { name: 'Is the coachee/mentee able to grasp the ideas discussed?', showLoad: false, rating: 3, AsPerRole: 'Mentee', ratingArray: [] },
             { name: 'What are the Strong Qualities of the Mentee/ Coachee ?', showLoad: false, rating: 5, AsPerRole: 'Mentor', ratingArray: [] },
             { name: 'What are the areas where the Mentee needs to Improve ? ', showLoad: false, rating: 2, AsPerRole: 'Coachee', ratingArray: [] },
             { name: 'Are there any critical areas where Mentee/ Coachee needs serious and urgent help/ support ?', showLoad: false, rating: 1, AsPerRole: 'Coach', ratingArray: [] },
             { name: 'Do you believe that the Mentee will be Successful in the targeted areas after the Mentoring is complete ?', showLoad: false, rating: 4, AsPerRole: 'Mentor', ratingArray: [] },
             { name: 'Was it worth your time, energy and interest ?', showLoad: false, rating: 5, AsPerRole: 'Coach', ratingArray: [] },
             { name: 'Rate the session', showLoad: false, rating: 5, AsPerRole: 'Coachee', ratingArray: [] },
        ];
        $scope.animationActicvate = false;
        $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 1000);
        $timeout(function () {
            for (var k = 0; k < $scope.feedBackArray.length ; k++) {
                $scope.feedBackArray[k].showFeed = true;
            }
        }, 1500);


        for (var i = 0 ; i < $scope.feedBackArray.length ; i++) {
            for (var j = 1 ; j <= $scope.feedBackArray[i].rating ; j++) {
                if ($scope.feedBackArray[i].ratingArray.indexOf(j) == -1)
                    $scope.feedBackArray[i].ratingArray.push(j);
            }
        }
    };
    $scope.localModel = { Password: '', ConfirmPassword  : '' };
    $scope.loadSettingDetail = function () {
        $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 1000);
        $timeout(function () {
            $scope.animationActicvate = true;
          //  console.error($scope.animationActicvate);
            $scope.localModel = {};
            $scope.profileHoverFlag = true;
            $scope.localModel = angular.copy($scope.myInfo);
            setTimeout(function () {
                _setElementFocus('userId');
            }, 400);
        }, 1500);
    };  

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
    $scope.closeAlertMessage = function (iSelectId) {
        _resetStyles(iSelectId);
        //if ($scope.toFocusUserId == "true") {
        //    _setElementFocus('userId'); //To set focus on UserId in login page when error occurred at UerId.  
        //    $scope.toFocusUserId = "false";
        //}
        //else if ($scope.toFocusPwd == "true") {
        //    _setElementFocus('userIdTask'); //to set focus on Password field in login page when error occurred at password.
        //    $scope.toFocusPwd = "false";
        //}
    };

    //autocomplete user name
    $scope.resetAutoComplete = function (iSelectId) {
        if ($scope.removedIdName != true) {
            //$scope.recentlyLoggedUsersAutoSuggestArr = [];
            $scope.selectedIndex = -1;
        }
        else {
            _setElementFocus(iSelectId); //to set focus on Password field in login page when error occurred at password.	
            $scope.removedIdName = false;
        }
    };

    $scope.autoCompleteEmailId = function ($event, iSelectId) {
        if ($event.keyCode === 9 || $event.keyCode === 27) {//tab/Esc key press
            //if tab is  pressed, set selectedIndex value to userId & focus to password field
            if ($event.keyCode === 9) {
                if ($scope.selectedIndex != -1) {
                    //  $scope.credentials.username= $scope.recentlyLoggedUsersAutoSuggestArr[$scope.selectedIndex];
                    // $scope.recentlyLoggedUsersAutoSuggestArr = [];
                    $scope.selectedIndex = -1;
                }
            }
            $scope.resetAutoComplete(iSelectId);
        }

    };

    $scope.displayDes = function () {
        if ($scope.myInfo.description && ($scope.myInfo.description != '' && $scope.myInfo.description != 'No Description Available')) {
            $scope.myInfo.descriptiontoDisplay = $scope.myInfo.description;
        }
    };

    $scope.closeProfilePopup = function () {
        //console.error('dddddddddddddddddddddd')
       // console.error($scope.closePopup)
        if ($scope.closePopup) $scope.closePopup();
    };

    $scope.openValueScope = function () {

    };

    $scope.editskills = function (iProfile) {
        // $scope.selectedMenu = true;
        $state.go('dashBoardCoach', { param: 'test' });
    };

    $scope.uploadFileFunction = function () {

        var valueFile = document.getElementById("fileInputIdRv").files;
        if (iProfile) {
            $scope.myInfo.profileImage = valueFile[0];
        } else {
            $scope.myInfo.profileBackgroundImage = valueFile[0];
        }

       // console.error(valueFile)
        var _object = {
            file: valueFile[0],
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        }
        serverCommunication.changeProfileImageDetails(_object);
    }

    $scope.triggerUpload = function (iProfile) {
        //console.error('width: 42px;')
        var obj = {
            fileInputId: "fileInputIdRv"
        }
        uploadImageOnPage(obj, function (imagePath) {
            //var valueFile = document.getElementById("fileInputIdRv").files;
            //if (iProfile) {
            //    $scope.myInfo.profileImage = valueFile[0];
            //} else {
            //    $scope.myInfo.profileBackgroundImage = valueFile[0];
            //}

            //console.error(valueFile)
            //var _object = {
            //    file: valueFile[0],
            //    successCallBack: function () {
            //        console.error('In successCallBack');

            //    },
            //    failureCallBack: function () {
            //        console.error('In failureCallBack');

            //    }
            //}

            var data = new FormData();
            //angular.forEach(scope.item, function (value, key) {
            //    if (key == "files") {
            //        for (var i = 0; i < value.length; i++) {
            //            data.append(value[i].name, value[i]); // Filename:File
            //        }
            //    } else {
            //        data.append(key, value);
            //    }
            //});

            var valueFile = document.getElementById("fileInputIdRv").files;
            data.append(valueFile[0].Name, valueFile[0]);
            //  debugger;
           // console.error(data);
            if (iProfile) {
                // $scope.myInfo.profileImage = valueFile[0];
                serverCommunication.changeProfileImageDetails(data, null, function (iPath) {
                    $scope.myInfo.profileImage = $scope.userInfo.Photo = iPath.data.Photo;
                    // console.error($scope.myInfo.profileImage)
                    if ($rootScope.loggedDetail.EmailAddress == iPath.data.EmailAddress) {
                        $rootScope.loggedDetail = iPath.data;
                    }
                });
            } else {

                serverCommunication.changeProfileImageDetails(data, true, function (iPath) {
                    $scope.myInfo.profileBackgroundImage = $scope.userInfo.coverphoto = iPath.data.coverphoto;
                    if ($rootScope.loggedDetail.EmailAddress == iPath.data.EmailAddress) {
                        $rootScope.loggedDetail = iPath.data;
                    }
                });
            }
            document.getElementById("fileInputIdRv").value = "";
            $scope.$apply();
        });
    };
    $scope.sendDetailsToServer = function () {
        $scope.editModeProfile = false;       
        $scope.myInfo = angular.copy($scope.localModel);
       // console.error($scope.myInfo)
        //if ($scope.userInfo.Mobile == $scope.myInfo.mobileNumber || $scope.userInfo.FirstName == $scope.myInfo.firstName || $scope.userInfo.LastName == $scope.myInfo.lastName) {
        //    return;
        //}
        $scope.userInfo.FirstName = $scope.myInfo.firstName;
        $scope.userInfo.LastName = $scope.myInfo.lastName;
        $scope.userInfo.Mobile = $scope.myInfo.mobileNumber;
        $scope.userInfo.LinkdinURL = $scope.myInfo.linkedInLink;
        $scope.userInfo.City = $scope.myInfo.City;
        $scope.userInfo.State = $scope.myInfo.State;
        $scope.userInfo.Country = $scope.myInfo.Country;
        //return
        var _object = {
            changeDetails: {
                LinkdinURL: $scope.myInfo.linkedInLink,
                Mobile: $scope.myInfo.mobileNumber,
                FirstName: $scope.myInfo.firstName,
                LastName: $scope.myInfo.lastName,
                City: $scope.myInfo.City,
                State: $scope.myInfo.State,
                Country: $scope.myInfo.Country
            },
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        }
        serverCommunication.changeProgileDetails(_object);
    };
    var _displayAlertMeesage = function (iObj) {
        var _displayAlert = {
            showAlert: true,
            message: iObj.message,
            formatType: iObj.formatType,
        };
        $rootScope.$broadcast("refreshStateHomeView", {
            type: 'displayAlert',
            // subType: 'Meeting',
            data: _displayAlert
        });
    };
    $scope.sendPasswordDetailsToServer = function () {
       
        console.error($scope.localModel)
        if ($scope.localModel.Password == '') {
            _displayAlertMeesage({ message: "Please Enter Password", formatType: '2' });
        }
       else if (($scope.localModel.Password) != ($scope.localModel.ConfirmPassword)) {
            _displayAlertMeesage({ message: "The passwords are not same", formatType: '2' });
            return;
        }
        //return;
        var _object = {
            signupObject: {
                userId  :$scope.userInfo.EmailAddress,
                Password: $scope.localModel.Password
            },
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        }       
        authentification.updatePassword(_object);
    };

    $scope.sendDescDetailsToServer = function () {
        $scope.editDescription = false;
        $scope.myInfo = angular.copy($scope.localModel);
      //  console.error($scope.myInfo)
        $scope.myInfo.description = $scope.myInfo.descriptiontoDisplay;
        var _object = {
            changeDetails: {
                description: $scope.myInfo.description
            },
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        }
        serverCommunication.changeDescriptionDetails(_object);
    };
    var _category = {};
    var _categoryArray = [];
    var _topicArray = [];
    var _skillsArray = [];
    $scope.init = function () {
        $rootScope.$broadcast("refreshView", { type: 'refreshUI' });
        $scope.ctsDataForMolecule = null;
        $scope.loadAnimation = false;
        $timeout(function () {
            $scope.loadAnimation = true;
        }, 500);

    //    console.error($scope);
        
        if ($scope.userInfo.Skills) {
            $scope.topicArray = [];
            for (var i = 0; i < $scope.userInfo.Skills.length; i++) {
                var _obj = {
                    Name: $scope.userInfo.Skills[i].Name,
                    role: $scope.userInfo.Role
                }
                $scope.topicArray.push(_obj);
            }
            $scope.selectedMenuProfile(0);
        } else if ($scope.userInfo.Topics) {
           // $scope.topicArray = [].concat($scope.userInfo.Topics);
            $scope.topicArray = [];
            for (var i = 0; i < $scope.userInfo.Topics.length; i++) {
                var _obj = {
                    Name: $scope.userInfo.Topics[i].Name,
                    role: $scope.userInfo.Role
                }
                $scope.topicArray.push(_obj);
            }
            $scope.selectedMenuProfile(0);
        } else {

            serverCommunication.GetRecordsOfSkillAndTopics({
                userID : $scope.userInfo    ,
                successCallBack: function (iObj) {
                    console.error('In getMySelection', iObj);
                    if (iObj.data) {
                        for (var role in iObj.data) {
                            if (iObj.data[role]) {
                                for (var i = 0; i < iObj.data[role].length; i++) {
                                    var _obj = {
                                        Name: iObj.data[role][i],
                                        role : role
                                    }
                                    $scope.topicArray.push(_obj);
                                }
                              
                            }
                        }
                    }
                    console.error($scope.topicArray)
                    $scope.selectedMenuProfile(0);
                    //return
                   // console.error('In getMySelection', _category, _categoryArray, _topicArray, _skillsArray);
                    //$scope.topicArray = [];
                    ////  $scope.topicArray =  $scope.topicArray.concat(_categoryArray);
                    ////  $scope.topicArray =  $scope.topicArray.concat(_topicArray);
                    //$scope.topicArray = $scope.topicArray.concat(_skillsArray);
                    //$scope.topicArray = [{ Name: 'OVERVIEW', role: 'Coach' }, { Name: 'OVERVIEW', role: 'Coachee' }, { Name: 'OVERVIEW', role: 'Mentor' }, { Name: 'OVERVIEW', role: 'Coach' },
                    //                     { Name: 'OVERVIEW', role: 'Mentee' }, { Name: 'OVERVIEW', role: 'Coach' }, { Name: 'OVERVIEW', role: 'Coachee' },
                    //                     { Name: 'FEEDBACKS', role: 'Coach' }, { Name: 'SETTINGS', role: 'Coachee' }];

                   
                    
                },
                failureCallBack: function (iObj) {
                    console.error('In failuregetMySelectionCallBack', iObj);

                }
            });
        }

        


    };
    $scope.init();
});

app.directive('profilePage', function ($state, serverCommunication) {
    return {
        scope: {
            editRequired: "@",
            userInfo: "=",
            closePopup: "&",
            moduleName: "@?",
            loadOutside: "@?",
        },
        templateUrl: '/Home/ksProfileTemplate',
        controller: "ksProfileController",
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {

        }
    }
});
