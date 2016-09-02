app.controller('ksMainDashBoardController', function ($timeout,$scope, $state, serverCommunication, $rootScope) {
        console.error('Dashoard load successfully')
        $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
        $rootScope.currentModule = 'DashBoard'
        $scope.notificationsArr = [
			    { notificationType: '1', name: 'YOU HAVE COACHING INVITE  FROM', assignPerson: 'HARSHADA D.' },
			    { notificationType: '2', role: 'mentor', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '20/05/2016', meetingTime: '11:00PM', meetingTimeDiff: '1 HOUR' },
			    { notificationType: '2', role: 'coachee', name: 'YOUR MEETING HAS BEEN SCHEDULED WITH SAGAR N  ON', meetingDate: '25/05/2016', meetingTime: '08:00AM', meetingTimeDiff: '2 HOUR' },
			
        ];
		$scope.leftSideMenus = [{ name : 'DashBoard'},{ name : 'Profile'}]
		$scope.applicationRole = [{ name: 'COACHEE', img: '../../Images/icons/coachee_logo.png', message: 'You need to be good, no, you need to be great at a skill, subject or sport.' }, { name: 'MENTEE', img: '../../Images/icons/mentee_logo.png', message: 'You wish to take the certain and efficient path to your success, handling all the changes and surprises on the way.' }, { name: 'COACH', img: '../../Images/icons/coach_logo.png', message: 'You help someone learn, improve and maximize at a skill, subject or sport.' }, { name: 'MENTOR', img: '../../Images/icons/mentor_logo.png', message: 'As an expert, you advise and develop a roadmap for people to make the right choices, to overcome hurdles, to grow and to be successful.' }]
		$scope.roleClick = function (iEvent, iObj) {
		    
		    switch(iObj.name){
		        case 'MENTOR': $state.go('home.dashBoard.mentor');
		            break;
		        case 'MENTEE': $state.go('home.dashBoard.mentee');
		            break;
		        case 'COACH': $state.go('home.dashBoard.coach');
		            break;
		        case 'COACHEE': $state.go('home.dashBoard.coachee');
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

        $scope.loadGridView = function () {
            for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                $scope.notificationData[k].showFlag = false;
            }
            $timeout(function () {
                for (var k = 0 ; k < $scope.notificationData.length ; k++) {
                    $scope.notificationData[k].showFlag = true;
                }
            }, 600);
        };

		$scope.notificationData =[];
        $scope.conversationRequest = function () {
            console.error('Conversation Request Call');
            $scope.notificationData = [];
            serverCommunication.getConversationRequest({
                ConversationType: "Coaching",
                successCallBack: function (iObj) {
                    console.debug('Conversation Request Call', iObj);
                    $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                    $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                    serverCommunication.getAllMeetingRequest({
                        ConversationType: "Coaching",
                        successCallBack: function (iObj) {
                            console.debug('In getAllMeetingRequest', iObj);                        
                            for(var k = 0 ; k < iObj.data.Result.length ; k++){
                                iObj.data.Result[k].Meeting.StartDate = new Date(Number(iObj.data.Result[k].Meeting.StartDate.split('(')[1].split(')')[0]));
                                iObj.data.Result[k].Meeting.EndDate = new Date(Number(iObj.data.Result[k].Meeting.EndDate.split('(')[1].split(')')[0]));
                            }
                            $scope.notificationData = $scope.notificationData.concat(iObj.data.Result);
                            $timeout(function () {
                                for (var k = 0 ; k < $scope.notificationData.length ; k++) {                            
                                    $scope.notificationData[k].showFlag = true;
                                }                         
                            }, 600);
                      
                            $scope.loadingMiddleObject = { showLoading: false, loadingMessage: 'Loading' };
                        },
                        failureCallBack: function (iObj) {
                            console.debug('In failureCallBack', iObj);
                        }
                    });
                },
                failureCallBack: function (iObj) {
                    console.debug('In failureCallBack', iObj);
                }
            });
        };
		$scope.init = function () {
		   
		    $scope.trendingTopicLeftArray = [];
		    $scope.trendingTopicRightArray = [];
		    $scope.conversationRequest();
		    serverCommunication.getCoachTrandingTopic({
             loggedUserDetails: $rootScope.loggedDetail,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                 $scope.StoryDetailArray = [].concat(iObj.data);
               //  console.error($scope.StoryDetailArray)
                 $scope.loadingObject = { showLoading: false, loadingMessage: 'Loading' };
                 if ($scope.StoryDetailArray[0]) {
                     $scope.trendingTopicLeftArray = $scope.StoryDetailArray[0];
                 }
                 if ($scope.StoryDetailArray[1]) {
                     $scope.trendingTopicRightArray = $scope.StoryDetailArray[1];
                 }
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
         });
		};
		$scope.init();
		$timeout(function () {
		    var nodes = document.querySelectorAll('li'),
                _nodes = [].slice.call(nodes, 0);
		    console.error(_nodes)
		    var getDirection = function (ev, obj) {
		        console.error(obj)
		        console.error('w - ' + obj.offsetWidth)
		        console.error('h - ' + obj.offsetHeight)
		        console.error('offsetLeft - ' + obj.offsetLeft)
		        console.error('offsetTop - ' + obj.offsetTop)
		        console.error('pageX - ' + ev.pageX)
		        console.error('pageY - ' + ev.pageY)
		        var w = obj.offsetWidth,
                    h = obj.offsetHeight,
                    x = (ev.pageX - obj.offsetLeft - (w / 2) * (w > h ? (h / w) : 1)),
                    y = (ev.pageY - obj.offsetTop - (h / 2) * (h > w ? (w / h) : 1));
		        console.error('x - ' + x)
		        console.error('y - ' + y)
		        var d = Math.round(Math.atan2(y, x) / 1.57079633) % 4;
		      //  console.error(Math.atan2(y, x))
		      //  console.error(Math.atan2(y, x) / 1.57079633)
		       // console.error(Math.atan2(y, x) / 1.57079633 + 5)
		        console.error('x - ' + x)
		        console.error('y - ' + y)
		        console.error('d - ' + d)
		        
		        return d;
		    };

		    var addClass = function (ev, obj, state) {
		        //debugger
		        var direction = 0;//getDirection(ev, obj),
                   
                    class_suffix = "";
		        console.error(direction)
		        obj.className = "liClassFOrHover";

		        switch (direction) {
		            case 0: class_suffix = '-top'; break;
		            case 1: class_suffix = '-right'; break;
		            case 2: class_suffix = '-bottom'; break;
		            case 3: class_suffix = '-left'; break;
		        }

		        obj.classList.add(state + class_suffix);
		    };

		    // bind events
		    _nodes.forEach(function (el) {
		        el.addEventListener('mouseover', function (ev) {
		            addClass(ev, this, 'in');
		        }, false);

		        el.addEventListener('mouseout', function (ev) {
		            addClass(ev, this, 'out');
		        }, false);
		    });

		}, 600);
	

});