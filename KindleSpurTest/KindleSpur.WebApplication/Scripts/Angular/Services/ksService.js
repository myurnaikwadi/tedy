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
        updatePassword: function (iObj) {
            console.error(iObj)
            $http.post('/User/UpdatePassword', iObj.signupObject).then(iObj.successCallBack, iObj.failureCallBack);
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
                Photo: iObj.loginObject.pictureUrl ? iObj.loginObject.pictureUrl : '',
                LinkdinURL: iObj.loginObject.publicProfileUrl,
                EmailAddress: iObj.loginObject.emailAddress,
                IsExternalAuthentication: true
            }
            console.error(_obj)
            $http.post('/User/linkedIn', _obj).then(iObj.successLinkedCallBack, iObj.failureCallBack);
        },
        logout: function (iObj) {
            $http.post('/User/logout', iObj.loginObject).then(iObj.successCallBack, iObj.failureCallBack);
        },

        successLinkedCallBack: function (iObj) {
            if (!iObj.data.Result) {
                alert(iObj.data.Message);
            }
        }

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
          * @Purpose : get category as per role coach
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
        getMyMenteeSelection: function (iObj) {
            console.error(iObj)
            $http.get('/Mentee/GetTopics').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 10/06/2016
         * @Purpose : get category as per role
         */
        getMyCoacheeSelection: function (iObj) {
            console.error(iObj)
            $http.get('/Coachee/GetCTS').then(iObj.successCallBack, iObj.failureCallBack);
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

        getCategorysTopics: function (iObj) {
            console.error(iObj)
            $http.get('/CTS/GetTopics').then(iObj.successCallBack, iObj.failureCallBack);
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
            var _action = '/Coach/SaveSkills';
            if (iObj.role == 'coachee')
                _action = '/Coachee/SaveSkills';
            $http.post(_action, iObj.selectedArray).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
        * @auther : piyush
        * @date : 04/08/2016
        * @Purpose :get story name and story description
        */
        getDataRelatedIZFromServer: function (iObj) {
            console.error(iObj)
            $http.post('/Value/GetValueFeedStories', iObj.storyDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
         * @auther : piyush
         * @date : 04/08/2016
         * @Purpose : post story name and story description
         */
        sendStory: function (iObj) {

            console.error(iObj)
            $http.post('/Value/SaveValueFeedStory', iObj.storyDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
        * @auther : piyush
        * @date : 04/08/2016
        * @Purpose : get coach Tranding Topic
        */
        getCoachTrandingTopic: function (iObj) {
            console.error(iObj)
            $http.post('/User/GetSkills', iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
          * @auther : MKN
          * @date : 10/06/2016
          * @Purpose : get topic and skill as per category selected
          */
        sendSelectedCTSDataToServerMentor: function (iObj) {
            console.error(iObj)
            var _action = '/Mentor/SaveTopics';
            if (iObj.role == 'mentee')
                _action = '/Mentee/SaveTopics';
            $http.post(_action, iObj.selectedArray).then(iObj.successCallBack, iObj.failureCallBack);
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
            $http.post('/User/UpdateUserDesc', iObj.changeDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
      * @auther : MKN
      * @date : 15/06/2016
      * @Purpose :
      */
        changeProfileImageDetails: function (iObj, iAction, iCallBack) {
            console.error(iObj)
            //method: 'POST',
            //url: '/resources/messages',
            //data: message // your original form data,
            //transformRequest: formDataObject  // this sends your data to the formDataObject provider that we are defining below.
            //headers: {'Content-Type': 'multipart/form-data'}
            var _action = '/Home/UpdateUserPhoto';
            if (iAction) {
                _action = '/Home/UpdatecoverPhoto'
            }
            iObj.successCallBack = function (idata) {
                console.error(idata)
                iCallBack(idata);
            }
            $http.post(_action, iObj, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(iObj.successCallBack, iObj.failureCallBack);
        },

        getCTSFilters: function (iObj) {
            console.error(iObj);
            // $http.get('/CTS/GetCTSFilters').then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/CTS/GetCTSFilters',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: iObj
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },


        //getCoaches: function (iObj) {
        //    var req = {
        //        method: 'POST',
        //        url: '/Coach/GetCoachs',
        //        headers: {
        //            'Content-Type': 'application/json'
        //        },
        //        data: { ctsFilter: iObj.filter }
        //    }
        //    $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        //},
        /**
         * @auther : MKN
         * @date : 4/08/2016
         * @Purpose :to search coachee
         */
        getRecommendedCoach: function (iObj) {
            console.error(iObj)
            var UserRole = {};
            UserRole.Role = iObj.Role;
            console.error(UserRole)
            console.error(JSON.stringify(UserRole))
            $http.post('/Coachee/GetRecommendedCoach', iObj).then(iObj.successCallBack, iObj.failureCallBack)
        },
        getProfileDetailsUserWise: function (iObj) {
           console.error(iObj)     
           $http.post('/Coachee/GetProfileDetails', iObj).then(iObj.successCallBack, iObj.failureCallBack)
        },
        
        getCoaches: function (iObj) {
            var req = {
                method: 'POST',
                url: '/Coachee/GetCoachs',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ctsFilter: iObj.filter, Role: iObj.role }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 15/06/2016
         * @Purpose :
         */
        getCoachingWithStatus: function (iObj) {
            console.error(iObj)
            var _action = '/Coach/GetCoachingStatus'
            if (iObj.role == 'mentor') {
                _action = "/Mentor/GetCoachingStatus";
            } else if (iObj.role == 'mentee') {
                _action = "/Mentee/GetCoachingStatus";
            } else if (iObj.role == 'coachee') {
                _action = "/Coachee/GetCoachingStatus";
            }
            $http.get(_action, iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
        },

        generateGarden: function (iObj) {
            console.error(iObj)
            var _action = '/Coach/GenerateGarden'
            if (iObj.role == 'mentor') {
                _action = "/Mentor/GenerateGarden";
            } else if (iObj.role == 'mentee') {
                _action = "/Mentee/GenerateGarden";
            } else if (iObj.role == 'coachee') {
                _action = "/Coachee/GenerateGarden";
            }
            $http.get(_action, iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
        },
        /**
        * @auther : MKN
        * @date : 15/06/2016
        * @Purpose :
        */
        sendFeedback: function (iObj) {
            console.error(iObj)
            var _action = '';
            switch (iObj.role) {
                case 'Mentor': _action = 'Mentee'; break;
                case 'Mentee': _action = 'Mentor'; break;
                case 'Coach': _action = 'Coachee'; break;
                case 'Coachee': _action = 'Coach'; break;
            }

            var _str = '/' + _action + "/SaveFeedBack";

            iObj.loggedUserDetails.Role = _action;
            console.error(iObj)

            var Data = {
                FeedbackStatus: iObj.loggedUserDetails.FeedbackType.toUpperCase(),
                Sender: iObj.loggedUserDetails.Sender,
                FeedBackId: iObj.loggedUserDetails.FeedBackId,
                QueAndAns: iObj.loggedUserDetails.FeedBacks,
                FeedbackClosed: iObj.loggedUserDetails.FeedbackClosed,
                customerSatisfactionRating: iObj.loggedUserDetails.customerSatisfactionRating,
                Skill: iObj.loggedUserDetails.Skill
            };


            // $http.post(_str, iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: _str,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: Data,
                traditional: true
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);

        },
        /**
       * @auther : MKN
       * @date : 03/09/2016
       * @Purpose :
       */
        getFeedback: function (iObj) {
            console.error(iObj);
            var Data = {
                role : iObj.role,
                Skill: iObj.openConversation.skill,
                senderEmail: iObj.senderEmail,
                //ReceiverMail: iObj.openConversation.ReceiverEmail
            };
            // $http.post(_str, iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/User/GetFeedback',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: Data,
                traditional: true
            }
            console.error(req);
           $http(req).then(iObj.successCallBack, iObj.failureCallBack);

        },
        /**
          * @auther : MKN
          * @date : 03/09/2016
          * @Purpose :
          */
        getMostRatedFeedback: function (iObj) {
            console.error(iObj);
            
            // $http.post(_str, iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/User/GetMostRatedFeedback',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { EmailAddress: iObj.EmailAddress, role: iObj.role },
                traditional: true
            }
            console.error(req);
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);

        },

        /**
       * @auther : MKN
       * @date : 15/06/2016
       * @Purpose :
       */
        bookMarkLink: function (iObj) {
            console.error(iObj)
            var req = {
                method: 'POST',
                url: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { BookMarks: iObj.bookMarkObject },
                traditional: true
            }
            console.error(req);
            //$http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
        * @auther : MKN
         * @date : 15/06/2016
         * @Purpose :
     */
        unlockGameCode: function (iObj) {
            console.error(iObj)
            if (iObj.redeemAction.actionName == 'GAME') {
                $http.get('/User/UnlockGame').then(iObj.successCallBack, iObj.failureCallBack)
            } else {
                $http.get('/User/UnlockPSR').then(iObj.successCallBack, iObj.failureCallBack)
            }
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
        /**
             * @auther : MKN
              * @date : 15/07/2016
              * @Purpose :
          */
        getMyMenteeSelection: function (iObj) {
            $http.get('/Mentee/GetTopics').then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
          * @auther : MKN
          * @date : 25/07/2016
          * @Purpose :
          */
        getActivityByUser: function (iObj) {
            console.error(iObj)
            $http.post('/User/GetVSCSActivity', iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 25/07/2016
         * @Purpose :
         */
        saveActivity: function (iObj) {
            console.error(iObj)
            $http.post('/User/AddVSCSActivity', iObj.activity).then(iObj.successCallBack, iObj.failureCallBack);
        },
        /**
         * @auther : MKN
         * @date : 25/07/2016
         * @Purpose :
         */
        deleteActivity: function (iObj) {
            console.error(iObj)
            $http.post('/User/RemoveVCSCActivity', iObj.activity).then(iObj.successCallBack, iObj.failureCallBack);
        },

        /**
        * @auther : MKN
        * @date : 25/07/2016
        * @Purpose :
        */
        sendSelectedFeed: function (iObj) {
            console.error(iObj)
            $http.post('/Value/SaveValueFeedStory', iObj.selectedFeed).then(iObj.successCallBack, iObj.failureCallBack);
        },
        getConversation: function (iObj) {

            var _action = '/Conversation/GetConversationForSender';
            if (iObj.Role == 'Coach' || iObj.Role == 'Mentor')
                _action = '/Conversation/ListConversationForReceiver';
            var req = {
                method: 'POST',
                url: _action,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { loggedEmail: iObj.loggedEmail, ConversationType: iObj.ConversationType }
            }
            console.error(req);
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },

        getConversationDetails: function (iObj) {
            console.log(iObj);
            var req = {
                method: 'POST',
                url: '/Conversation/GetConversationDetails',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ParentId: iObj.ParentId, ConversationType: iObj.ConversationType }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        getAllConversationRequest: function (iObj) {
            console.log(iObj);
            var req = {
                method: 'POST',
                url: '/Conversation/getAllConversationRequest',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ConversationType: iObj.ConversationType }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        getConversationRequest: function (iObj) {
            console.log(iObj);
            var req = {
                method: 'POST',
                url: '/Conversation/getConversationRequest',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ConversationType: iObj.ConversationType }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);           
        },
        sendConversation: function (iObj) {
            console.error('sendConversation --------------- ', iObj);
            var _checkObj = angular.copy(iObj);
            var _action = _checkObj.loggedUserDetails.IsVerified == false ? '/Conversation/MentoringCoachingInvite' : '/Conversation/ConversationExchanged';
            var req = {
                method: 'POST',
                url: _action,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { _obj: _checkObj.loggedUserDetails, ReceiverName: _checkObj.ReceiverName, Role: _checkObj.Role }
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
            // $http.post('/Conversation/Create', _sdss.loggedUserDetails, _sdss.ReceiverName, _sdssRole).then(iObj.successCallBack, iObj.failureCallBack)
        },
        updateConversation: function (iObj) {
            console.error(iObj)
            $http.post('/Conversation/CoachingMentoringInvite', iObj.loggedUserDetails, iObj.ReceiverName, iObj.Role).then(iObj.successCallBack, iObj.failureCallBack)
        },
        
        getMeetingRequestAsPerRole: function (iObj) {
            console.error(iObj)
            //$http.get('/Schedular/GetAllMeetingRequest').then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/Schedular/GetAllMeetingRequest',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { Role: iObj.Role }
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        getAllMeetingRequest: function (iObj) {
            console.error(iObj)
            //$http.get('/Schedular/GetAllMeetingRequest').then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/Schedular/GetAllMeetingRequest',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {}
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        GetAllMeetingPerMonth: function (iObj) {
            console.error(iObj)
            //$http.get('/Schedular/GetAllMeetingRequest').then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/Schedular/GetAllMeetingPerMonth',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { FromDate: iObj.FromDate, ToDate: iObj.ToDate }
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        MeetingSchedularUpdate: function (iObj) {
            console.error(iObj)
            //$http.get('/Schedular/GetAllMeetingRequest').then(iObj.successCallBack, iObj.failureCallBack)
            var req = {
                method: 'POST',
                url: '/Schedular/MeetingSchedularUpdate',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { MeetingId: iObj.MeetingId, flag: iObj.flag }
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        
        saveMeeting: function (iObj) {
            console.error(iObj)
            var req = {
                method: 'POST',
                url: '/Schedular/Create',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: iObj.loggedUserDetails
            }
            console.error(req)
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
           // $http.post('/Schedular/Create', iObj.loggedUserDetails).then(iObj.successCallBack, iObj.failureCallBack)
        },
        updateMeeting: function (iObj) {
            $http.post('/MeetingSchedular/UpdateMeetingStatus', iObj.loggedUserDetails, iObj.ReceiverName, iObj.Reason).then(iObj.successCallBack, iObj.failureCallBack)
        },

        /**
      * @auther : MKN
      * @date : 15/06/2016
      * @Purpose :
      */
        //sendUploadedFileToServer : function (iObj,iCallBack) {
        //    console.error(iObj)
        //    //method: 'POST',
        //    //url: '/resources/messages',
        //    //data: message // your original form data,
        //    //transformRequest: formDataObject  // this sends your data to the formDataObject provider that we are defining below.
        //    //headers: {'Content-Type': 'multipart/form-data'}
        //    var request = {
        //        method: 'POST',
        //        url: '/Home/UpdateUserPhoto',
        //        data: iObj,
        //        headers: {
        //            'Content-Type': undefined
        //        }
        //    };

        //    // SEND THE FILES.
        //    $http(request)
        //        .success(function (d) {
        //            iCallBack && iCallBack();
        //        })
        //        .error(function () {
        //            console.error('uploading error');
        //        });
        //},
        sendUploadedFileToServer: function (iObj, iCallBack) {
            console.error(iObj)
            //method: 'POST',
            //url: '/resources/messages',
            //data: message // your original form data,
            //transformRequest: formDataObject  // this sends your data to the formDataObject provider that we are defining below.
            //headers: {'Content-Type': 'multipart/form-data'}
            var _action = '/Resources/UploadFilesForArtiFacts';
            iObj.successCallBack = function (idata) {
                console.error(idata)
                iCallBack(idata);
            }
            $http.post(_action, iObj, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then(iObj.successCallBack, iObj.failureCallBack);
        },
        getArtifactBookMarks: function (iObj) {
            console.error('getArtifactBookMarks --------------- ', iObj);

            var req = {
                method: 'POST',
                    url : '/Resources/getAlllFilesAndBookmarks',
                    headers: {
                    'Content-Type': 'application/json'
                },
                    data: iObj.loggedDetail,
                traditional: true
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        deleteFilesServer: function (iObj) {
            console.error('deleteFilesServer --------------- ', iObj);

            var req = {
                method: 'POST',
                url : '',
                headers: {
                     'Content-Type': 'application/json'
                },
                data: { deletedArray : iObj.deletedArray },
                traditional: true
            }
           // $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },
        
        sendAddCtsInfoToAdmin: function (iObj) {
            console.error('sendAddCtsInfoToAdmin --------------- ', iObj);           
            var req = {
                method: 'POST',
                url: '/User/SendEmailForCategorySuggestion',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { displayArray : iObj.displayArray },
                traditional: true
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },

        sendInvitationToFriend: function (iObj) {
            console.error('sendInvitationTOFriend --------------- ', iObj);
            var _checkObj = angular.copy(iObj);
            var postData = { values: iObj.invitation.Email };
            var Data = {
                Description: iObj.invitation.Description,
                Invites: iObj.invitation.Email
            };
            console.error(Data);
            var req = {
                method: 'POST',
                url: '/User/SendEmailOnInvitation',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: Data,
                traditional: true
            }
            $http(req).then(iObj.successCallBack, iObj.failureCallBack);
        },

        GetRecordsOfSkillAndTopics: function (iObj) { //userID
            console.error('GetRecordsOfSkillAndTopics --------------- ', iObj);
            $http.post('/CTS/GetRecordsOfSkillAndTopics', iObj.userID).then(iObj.successCallBack, iObj.failureCallBack);
        }
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

function seperateDataAsPerCTS(iObj) {
    var _category = {};
    var _topics = {};
    var _skills = {};
    console.error(angular.copy(iObj.data));
    if (iObj.data && iObj.data.Categories && iObj.data.Categories.length > 0) {
        for (var k = 0; k < iObj.data.Categories.length ; k++) {
            if (Object.keys(iObj.data.Categories[k]).length > 0) {

                // _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category };
                if (iObj.data.Categories[k].Category) {
                    if (_category[iObj.data.Categories[k].Category]) {//if category is already present
                        if (_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic]) {//if topic is already present
                            //  _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {} };
                            if (iObj.data.Categories[k].Skill) {
                                _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                            }
                        } else {
                            _topics[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {}, profiLevel: iObj.data.Categories[k].profiLevel };
                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                            if (iObj.data.Categories[k].Skill) {
                                _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                                if (!_category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill) _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                                _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                            }
                        }
                    } else {
                        _category[iObj.data.Categories[k].Category] = { Name: iObj.data.Categories[k].Category, topic: {} };
                        _topics[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: null, profiLevel: iObj.data.Categories[k].profiLevel };
                        _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic] = { Name: iObj.data.Categories[k].Topic, skill: {}, profiLevel: iObj.data.Categories[k].profiLevel };
                        if (iObj.data.Categories[k].Skill) {
                            _skills[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel };
                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill = {}
                            _category[iObj.data.Categories[k].Category].topic[iObj.data.Categories[k].Topic].skill[iObj.data.Categories[k].Skill] = { Name: iObj.data.Categories[k].Skill, profiLevel: iObj.data.Categories[k].profiLevel }
                        }
                    }
                }

            }
        }
    }
    console.error('In getMySelection', _category, _topics, _skills);
    return { category: _category, topics: _topics, skills: _skills }
};
