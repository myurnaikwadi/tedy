app.controller('ksHomePageController', function ($rootScope, $scope, serverCommunication, $state) {

    $scope.loadMentoringView = function () {
        $state.go('ksUserDashBoard');
    };
    $scope.loadVcsView = function () {
        $state.go('VCGameView');
    };

});
