app.controller('ksDashBoardCoachController', function ($scope,serverCommunication,$stateParams) {
    console.error($stateParams) 
    $scope.passedData = $stateParams;

    $scope.coachingStatusArray = [{ name: 'MAYUR N', progressBar: 50, skills: 'ANGULAR JS', status: 'NOT STARTED' }
					, { name: 'SAGAR N', progressBar: 30, skills: 'C# MVC', status: 'JUST PROGRESS' }
					, { name: 'SAGAR P', progressBar: 90, skills: 'C# MVC', status: 'JUST PROGRESS' }
					, { name: 'SHILPA M', progressBar: 60, skills: 'BUSINESS', status: 'NOT STARTED' }
					, { name: 'SHANTANU P', progressBar: 05, skills: 'BUSINESS', status: 'JUST PROGRESS' }
					, { name: 'SONALI J', progressBar: 50, skills: 'PROGRAM', status: 'JUST PROGRESS' }
					, { name: 'ISHWAR J', progressBar: 100, skills: 'DEV', status: 'SESSION OVER' }
    ];


    $scope.notifications = [

                { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
                { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
                { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
               
    ]
    $scope.leftSideMenus = [{ name: 'DASHBOARD' }
                , { name: 'COACHING STATUS' }
                , { name: 'KNOWLEDGE GARDEN' }
                , { name: 'BRAIN GAMES' }
                , { name: 'GRAPHS' }
                , { name: 'RESOURCES' }
                ,{ name : 'Add Skills'}
    ]
    $scope.applicationRole = [{ name: 'COACHEE' }, { name: 'MENTEE' }, { name: 'COACH' }, { name: 'MENTOR' }]
    $scope.rightSideDashBoardArray = [
                { name: 'COACHING STATUS' },
                { name: 'KNOWLEDGE GARDEN' },
                { name: 'FEED YOU SHOULD READ' },
                { name: 'GRAPHS' },
                { name: 'BRAIN GAMES' },
                { name: 'RESOURCES' }
    ];
  
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;
        //switch (iIndex) {
        //    case '0': break;
        //}
    };
    $scope.selectedOption = function (iIndex, iCate) {
        iCate.selectedOption = !iCate.selectedOption;
    }

    $scope.init = function () {
        console.error( $scope.passedData)
        if( $scope.passedData &&  $scope.passedData.param){

            $scope.selectedMenu = '6';
        }else{
            $scope.selectedMenu = '0';
            serverCommunication.getCoachData({
                successCallBack: function () {
                    console.error('In successCallBack');

                },
                failureCallBack: function () {
                    console.error('In failureCallBack');

                }
            });
        }
            
	};
	$scope.init();
});