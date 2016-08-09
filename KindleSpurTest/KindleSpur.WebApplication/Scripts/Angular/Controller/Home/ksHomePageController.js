app.controller('ksHomePageController', function ($rootScope, $scope, serverCommunication, $state) {
    $scope.dd = false;
    $scope.dd1 = false;
    $scope.lwp = false;

    $scope.str = 'For the Professional and Individual who wants to Grow,  wants to transform career, wants to be better than Self or wants to go ahead of Peers, KindleSpur provides a platform to define your own Value Creation Goals and leverage the power of Mentoring and Coaching, to accelerate your achievement ! ' +
    'When an employee is able to unlock the immense potential s/he has, s/he grows and along with her, does the organisation.' +
    'The increasing significance of mentoring and coaching owes a lot to this pragmatic belief.' +
    'It makes me shade off my preconceived notions about myself and the environment I am in' +
    'It helps me set a definite and realistic goal' +
    'It prepares me for the desirable change/s to meet that goal' +
    'In the process, I grow as a better person, more open, more confident and of course, more successful than I was before' +
   'The Mentor-Mentee or Coach-Coachee are Unique relationships and the beauty of these relationships is that,these are always mutually nurturing and rewarding !';
    $scope.fff = function () {
        console.error('222')
        $('[data-toggle="popover"]').popover();
    }
    $('#popoverOption').popover({ trigger: "hover" });
    $('#popoverOption1').popover({ trigger: "hover" });
    
    $scope.loadMentoringView = function () {
        $state.go('ksUserDashBoard');
    };
    $scope.loadVcsView = function () {
        $state.go('VCGameView');
    };

});
