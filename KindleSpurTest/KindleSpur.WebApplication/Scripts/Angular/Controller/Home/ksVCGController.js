app.controller('ksVCGController', function ($rootScope, $scope, serverCommunication, $state) {

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
    $scope.selectedMenu = 0;
    $scope.menuClick = function (iIndex, iOption) {
        $scope.selectedMenu = iIndex;       
        switch (iIndex) {
           // case 0:  break;
           // case 1:  break;
        }
    };
});