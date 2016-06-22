app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication,$rootScope,$state) {
    $scope.editModeProfile = false;
    console.error($rootScope.loggedDetail)
    $scope.myInfo = {
        mobileNumber : '1234567890',
        linkedInLink: 'No link available',
        firstName: $rootScope.loggedDetail.FirstName.toUpperCase(),
        lastName: $rootScope.loggedDetail.LastName.toUpperCase(),
        profileImage: '',
        profileBackgroundImage: '',
        description : 'No Description Available'
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

    $scope.editskills = function (iProfile) {
       // $scope.selectedMenu = true;
        $state.go('dashBoardCoach',{ param: 'test' });
    };

    $scope.triggerUpload = function (iProfile) {
        console.error('width: 42px;')
        var obj = {
            fileInputId: "fileInputIdRv"
        }
        uploadImageOnPage(obj, function (imagePath) {
            var valueFile = document.getElementById("fileInputIdRv").files;
            if (iProfile) {
                $scope.myInfo.profileImage = valueFile[0];
            } else {
                $scope.myInfo.profileBackgroundImage = valueFile[0];
            }

            console.error(valueFile)
            var _object = {
                changeDetails: iProfile ? $scope.myInfo.profileImage :  $scope.myInfo.profileBackgroundImage,
                successCallBack: function () {
                    console.error('In successCallBack');

                },
                failureCallBack: function () {
                    console.error('In failureCallBack');

                }
            }
            serverCommunication.changeProfileImageDetails(_object);
            document.getElementById("fileInputIdRv").value = "";
            $scope.$apply();
        });
    };
    $scope.sendDetailsToServer = function () {
        $scope.editModeProfile = false;
        console.error($scope.myInfo)
        if ($rootScope.FirstName == $scope.myInfo.firstName || $rootScope.LastName == $scope.myInfo.lastName) {
            return;
        }
        $rootScope.FirstName = $scope.myInfo.firstName;
        $rootScope.LastName = $scope.myInfo.lastName;
        var _object = {
            changeDetails: $scope.myInfo,
            successCallBack: function () {
                console.error('In successCallBack');

            },
            failureCallBack: function () {
                console.error('In failureCallBack');

            }
        }
        serverCommunication.changeProgileDetails(_object);
    };
    $scope.sendDescDetailsToServer = function () {
        $scope.editDescription = false;
        console.error($scope.myInfo)
        var _object = {
            changeDetails: { description: $scope.myInfo.description },
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
               
            },
            failureCallBack: function (iObj) {
                console.error('In failuregetMySelectionCallBack', iObj);

            }
        });

    };
    $scope.init();
});