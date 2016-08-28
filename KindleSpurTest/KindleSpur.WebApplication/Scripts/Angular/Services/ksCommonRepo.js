app.directive('commonRepository', function ($state, serverCommunication, $rootScope) {
    return {
        scope: {
            extraParam: "="
        },
        templateUrl: '/Home/ksCommonRepository',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.re = scope;
            scope.uiFlag = { uploadNotRequired: false, Message : '' };
            console.error(scope.extraParam)
            scope.styleUI = {};
            if (scope.extraParam && scope.extraParam.styleUI)
                scope.styleUI = scope.extraParam.styleUI;

            scope.artifactsArray = [];
            scope.bookMarkArray = [];
            scope.uploadAttachmentArray = [];
            var data = new FormData();
            var tempArray = [];
            scope.loadUploadPopupFlag = false;
            scope.loadUploadPopup = function () {
                scope.loadUploadPopupFlag = true;
                // data = [];
                data = new FormData();
                tempArray = [];
            };
            
            scope.closePopup = function () {
                console.error(scope)
            };
            scope.attachFiles = function () {
                console.error(scope)
                var _selectedData = {};
                scope.artifactsArray.some(function (iContain) {
                    if (iContain.selected) {
                        if (_selectedData['Artifact'])
                            _selectedData['Artifact'][iContain.FileName] = iContain;
                        else
                            _selectedData['Artifact'] = {}
                    }
                });

                scope.bookMarkArray.some(function (iContain) {
                    if (iContain.selected) {
                        if (_selectedData['bookMark'])
                            _selectedData['bookMark'][iContain.FileName] = iContain;
                        else
                            _selectedData['bookMark'] = {}
                    }
                });
                if (scope.extraParam && scope.extraParam.afterAddCallBack)
                    scope.extraParam.afterAddCallBack({ selectedData: _selectedData, message: scope.uiFlag.Message });
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };
            scope.closePopup = function () {
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };
            scope.uploadDataOnServer = function () {
                console.error(data)
                scope.artifactsArray = scope.artifactsArray.concat(tempArray);
                serverCommunication.sendUploadedFileToServer(data,function (iPath) {
                    data = new FormData();
                    scope.uploadAttachmentArray = [];
                    scope.loadUploadPopupFlag = false;
                    console.error(iPath)
                });
               
            };
            scope.triggerUpload = function (iId) {
                console.error('iId --- ', iId)
                var obj = {
                    fileInputId: iId
                }
                uploadImageOnPage(obj, function (imagePath) {
                    
                    var valueFile = document.getElementById(iId).files;                   
                    //  debugger;
                    console.error(valueFile);                    
                    angular.forEach(valueFile, function (value, key) {
                        value.TagName = "sssss"
                        data.append(key, value);
                        console.error(key, value)
                    });
                    console.error(data)
                    //serverCommunication.changeProfileImageDetails(data, null, function (iPath) {    
                    for (var k = 0 ; k < valueFile.length ; k++) {
                       // data.append('photo[' + k + ']', valueFile[k]);
                       // ajaxData.append('photo[' + i + ']', file);
                      
                        if (valueFile[k].type.indexOf('document') > -1)
                            valueFile[k].fileType = 'document';
                        else if (valueFile[k].type.indexOf('sheet') > -1)
                            valueFile[k].fileType = 'sheet';
                        else
                            valueFile[k].fileType = 'default';
                      
                        scope.uploadAttachmentArray.push(valueFile[k]);
                        var _obj = {                            
                            FileName :  valueFile[k].name,
                            fileType : valueFile[k].fileType,
                            FilePath:  valueFile[k].name,
                        }                 
                        //});                 
                        tempArray.push(_obj);
                    }
                    //console.error(scope.uploadAttachmentArray, tempArray);
                  
                    document.getElementById(iId).value = "";
                    scope.$apply();
                });
            };

            scope.init = function () {
                var _object = {                   
                    EmailAddress: $rootScope.loggedDetail.EmailAddress,
                }
                serverCommunication.getArtifactBookMarks({

                    loggedDetail: _object,
                    successCallBack: function (iObj) {
                        console.error('serverrrrr', iObj)
                        scope.artifactsArray = iObj.data[0];
                        scope.bookMarkArray = iObj.data[1];
                    }, failureCallBack: function (iObj) {
                        console.error('serverrrrr', iObj)
                    }
                });
            };
            scope.init();
        }
    }
});