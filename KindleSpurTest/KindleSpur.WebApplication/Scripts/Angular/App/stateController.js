/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/ksUserDashBoard.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
app.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider){
   
    var _string = window.location.href;
    if (_string.indexOf('PasswordPro') > -1) {
        console.error('1')
        var _userId = _string.split("=")[1];
        $urlRouterProvider.otherwise('passwordPrompt/' + _userId);
    }else{
         $urlRouterProvider.otherwise('login');
    }
  
    $locationProvider.html5Mode(true);
    $stateProvider
	.state('login', {
		url: '/login',
		templateUrl: '/User/Login',
	})
    .state('profile', {
        url: '/profile',
        templateUrl: '/Home/ksProfileView',
    })
    .state('passwordPrompt', {
        url: '/password/:userId',
        templateUrl: '/User/PasswordPromp',
    })
	.state('ksUserDashBoard', {
	    url: '/ksUserDashBoard',
	    templateUrl: '/Home/ksUserDashBoard',
	})
    .state('dashBoardCoach', {
        url: '/coachDashboard/:param',
	    templateUrl: '/Home/ksDashBoardCoach',
	})
    .state('dashBoardCoachee', {
        url: '/coacheeDashboard',
		templateUrl: '/Home/ksDashBoardCoachee',
	})
    .state('dashBoardMentor', {
	    url: '/mentorDashboard',
	    templateUrl: '/Home/ksDashBoardMentor',
    })
    .state('dashBoardMentee', {
        url: '/menteeDashboard',
        templateUrl: '/Home/ksDashBoardMentee',
    })
}]);
