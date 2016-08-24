app.controller('ksMainDashBoardController', function ($scope, $state, serverCommunication, $rootScope) {
    console.error('Dashoard load successfully')
   
        $scope.notificationsArr = [
			    { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
			    { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
			    { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
			
        ];
		$scope.leftSideMenus = [{ name : 'DashBoard'},{ name : 'Profile'}]
		$scope.applicationRole = [{ name: 'COACHEE', img: '../../Images/icons/coachee_logo.png', message: 'You need to be good, no, you need to be great at a skill, subject or sport.' }, { name: 'MENTEE', img: '../../Images/icons/mentee_logo.png', message: 'You wish to take the certain and efficient path to your success, handling all the changes and surprises on the way.' }, { name: 'COACH', img: '../../Images/icons/coach_logo.png', message: 'You help someone learn, improve and maximize at a skill, subject or sport.' }, { name: 'MENTOR', img: '../../Images/icons/mentor_logo.png', message: 'As an expert, you advise and develop a roadmap for people to make the right choices, to overcome hurdles, to grow and to be successful.' }]
        
		$scope.invitation = {};
		$scope.sendInvitation = function () {
		    console.error($scope.invitation)
            if($scope.invitation.email == ''){
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
      
		$scope.logout = function () {
		   
            console.error(IN.User)  
            if (IN.User) IN.User.logout();
            $state.go('login');
            authentification.logout({ loginObject : {}});
		};

		
		$scope.init = function () {
		   
		    $scope.trendingTopicLeftArray = [];
		    $scope.trendingTopicRightArray = [];
		    serverCommunication.getCoachTrandingTopic({
             loggedUserDetails: $rootScope.loggedDetail,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                 $scope.StoryDetailArray = [].concat(iObj.data);
                 for (var k = 0 ; k < $scope.StoryDetailArray.length ; k++) {
                     if ($scope.StoryDetailArray[k].ConversationType == "Coaching") {
                         $scope.trendingTopicLeftArray.push($scope.StoryDetailArray[k]);
                     } else if ($scope.StoryDetailArray[k].ConversationType == "Mentoring") {
                         $scope.trendingTopicRightArray.push($scope.StoryDetailArray[k]);
                     }
                 }
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
         });
		};
		$scope.init();
});