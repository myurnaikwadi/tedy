app.controller('ksMainDashBoardController', function ($scope,$state,authentification) {
    console.error('Dashoard load successfully')
    $scope.notificationsArr = [
			{ notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
			{ notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
			{ notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
			{ notificationType: '3', name: 'MOHAN N.', profileImage: '' }
    ];
		$scope.leftSideMenus = [{ name : 'DashBoard'},{ name : 'Profile'}]
		$scope.applicationRole = [{ name : 'COACHEE'},{ name : 'MENTEE'},{ name : 'COACH'},{ name : 'MENTOR'}]
		$scope.roleClick = function (iEvent, iObj) {
		    
		    switch(iObj.name){
		        case 'MENTOR' :  $state.go('dashBoardMentor');
		            break;
		        case 'MENTEE': $state.go('dashBoardMentee');
		            break;
		        case 'COACH' :  $state.go('dashBoardCoach');
		            break;
		        case 'COACHEE': $state.go('dashBoardCoachee');
		            break;
		    }
		
		};

        $scope.logout = function(){
            $state.go('login');
            authentification.logout({ loginObject : {}});
        };
});