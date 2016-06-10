app.directive('pwdCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);
app.directive('focusMe', function($timeout, $parse) {
  return {
    scope: {
		      blur: '&',
		      setFocus : '='
    },
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
		console.error(scope.setFocus);
		if(element[0] && scope.setFocus) element[0].focus();
      		element.bind('blur', function() {
			 scope.$apply(function() {
				if ('undefined' !== typeof scope.blur) {            
				      scope.blur();
				}
			 });
      		});
    }
  };
});

app.directive('topMainStrip', function ($state) {
    return {
        scope: {
           
        },
        templateUrl : '/Home/ksTopMainStrip',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.selectedRole = 0;
            scope.navigateAsPerRole = function (iRole) {
                console.error(iRole);
                scope.selectedRole = iRole;
                switch(iRole){
                   case 0 : $state.go('dashBoardCoachee');  break;
                    case 1: $state.go('dashBoardCoach'); break;
                   case 2 : $state.go('dashBoardMentee'); break;
                   case 3 : $state.go('dashBoardMentor'); break;
                 }
            };
        }
    };
});
app.directive('bottomMainStrip', function ($timeout) {
    return {
        scope: {
           
        },
        template : '<div style="float: left;width: 100%;height: 100%;display: flex;"><ul class="bottomStripOption"><li class="fontClass" ng-repeat = "option in bottomOptionArray">{{ option.name}}</li></ul></div>',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            console.error(scope);
            scope.bottomOptionArray = [
               { name : 'UNKNOWN 2016' },
                { name : 'USER AGREEMENT' },
                 { name : 'PRIVACY POLICY' },
                { name : 'COMMUNITY GUIDELINES' },
                { name : 'COOKIE POLICY' },
                { name : 'COPIRIGHT POLICY' },
                { name : 'QUEST CONTROLS' },
                { name : 'LANGUAGE' },
            
            ];
        }
    };
});

app.directive('ctcRole', function ($state) {
    return {
        scope: {

        },
        templateUrl: '/Home/ksCtcRole',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.catogoryArray = [
                 { name: 'Advertising' },
                 { name: 'Education' },
                 { name: 'Engineering' },
                 { name: 'Marketing' },
                 { name: 'BRAIN GAMES' },
                 { name: 'RESOURCES' }
            ];
            scope.selectedCategory = -1;
            scope.categoryClick = function (iIndex, iCategory) {
                scope.selectedCategory = iIndex;
            };
        }
    };
});


