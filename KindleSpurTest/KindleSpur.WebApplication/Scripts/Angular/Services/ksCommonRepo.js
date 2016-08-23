app.directive('commonRepository', function ($state, serverCommunication) {
    return {
        scope: {
            role: "@"
        },
        templateUrl: '/Home/ksCommonRepository',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.re = scope;
            scope.artifactsArray = [
                 { Name: ' Design Notes', size: '120KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                 { Name: ' Angulat Js Documentation', size: '12KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                 { Name: ' Design Flow', size: '10KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                 { Name: ' MVC Architecture', size: '190KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                 { Name: ' Design Notes', size: '1220KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' }
            ];
            scope.bookMarkArray = [
                { Name: ' Design Notes', bookmarkedIamge: '/Images/icons/Microsoft_Word_2013_icon.png', size: '120KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                { Name: ' Angulat Js Documentation', bookmarkedIamge: '/Images/icons/Microsoft_Word_2013_icon.png', size: '120KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                { Name: ' Design Flow', bookmarkedIamge: '/Images/icons/Microsoft_Word_2013_icon.png', size: '10KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                { Name: ' MVC Architecture', bookmarkedIamge: '/Images/icons/Microsoft_Word_2013_icon.png', size: '190KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' },
                { Name: ' Design Notes', bookmarkedIamge: '/Images/icons/Microsoft_Word_2013_icon.png', size: '1220KB', PhotoURL: '/Images/icons/Microsoft_Word_2013_icon.png' }
            ];
            scope.uploadAttachmentArray = [];
            var data = new FormData();
            scope.loadUploadPopupFlag = false;
            scope.loadUploadPopup = function () {
                scope.loadUploadPopupFlag = true;
                // data = [];
                data = new FormData();
            };           
            scope.uploadDataOnServer = function () {
                console.error(data)
                serverCommunication.sendUploadedFileToServer(data, null, function (iPath) {
                    data = new FormData();
                    scope.uploadAttachmentArray = [];
                    scope.loadUploadPopupFlag = false;
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
                    }
                    console.error(scope.uploadAttachmentArray);
                    //});                 
                    document.getElementById(iId).value = "";
                    scope.$apply();
                });
            };

        }
    }
});