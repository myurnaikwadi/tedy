app.factory('authentification', function ($http) {
    return {
        //$http.get('/someUrl', config).then(successCallback, errorCallback);
        //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
        /**
          * @auther : MKN
          * @date : 07/05/2016
          * @Purpose : login function - send credienal to verify details
          */
        login: function (iObj) {
            console.error(iObj)
            $http.post('/User/LoginResult', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 07/05/2016
          * @Purpose : logout function - reset all data 
          */
        logout: function (iObj) {
            $http.get('/plateformLogout', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 07/05/2016
          * @Purpose : Signup click function - send credienal to verify details
          */
        signup: function (iObj) {
            console.error(iObj)
            $http.post('/User/Login', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
        },

         ///*** @auther : SVH * @date : 07/05/2016 */
         //forgotPassword: function (iObj) {
         //    console.error(iObj)
         //    $http.post('/User/ForgotPasswordEmail', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
         //},
        
         savePassword: function (iObj) {
             console.error(iObj)
             $http.post('/User/SavePassword', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
         },

         verifyEmailAddress: function (iObj) {
             console.error(iObj)
             $http.post('/User/ForgotPasswordEmail', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
         },

         
         linkedInClick: function (iObj) {
             console.error(iObj)
             var _obj = {
                 FirstName: iObj.loginObject.firstName,
                 LastName: iObj.loginObject.lastName,
                 img: iObj.loginObject.pictureUrl,
                 publicUrl: iObj.loginObject.publicProfileUrl,
                 EmailAddress: iObj.loginObject.emailAddress,
                 IsExternalAuthentication: true
             }
             $http.post('/User/linkedIn', _obj).then(iObj.successCallBack, iObj.failureCallBack);
         },
         logout: function (iObj) {
             $http.post('/User/logout', iObj.loginObject).then(iObj.successCallBack, iObj.failureCallBack);
         },

     }
});


/**
  * @auther : MKN
  * @date : 10/06/2016
  * @Purpose : communication service with server
  */
app.factory('serverCommunication', function ($http) {
    return {

        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : login function - send credienal to verify details
          */
        getDashBoardData: function (iObj) {
            console.error(iObj)
            $http.get('/User/dashboard').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 10/06/2016
         * @Purpose : get Landing page data for Coach
         */
        getCoachData: function (iObj) {
            console.error(iObj)
            $http.get('/User/Coach').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 10/06/2016
         * @Purpose :  get Landing page data for coachee
         */
        getCoacheeData: function (iObj) {
            console.error(iObj)
            $http.get('/User/Coachee').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 10/06/2016
         * @Purpose :  get Landing page data for Mentor
         */
        getMentorData: function (iObj) {
            console.error(iObj)
            $http.get('/User/Mentor').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get Landing page data for Mentee
          */
        getMenteeData: function (iObj) {
            console.error(iObj)
            $http.get('/User/Mentee').then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get category as per role
          */
         getMySelection: function (iObj) {
                console.error(iObj)
                $http.get('/Coach/GetCTS').then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
   * @auther : MKN
   * @date : 10/06/2016
   * @Purpose : get category as per role
   */
        getMyMentorSelection: function (iObj) {
            console.error(iObj)
            $http.get('/Mentor/GetTopics').then(iObj.successCallBack, iObj.failureCallBack);
        },

        
        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get category as per role
          */
         getMyMentorSelection: function (iObj) {
             console.error(iObj)
             $http.get('/Mentor/GetTopics').then(iObj.successCallBack, iObj.failureCallBack);
         },
        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get category as per role
          */
        getCategorys: function (iObj) {
            console.error(iObj)
            $http.get('/CTS/GetCTS').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
      * @auther : MKN
      * @date : 10/06/2016
      * @Purpose : get topic and skill as per category selected
      */
        getTopicSkill: function (iObj) {
            console.error(iObj)
            $http.get('/CTS/GetTopicSkills', iObj.cateGoryObject).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get topic and skill as per category selected
          */
        sendSelectedCTSDataToServer: function (iObj) {
            console.error(iObj)
            $http.post('/Coach/SaveSkills', iObj.selectedArray).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get topic and skill as per category selected
          */
        sendSelectedCTSDataToServerMentor: function (iObj) {
            console.error(iObj)
            $http.post('/Mentor/SaveTopics', iObj.selectedArray).then(iObj.successCallBack, iObj.failureCallBack);
        },


        /**
         * @auther : MKN
         * @date : 15/06/2016
         * @Purpose :
         */
        changeProgileDetails: function (iObj) {
            console.error(iObj)
            $http.post('/User/UpdateUserDetails', iObj.changeDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
       * @auther : MKN
       * @date : 15/06/2016
       * @Purpose :
       */
        changeDescriptionDetails: function (iObj) {
            console.error(iObj)
            $http.post('/User/UpdateUserDesc', iObj.cateGoryObject).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
      * @auther : MKN
      * @date : 15/06/2016
      * @Purpose :
      */
        changeProfileImageDetails: function (iObj) {
            console.error(iObj)
            //method: 'POST',
            //url: '/resources/messages',
            //data: message // your original form data,
            //transformRequest: formDataObject  // this sends your data to the formDataObject provider that we are defining below.
            //headers: {'Content-Type': 'multipart/form-data'}
            $http.post('/User/UpdateUserPhoto', iObj.file).then(iObj.successCallBack, iObj.failureCallBack);
        },

        getCTSFilters: function (iObj) {
            $http.get('/CTS/GetCTSFilters').then(iObj.successCallBack, iObj.failureCallBack)
        },

        getCoaches: function (iObj) {
            var req = {
                method: 'POST',
                url: '/Coach/GetCoachs',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ctsFilter: iObj.filter }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 15/06/2016
         * @Purpose :
         */
        getCoachingWithStatus: function (iObj) {
            $http.get('/Mentor/GetCoachingStatus', iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
        },
        /**
        * @auther : MKN
        * @date : 15/06/2016
        * @Purpose :
        */
        sendFeedback: function (iObj) {
            console.error(iObj)
            $http.post('/Coach/SaveFeedBack', iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
        },
        /**
        * @auther : MKN
         * @date : 15/06/2016
         * @Purpose :
     */
        unlockGameCode: function (iObj) {
            console.error(iObj)
            $http.get('/User/UnlockGame', iObj.redeemAction).then(iObj.successCallBack, iObj.failureCallBack)
        },

        /**
       * @auther : MKN
        * @date : 15/06/2016
        * @Purpose :
    */
        getPointsRecord: function (iObj) {
            console.error(iObj)
            $http.get('/User/GetRewardPoints').then(iObj.successCallBack, iObj.failureCallBack)
        },
        

    }
});


var _getMyDetailsFromCookies = function () {
    var _user = document.cookie;
    console.error(_user)
    var ca = _user.split(';');
    var _userDetails = null;
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        if (c.indexOf('ksUser') > -1) {
            _userDetails = c;
        }
    }
    if (_userDetails) {
        var _de = _userDetails.split('com=');
        var _userDetails = JSON.parse(_de[1]);
        console.error(ca)
    }

    return _userDetails;
};

