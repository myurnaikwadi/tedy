app.controller('ksProfileController', function ($scope, commonFunction, serverCommunication) {
    $scope.editModeProfile = false;
    $scope.myInfo = {
        mobileNumber : '1234567890',
        linkedInLink: 'No link available',
        firstName: 'Test',
        lastName: 'User',
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