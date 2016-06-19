app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication,$rootScope) {
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
    
});