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
		templateUrl: '/User/ksUserDashBoard',
	})
    .state('dashBoardCoach', {
        url: '/coachDashboard',
	    templateUrl: '/User/ksDashBoardCoach',
	})
    .state('dashBoardCoachee', {
        url: '/coacheeDashboard',
		templateUrl: '/User/ksDashBoardCoachee',
	})
    .state('dashBoardMentor', {
	    url: '/mentorDashboard',
		templateUrl: '/User/ksDashBoardMentor',
    })
    .state('dashBoardMentee', {
        url: '/menteeDashboard',
        templateUrl: '/User/ksDashBoardMentee',
    })
}]);
