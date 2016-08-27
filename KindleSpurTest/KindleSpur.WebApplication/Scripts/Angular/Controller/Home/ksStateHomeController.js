app.controller('ksStateHomeController', function ($rootScope, $scope, serverCommunication, $interval, $state) {
    window.parent = $scope;
    console.error('Application Home controller --- ');
    //$scope.bottomStrip = { style : '' };
    $scope.invitation = {};
    $scope.extraParam = {};
    $scope.sendInvitation = function () {
        console.error($scope.invitation)
        if ($scope.invitation.email == '') {
            return;
        }
        serverCommunication.sendInvitationToFriend({
            invitation: { Email: [$scope.invitation.email], UserDetails: { FirstName: $rootScope.loggedDetail.FirstName, LastName: $rootScope.loggedDetail.LastName, EmailAddress: $rootScope.loggedDetail.EmailAddress }, Description: $scope.invitation.description },
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.invitation = {};
            },
            failureCallBack: function (iObj) {
            }
        });
    };
    $scope.uiFlag = { loadRepository: false, loadBottomContain: false };
    $rootScope.$on("refreshStateHomeView", function (event, iObj) {
        console.error('refreshStateHomeView ---- ', iObj);
        switch (iObj.type) {
            case "loadUpperSlider":
                $scope.uiFlag.loadRepository = true;
                $scope.uiFlag.loadModule = iObj.subType;
                $scope.extraParam = iObj.data;
                $scope.extraParam.closeCallBack = function () {
                    console.error('sssss')
                    $scope.uiFlag.loadRepository = false;
                }
                break;
            case "loadBottomContain": $scope.uiFlag.loadBottomContain = true; break;
        }

    });
});