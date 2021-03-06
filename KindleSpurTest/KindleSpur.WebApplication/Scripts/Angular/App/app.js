﻿var app = angular.module('app', ['ui.router', 'smoothScroll', 'ngIdle']);
app.run(function ($rootScope, $timeout, $state, Idle) {
    
    $rootScope.$on('$locationChangeSuccess', function () {
        if (window.location.href.indexOf('home') > -1) {            
            Idle.watch();
        } else {
            Idle.unwatch();
        }
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

   
});
var rootScope = null;
function onLinkedInLoad() {

    IN.Event.on(IN, "auth", function () {
      
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



