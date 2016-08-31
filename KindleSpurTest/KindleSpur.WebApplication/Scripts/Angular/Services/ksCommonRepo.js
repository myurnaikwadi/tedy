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
               // debugger
                scope.artifactsArray.some(function (iContain) {
                    //debugger
                    //console.error(iContain)
                    if (iContain.selected) {
                        if (_selectedData['Artifact'])
                            _selectedData['Artifact'][iContain.FileName] = iContain;
                        else {
                            _selectedData['Artifact'] = {};
                            _selectedData['Artifact'][iContain.FileName] = iContain;
                            
                        }
                    }

                });
                console.error(_selectedData)
                scope.bookMarkArray.some(function (iContain) {
                    if (iContain.selected) {
                        if (_selectedData['bookMark'])
                            _selectedData['bookMark'][iContain.FileName] = iContain;
                        else {
                            _selectedData['bookMark'] = {};
                            _selectedData['bookMark'][iContain.FileName] = iContain;
                        }
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
                console.error(scope.artifactsArray)
                scope.artifactsArray = scope.artifactsArray.concat(tempArray);
                serverCommunication.sendUploadedFileToServer(data,function (iPath) {
                    data = new FormData();
                    scope.uploadAttachmentArray = [];
                    scope.loadUploadPopupFlag = false;
                    console.error(iPath)
                });
               
            };
            //{ deleteMultiple : false , type : 'artifact' , deletedObject : option , index : $index }
            scope.deleteAttachment = function (iObj) {
                var _array = [];
                console.error(iObj);
                var _selectedData = {};
                var _deletedArray = [];
                if (iObj.type == 'artifact') {
                    var _indexArray = [];
                    if (iObj.deleteMultiple) {
                        scope.artifactsArray.some(function (iContain, iIndex) {
                            console.error(iIndex)
                            //debugger
                            //console.error(iContain)
                            if (iContain.selected) {
                                _indexArray.push(iIndex);
                                if (_selectedData['Artifact'])
                                    _selectedData['Artifact'][iContain.FileName] = iContain;
                                else {
                                    _selectedData['Artifact'] = {};
                                    _selectedData['Artifact'][iContain.FileName] = iContain;

                                }
                            }
                        });                       
                        if (_indexArray.length == 0) {
                            alert('please Select ')
                        } else {
                            _indexArray.sort(function (a, b) { return b - a });
                            console.error(_indexArray)
                            for (var k = 0 ; k < _indexArray.length ; k++) {
                                scope.artifactsArray.splice(_indexArray[k], 1);
                            }
                        }
                      
                    } else {
                        _selectedData['Artifact'] = {};
                        _selectedData['Artifact'][iObj.deletedObject.FileName] = iObj.deletedObject;
                        scope.artifactsArray.splice(iObj.index, 1);
                    }
                } else {
                    if (iObj.deleteMultiple) {
                        scope.bookMarkArray.some(function (iContain, iIndex) {
                            console.error(iIndex)
                            if (iContain.selected) {
                                if (iContain.selected) {
                                    _indexArray.push(iIndex);
                                    if (_selectedData['bookMark'])
                                        _selectedData['bookMark'][iContain.FileName] = iContain;
                                    else {
                                        _selectedData['bookMark'] = {};
                                        _selectedData['bookMark'][iContain.FileName] = iContain;
                                    }
                                }
                            }
                        });
                        if (_indexArray.length == 0) {
                            alert('please Select ')
                        } else {
                            _indexArray.sort(function (a, b) { return b - a });
                            console.error(_indexArray)
                            for (var k = 0 ; k < _indexArray.length ; k++) {
                                scope.bookMarkArray.splice(_indexArray[k], 1);
                            }
                        }
                        
                    } else {
                        _selectedData['bookMark'] = {};
                        _selectedData['bookMark'][iObj.deletedObject.FileName] = iObj.deletedObject;
                        scope.bookMarkArray.splice(iObj.index, 1);
                    }
                }
                console.error(_selectedData)
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
                        if (iObj.data['Artifacts'])
                            scope.artifactsArray = iObj.data['Artifacts'];
                        if (iObj.data['Bookmarks'])
                            scope.bookMarkArray = iObj.data['Bookmarks'];
                       
                    }, failureCallBack: function (iObj) {
                        console.error('serverrrrr', iObj)
                    }
                });
            };
            scope.init();
        }
    }
});