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

    $scope.closeCallBack = function (iEvent) {
       // $scope.extraParam.closeCallBack();
        $scope.extraParam.closeCallBack && ($scope.extraParam.closeCallBack());
        $scope.extraParam.closeMainCallBack && ($scope.extraParam.closeMainCallBack());
    };
    $scope.uiFlag = { loadRepository: false, loadBottomContain: false ,loadProfileView : false};
    $rootScope.$on("refreshStateHomeView", function (event, iObj) {
        console.error('refreshStateHomeView ---- ', iObj);
        switch (iObj.type) {
            case 'displayAlert': $scope.displayAlert = iObj.data; break;
            case "loadUpperSlider":
                $scope.uiFlag.loadRepository = iObj.data.closeFlag ? false : true;
                $scope.uiFlag.loadModule = iObj.subType;
                $scope.extraParam = iObj.data;
                $scope.extraParam.closeCallBack = function () {
                    console.error('sssss')
                    $scope.uiFlag.loadRepository = false;
                    $scope.uiFlag.loadModule = '';
                }
                break;
            case "loadBottomContain":
                                        $scope.uiFlag.loadBottomContain = true;
                                        $scope.extraParam = iObj.data; 
                                        $scope.extraParam.closeCallBack = function () {
                                            console.error('sssss')
                                            $scope.uiFlag.loadBottomContain = false;                                            
                                        };
                                        break;
            case "loadProfileContain": $scope.extraParam = iObj.data; 
                                       $scope.uiFlag.loadProfileView = iObj.data.toggleFlag;
                                        break;
        }

    });

    $scope.closeMyPopup = function () {
        console.error('closeMyPopup')
        $scope.load = false;
        $scope.invitation = {}
    };
});

app.directive("outsideClick", ['$document', '$parse', function ($document, $parse) {
    return {
        scope : {
            outSide: "&",
            idArr : '='
        },
        link: function ($scope, $element, $attributes) {          
            var _id = $scope.id;
            // console.error($element)
           var onDocumentClick = function (event) {
              // console.error($scope.idArr)
              //console.error(event.target)     
              
                var scopeExpression = $attributes.outsideClick;
               //  console.error($scope)
                var isChild = $element.find(event.target).length > 0;
               //  console.error(isChild)
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
               // console.error('ddd');
                if($scope.id == _id)
                 $document.off("click", onDocumentClick);               
            });
            
        }
    }
}]);
//app.directive('hideLogin', function ($document) {
//    return {
//        restrict: 'A',
//        link: function (scope, elem, attr, ctrl) {
//            elem.bind('click', function (e) {
//                e.stopPropagation();
//            });
//            $document.bind('click', function () {
//                scope.$apply(attr.hideLogin);
//            })
//        }
//    }
//});
