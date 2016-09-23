/**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : login and Signup controller - Manage all data related to  login and signup page
     */
app.controller('ksLoginController', ['$scope', 'authentification', '$location', '$rootScope', '$state', '$stateParams', '$timeout', function ($scope, authentification, $location, $rootScope, $state, $stateParams, $timeout) {
    
    rootScope = $rootScope;
   
    $scope.passedData = $stateParams;
    $scope.loginDetails = { emailAddress: '', password: ''  };
    $scope.displayAlert = { showAlert: false,  message: '',  formatType: '1'  };
   
    $scope.signupDetails = {
        FirstName: '',
        LastName: '',
        EmailAddress: '',
        password: '',
        confirmPassword: ''
    };

    $scope.uiFlag = { loadRepository: false, loadBottomContain: false, loadProfileView: false };
    $rootScope.$on("refreshStateHomeView", function (event, iObj) {
        switch (iObj.type) {          
            case "loadBottomContain":
                $scope.uiFlag.loadBottomContain = true;
                $scope.extraParam = iObj.data;
                $scope.extraParam.closeCallBack = function () {
                    $scope.uiFlag.loadBottomContain = false;
                };
                break;
        }
    });
    $scope.emailValidate = true;
    $scope.emailValidation = function (iEmail) {
        var _validFlag = false;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (iEmail && iEmail.match(mailformat)) {
            _validFlag = true;
           
        } else {
            _validFlag = false;

        }
        return _validFlag
    };

    /**
    * @auther : MKN
    * @date : 07/05/2016
    * @Purpose : success callback after successful login
    */
    var _successLoginCallBack = function (iObject) {
    
        if (!iObject.data.Result) {
            $scope.displayAlert = { showAlert: true, message: iObject.data.Message, formatType: '2' };
            //to access in html displayAlert.showAlert 
        } else {
            var _userDetails = _getMyDetailsFromCookies();
            if (_userDetails)
                $rootScope.loggedDetail = _userDetails;
            if (_userDetails.emailAddress == null && _userDetails.emailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Wrong id password', formatType: '2' };
                $state.go('login', {}, { reload: true });
            } else {
                $state.go('home.dashBoard');
               
            }
        }
    };
    var _successPasswordCallBack = function (iObj) {
        $scope.displayAlert = { showAlert: true, message:'Your password has been saved successfully. Please login', formatType: '1' };
        $timeout(function () {
            $state.go('login', {}, { reload: true });
        }, 1000);
    };

    var _successCallBack = function (iObj) {
        $scope.signupDetails.FirstName = "";
        $scope.signupDetails.LastName = "";
        $scope.signupDetails.EmailAddress = "";

        if (!iObj.data.Result) {
            $scope.displayAlert = { showAlert: true, message:  iObj.data.Message, formatType: '1' };
        }
        
        $timeout(function () {
            $state.go('login', {}, { reload: true });
        }, 1000);
    };

    /**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : failure callback  - don't do anything if user enter wrong credienal in system
     */
    var _failureLoginCallBack = function (iObj) {
        $scope.displayAlert = { showAlert: true, message: 'Invalid username or password', formatType: '2' };
    };
    var _failurePasswordCallBack = function (iObj) {
        $scope.displayAlert = { showAlert: true, message: 'Your password has been saved successfully. Please login', formatType: '1' };
        $timeout(function () {
            $state.go('login', {}, { reload: true });
        }, 1000);
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
        if (($scope.loginDetails.emailAddress == '') || ($scope.loginDetails.password == '')) {
            if ($scope.loginDetails.emailAddress == '' && $scope.loginDetails.password == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter email address and password', formatType: '2' };
            }
            else if ($scope.loginDetails.emailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter email address', formatType: '2' };
            }
            else if ($scope.loginDetails.password == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter password', formatType: '2' };
            }
            return;

        }
        else if ($scope.emailValidation($scope.loginDetails.emailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter the correct email address or password', formatType: '2' };
            return;
        }

        var _object = {
            EmailAddress: $scope.loginDetails.emailAddress.toLowerCase(),
            Password: $scope.loginDetails.password,
        }
        authentification.login({ signupObject: _object, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
    };

    /**
    * @auther : MKN
    * @date : 07/05/2016
    * @Purpose : 
    */
    $scope.cancelClick = function () {
        $state.go('login',{}, { reload: true });
    };
    /**
    * @auther : MKN
    * @date : 07/05/2016
    * @Purpose : 
    */
    $scope.savePassword = function () {
        if ($scope.signupDetails.password == '') {
            $scope.displayAlert = { showAlert: true, message: 'Please enter password', formatType: '2' };
            return
        }
        else if (($scope.signupDetails.password) != ($scope.signupDetails.confirmPassword)) {
            $scope.displayAlert = { showAlert: true, message: 'The passwords are not same', formatType: '2' };
            return;
        }

        var _object = {
            Password: $scope.signupDetails.password
        }
        var _string = window.location.href;
        _object.userId = _string.split('PasswordPromp?UserId=')[1];
        _object.userId = _object.userId.split('#/login')[0];
        authentification.savePassword({ signupObject: _object, successCallBack: _successPasswordCallBack, failureCallBack: _failurePasswordCallBack });
    };

    /**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : signup function  - send data to auth factory to send data to server.
     */

    $scope.signupClick = function () {
        if ($scope.signupDetails.FirstName == '') {
            if ($scope.signupDetails.LastName == '' && $scope.signupDetails.EmailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter first, last name and email address', formatType: '2' };
            } else if ($scope.signupDetails.FirstName == '' && $scope.signupDetails.LastName == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter first name and last name', formatType: '2' };
            }
            else if ($scope.signupDetails.FirstName == '' && $scope.signupDetails.EmailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter first name and email address', formatType: '2' };
            }
            else if ($scope.signupDetails.FirstName == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter first name', formatType: '2' };
            }
            else if ($scope.signupDetails.LastName == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter last name', formatType: '2' };
            } else if ($scope.signupDetails.EmailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter email address', formatType: '2' };
            }
            return
        } else if ($scope.signupDetails.LastName == '') {
            if ($scope.signupDetails.EmailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter last name and email address', formatType: '2' };
            } else {
                $scope.displayAlert = { showAlert: true, message: 'Please enter last name', formatType: '2' };
            }
            return
        } else if ($scope.signupDetails.EmailAddress == '') {
            $scope.displayAlert = { showAlert: true, message: 'Please enter email address', formatType: '2' };
            return
        } else if ($scope.emailValidation($scope.signupDetails.EmailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter correct email address', formatType: '2' };
            return;
        } else {
            $scope.displayAlert = { showAlert: true, message: 'Account activation link sent to your registered email address', formatType: '1' };
        }
        var _object = {
            FirstName: $scope.signupDetails.FirstName,
            LastName: $scope.signupDetails.LastName,
            EmailAddress: $scope.signupDetails.EmailAddress.toLowerCase(),
        }
        authentification.signup({ signupObject: _object, successCallBack: _successCallBack, failureCallBack: _failureLoginCallBack });
    };

    /**
    * @auther : MKN
    * @date : 07/05/2016
    * @Purpose : 
    */
    $scope.forgotPasswordClick = function () {
        if ($scope.signupDetails.EmailAddress == '') {
            $scope.displayAlert = { showAlert: true, message: 'Please enter email address', formatType: '2' };
            return
        }
        else if ($scope.emailValidation($scope.signupDetails.EmailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter correct email address', formatType: '2' };
            return;
        }
        else {
            $scope.displayAlert = { showAlert: true, message: 'Verification link sent to registered email address', formatType: '1' };
        }
        var _object = {
            EmailAddress: $scope.signupDetails.EmailAddress.toLowerCase()
        }
        authentification.verifyEmailAddress({
            signupObject: _object, successCallBack: _successCallBack, failureCallBack: _failureLoginCallBack
        });
    };

    $scope.getLinkedInData = function () {

        if (!$scope.hasOwnProperty("userprofile")) {
            IN.API.Profile("me").fields(
					["id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl", "email-address", 'summary']).result(function (result) {
							  
							    // set the model
							    $rootScope.$apply(function () {
							        var userprofile = result.values[0];
							        $rootScope.loggedDetail = {};
							        $rootScope.loggedDetail.FirstName = userprofile.firstName;
							        $rootScope.loggedDetail.LastName = userprofile.lastName;
							        $rootScope.loggedDetail.Photo = userprofile.pictureUrl ? userprofile.pictureUrl : '';
							        // coverphoto
							      
							        $rootScope.loggedDetail.EmailAddress = userprofile.emailAddress;
							        $rootScope.loggedDetail.LinkdinURL = userprofile.publicProfileUrl;

							        var _object = {
							            EmailAddress: userprofile.emailAddress.toLowerCase(),
							            Password: '',
							        }
							        authentification.linkedInClick({
							            loginObject: userprofile, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack
							        });
							        setTimeout(function () {
							            authentification.login({ signupObject: _object, successCallBack: _successLoginCallBack, failureCallBack: _failureLoginCallBack });
							        }, 400);
							    });
							}).error(function (err) {
							    $scope.error = err;
							});
        }
    };
    //logout and go to login screen
    $scope.logoutLinkedIn = function () {
        //retrieve values from LinkedIn
        if (IN.User) IN.User.logout();
        delete $rootScope.userprofile;
        $rootScope.loggedUser = false;
        _failureLoginCallBack();
    };
}])