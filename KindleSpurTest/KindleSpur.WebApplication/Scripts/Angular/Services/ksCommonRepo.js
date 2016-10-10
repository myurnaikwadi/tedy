app.directive('commonRepository', function ($state, serverCommunication, $rootScope, $interval) {
    return {
        scope: {
            extraParam: "="
        },
        templateUrl: '/Home/ksCommonRepository',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.commonRepository = scope;


            scope.commonRepoInstance = {
                commonRepoSelectedMenu: 0,
                loadGridView : true,
                uploadingInProgress: { uploadButtonName : 'DONE',  uploadedCount: 0, uploadInProgress : 0 , uploadInProgressFlag : false }
            };

            scope.ddd = function (iObj) {
                console.error(iObj)
                _addInFrontArray(iObj);
            };
            scope.commonRepoInstance.loadMenuRepo = function (iIndex) {
                scope.commonRepoInstance.commonRepoSelectedMenu = iIndex;

                switch (iIndex) {
                    
                }
            };

            scope.loadIsotopeAttachment = function () {
              
                if (scope.commonRepoInstance.loadGridView) {
                    var _obj = {
                        iHeight: 120,
                        iWidth: 40,
                        iCol: 5,
                        iArray: scope.artifactsArray
                    };
                } else {
                    var _obj = {
                        iHeight: 40,
                        iWidth: 40,
                        iCol: 1,
                        iArray: scope.artifactsArray
                    };
                }
                msIsotopeFunc.prototype.genericHeightChange(_obj);
            };


            scope.uiFlag = { uploadNotRequired: false, Message : '' };

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
                scope.uploadAttachmentArray = [];
                scope.loadUploadPopupFlag = true;
                // data = [];
                data = new FormData();
                tempArray = [];
            };

            scope.addBookMark = function () {
                scope.artictFact = false;
                scope.loadUploadPopupFlag = true;

                data = new FormData();
                tempArray = [];
            };

            scope.loadFeedOnNextTab = function (iFeed) {
                window.open(iFeed.FilePath);
            };

            scope.closePopup = function () {
                scope.loadUploadPopupFlag = false;

                data = new FormData();
                tempArray = [];
                scope.artictFact = null;
                scope.bookmark = { FilePath  : '', FileName: ''};
                if (scope.extraParam && scope.extraParam.closeCallBack)
                    scope.extraParam.closeCallBack();
            };

            var _displayAlertMeesage = function (iObj) {
                var _displayAlert = {
                    showAlert: true,
                    message: iObj.message,
                    formatType: iObj.formatType,
                };
                $rootScope.$broadcast("refreshStateHomeView", {
                    type: 'displayAlert',

                    data: _displayAlert
                });
            };
            scope.selectBookMarkLink = function (iArtifacts) {
                if (iArtifacts.bookMarked == false || (!iArtifacts.bookMarked)) {//make bookmark
                    scope.saveBookmark(iArtifacts);                   
                } else {                 
                    var _foundElement = null;
                    iArtifacts.bookMarked = false;
                    scope.bookMarkArray.some(function (iContain, iIndex) {
                        if (iContain.ParentFileId == iArtifacts.FileId) {
                            _foundElement = {};
                            _foundElement.index = iIndex;
                            _foundElement.contain = iContain;
                        }
                    });
                    scope.deleteAttachment({ deleteMultiple: false, type: 'bookMark', deletedObject: _foundElement ? _foundElement.contain : iArtifacts, index: _foundElement ? _foundElement.index : -1 })
                }
            };
       
            scope.saveBookmark = function (iArtifacts) {
                var _callServerSide = true;
                var _bookmarkId = $rootScope.loggedDetail.EmailAddress + ":BMK#" + (Date.now()) + (Math.floor((Math.random() * 10) + 1));
                if (iArtifacts) {
                    if (iArtifacts.bookMarked == false || (!iArtifacts.bookMarked)) {
                        iArtifacts.bookMarked = _bookmarkId;
                        _callServerSide = true;
                        scope.bookmark = { BookMarkId: _bookmarkId, ParentFileId: iArtifacts.FileId, FileId: iArtifacts.FileId, FilePath: iArtifacts.FilePath, FileName: iArtifacts.FileName };
                    } else {
                        _callServerSide = false;
                    }
                }

                if (scope.bookmark.FilePath == '' || scope.bookmark.FileName == '') {
                    _displayAlertMeesage({ message: 'Please Enter empty fields', formatType: '2' });
                    return;
                }


                if (_callServerSide) {                   
                    scope.bookmark.LinkUrl = scope.bookmark.FilePath;
                    scope.bookmark.DocumentName = scope.bookmark.FileName;
                    scope.bookmark.BookMarkId = _bookmarkId;
                   
                    if (scope.bookmark.FileId) {
                        scope.bookmark.ParentFileId = scope.bookmark.FileId;
                    }

                    scope.bookMarkArray.push(scope.bookmark);
                    serverCommunication.bookMarkLink({
                        bookMarkObject: { BookMarkId: scope.bookmark.BookMarkId, ParentFileId :  scope.bookmark.ParentFileId, LinkUrl: scope.bookmark.FilePath, DocumentName: scope.bookmark.FileName } ,
                        successCallBack: function (iObj) {
                            console.error(iObj)
                            scope.bookMarkArray = [].concat(iObj.data);
                            scope.closePopup();
                        },
                        failureCallBack: function (iObj) {
                            console.error(iObj)
                        }
                    });
                }
            };

            scope.attachFiles = function () {

                var _selectedData = {};
                // debugger
                scope.artifactsArray.some(function (iContain) {
                    //debugger

                    if (iContain.selected) {
                        if (_selectedData['Artifact'])
                            _selectedData['Artifact'][iContain.FileName] = iContain;
                        else {
                            _selectedData['Artifact'] = {};
                            _selectedData['Artifact'][iContain.FileName] = iContain;

                        }
                    }

                });

                scope.bookMarkArray.some(function (iContain) {
                    if (iContain.selected) {
                        if (_selectedData['bookMark'])
                            _selectedData['bookMark'][iContain.DocumentName] = iContain;
                        else {
                            _selectedData['bookMark'] = {};
                            _selectedData['bookMark'][iContain.DocumentName] = iContain;
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

            scope.cancelClick = function (iIndex) {
                if (scope.uploadAttachmentArray[iIndex].autoSyncCounter) {
                    $interval.cancel(scope.uploadAttachmentArray[iIndex].autoSyncCounter);
                    scope.uploadAttachmentArray[iIndex].autoSyncCounter = undefined;
                }                
                scope.uploadAttachmentArray.splice(iIndex, 1);
                if (scope.uploadAttachmentArray.length == 0) {
                    scope.commonRepoInstance.uploadingInProgress = { uploadButtonName: 'UPLOAD', uploadedCount: 0, uploadInProgress: 0, uploadInProgressFlag: false };
                } 
            };

            var _rec = function (iIndex, iArr) {
                if (iArr[iIndex]) {
                    console.error(iArr[iIndex])
                    iArr[iIndex].progressBar = 0;
                    iArr[iIndex].autoSyncCounter = $interval(function () {
                        iArr[iIndex].progressBar++;
                        if (iArr[iIndex].progressBar == 100) {
                            $interval.cancel(iArr[iIndex].autoSyncCounter);
                            iArr[iIndex].autoSyncCounter = undefined;
                            iIndex++;
                            if (iIndex == iArr.length) {
                                console.error('Done')
                                scope.commonRepoInstance.uploadingInProgress = { uploadButtonName: 'DONE', uploadedCount: 0, uploadInProgress: 0, uploadInProgressFlag: false };
                            } else {
                                _rec(iIndex, iArr);
                            }
                        }
                    }, 100);
                   
                } else {
                    iIndex++;
                    if (iIndex == iArr.length) {
                        console.error('Done')
                        scope.commonRepoInstance.uploadingInProgress = { uploadButtonName: 'DONE', uploadedCount: 0, uploadInProgress: 0, uploadInProgressFlag: false };
                    } else {
                        _rec(iIndex, iArr);
                    }
                }
            }

            scope.uploadingData = function () {
                scope.commonRepoInstance.uploadingInProgress.uploadInProgressFlag = true;
                scope.commonRepoInstance.uploadingInProgress.uploadButtonName = 'UPLOADING';
                _rec(0, scope.uploadAttachmentArray);
            };
            scope.uploadDataOnServer = function () {

                if (scope.commonRepoInstance.uploadingInProgress.uploadButtonName == 'UPLOAD') {
                    scope.uploadingData();
                    return;
                } else if (scope.commonRepoInstance.uploadingInProgress.uploadButtonName == 'UPLOADING') {
                    return;
                } else {
                    var _finalArray = [];
                    scope.artifactsArray = scope.artifactsArray.concat(tempArray);
                    scope.loadIsotopeAttachment();
                    for (var i = 0; i < tempArray.length ; i++) {
                        data.append("FileId", tempArray[i].FileId);
                    }
                    serverCommunication.sendUploadedFileToServer(data, function (iPath) {
                        data = new FormData();
                        scope.uploadAttachmentArray = [];
                        scope.loadUploadPopupFlag = false;
                        console.error(iPath)
                        scope.artifactsArray = [].concat(iPath.data);

                    });
                    scope.closePopup();
                }

            };

            scope.deleteAttachment = function (iObj) {
                var _array = [];

                var _selectedData = {};
                var _deletedArray = [];
                if (iObj.type == 'artifact') {
                    var _indexArray = [];
                    if (iObj.deleteMultiple) {
                        scope.artifactsArray.some(function (iContain, iIndex) {
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
                    var _checkInFilePresent = function (iObj) {
                        for (var j = 0 ; j < iObj.bookMarkArr.length ; j++) {
                             for (var k = 0 ; k < scope.artifactsArray.length ; k++) {                        
                                 if (scope.artifactsArray[k].FileId == iObj.bookMarkArr[j].ParentFileId) {
                                     delete scope.artifactsArray[k].bookMarked;
                                     break;
                                 }
                             }
                        }
                    };
                    if (iObj.deleteMultiple) {
                        var _deleteArr = [];
                        scope.bookMarkArray.some(function (iContain, iIndex) {
                            if (iContain.selected) {
                                if (iContain.selected) {
                                    _indexArray.push(iIndex);
                                    _deleteArr.push(iContain);
                                    if (_selectedData['bookMark'])
                                        _selectedData['bookMark'][iContain.DocumentName] = iContain;
                                    else {
                                        _selectedData['bookMark'] = {};
                                        _selectedData['bookMark'][iContain.DocumentName] = iContain;
                                    }
                                }
                            }                           
                        });
                        _checkInFilePresent({ bookMarkArr : _deleteArr });
                        if (_indexArray.length == 0) {
                            alert('please select some bookmarks')
                        } else {
                            _indexArray.sort(function (a, b) { return b - a });                            
                            for (var k = 0 ; k < _indexArray.length ; k++) {
                                scope.bookMarkArray.splice(_indexArray[k], 1);
                            }
                        }

                    } else {
                        _selectedData['bookMark'] = {};
                        _checkInFilePresent({ bookMarkArr: [iObj.deletedObject] });
                        _selectedData['bookMark'][iObj.deletedObject.DocumentName] = iObj.deletedObject;
                        if(iObj.index > -1) scope.bookMarkArray.splice(iObj.index, 1);
                    }

                    for (var _key in _selectedData['bookMark']) {
                        _deletedArray.push(_selectedData['bookMark'][_key]);
                    }
                }

                serverCommunication.deleteFilesServer({
                    type :  iObj.type,
                    deletedArray: _deletedArray,
                    successCallBack: function (iObj) {

                        if (iObj.data['Artifacts'])
                            scope.artifactsArray = iObj.data['Artifacts'];
                        if (iObj.data['Bookmarks'])
                            scope.bookMarkArray = iObj.data['Bookmarks'];

                    }, failureCallBack: function (iObj) {

                    }
                });
            };

            var _addInFrontArray = function (iFiles) {
                angular.forEach(iFiles, function (value, key) {
                    value.TagName = "sssss"
                    data.append(key, value);
                });

                for (var k = 0 ; k < iFiles.length ; k++) {
                    iFiles[k].ContentType = iFiles[k].type;
                    scope.uploadAttachmentArray.push(iFiles[k]);
                    var _random = Date.now() * new Date(k).getTime() + Date.now() + k;
                    var _obj = {
                        FileName: iFiles[k].name,
                        FileId: $rootScope.loggedDetail.EmailAddress + ":AFT#" + ((Date.now()) + (Math.floor((Math.random() * 10) + 1 + _random))),
                        FilePath: iFiles[k].name,
                        ContentType: iFiles[k].type,
                        progressBar: -1,
                        autoSyncCounter : null
                    }
                    console.error(_obj.FileId)
                    tempArray.push(_obj);

                }
                if (!scope.$$phase) scope.$digest();
            };
            scope.triggerUpload = function (iId) {

                var obj = {
                    fileInputId: iId
                }
                uploadImageOnPage(obj, function (imagePath) {
                    var valueFile = document.getElementById(iId).files;                   
                    _addInFrontArray(valueFile);                   
                    document.getElementById(iId).value = "";                    
                });
            };

            scope.init = function () {
                var _object = {
                    EmailAddress: $rootScope.loggedDetail.EmailAddress,
                }
                serverCommunication.getArtifactBookMarks({

                    loggedDetail: _object,
                    successCallBack: function (iObj) {

                        if (iObj.data['Artifacts']) {
                            scope.artifactsArray = iObj.data['Artifacts'];
                            var _tempHeight = document.getElementById('artiFactParent').getBoundingClientRect().height;
                            
                            scope.loadIsotopeAttachment();
                        }

                        if (iObj.data['Bookmarks']) {
                            scope.bookMarkArray = iObj.data['Bookmarks'];
                        }

                    }, failureCallBack: function (iObj) {

                    }
                });
            };
            scope.init();
        }
    }
});

app.directive('droppable', function ($rootScope) {
    return {
        scope: {
            drop: '&',           
        },
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];
            el.addEventListener('dragover',function (e) {
                e.dataTransfer.dropEffect = 'move';
               //event.dataTransfer.dropEffect = 'copy'
                event.dataTransfer.effectAllowed = 'copy'
                  // allows us to drop
                  if (e.preventDefault) e.preventDefault();
                //  this.classList.add('over');
                  return false;
              },
              false
            );

            el.addEventListener('dragenter',function (e) {
                 // this.classList.add('over');
                  return false;
              },
              false
            );

            el.addEventListener('dragleave',function (e) {
                //  this.classList.remove('over');
                  return false;
              },
              false
            );

            el.addEventListener('drop', function (e) {
                  // Stops some browsers from redirecting.
                if (e.stopPropagation) e.stopPropagation();
                if (e.preventDefault) e.preventDefault();
                  // call the passed drop function
                  var fn = scope.drop();
                  if ('undefined' !== typeof fn) {                    
                      fn(e.dataTransfer.files);
                  }
                  return false;
              },
              false
            );
        }
    }
});