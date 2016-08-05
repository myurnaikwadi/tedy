app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication, $rootScope, $state) {
    $scope.editModeProfile = false;
    console.error($scope.userInfo)
    window.profile = $scope;
    $scope.myInfo = {
        mobileNumber: $scope.userInfo.Mobile ? $scope.userInfo.Mobile : null,
        linkedInLink: $scope.userInfo.LinkdinURL ? $scope.userInfo.LinkdinURL : null,
        firstName: $scope.userInfo.FirstName.toUpperCase(),
        lastName: $scope.userInfo.LastName.toUpperCase(),
        profileImage: '',
        profileBackgroundImage: '',
        descriptiontoDisplay : '',
        description:$scope.userInfo.description ? $scope.userInfo.description :  'No Description Available'
    }
    var uploadImageOnPage = function (iObj, iCallback) {
        var fileInputId = iObj.fileInputId;
        var imageElementId = iObj.imageElementId;
        var imagePath = "";
        commonFunction.fireEvent(document.getElementById(fileInputId), "click", { bubble: false });
        var _change = document.getElementById(fileInputId);
        _change.onchange = function () {
            if (iCallback) iCallback();
        };

    };

    $scope.displayDes = function () {
        if ($scope.myInfo.description && ($scope.myInfo.description != '' && $scope.myInfo.description != 'No Description Available')) {
            $scope.myInfo.descriptiontoDisplay = $scope.myInfo.description;
        }
    };

    $scope.closeProfilePopup = function () {
        console.error('dddddddddddddddddddddd')
        console.error($scope.closePopup)
        if ($scope.closePopup) $scope.closePopup();
    };

    $scope.openValueScope = function () {

    };

    $scope.editskills = function (iProfile) {
        // $scope.selectedMenu = true;
        $state.go('dashBoardCoach',{ param: 'test' });
    };

    $scope.uploadFileFunction = function () {

        var valueFile = document.getElementById("fileInputIdRv").files;
        if (iProfile) {
            $scope.myInfo.profileImage = valueFile[0];
        } else {
            $scope.myInfo.profileBackgroundImage = valueFile[0];
        }

        console.error(valueFile)
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
        console.error('width: 42px;')
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

            console.error(data);
            serverCommunication.changeProfileImageDetails(data);
            document.getElementById("fileInputIdRv").value = "";
            $scope.$apply();
        });
    };
    $scope.sendDetailsToServer = function () {
        $scope.editModeProfile = false;
        console.error($scope.myInfo)
        //if ($scope.userInfo.Mobile == $scope.myInfo.mobileNumber || $scope.userInfo.FirstName == $scope.myInfo.firstName || $scope.userInfo.LastName == $scope.myInfo.lastName) {
        //    return;
        //}
        $scope.userInfo.FirstName = $scope.myInfo.firstName;
        $scope.userInfo.LastName = $scope.myInfo.lastName;
        $scope.userInfo.Mobile = $scope.myInfo.mobileNumber;
        $scope.userInfo.LinkdinURL = $scope.myInfo.linkedInLink;

        var _object = {
            changeDetails: {
                LinkdinURL: $scope.myInfo.linkedInLink, Mobile: $scope.myInfo.mobileNumber, FirstName: $scope.myInfo.firstName, LastName: $scope.myInfo.lastName
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
    $scope.sendDescDetailsToServer = function() {
        $scope.editDescription = false;
        console.error($scope.myInfo)
        $scope.myInfo.description = $scope.myInfo.descriptiontoDisplay;
        var _object = {
            changeDetails: {
                description: $scope.myInfo.description
            },
            successCallBack: function() {
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
        $scope.ctsDataForMolecule = null;
        serverCommunication.getMySelection({
            successCallBack: function (iObj) {
                console.error('In getMySelection', iObj);
                _category = {};
                _categoryArray = [];
                _topicArray = [];
                _skillsArray = [];
                if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
                    for (var k = 0; k < iObj.data.Categories.length ; k++) {
                        if (Object.keys(iObj.data.Categories[k]).length > 0) {
                            if (iObj.data.Categories[k].Category) {
                                if (_category[iObj.data.Categories[k].Category]) {

                                } else {
                                    _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category };
                                    _categoryArray.push(_category[iObj.data.Categories[k].Category]);
                                }
                            }

                            if (iObj.data.Categories[k].Topic) {
                                if (_category[iObj.data.Categories[k].Topic]) {

                                } else {
                                    _category[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic };
                                    _topicArray.push(_category[iObj.data.Categories[k].Topic]);
                                }
                            }

                            if (iObj.data.Categories[k].Skill) {
                                if (_category[iObj.data.Categories[k].Skill]) {

                                } else {
                                    _category[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill };
                                    _skillsArray.push(_category[iObj.data.Categories[k].Skill]);
                                }
                            }

                        }
                    }
                }
                console.error('In getMySelection', _category, _categoryArray, _topicArray, _skillsArray);
                $scope.topicArray = [];
              //  $scope.topicArray =  $scope.topicArray.concat(_categoryArray);
              //  $scope.topicArray =  $scope.topicArray.concat(_topicArray);
                $scope.topicArray =  $scope.topicArray.concat(_skillsArray);
            },
            failureCallBack: function (iObj) {
                console.error('In failuregetMySelectionCallBack', iObj);

            }
        });

    };
    $scope.init();
});

app.directive('profilePage', function ($state, serverCommunication) {
    return {
        scope: {
            editRequired: "@",
            userInfo: "=",
            closePopup: "&"
        },
        templateUrl: '/Home/ksProfileTemplate',
        controller: "ksProfileController",
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {

        }
    }
});
