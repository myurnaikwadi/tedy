app.controller('ksVCGController', function ($rootScope, $scope, serverCommunication, $state) {
    $scope.AddStory = {
        SubjectName: '',
        Description: ''
    }
    $scope.leftSideMenus = [
               { name: 'VALUE SCORE CARD' },
               { name: 'VALUE FEEDS' }
    ];
   
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
         
            case 1: $scope.fetchFeedDataFromServer(); break;
        }
    };

    $scope.topButtonArray = [{ name: 'Higher Revenue' }
                  , { name: 'Lower costs' }
                  , { name: 'Improved Brand' }
                  , { name: 'Certainty of Success' }
                  , { name: 'Scale of Success' }
                  , { name: 'Turn Around' }
                  , { name: 'Customer Delight' }
                  , { name: 'Peer Success' }
                  , { name: 'Team Success' }
                  , { name: 'Subordinate Success' }
    ]
     $scope.StoryDetailArray = [
                

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
            
         }
         serverCommunication.getDataRelatedIZFromServer({
             storyDetails: _object,
             successCallBack: function (iObj) {
                
                 $scope.StoryDetailArray =[].concat(iObj.data);
             },
             failureCallBack: function (iObj) {
               
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
            
                 
             },
             failureCallBack: function (iObj) {
               
             }

         });
         $scope.closeaddStoryPopup();
     };
    
     $scope.init = function () {
        
     };
     $scope.init();
});