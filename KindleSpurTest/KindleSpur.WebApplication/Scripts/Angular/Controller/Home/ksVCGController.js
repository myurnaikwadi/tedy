app.controller('ksVCGController', function ($rootScope, $scope, serverCommunication, $state) {
    $scope.AddStory = {
        SubjectName: '',
        Description: ''
    }
    $scope.leftSideMenus = [
               { name: 'VALUE SCORE' },
               { name: 'VALUE FEEDS' }
    ];
    //$scope.rightSideDashBoardArray = [

    //             { name: 'SELECT SKILLS', url: '../../Images/icons/book.png ' },
    //        //    { name: 'COACHING STATUS', url: '../../Images/icons/book.png ' },
    //            { name: 'KNOWLEDGE GARDEN', url: '../../Images/icons/Knowledge.png ' },
    //            { name: 'KNOWLEDGE FEED', url: '../../Images/icons/KnowledgeFeed.png ' },
    //            { name: 'COMMUNICATION', url: '../../Images/icons/Resources.png ' },
    //            { name: 'MY REWARDS', url: '../../Images/icons/Reword.png ' }

    //];
    $scope.valueFeeds = {}
    $scope.valueFeeds.addStory = false;
    $scope.addStory = function () {
        $scope.valueFeeds.addStory = true;
    }
    $scope.closeaddStoryPopup = function () {
        $scope.valueFeeds.addStory = false;
    }
    $scope.selectedMenu = 0;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;       
        switch (iIndex) {
           // case 0:  break;
           // case 1:  break;
        }
    };

    
     $scope.topButtonArray = [
              { name: 'TYPOGRAPHY' },
               { name: 'ILLUSTRATION' },
                { name: 'INFOGRAPHICS' },
               { name: 'TYPOGRAPHY' },
               { name: 'ILLUSTRATION' },
               { name: 'INFOGRAPHICS' },
               { name: 'INFOGRAPHICS' }             

            ];
     $scope.StoryDetailArray = [
                {username:'P.sagar' ,description:'story description within two to three line'},
                { username: 'J.ishwar', description: 'story description within two to three line' },
                { username: 'Tushar', description: 'story description within two to three line' },
                { username: 'Pranav', description: 'story description within two to three line' }

     ];
     $scope.selectButton=null;
     $scope.selectOption = function (Lindex, Loption) {
         $scope.selectButton=Loption;
         var _object = {
             buttonNmae: Loption.name,
            // subjectname: $scope.AddStory.SubjectName,
            // description: $scope.AddStory.Description
         }

         serverCommunication.getDetarelatedToimpoactzone({
             selectedFeed: _object,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);

             }

         });
     }
           
              $scope.shareStoryClick = function(){
                  
                  var _object = {
                  buttonName:$scope.selectButton.name,
                  subjectname: $scope.AddStory.SubjectName,
                 description: $scope.AddStory.Description
             }
              
              serverCommunication.sendStory({
                selectedFeed: _object,
                successCallBack: function (iObj) {
                console.error('In successCallBack', iObj);
                $scope.getPointsRecord();
        },
                failureCallBack: function (iObj) {
                console.error('In failureCallBack', iObj);

                }
             
    });
              }
});