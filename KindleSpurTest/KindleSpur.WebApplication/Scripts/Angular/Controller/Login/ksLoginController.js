/**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : login and Signup controller - Manage all data related to  login and signup page
     */
app.controller('ksLoginController', ['$scope', 'authentification', '$location', '$rootScope', '$state', '$stateParams', function ($scope, authentification, $location, $rootScope, $state, $stateParams) {
    console.error('login Page loaded Successfully');
    rootScope = $rootScope;
    $scope.passedData = $stateParams;
 	$scope.loginDetails = {
 	    emailAddress : '',
        password : ''
 	};
 	$scope.displayAlert = {
 	    showAlert: false,
 	    message: '',
        formatType : '1'
 	};
 	console.error($scope.passedData)
 	$scope.signupDetails = {
 	    FirstName : '',
 	    LastName : '',
 	    EmailAddress: '',
 	    password: '',
 	    confirmPassword : ''
 	};
 	console.error($stateParams);

 	$scope.emailValidate = true;
 	$scope.emailValidation = function () {
 	    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 	    if ($scope.emailAddress.match(mailformat)) {
 	        $scope.emailValidate = true;
 	        console.error('validdate')
 	    } else {
 	        $scope.emailValidate = false;
 	    }
 	};
 	//$scope.hideCancelButton = false;
 	//if (window.location.href.indexOf('passwordPrompt') > -1) {
 	//    $scope.hideCancelButton = true;
 	//}


     /**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : success callback after successful login
     */
 	var _successLoginCallBack = function (iObject) {
 	    console.error('In _successCallBack', iObject);
 	    //  window.$cookieStore = $cookieStore 	    
 	    if (!iObject.data.Result) {
 	         //alert(iObject.data.Message);
 	        //to access in html displayAlert.showAlert 
 	        $scope.displayAlert.showAlert = true;
 	        $scope.displayAlert.message = iObject.data.Message;
 	        $scope.displayAlert.formatType = '1';
 	        formatType: '1'
 	         
 	    } else {
 	        var _userDetails = _getMyDetailsFromCookies();
 	        if (_userDetails)
 	            $rootScope.loggedDetail = _userDetails;
 	        if (_userDetails.emailAddress == null && _userDetails.emailAddress == '') {
 	            //alert('wrong id password');
 	            $scope.displayAlert.showAlert = true;
 	            $scope.displayAlert.message = 'wrong id password';
 	            $scope.displayAlert.formatType = '2';
 	            $state.go('login');
 	        } else {
 	            $state.go('landingPage');
 	        }
 	    }
        };
 	var _successPasswordCallBack = function (iObj) {
 	    console.error('In _successCallBack');
 	    //alert('Your password has been save successfully.Please login')
 	    $scope.displayAlert.showAlert = true;
 	    $scope.displayAlert.message = 'Your password has been save successfully.Please login';
 	    $scope.displayAlert.formatType = '1';

 	    $state.go('login');
 	};
 	
 	var _successCallBack = function (iObj) {
 	    console.error('In _successCallBack');
 	    $scope.signupDetails.FirstName = "";
 	    $scope.signupDetails.LastName = "";
 	    $scope.signupDetails.EmailAddress = "";

 	    if(!iObj.data.Result)
 	    {
 	        alert(iObj.data.Message);
        }
 	    //$rootscope.$broadcast('alertBox', {
        //        showAlertBox: true,
        //        formatType: 'success',
        //        closeRequired: true,
        //        message: 'Verification Link is sent successfully. Please check your email account'
        //});
 	   // alert('Verification Link is sent successfully. Please check your email account')
 	};
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : failure callback  - don't do anything if user enter wrong credienal in system
      */
 	var _failureLoginCallBack = function (iObj) {
 	    console.error('In _failureCallBack');
 	    //alert('Invalid Username or Password')
 	    $scope.displayAlert.showAlert = true;
 	    $scope.displayAlert.message = 'Invalid Username or Password';
 	    $scope.displayAlert.formatType = '2';
 	  //$state.go('login');
 	 //  $state.go('dashBoard');
 	  //  window.location = '/User/Login';
 	};	
 	var _failurePasswordCallBack = function (iObj) {
 	    console.error('In _failurePasswordCallBack');
 	    //alert('Your password has been save successfully.Please login')
 	    $scope.displayAlert.showAlert = true;
 	    $scope.displayAlert.message = 'Your password has been save successfully.Please login';
 	    $scope.displayAlert.formatType = '1';
 	    //$state.go('login');
 	    $state.go('login');
 	    //  window.location = '/User/Login';
 	};

 	$scope.isVerified = false;
 	$scope.forgotPasswordClickFunc = function (iEvent) {
 	    iEvent.stopPropagation();
 	    $state.go('forgotPassword');
 	
 	};
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : signup function  - send data to auth factory to send data to server.
      */
 	$scope.loginClick = function () {
 	    //$state.go('landingPage');
        //return
 	    if ($scope.loginDetails.emailAddress == '' || $scope.loginDetails.password == '') {
 	        //alert('Please enter emailAddress or Password')
            $scope.displayAlert.showAlert = true;
            $scope.displayAlert.message = 'Please enter emailAddress or Password';
 	        $scope.displayAlert.formatType = '2';
 	        //formatType: '1'
 	        return
 	    }

 	    var _object = {
 	        EmailAddress: $scope.loginDetails.emailAddress,
 	        Password: $scope.loginDetails.password,
 	    }
 	    console.error(_object)
        
	    authentification.login({ signupObject: _object, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
 	};
 
 	$scope.cancelClick = function () {
 	    
 	    $state.go('login');
 	};

 	$scope.savePassword = function () {
 	    console.error($scope.signupDetails)
 
 	    if ($scope.signupDetails.password == '') {
 	       // alert('Please enter Password')
 	        $scope.displayAlert.showAlert = true;
 	        $scope.displayAlert.message = 'Please enter Password';
 	        $scope.displayAlert.formatType = '2';

 	        return
 	    }
 	    var _object = {
 	        Password: $scope.signupDetails.password
 	    }
 	    var _string = window.location.href;
 	    _object.userId = _string.split("passwordPrompt/")[1];

        console.error(_object)
        authentification.savePassword({ signupObject: _object, successCallBack: _successPasswordCallBack, failureCallBack: _failurePasswordCallBack });
        $state.go('login');
 	}; 	
    
     /**
      * @auther : MKN
      * @date : 07/05/2016
      * @Purpose : signup function  - send data to auth factory to send data to server.
      */
 	$scope.signupClick = function () {
 	    if ($scope.signupDetails.FirstName == '') {
 	        if ($scope.signupDetails.LastName == '' && $scope.signupDetails.EmailAddress == '') {
 	            //alert('Please enter First,last name and Email address')
 	            $scope.displayAlert.showAlert = true;
 	            $scope.displayAlert.message = 'Please enter First,last name and Email address';
 	            $scope.displayAlert.formatType = '2';

 	        }else if ($scope.signupDetails.LastName == '') {
 	            //alert('Please enter last name')
 	            $scope.displayAlert.showAlert = true;
 	            $scope.displayAlert.message = 'Please enter last name';
 	            $scope.displayAlert.formatType = '2';
 	        } else if ($scope.signupDetails.EmailAddress == '') {
 	            //alert('Please enter Email address')
 	            $scope.displayAlert.showAlert = true;
 	            $scope.displayAlert.message = 'Please enter Email address';
 	            $scope.displayAlert.formatType = '2';
 	        }
 	        return
 	    }else if($scope.signupDetails.LastName == ''){
 	         if ($scope.signupDetails.EmailAddress == '') {
 	             //alert('Please enter last name and Email address')
 	             $scope.displayAlert.showAlert = true;
 	             $scope.displayAlert.message = 'Please enter last name and Email address';
 	             $scope.displayAlert.formatType = '2';
 	         } else {
 	            // alert('Please enter last name')
 	             $scope.displayAlert.showAlert = true;
 	             $scope.displayAlert.message = 'Please enter last name';
 	             $scope.displayAlert.formatType = '2';
 	         }
 	         return
 	    } else if ($scope.signupDetails.EmailAddress == '') {
 	       // alert('Please enter Email address')
 	        $scope.displayAlert.showAlert = true;
 	        $scope.displayAlert.message = 'Please enter Email address';
 	        $scope.displayAlert.formatType = '2';
 	        return
 	    }
 		var _object = {
 		    FirstName: $scope.signupDetails.FirstName,
 		    LastName: $scope.signupDetails.LastName,
 		    EmailAddress: $scope.signupDetails.EmailAddress,
 		}
 		authentification.signup({ signupObject: _object, successCallBack: _successCallBack, failureCallBack: _failureLoginCallBack });
 	};

    /*SVH 26-06-2016*/
 	$scope.forgotPasswordClick = function () {
 	    if ($scope.signupDetails.EmailAddress == '') {
 	       // alert('Please enter emailAddress')
 	        $scope.displayAlert.showAlert = true;
 	        $scope.displayAlert.message = 'Please enter emailAddress';
 	        $scope.displayAlert.formatType = '2';
 	        return
 	    }
 		var _object = {
 		    EmailAddress: $scope.signupDetails.EmailAddress
 		}
 		authentification.verifyEmailAddress({ signupObject: _object, successCallBack: _successCallBack, failureCallBack: _failureLoginCallBack
 	});
 	};

 	$scope.getLinkedInData = function () {
 	   
 	    if (!$scope.hasOwnProperty("userprofile")) {
 	        IN.API.Profile("me").fields(
					["id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl", "email-address",'summary']).result(function (result) {
							    console.error(result);
							    // set the model
							    $rootScope.$apply(function () {
							        var userprofile = result.values[0];
							        $rootScope.loggedDetail = {};
							        $rootScope.loggedDetail.FirstName = userprofile.firstName;
							        $rootScope.loggedDetail.LastName = userprofile.lastName;
							        $rootScope.loggedDetail.Photo = userprofile.pictureUrl;
							        $rootScope.loggedDetail.publicProfileUrl = userprofile.publicProfileUrl;
							        $rootScope.loggedDetail.EmailAddress = userprofile.emailAddress;
							        $rootScope.loggedDetail.LinkdinURL = userprofile.id;
							        authentification.linkedInClick({ loginObject: $rootScope.loggedDetail, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack
							    });
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
 	    if(IN.User) IN.User.logout();
 	    delete $rootScope.userprofile;
 	    $rootScope.loggedUser = false;
 	    _failureLoginCallBack();
 	};
}])