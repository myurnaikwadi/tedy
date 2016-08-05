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
            case 1: $scope.fetchFeedDataFromServer(); break;
        }
    };

    $scope.topButtonArray = [{ name: 'Higher Revenue' }
                  , { name: 'Lower costs' }
                  , { name: 'KNOWLEDGE GARDEN' }
                  , { name: 'Improved Brand' }
                  , { name: 'Certainty of Success' }
                  , { name: 'Turn Around' }
                  , { name: 'Customer Delight' }
                  , { name: 'Peer Success' }
                  , { name: 'Team Success' }
                  , { name: 'Subordinate Success' }
    ]
     $scope.StoryDetailArray = [
                //{username:'P.sagar' ,description:'story description within two to three line'},
                //{ username: 'J.ishwar', description: 'story description within two to three line' },
                //{ username: 'Tushar', description: 'story description within two to three line' },
                //{ username: 'Pranav', description: 'story description within two to three line' }

     ];
     $scope.AllVideoDetail = [
         { name: 'Demo1' },
         { name: 'Demo1' },
         { name: 'Demo1' },
         { name: 'Demo1' },
         { name: 'Demo1' },
          
     ]
     $scope.selectButton=null;
     $scope.selectOption = function (iIndex, iOption) {
         
         for (var k = 0 ; k < $scope.topButtonArray.length ; k++) {
             $scope.topButtonArray[k].selected = false;
             if (iOption.name == $scope.topButtonArray[k].name) {
                 iOption.selected = true;                 
             }
         }
         $scope.selectButton = iOption;
         var _object = {
             ImpactZone: iOption.name,
             //StoryTitle: '',
             //StoryContent: ''
         }
         serverCommunication.getDataRelatedIZFromServer({
             storyDetails: _object,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                 $scope.StoryDetailArray =[].concat(iObj.data);
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }
         });
     };
           

     $scope.fetchFeedDataFromServer = function () {
         if ($scope.topButtonArray.length > 0)
             $scope.selectOption(0, $scope.topButtonArray[0]);
     };

     $scope.shareStoryClick = function () {
     
         var _object = {
             ImpactZone: $scope.selectButton.name,
             StoryTitle: $scope.AddStory.SubjectName,
             StoryContent: $scope.AddStory.Description
         }
         $scope.StoryDetailArray.push(_object);
         serverCommunication.sendStory({
             storyDetails: _object,
             successCallBack: function (iObj) {
                 console.error('In successCallBack', iObj);
                 
             },
             failureCallBack: function (iObj) {
                 console.error('In failureCallBack', iObj);
             }

         });
         $scope.closeaddStoryPopup();
     };
    
     $scope.init = function () {
        
     };
     $scope.init();
});