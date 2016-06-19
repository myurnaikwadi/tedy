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
             $http.post('/User/Login',iObj.signupObject).then(iObj.successCallBack,iObj.failureCallBack);
         },

         savePassword: function (iObj) {
             console.error(iObj)
             $http.post('/User/SavePassword', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
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
        getCategorys: function (iObj) {
            console.error(iObj)
            $http.get('/api/CTS').then(iObj.successCallBack, iObj.failureCallBack);
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
            $http.post('/CTS/UpdateUserDetails', iObj.changeDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
       * @auther : MKN
       * @date : 15/06/2016
       * @Purpose :
       */
        changeDescriptionDetails: function (iObj) {
            console.error(iObj)
            $http.post('/CTS/UpdateUserDesc', iObj.cateGoryObject).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
      * @auther : MKN
      * @date : 15/06/2016
      * @Purpose :
      */
        changeProfileImageDetails: function (iObj) {
            console.error(iObj)
            $http.post('/CTS/GetTopicSkills', iObj.cateGoryObject).then(iObj.successCallBack, iObj.failureCallBack);
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
        if (c.indexOf('ksUser') > 0) {
            _userDetails = c;
        }
    }
    var _de = _userDetails.split('com=');
    var _userDetails = JSON.parse(_de[1]);
    console.error(ca)
    return _userDetails;
};

