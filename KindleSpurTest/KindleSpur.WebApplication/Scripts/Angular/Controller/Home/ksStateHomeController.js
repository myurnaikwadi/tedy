app.controller('ksStateHomeController', function ($rootScope, $scope, serverCommunication, $interval, $state) {
    window.parent = $scope;
    console.error('Application Home controller --- ');
    //$scope.bottomStrip = { style : '' };
    $scope.invitation = { email: '' };
    $scope.displayAlert = {
        showAlert: false,
        message: '',
        formatType: '1'
    };    $scope.checkEmailValidation = function (iObj) {
              if ((iObj.event && (iObj.event.keyCode == 186)) || iObj.otherCall) {
           console.log(iObj.email);
           var _stringSplit = iObj.email.split(';');           for (var k = 0; k < _stringSplit.length; k++) {
               if(_stringSplit[k]!= '') {
                    if($scope.emailValidation(_stringSplit[k]) == false) {
                        $scope.displayAlert.showAlert = true;
                        $scope.displayAlert.message = 'You have entered wrong email address. Wrong Email Address is '+ _stringSplit[k];
                        $scope.displayAlert.formatType = '2';
    }
               }
            }        }         
    };

    $scope.emailValidation = function (iEmail) {
        var _validFlag = false;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (iEmail && iEmail.match(mailformat)) {
            _validFlag = true;          
        }else {
            _validFlag = false;
        }
        return _validFlag;
    };
    $scope.extraParam = {};
    $scope.sendInvitation = function (iEvent) {
        if (Object.keys($scope.invitation).length == 0 || $scope.invitation.email == '') {
            $scope.displayAlert.showAlert = true;
            $scope.displayAlert.message = 'Please enter emailAddress ';
            $scope.displayAlert.formatType = '2';
            return;
        }
        $scope.checkEmailValidation({ event : iEvent, email : $scope.invitation.email, otherCall : true });
        var _str = $scope.invitation.email.split(';');
        var _string = [];
        for (var k = 0; k < _str.length; k++) {
            if(_str[k] != ''){
                _string.push(_str[k]);
            }                
        }   
        serverCommunication.sendInvitationToFriend({
            invitation: { Email:_string, UserDetails: { FirstName: $rootScope.loggedDetail.FirstName, LastName: $rootScope.loggedDetail.LastName, EmailAddress: $rootScope.loggedDetail.EmailAddress }, Description: $scope.invitation.description },
            successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.invitation = {};
            },
            failureCallBack: function (iObj) {
            }
        });
    };
    $scope.uiFlag = { loadRepository: false, loadBottomContain: false ,loadProfileView : false};
    $rootScope.$on("refreshStateHomeView", function (event, iObj) {
        console.error('refreshStateHomeView ---- ', iObj);
        switch (iObj.type) {
            case 'displayAlert': $scope.displayAlert = iObj.data; break;
            case "loadUpperSlider":
                $scope.uiFlag.loadRepository = true;
                $scope.uiFlag.loadModule = iObj.subType;
                $scope.extraParam = iObj.data;
                $scope.extraParam.closeCallBack = function () {
                    console.error('sssss')
                    $scope.uiFlag.loadRepository = false;
                }
                break;
            case "loadBottomContain": $scope.uiFlag.loadBottomContain = true; break;
            case "loadProfileContain": $scope.extraParam = iObj.data; $scope.uiFlag.loadProfileView = iObj.data.toggleFlag; break;
        }

    });
});