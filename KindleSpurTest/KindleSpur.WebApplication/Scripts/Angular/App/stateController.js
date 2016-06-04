/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/ksUserDashBoard.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
app.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider){
    $urlRouterProvider.otherwise('login');
    $locationProvider.html5Mode(true);
	$stateProvider	
	.state('login', {
		url: '/login',
		templateUrl: '/User/Login',
	})
    .state('passwordPrompt', {
        url: '/password',
        templateUrl: '/User/PasswordPromp',
    })
	.state('dashBoard', {
	    url: '/dashBoard',
	    templateUrl: '/Home/ksUserDashBoard',
	})
    .state('dashBoardCoach', {
        url: '/coachDashboard',
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
