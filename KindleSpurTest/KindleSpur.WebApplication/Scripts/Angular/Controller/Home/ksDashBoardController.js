app.controller('ksMainDashBoardController', function ($timeout,$scope, $state, serverCommunication, $rootScope) {
        console.error('Dashoard load successfully')
        window.dashBoard = $scope;
        $scope.loadingObject = { showLoading: true, loadingMessage: 'Loading' };
        $rootScope.currentModule = 'DashBoard';
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
		$scope.gridViewLoaded = false;
		$scope.loadGridView = function (iEvent) {
		    iEvent && iEvent.stopPrapagation();		  
		    $rootScope.$broadcast("inboxListener", { gridViewLoaded: $scope.gridViewLoaded });
		};

		$scope.notificationData =[];       
		$scope.init = function () {
		   
		    $scope.trendingTopicLeftArray = [];
		    $scope.trendingTopicRightArray = [];		  
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
		  //  console.error(_nodes)
		    var getDirection = function (ev, obj) {		
		        var w = obj.offsetWidth,
                    h = obj.offsetHeight,
                    x = (ev.pageX - obj.offsetLeft - (w / 2) * (w > h ? (h / w) : 1)),
                    y = (ev.pageY - obj.offsetTop - (h / 2) * (h > w ? (w / h) : 1));
		        var d = Math.round(Math.atan2(y, x) / 1.57079633) % 4;		        
		        return d;
		    };

		    var addClass = function (ev, obj, state) {
		        //debugger
		        var direction = 0;//getDirection(ev, obj),
                   
                    class_suffix = "";
		     //   console.error(direction)
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