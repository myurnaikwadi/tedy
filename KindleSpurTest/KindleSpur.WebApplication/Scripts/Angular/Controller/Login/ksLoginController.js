/**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : login and Signup controller - Manage all data related to  login and signup page
     */
app.controller('ksLoginController', ['$scope', 'authentification', '$location', '$rootScope', '$state', function ($scope, authentification, $location, $rootScope, $state) {
 	console.error('login Page loaded Successfully');
 	$scope.loginDetails = {};
     /**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : success callback after successful login
     */
 	var _successLoginCallBack = function (iObj) {
 	    console.error('In _successCallBack');
 	    $state.go('dashBoard');
 	};
 	var _successCallBack = function (iObj) {
 	    console.error('In _successCallBack');
 	    alert('Verification Link is sent successfully. Please check your email account')
 	};
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : failure callback  - don't do anything if user enter wrong credienal in system
      */
 	var _failureLoginCallBack = function (iObj) {
 	    console.error('In _failureCallBack');
 	  //$state.go('login');
 	   $state.go('dashBoard');
 	  //  window.location = '/User/Login';
 	};
  	
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : signup function  - send data to auth factory to send data to server.
      */
 	$scope.loginClick = function () {
   
 	    var _object = {
 	        firstName: $scope.loginDetails.firstName,
 	        lastName: $scope.loginDetails.lastName,
 	    }
 	    console.error(_object)
        
	    authentification.login({ signupObject: _object, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
 	};
 
 	$scope.savePassword = function () {
 	    var _object = {
 	        Password: $scope.loginDetails.password
 	    }
 	    var _string = window.location.href;
 	    _object.userId = _string.split("=")[1];

        console.error(_object)
 	    authentification.savePassword({ signupObject: _object, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
 	}; 	
    
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : signup function  - send data to auth factory to send data to server.
      */
 	$scope.signupClick = function () {
 		var _object = {
 			FirstName : $scope.loginDetails.FirstName,
 			LastName : $scope.loginDetails.LastName,
 			EmailAddress : $scope.loginDetails.EmailAddress,
 		}
 		authentification.signup({ signupObject: _object, successCallBack: _successCallBack, failureCallBack: _failureLoginCallBack });
 	};

 	$scope.getLinkedInData = function () {
 	   
 	    if (!$scope.hasOwnProperty("userprofile")) {
 	        IN.API.Profile("me").fields(
					["id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl", "email-address"]).result(function (result) {
							    console.error(result);
							    // set the model
							    $rootScope.$apply(function () {
							        var userprofile = result.values[0]
							        authentification.linkedInClick({ loginObject: userprofile, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
							        //go to main
							        //  $location.path("/main");
							    });
							}).error(function (err) {
							    $scope.error = err;
							});
 	    }
 	};
    //logout and go to login screen
 	$scope.logoutLinkedIn = function () {
 	    //retrieve values from LinkedIn
 	    IN.User.logout();
 	    delete $rootScope.userprofile;
 	    $rootScope.loggedUser = false;
 	    _failureLoginCallBack();
 	};
}])