app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication, $rootScope, $state, $timeout, $filter,authentification) {
    $scope.editModeProfile = false;
    
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
       
        $("#carousel").carousel(iIndex);
    };
   
    $scope.myInfo = {
        mobileNumber: $scope.userInfo.Mobile ? $scope.userInfo.Mobile : null,
        linkedInLink: $scope.userInfo.LinkdinURL ? $scope.userInfo.LinkdinURL : null,
        firstName: $scope.userInfo.FirstName.toUpperCase(),
        lastName: $scope.userInfo.LastName.toUpperCase(),
        IsExternalAuthentication : $scope.userInfo.IsExternalAuthentication,
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
    
        $scope.myInfo.displayAddress = _str;
    };
    var _displayDescription = function () {
        var _str = '';
        if ($scope.userInfo.description)
            _str = $scope.userInfo.description;
       
     
       return _str;
    };
    $scope.selectedMenuIndex = -1;
    $scope.switchRoleDropDown = 'All';
    $scope.switchRoleDropDowns = { role: 'All' };
    $scope.roleDropdownChange = function () {
        //| myFormat:switchRoleDropDowns
        for (var k = 0; k < $scope.mySkill.length ; k++) {
            $scope.mySkill[k].showSkill = false;
        }
      
        $scope.switchRoleDropDowns = { role: $scope.switchRoleDropDown };
       
        var _array = [].concat($filter('myFormat')($scope.topicArray, $scope.switchRoleDropDowns));
       
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
        $("#carousel").carousel(iIndex);
        for (var k = 0; k < $scope.topicArray.length ; k++) {
            $scope.topicArray[k].showSkill = false;
        }
       
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
        $timeout(function () {
            $scope.animationActicvate = true;
          
        }, 1500);
        $scope.mySkill = [].concat(angular.copy($scope.topicArray));
     
        $timeout(function () {
            $scope.displayAddress();
            for (var k = 0; k < $scope.mySkill.length ; k++) {
                $scope.mySkill[k].showSkill = true;
            }
        }, 1900);
    };

    $scope.showRatingColor = function (iIndex, iQuestion) {
       
        var _indexArray = []
        for (var j = 1 ; j <= iIndex ; j++) {
            if (_indexArray.indexOf(j) == -1)
                _indexArray.push(j);
        }
        return _indexArray;
    };

    $scope.loadFeedBacks = function () {

        $scope.feedBackArray = [
             //{ name: 'What do you appreciate the most in your interactions with the mentee ? ', showLoad: false, rating: 4, AsPerRole: 'Coach', ratingArray: [] },
             //{ name: 'Is the coachee/mentee able to grasp the ideas discussed?', showLoad: false, rating: 3, AsPerRole: 'Mentee', ratingArray: [] },
             //{ name: 'What are the Strong Qualities of the Mentee/ Coachee ?', showLoad: false, rating: 5, AsPerRole: 'Mentor', ratingArray: [] },
             //{ name: 'What are the areas where the Mentee needs to Improve ? ', showLoad: false, rating: 2, AsPerRole: 'Coachee', ratingArray: [] },
             //{ name: 'Are there any critical areas where Mentee/ Coachee needs serious and urgent help/ support ?', showLoad: false, rating: 1, AsPerRole: 'Coach', ratingArray: [] },
             //{ name: 'Do you believe that the Mentee will be Successful in the targeted areas after the Mentoring is complete ?', showLoad: false, rating: 4, AsPerRole: 'Mentor', ratingArray: [] },
             //{ name: 'Was it worth your time, energy and interest ?', showLoad: false, rating: 5, AsPerRole: 'Coach', ratingArray: [] },
             //{ name: 'Rate the session', showLoad: false, rating: 5, AsPerRole: 'Coachee', ratingArray: [] },
        ];
        $scope.animationActicvate = false;

        var _object = {
            EmailAddress: $scope.userInfo.EmailAddress,
            role : 'All',
            successCallBack: function (iObj) {
              
                if(iObj.data && iObj.data.length > 0){
                    $scope.feedBackArray = [].concat(iObj.data);
                    $timeout(function () {
                        for (var k = 0; k < $scope.feedBackArray.length ; k++) {
                            $scope.feedBackArray[k].feedbackDate = new Date(Number($scope.feedBackArray[k].feedbackDate.split('(')[1].split(')')[0]));
                            $scope.feedBackArray[k].ratingArray = $scope.showRatingColor($scope.feedBackArray[k].Rating);
                            $scope.feedBackArray[k].showFeed = true;
                        }
                    }, 1500);
                }
                $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 1000);
               
            },
            failureCallBack: function (iObj) {
              
            }
        }
        serverCommunication.getMostRatedFeedback(_object);        

        for (var i = 0 ; i < $scope.feedBackArray.length ; i++) {
            for (var j = 1 ; j <= $scope.feedBackArray[i].rating ; j++) {
                if ($scope.feedBackArray[i].ratingArray.indexOf(j) == -1)
                    $scope.feedBackArray[i].ratingArray.push(j);
            }
        }
    };
    $scope.descriptionLoad = false;
    $scope.localModel = { Password: '', ConfirmPassword  : '' };
    $scope.loadSettingDetail = function () {
        $timeout(function () { $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading Feed' }; }, 1000);
        $timeout(function () {
            $scope.animationActicvate = true;
         
            $scope.localModel = {};          
            $scope.localModel = angular.copy($scope.myInfo);
            $scope.profileHoverFlag = true;
            $scope.localModel.description = _displayDescription();
            $scope.descriptionLoad = true;
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
       
    };

    //autocomplete user name
    $scope.resetAutoComplete = function (iSelectId) {
        if ($scope.removedIdName != true) {
          
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
       
        if ($scope.closePopup) $scope.closePopup();
    };

    $scope.openValueScope = function () {

    };

    $scope.editskills = function (iProfile) {
     
        $state.go('dashBoardCoach', { param: 'test' });
    };

    $scope.uploadFileFunction = function () {

        var valueFile = document.getElementById("fileInputIdRv").files;
        if (iProfile) {
            $scope.myInfo.profileImage = valueFile[0];
        } else {
            $scope.myInfo.profileBackgroundImage = valueFile[0];
        }

     
        var _object = {
            file: valueFile[0],
            successCallBack: function () {
              

            },
            failureCallBack: function () {
               

            }
        }
        serverCommunication.changeProfileImageDetails(_object);
    }

    $scope.triggerUpload = function (iProfile) {
       
        var obj = {
            fileInputId: "fileInputIdRv"
        }
        uploadImageOnPage(obj, function (imagePath) {
            

            var data = new FormData();
          

            var valueFile = document.getElementById("fileInputIdRv").files;
            data.append(valueFile[0].Name, valueFile[0]);
           
            if (iProfile) {
               
                serverCommunication.changeProfileImageDetails(data, null, function (iPath) {
                    $scope.myInfo.profileImage = $scope.userInfo.Photo = iPath.data.Photo;
                    
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
        if (!$scope.localModel.firstName || $scope.localModel.firstName == '') {
            _displayAlertMeesage({ message: "Please enter your first name.", formatType: '2' });
            return;
        }else if(!$scope.localModel.lastName || $scope.localModel.lastName == ''){
            _displayAlertMeesage({ message: "Please Enter your last name.", formatType: '2' });
            return;
        }       

        $scope.myInfo = angular.copy($scope.localModel);
      
        
        $scope.userInfo.FirstName = $scope.myInfo.firstName;
        $scope.userInfo.LastName = $scope.myInfo.lastName;
        $scope.userInfo.Mobile = $scope.myInfo.mobileNumber;
        $scope.userInfo.LinkdinURL = $scope.myInfo.linkedInLink;
        $scope.userInfo.City = $scope.myInfo.City;
        $scope.userInfo.State = $scope.myInfo.State;
        $scope.userInfo.Country = $scope.myInfo.Country;
        
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
               
                _displayAlertMeesage({ message: "Your details has been saved.", formatType: '1' });

            },
            failureCallBack: function () {
               

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
         
            data: _displayAlert
        });
    };
    $scope.sendPasswordDetailsToServer = function () {
       
       
        if (!$scope.localModel.Password || $scope.localModel.Password == '') {
            _displayAlertMeesage({ message: "Please Enter your Password", formatType: '2' });
            return;
        }
       else if (($scope.localModel.Password) != ($scope.localModel.ConfirmPassword)) {
            _displayAlertMeesage({ message: "password and Confirm password are not same", formatType: '2' });
            return;
       }
      
        //return;
        var _object = {
            signupObject: {
                userId  :$scope.userInfo.EmailAddress,
                Password: $scope.localModel.Password
            },
            successCallBack: function () {
               
                _displayAlertMeesage({ message: "Your password has been saved.", formatType: '1' });
            },
            failureCallBack: function () {
             

            }
        }       
        authentification.updatePassword(_object);
    };

    $scope.sendDescDetailsToServer = function () {
     
        if (!$scope.localModel.description || $scope.localModel.description == '') {
            _displayAlertMeesage({ message: "Description cannot be empty.", formatType: '2' });
            return;
        }
        $scope.editDescription = false;
        $scope.myInfo = angular.copy($scope.localModel);
   
        var _object = {
            changeDetails: {
                description: $scope.myInfo.description
            },
            successCallBack: function () {
             
                _displayAlertMeesage({ message: "Description has been saved", formatType: '1' });
                return;
            },
            failureCallBack: function () {
              

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
                 
                    $scope.selectedMenuProfile(0);
                  
                   
                    
                },
                failureCallBack: function (iObj) {
                   

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
       
        link: function (scope, element, attrs) {

        }
    }
});
