var app = angular.module('app', ['ui.router','smoothScroll']);
app.run(function ($rootScope, $timeout, $state) {
    $rootScope.$on('$locationChangeSuccess', function () {
        var _userDetails = _getMyDetailsFromCookies();
        if (_userDetails) {
            $rootScope.loggedDetail = _userDetails;
            window.rootScope = $rootScope;
        } else {
            //resolve issue page navigation
            if (window.location.href.indexOf('forgotPassword') > -1) {

            }else{
  		        $timeout(function () {
  		            $state.go('login');
            	});        		
            }
        }           
    });

    //var lastDigestRun = new Date();
    //$rootScope.$watch(function detectIdle() {
    //    var now = new Date
    //    console.error(lastDigestRun)
    //    if (now - lastDigestRun > 60 * 60) {
    //        // logout here, like delete cookie, navigate to login ...
    //        alert('sessio')
    //    }
    //    lastDigestRun = now;
    //});
});
var rootScope = null;
function onLinkedInLoad() {

    IN.Event.on(IN, "auth", function () {
        console.error('DDDDDDDDDDDDDDD')
        onLinkedInLogin();
    });
    IN.Event.on(IN, "logout", function () {
        onLinkedInLogout();
    });
}

//execute on logout event
function onLinkedInLogout() {
    location.reload(true);
}

//execute on login event
function onLinkedInLogin() {
    // pass user info to angular
    angular.element(document.getElementById("appBody")).scope().$apply(
		function ($scope) {
		    $scope.getLinkedInData();
		}
	);
}


//function onLinkedInLogin() {
//    // pass user info to angular
//    IN.API.Profile("me").fields(
//                 ["id", "firstName", "lastName", "pictureUrl",
//                         "publicProfileUrl"]).result(function (result) {
//                             // set the model
//                             console.error('ssssssssssssssss')
//                             console.error(result)

//                         }).error(function (err) {
//                             console.error('ssssssssssssssss')
//                             console.error(err)

//                         });

//}
