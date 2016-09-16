/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/ksUserDashBoard.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/Login.cshtml" />
/// <reference path="C:\Users\User\Desktop\KindleSpurTest\KindleSpurTest\KindleSpur.WebApplication\Views/User/PasswordPromp.cshtml" />
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'KeepaliveProvider', 'IdleProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, KeepaliveProvider, IdleProvider) {
   
    var _string = window.location.href;
    if (_string.indexOf('PasswordPro') > -1) {
        console.error('1')
        var _userId = _string.split("=")[1];
        $urlRouterProvider.otherwise('passwordPrompt/' + _userId);
    }else{
         $urlRouterProvider.otherwise('login');
    }
    IdleProvider.idle(900);
    IdleProvider.timeout(10);
    KeepaliveProvider.interval(10);
    //$locationProvider.html5Mode(true);
    $stateProvider
    .state('/', {
        url: '/login',
        templateUrl: '/User/Login',
    })
    .state('login', {
        url: '/login',
        templateUrl: '/User/Login',
    })
    .state('home', {
        url: '/home',
        views: {
            '': { templateUrl: '/Home/ksParentState' }
        }
    })
    .state('home.dashBoard', {
        url: '/dashBoard',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksUserDashBoard',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })       
    .state('home.vCGameView', {
        url: '/vcg',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksUserDashBoard',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    .state('home.dashBoard.landingPage', {
        url: '/landingPage',
        'topMainPanel@home': {
            template: '<top-Main-Strip></top-Main-Strip>',
        },
        'mainBody@home': {
            templateUrl: '/Home/ksLandingPage',
        },
        'bottomPanel@home': {
            template: '<bottom-Main-Strip></bottom-Main-Strip>',
        }
    })
    .state('home.dashBoard.profile', {
        url: '/profile',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksProfileView',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    .state('home.dashBoard.coach', {
        url: '/coach/:param',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksDashBoardCoach',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    .state('home.dashBoard.coachee', {
        url: '/coachee',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksDashBoardCoachee',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    .state('home.dashBoard.mentor', {
        url: '/mentor',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksDashBoardMentor',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    .state('home.dashBoard.mentee', {
        url: '/mentee',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksDashBoardMentee',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
    })
    

        ///////////////////////////////////////////
  

    //.state('profile', {
    //    url: '/profile',
    //    templateUrl: '/Home/ksProfileView',
    //})
    .state('passwordPrompt', {
        url: '/password/:userId',
        templateUrl: '/User/PasswordPromp',
    })
    .state('forgotPassword', {
            url: '/forgotPassword/',
            templateUrl: '/User/ForgotPasswordEmail',
    })
	//.state('ksUserDashBoard', {
	//    url: '/ksUserDashBoard',
	//    templateUrl: '/Home/ksUserDashBoard',
	//})
    //.state('dashBoardCoach', {
    //    url: '/coachDashboard/:param',
	//    templateUrl: '/Home/ksDashBoardCoach',
	//})
    //.state('dashBoardCoachee', {
    //    url: '/coacheeDashboard',
	//	templateUrl: '/Home/ksDashBoardCoachee',
	//})
    //.state('dashBoardMentor', {
	//    url: '/mentorDashboard',
	//    templateUrl: '/Home/ksDashBoardMentor',
    //})
    //.state('dashBoardMentee', {
    //    url: '/menteeDashboard',
    //    templateUrl: '/Home/ksDashBoardMentee',
    //})    
    .state('Conversation', {
        url: '/Conversation',
        templateUrl: '/Conversation/Index',
    })
    .state('home.dashBoard.calendar', {
        url: '/calendar',
        views: {
            'topMainPanel@home': {
                template: '<top-Main-Strip></top-Main-Strip>',
            },
            'mainBody@home': {
                templateUrl: '/Home/ksMonthlyTemplate',
            },
            'bottomPanel@home': {
                template: '<bottom-Main-Strip></bottom-Main-Strip>',
            }
        }
        
    })

}]);
