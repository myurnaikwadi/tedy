app.controller('ksHomePageController', function ($rootScope, $scope, serverCommunication, $state) {
    $scope.dd = false;
    $scope.dd1 = false;
    $scope.lwp = false;

    $scope.loadMentoringView = function () {
        $state.go('ksUserDashBoard');
    };
    $scope.loadVcsView = function () {
        $state.go('VCGameView');
    };

});
