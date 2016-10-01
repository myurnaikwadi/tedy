/**
     * @auther : MKN
     * @date : 07/05/2016
     * @Purpose : login and Signup controller - Manage all data related to  login and signup page
     */
app.controller('ksLoginController', ['$scope', 'authentification', '$location', '$rootScope', '$state', '$stateParams', '$timeout', '$interval', function ($scope, authentification, $location, $rootScope, $state, $stateParams, $timeout, $interval) {
    
    rootScope = $rootScope;
    window.login = $scope
    $scope.passedData = $stateParams;
    $scope.loginDetails = { emailAddress: '', password: ''  };
    $scope.displayAlert = { showAlert: false,  message: '',  formatType: '1'  };
   
    //login page animation effect
    $scope.loginAnimation = { applicationLogo: false, otherThanLogin: 0, signupClick : 1 };
    $timeout(function () {
        $scope.loginAnimation.applicationLogo = true;
    }, 500);

    $scope.loginAnimation.loadDemos = function () {
        $scope.loginAnimation.otherThanLogin = 1;
    }; 
    $scope.loginAnimation.loadLoginPage = function () {
        $scope.loginAnimation.otherThanLogin = 2;
    };
    $scope.loginAnimation.changeview = function () {
        
        if ($scope.loginAnimation.signupClick == 2) {
            $scope.loginAnimation.signupClick = 1;
        } else {
            $scope.loginAnimation.signupClick = 2;
        }
        console.error($scope.loginAnimation.signupClick)
        $("#carouselcHECK").carousel($scope.loginAnimation.signupClick);
        
    };
   
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
    * @Purpose : 
    */
    var _messageHidelogic = function () {

        $scope.displayAlert.count = 10;
        if (angular.isDefined($scope.autoSyncCounter)) {
            $interval.cancel($scope.autoSyncCounter);
            $scope.autoSyncCounter = undefined;
        }
        //  $scope.displayAlert.count = 10;
        $scope.autoSyncCounter = $interval(function () {
            $scope.displayAlert.count--;
            if ($scope.displayAlert.count == -1) {
                $interval.cancel($scope.autoSyncCounter);
                $scope.autoSyncCounter = undefined;
                $scope.displayAlert.showAlert = false;
            }
        }, 1000);
    };
    /**
    * @auther : MKN
    * @date : 07/05/2016
    * @Purpose : success callback after successful login
    */
    var _successLoginCallBack = function (iObject) {
    
        if (!iObject.data.Result) {
            $scope.displayAlert = { showAlert: true, message: iObject.data.Message, formatType: '2' };
            _messageHidelogic();
            //to access in html displayAlert.showAlert 
        } else {
            var _userDetails = _getMyDetailsFromCookies();
            if (_userDetails)
                $rootScope.loggedDetail = _userDetails;
            if (_userDetails.emailAddress == null && _userDetails.emailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Wrong id password', formatType: '2' };
                _messageHidelogic();
                $state.go('login', {}, { reload: true });
            } else {
                $state.go('home.dashBoard');
               
            }
        }
    };
    var _successPasswordCallBack = function (iObj) {
        $scope.displayAlert = { showAlert: true, message: 'Your password has been saved successfully. Please login', formatType: '1' };
        _messageHidelogic();
        $timeout(function () {
            $state.go('login', {}, { reload: true });
        }, 1000);
    };

    var _successCallBack = function (iObj) {
        $scope.signupDetails.FirstName = "";
        $scope.signupDetails.LastName = "";
        $scope.signupDetails.EmailAddress = "";

        if (!iObj.data.Result) {
            $scope.displayAlert = { showAlert: true, message: iObj.data.Message, formatType: '1' };
            _messageHidelogic();
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
        _messageHidelogic();
    };
    var _failurePasswordCallBack = function (iObj) {
        $scope.displayAlert = { showAlert: true, message: 'Your password has been saved successfully. Please login', formatType: '1' };
        _messageHidelogic();
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
            _messageHidelogic();
            return;

        }
        else if ($scope.emailValidation($scope.loginDetails.emailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter the correct email address or password', formatType: '2' };
            _messageHidelogic();
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
            _messageHidelogic();
            return
        }
        else if (($scope.signupDetails.password) != ($scope.signupDetails.confirmPassword)) {
            $scope.displayAlert = { showAlert: true, message: 'The passwords are not same', formatType: '2' };
            _messageHidelogic();
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
            _messageHidelogic();
            return
        } else if ($scope.signupDetails.LastName == '') {
            if ($scope.signupDetails.EmailAddress == '') {
                $scope.displayAlert = { showAlert: true, message: 'Please enter last name and email address', formatType: '2' };
            } else {
                $scope.displayAlert = { showAlert: true, message: 'Please enter last name', formatType: '2' };
            }
            _messageHidelogic();
            return
        } else if ($scope.signupDetails.EmailAddress == '') {
            $scope.displayAlert = { showAlert: true, message: 'Please enter email address', formatType: '2' };
            _messageHidelogic();
            return
        } else if ($scope.emailValidation($scope.signupDetails.EmailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter correct email address', formatType: '2' };
            _messageHidelogic();
            return;
        } else {
            $scope.displayAlert = { showAlert: true, message: 'Account activation link sent to your registered email address', formatType: '1' };
            _messageHidelogic();

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
            _messageHidelogic();
            return
        }
        else if ($scope.emailValidation($scope.signupDetails.EmailAddress) == false) {
            $scope.displayAlert = { showAlert: true, message: 'Please enter correct email address', formatType: '2' };
            _messageHidelogic();
            return;
        }
        else {
            $scope.displayAlert = { showAlert: true, message: 'Verification link sent to registered email address', formatType: '1' };
            _messageHidelogic();
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

    //$(function () {
    //    var canvas = document.querySelector('canvas'),
    //        ctx = canvas.getContext('2d')
    //    canvas.width = window.innerWidth;
    //    canvas.height = window.innerHeight;
    //    ctx.lineWidth = .3;
    //    ctx.strokeStyle = (new Color(150)).style;

    //    var mousePosition = {
    //        x: 30 * canvas.width / 100,
    //        y: 30 * canvas.height / 100
    //    };

    //    var dots = {
    //        nb: 250,
    //        distance: 100,
    //        d_radius: 150,
    //        array: []
    //    };

    //    function colorValue(min) {
    //        return Math.floor(Math.random() * 255 + min);
    //    }

    //    function createColorStyle(r, g, b) {
    //        return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
    //    }

    //    function mixComponents(comp1, weight1, comp2, weight2) {
    //        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    //    }

    //    function averageColorStyles(dot1, dot2) {
    //        var color1 = dot1.color,
    //            color2 = dot2.color;

    //        var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
    //            g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
    //            b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
    //        return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    //    }

    //    function Color(min) {
    //        min = min || 0;
    //        this.r = colorValue(min);
    //        this.g = colorValue(min);
    //        this.b = colorValue(min);
    //        this.style = createColorStyle(this.r, this.g, this.b);
    //    }

    //    function Dot() {
    //        this.x = Math.random() * canvas.width;
    //        this.y = Math.random() * canvas.height;

    //        this.vx = -.5 + Math.random();
    //        this.vy = -.5 + Math.random();

    //        this.radius = Math.random() * 2;

    //        this.color = new Color();
    //        //console.log(this);
    //    }

    //    Dot.prototype = {
    //        draw: function () {
    //            ctx.beginPath();
    //            ctx.fillStyle = this.color.style;
    //            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //            ctx.fill();
    //        }
    //    };

    //    function createDots() {
    //        for (i = 0; i < dots.nb; i++) {
    //            dots.array.push(new Dot());
    //        }
    //    }

    //    function moveDots() {
    //        for (i = 0; i < dots.nb; i++) {

    //            var dot = dots.array[i];

    //            if (dot.y < 0 || dot.y > canvas.height) {
    //                dot.vx = dot.vx;
    //                dot.vy = -dot.vy;
    //            }
    //            else if (dot.x < 0 || dot.x > canvas.width) {
    //                dot.vx = -dot.vx;
    //                dot.vy = dot.vy;
    //            }
    //            dot.x += dot.vx;
    //            dot.y += dot.vy;
    //        }
    //    }

    //    function connectDots() {
    //        for (i = 0; i < dots.nb; i++) {
    //            for (j = 0; j < dots.nb; j++) {
    //                i_dot = dots.array[i];
    //                j_dot = dots.array[j];

    //                if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
    //                    if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
    //                        ctx.beginPath();
    //                        ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
    //                        ctx.moveTo(i_dot.x, i_dot.y);
    //                        ctx.lineTo(j_dot.x, j_dot.y);
    //                        ctx.stroke();
    //                        ctx.closePath();
    //                    }
    //                }
    //            }
    //        }
    //    }

    //    function drawDots() {
    //        for (i = 0; i < dots.nb; i++) {
    //            var dot = dots.array[i];
    //            dot.draw();
    //        }
    //    }

    //    function animateDots() {
    //        ctx.clearRect(0, 0, canvas.width, canvas.height);
    //        moveDots();
    //        connectDots();
    //        drawDots();

    //        requestAnimationFrame(animateDots);
    //    }

    //    createDots();
    //    requestAnimationFrame(animateDots);
    //});
}])