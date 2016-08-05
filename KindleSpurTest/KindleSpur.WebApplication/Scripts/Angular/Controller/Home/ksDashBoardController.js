app.controller('ksMainDashBoardController', function ($scope,$state,serverCommunication) {
    console.error('Dashoard load successfully')
    $scope.notificationsArr = [
			{ notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
			{ notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
			{ notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
			
    ];
		$scope.leftSideMenus = [{ name : 'DashBoard'},{ name : 'Profile'}]
		$scope.applicationRole = [{ name: 'COACHEE', img: '../../Images/icons/coachee_logo.png' }, { name: 'MENTEE', img: '../../Images/icons/mentee_logo.png' }, { name: 'COACH', img: '../../Images/icons/coach_logo.png' }, { name: 'MENTOR', img: '../../Images/icons/mentor_logo.png' }]
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
		$scope.trendingTopicLeftArray = [
            { name: 'Strategic Management ' ,description: ' this is a demo description'},
            { name: 'non-finance managers', description: '' },
            { name: 'Bid Solutioning' ,description: ''},
            { name: 'Successful Virtual Teams' ,description: ''},
            { name: 'Technology migration' ,description: ''}
		];
		$scope.trendingTopicRightArray = [
                { name: 'Strategic Management ' ,description: ''},
                { name: 'non-finance managers' ,description: ''},
                { name: 'Bid Solutioning' ,description: ''},
                { name: 'Successful Virtual Teams' ,description: ''},
                { name: 'Technology migration' ,description: ''}
		];

        $scope.navigateToProfile = function () {
            $state.go('profile');
        };
		$scope.logout = function () {
		   
            console.error(IN.User)  
            if (IN.User) IN.User.logout();
            $state.go('login');
            authentification.logout({ loginObject : {}});
		};
		$scope.init = function () {

		    serverCommunication.getCoachTrandingTopic({
             loggedUserDetails: $rootScope.loggedDetail,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                 $scope.StoryDetailArray =[].concat(iObj.data);
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
         });
		};
		$scope.init();
});