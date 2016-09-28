app.controller('ksStateHomeController', function ($rootScope, $scope, serverCommunication, $interval, $state, authentification, $timeout) {
    window.parent = $scope;
   
    $scope.invitation = { email: '' };
    $scope.displayAlert = {
        showAlert: false,
        message: '',
        idleAlert : { showAlert: false,  formatType: '1',message: '', },
        formatType: '1'
    };    $scope.logout = function (iEvent) {
      
        if (iEvent) iEvent.stopPropagation();
        
        if (IN.User) IN.User.logout();
        authentification.logout({ loginObject: {} });
        $state.go('login');
    };    $scope.checkEmailValidation = function (iObj) {
              if ((iObj.event && (iObj.event.keyCode == 186)) || iObj.otherCall) {
         
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
               
                $scope.invitation = {};
            },
            failureCallBack: function (iObj) {
            }
        });
    };

    $scope.closeCallBack = function (iEvent) {
      
        $scope.extraParam.closeCallBack && ($scope.extraParam.closeCallBack());
        $scope.extraParam.closeMainCallBack && ($scope.extraParam.closeMainCallBack());
    };
    $scope.loadApplicationLevel = { loadDiv : false , loadAnimation : false };

    $scope.uiFlag = { loadRepository: false, loadBottomContain: false ,loadProfileView : false};
    $rootScope.$on("refreshStateHomeView", function (event, iObj) {
      
        switch (iObj.type) {
            case 'displayAlert':
                                    iObj.data.count = 10;
                                    $scope.displayAlert = iObj.data;
                                    if (angular.isDefined($scope.autoSyncCounter)) {
                                        $interval.cancel($scope.autoSyncCounter);
                                        $scope.autoSyncCounter = undefined;
                                    }
                                  //  $scope.displayAlert.count = 10;
                                    $scope.autoSyncCounter = $interval(function () {
                                        $scope.displayAlert.count--;                  
                                        if ($scope.displayAlert.count == 0) {
                                            $interval.cancel($scope.autoSyncCounter);
                                            $scope.autoSyncCounter = undefined;
                                            $scope.displayAlert.showAlert = false;
                                        }
                                    }, 1000);
                                     break;
            case "loadUpperSlider":
                                        $scope.uiFlag.loadRepository = iObj.data.closeFlag ? false : true;
                                        $scope.uiFlag.loadModule = iObj.subType;
                                        $scope.extraParam = iObj.data;
                                        $scope.extraParam.closeCallBack = function () {
               
                                            $scope.uiFlag.loadRepository = false;
                                            $scope.uiFlag.loadModule = '';
                                        }
                                        break;
            case "loadBottomContain": 
                                        $scope.uiFlag.loadBottomContain = true;
                                        $scope.extraParam = iObj.data; 
                                        $scope.extraParam.closeCallBack = function () {
                                        
                                            $scope.uiFlag.loadBottomContain = false;                                            
                                        };
                                        break;
            case "loadProfileContain": $scope.extraParam = iObj.data; 
                                       $scope.uiFlag.loadProfileView = iObj.data.toggleFlag;
                                       break;
            case "loadAppAlertBox":
                                        $scope.loadApplicationLevel.loadDiv = true;
                                        angular.extend($scope.loadApplicationLevel, iObj.data);
                                        $timeout(function () {
                                           // console.error('sddd');
                   
                                            $scope.loadApplicationLevel.loadAnimation = true;
                                        }, 900);
                                        break;
        }

    });

    $scope.closeMyPopup = function () {
     
        $scope.load = false;
        $scope.invitation = {}
    };
    $scope.$on('IdleStart', function () {
        $scope.displayAlert.idleAlert = {          
            showAlert: true,
            formatType: '1',
            message: ''           
        };
    });

    $scope.$on('IdleEnd', function () {
        $scope.displayAlert.idleAlert = {
            showAlert: false,
            formatType: '1',
            message: ''
        };
    });

    $scope.$on('IdleTimeout', function () {
        $scope.displayAlert.idleAlert = {
            showAlert: false,
            formatType: '2',
            message: ''
        };
        $scope.logout();
    });
});

app.directive("outsideClick", ['$document', '$parse', function ($document, $parse) {
    return {
        scope : {
            outSide: "&",
            idArr : '='
        },
        link: function ($scope, $element, $attributes) {          
            var _id = $scope.id;
         
           var onDocumentClick = function (event) {
              
              
                var scopeExpression = $attributes.outsideClick;
             
                var isChild = $element.find(event.target).length > 0;
           
                if ($scope.idArr && $scope.idArr.length > 0) {
                    var _index = $scope.idArr.indexOf(event.target.id) ;
                    if (_index > -1)
                        isChild = true;
                }
                if (!isChild) {
                    $scope.outSide()();
                    $scope.$apply();
                }
            };
          
            $document.on("click", onDocumentClick);             

            $scope.$on('$destroy', function () {
              
                if($scope.id == _id)
                 $document.off("click", onDocumentClick);               
            });
            
        }
    }
}]);
