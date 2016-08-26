app.controller('ksStateHomeController', function ($rootScope, $scope, serverCommunication, $interval, $state) {
   // window.cocc = $scope;
    console.error('Application Home controller --- ');
    //$scope.bottomStrip = { style : '' };
    $scope.invitation = {};
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
    $scope.uiFlag = { loadRepository: false, loadBottomContain : false};
    $rootScope.$on("refreshStateHomeView", function (event,iObj) {
        console.error('refreshStateHomeView ---- ', iObj);
        switch (iObj.type) {
            case "refreshUI": $scope.uiFlag.loadRepository = true; break;
            case "loadBottomContain": $scope.uiFlag.loadBottomContain = true; break;
        }
        
    });
});