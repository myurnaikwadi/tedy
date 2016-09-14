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
            scope.artictFact = false;
            scope.bookmark = { FilePath  : '', FileName: ''};
            scope.loadUploadPopup = function () {
                scope.artictFact = true;
                scope.loadUploadPopupFlag = true;
                // data = [];
                data = new FormData();
                tempArray = [];
            };

            scope.addBookMark = function () {
                scope.artictFact = false;
                scope.loadUploadPopupFlag = true;
                // data = [];
                data = new FormData();
                tempArray = [];
            };            
            
            scope.closePopup = function () {
                scope.loadUploadPopupFlag = false;
                // data = [];
                data = new FormData();
                tempArray = [];
                scope.artictFact = null;
                scope.bookmark = { FilePath  : '', FileName: ''};
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };

            scope.saveBookmark = function (iArtifacts) {
                ///debugger
                var _callServerSide = true;
                if (iArtifacts) {
                    if (iArtifacts.bookMarked) {
                        _callServerSide = true;
                        scope.bookmark = { FilePath: iArtifacts.FileName, FileName: iArtifacts.FilePath };
                    } else {
                        _callServerSide = false;
                        scope.deleteAttachment({ deleteMultiple: false, type: 'bookMark', deletedObject: iArtifacts, index: -1 })
                    }                   
                }
                //console.error(_callServerSide)
                if (_callServerSide) {
                    scope.bookmark.LinkUrl = scope.bookmark.FilePath;
                    scope.bookmark.DocumentName = scope.bookmark.FileName;
                    scope.bookMarkArray.push(scope.bookmark);
                    serverCommunication.bookMarkLink({
                        bookMarkObject: { LinkUrl : scope.bookmark.FilePath, DocumentName : scope.bookmark.FileName } ,
                        successCallBack: function () {
                            scope.closePopup();
                        },
                        failureCallBack: function () {
                            // $scope.conversation.Message = "";
                            console.debug('In failureCallBack');
                        }
                    });
                }               
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

                if (Object.keys(_selectedData).length == 0) {
                    alert('Please select at list one file');
                    return
                }
              
                if (scope.extraParam && scope.extraParam.afterAddCallBack)
                    scope.extraParam.afterAddCallBack({ selectedData: _selectedData, message: scope.uiFlag.Message });
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
                            alert('please select some artifacts')
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
                        if (iObj.index > -1)  scope.artifactsArray.splice(iObj.index, 1);
                    }
                    for(var _key in _selectedData['Artifact']){
                        _deletedArray.push(_selectedData['Artifact'][_key]);
                    }

                } else {
                    var _indexArray = [];
                    if (iObj.deleteMultiple) {
                        scope.bookMarkArray.some(function (iContain, iIndex) {
                            console.error(iIndex)
                            if (iContain.selected) {
                                if (iContain.selected) {
                                    _indexArray.push(iIndex);
                                    if (_selectedData['bookMark'])
                                        _selectedData['bookMark'][iContain.DocumentName] = iContain;
                                    else {
                                        _selectedData['bookMark'] = {};
                                        _selectedData['bookMark'][iContain.DocumentName] = iContain;
                                    }
                                }
                            }
                        });
                        if (_indexArray.length == 0) {
                            alert('please select some bookmarks')
                        } else {
                            _indexArray.sort(function (a, b) { return b - a });
                            console.error(_indexArray)
                            for (var k = 0 ; k < _indexArray.length ; k++) {
                                scope.bookMarkArray.splice(_indexArray[k], 1);
                            }
                        }
                        
                    } else {
                        _selectedData['bookMark'] = {};
                        _selectedData['bookMark'][iObj.deletedObject.DocumentName] = iObj.deletedObject;
                        if(iObj.index > -1) scope.bookMarkArray.splice(iObj.index, 1);
                    }
                    
                    for (var _key in _selectedData['bookMark']) {
                        _deletedArray.push(_selectedData['bookMark'][_key]);
                    }
                }
                console.error(_selectedData)
                 serverCommunication.deleteFilesServer({
                    type :  iObj.type,
                    deletedArray: _deletedArray,
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