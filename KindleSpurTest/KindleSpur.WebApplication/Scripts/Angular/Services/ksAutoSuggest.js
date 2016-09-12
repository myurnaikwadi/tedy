
/**
 * Genreic autoacompleteListig
 * Param 
 *  selectedTags:'=model'**
 *  listingData ://List of data**
 *  format://suggestions or tags **
 *  layoutMode://template required 
 *  callBackBeforeAdd://callBack as soon as click on any data from listing. (this function will have callBack param)*
 *  callBackBeforeRemove://callback as soon as you clicked on 'X' button
 *  callBackInChange://successfully add calback(changeInInviteeParentFunc)
 *  objecParams : {title:'CML_TITLE',id:'CML_ID',description:'CML_DESCRIPTION',img:'CML_IMAGE_PATH'}**
 *  openFor:'TO','CC','BCC'(changeInInviteeParentFuncParam)
 *  callBackInChangeParams:""
 */

/**
 * @name callBackBeforeRemove
 * @kind function
 * @description
 * 		Use this function to remove a selected tag from list of tags
 * @param {Object} - selection - Name must be this in html, it contains removed object
 * @param {function} - callback - Callback function if executed will remove that selected tag
 * */

app.directive('autoComplete', ['$filter', '$compile', '$rootScope', '$timeout', 'filterFilter', function ($filter, $compile, $rootScope, $timeout, filterFilter) {
	return {
		restrict:'E',
	    scope:{
	        selectedTags:'=model', //done
	        listingData: '=?', //done
	        format: '@', //done	    	
	        layoutMode: '@', //done
	        widthHeight: '@', //done
	    	callBackInChange :'&',
	    	openFor: '@',
	    	callBackTyping: '&',
	    	callBackInChangeParams: "@",
	    	callBackBeforeAdd :"&", //done
	    	callBackBeforeRemove :"&", //done
	    	objectParams:"=?", //done
	    	setFocusOnLoad: '@'
	    	
	    	/*callbackForAddInvitee : "=",
	    	callbackForRemoveInvitee : "=",*/
	    	
	    },
	    templateUrl: '/Home/ksAutoSuggest',
	    link :function (scope,element,attrs) {
	    	window.sugg= scope
	        //load exiting Populated data
	    	if(!scope.selectedTags)
	    		scope.selectedTags = [];
	    	
	    	scope.suggestions = [];
	    	scope.tempId = Date.now() + "" + Math.random();
	    	if(scope.setFocusOnLoad == 'true'){
		    	$timeout(function(){
		    		ang.setElementFocus(scope.tempId);
		    	},50);	
	    	}
	    	
	    	scope.suggestionChange = false;
	    	
	    	var callBackInChange = scope.callBackInChange();

	    	if(!scope.objectParams){
	    		scope.objectParams = {
	    		        firstName: 'Name',
		    			lastName : 'CML_LAST_NAME',
		    			imgPath : 'CML_IMAGE_PATH',
		    			email   :'CML_PERSONAL_EMAIL'

		    	}
	    	}
	    	
	    	/**
	    	 * @name arrangeIt
	    	 * @kind function
	    	 * @description
	    	 * 	Use this function to re-arrange Data into required format for display
	    	 */

	    	function arrangeIt() {
	    	    scope.listingData =eval(scope.listingData)
	    		for(var i=0;i<scope.listingData.length;i++){
	    			if(scope.objectParams ){
	    				scope.listingData[i].name = (scope.objectParams.firstName && scope.objectParams.lastName) ? scope.listingData[i][scope.objectParams.firstName] +" "+  scope.listingData[i][scope.objectParams.lastName] : scope.listingData[i][scope.objectParams.firstName];
	    				scope.listingData[i].id = scope.listingData[i]['KEY_VAL'];
	    				if(scope.objectParams.email)
	    					scope.listingData[i].email = scope.listingData[i][scope.objectParams.email];
	    					
	    				if(scope.objectParams.imgPath)
	    					scope.listingData[i].img = 	makeImagePath(scope.listingData[i][scope.objectParams.imgPath]);
	    				
	    			    scope.suggestions.push(scope.listingData[i]);
	    			}
	    		}
	    		//console.log(scope.suggestions);
	    	}
	    	
	    	arrangeIt();
	    	
	    	/**
	    	 * @type {string} - layoutMode - it contains path of html
	    	 * @desc - Set Layout here through html
	    	 * */
	    	if(!scope.layoutMode || scope.layoutMode == "" ){
	    	    scope.layoutMode = 'Home/ksAutoSuggestSuggestion';
	    	}
	    	
	    	/**
	    	 * @type {Object} - _templateScopeHoldingVar
	    	 * @desc - It is for Dynamic Template loading
	    	 * */
	    	var _templateScopeHoldingVar = genericMethodsForLoadingTemplatesDynamically('suggestionListTemplate', 'Home/ksAutoSuggestSuggestion', function (iData, id) {
			    console.error(iData)
			    $compile(iData)(scope);
				scope.generatedTemplateId = id;
			});
			
			/**
	    	 * @name search
	    	 * @kind function
	    	 * @description
	    	 * 	This function is called on change of input box
	    	 */
	    	scope.search = function () {
	    	    scope.layoutModeD = { name: scope.searchText }
	    	    if (scope.callBackTyping && typeof scope.callBackTyping == 'function') {
	    	        scope.callBackTyping()({ searchText: scope.searchText  });
	    	    }
			    _actionOnSuggestion();
			}
			
			scope.filterCallback = function(iArr)
			{
				for(var i in iArr){
					iArr[i].index = i;
				}
				//console.error(iArr);
				scope.newAlteredSuggestions = iArr;
			}
			
			/** 
			 * @name makeEditable
			 * @kind function
			 * @description
			 * 	function to make Editable enetered invitee
			 * 
			 */
			scope.makeEditable = function(iIndex,iObj){
				if(iObj.email)
					scope.searchText =iObj.email;
				scope.selectedIndex = -1;
				scope.removeTag(iIndex);
			}
			
			var onSelectionn = function (selection){
				console.log(selection)
				switch (scope.format){
				case 'tags' :
					if(scope.selectedTags.indexOf(selection)===-1){
						if(selection.mode == "manual"){
							scope.selectedTags.push(selection);
							callBackInChange({
								type			:	scope.openFor,
								selectedData	:	selection,
								Selected		:	true,
								param			:	scope.callBackInChangeParams
							},2)
						}else{
							scope.selectedTags.push(scope.suggestions[scope.suggestions.indexOf(selection)]);
							callBackInChange({
								type			:	scope.openFor,
								selectedData	:	scope.suggestions[scope.selectedIndex],
								Selected		:	true,
								param			:	scope.callBackInChangeParams
							},2)
						}
						
				         scope.searchText='';
						 scope.blurOnTab()
				         //scope.suggestions=[];
					}
					
					break;
				case 'suggestion':
					scope.selectedTags[0] = (scope.suggestions[scope.suggestions.indexOf(selection)]);
					scope.searchText = scope.selectedTags[0].Name;
//					scope.changeInInviteeField({type:scope.changeInInviteeParentFuncParam,selectedData:scope.newAlteredSuggestions[scope.selectedIndex],Selected:true,param:scope.funcParam},2);
					callBackInChange(scope.suggestions[scope.suggestions.indexOf(selection)]);
					break;
				}
			}
			
			/**
	    	 * @name addToSelectedTags
	    	 * @kind function
	    	 * @description
	    	 *  Purpose of function is to add to selected tag 
	    	 *  Internally it will call callbackbeforeadd if present to verify the data being entered
	    	 *  @param {Object} - selection - It is object that contains details of selected object
	    	 */

			scope.addToSelectedTags = function(iSelection){

			    var _filtersz = filterFilter(scope.suggestions, scope.layoutModeD);
			    iSelection = _filtersz[scope.selectedIndex];
				if(scope.callBackBeforeAdd && typeof scope.callBackBeforeAdd == 'function'){
					scope.callBackBeforeAdd({iType :scope.openFor, iACAddTag:iSelection,iACCallback: function(iModObject){
						if(iModObject)
							onSelectionn(iModObject);
						else
							onSelectionn(iSelection);
					}});
				}else{
					onSelectionn(iSelection);
				}
			}
		
			scope.blurOnTab = function(iEvent,iPrm)
			{				
				if(iEvent)
					iEvent.stopPropagation();
				scope.suggestionChange=false;
				scope.suggestionResults = [];
			};
			
			/**
	    	 * @name checkKeyDown
	    	 * @kind function
	    	 * @description
	    	 *  This Function is used to determine details of keypress
	    	 *  @param {Object} - event - It is object that contains details event ehich is used to determine details of keypress
	    	 */
			scope.scrollHwightbackUp = 0;
			scope.selectedIndex = -1;
			scope.checkKeyDown = function(event)
			{

				if(scope.suggestions.length > 0)
					scope.showDropFlag = true;
				//scope.suggestionChange=false;
				   if(event.keyCode===40){//down key, increment selectedIndex
				       event.preventDefault();
				       if (scope.selectedIndex == -1 && scope.suggestions.length > 0)
				           _actionOnSuggestion();
				       if(scope.selectedIndex+1 !== scope.suggestionResults.length){
				           scope.selectedIndex++;
				           if (scope.selectedIndex > 2) {
				               var msgDiv = document.getElementById("ssssss");
				               if (scope.scrollHwightbackUp == 0)
				                   scope.scrollHwightbackUp = msgDiv.scrollHeight;
				               $(".autosuggestionPopup").scrollTop(0);//set to top
				               $(".autosuggestionPopup").scrollTop(scope.scrollHwightbackUp + Number(scope.widthHeight));
				               scope.scrollHwightbackUp = scope.scrollHwightbackUp + Number(scope.widthHeight);
				           }
				       }
				   }
				   else if(event.keyCode===38){ //up key, decrement selectedIndex
				       event.preventDefault();
				      
				       if(scope.selectedIndex-1 !== -1){
				           scope.selectedIndex--;
				           if (scope.selectedIndex > 2) {
				               var msgDiv = document.getElementById("ssssss");
				               if (scope.scrollHwightbackUp == 0)
				                   scope.scrollHwightbackUp = msgDiv.scrollHeight;
				               $(".autosuggestionPopup").scrollTop(0);//set to top
				               $(".autosuggestionPopup").scrollTop(scope.scrollHwightbackUp - Number(scope.widthHeight));
				               scope.scrollHwightbackUp = scope.scrollHwightbackUp - Number(scope.widthHeight);
				           } else {
				               $(".autosuggestionPopup").scrollTop(0);//set to top
				           }
				       }
				   }
				   else if(event.keyCode===13){
					   if(scope.selectedIndex >= 0){
						   scope.addToSelectedTags(scope.suggestions[scope.selectedIndex]);
					   }else{
						   scope.addToSelectedTags({
							   name				:	scope.searchText,
							   id				:	Date.now(),
//							   img				:	"www/public/msStream/images/msOrganization/clouzer.png",
//							   CML_ID 			: 	Date.now(),
//							   CML_TITLE 		: 	scope.searchText,
//							   CML_IMAGE_PATH 	:	"www/public/msStream/images/msOrganization/clouzer.png",
//							   CML_PERSONAL_EMAIL:	scope.searchText,
//							   email			: 	scope.searchText,
							   mode				:	"manual"
						   });
						   console.log(scope.searchText);
					   }
						   
				   }
			}

			/**
	    	 * @name actionOnSuggestion
	    	 * @kind function
	    	 * @description
	    	 * 	This function is called to rearrange position of suggestion box
	    	 */
			var _actionOnSuggestion = function(){
				
			    scope.selectedIndex = -1;
			    var _element= 	document.getElementById(scope.tempId);
	 			var _elementPos=_element.getBoundingClientRect();
	 			var _left = _elementPos.left;
	 			var _top=_elementPos.bottom  ;
		 			
			    scope.autoComplete = {
			    	suggestionListPosition:{
			    	    left: (_left-15) + "px",
			    		top: _top + "px",
	 					display:'block'
			    	}
			    }
			    
			    scope.suggestionChange = true;
		        console.log(angular.copy(scope.searchText))
			    if(scope.searchText == ''){
		        	 scope.suggestionChange = false;
		        }
		         
			}
			
			/**
	    	 * @name _removeTag
	    	 * @kind function
	    	 * @description
	    	 * 	Actual remove tag function that will remove a selected tag and 
	    	 *  will call a callback in change function which in turn will report what was changed
	    	 *  @param {Number} - index - It should be number that index will be removed from tag
	    	 */
			
			var _removeTag = function (index){
				console.error('_removeTag');
				var removedMember = scope.selectedTags[index];
				console.error(removedMember)
				scope.selectedTags.splice(index,1);
				callBackInChange({type:scope.changeInInviteeParentFuncParam,selectedData:removedMember,Removed :true});
				scope.blurOnTab();
			}
			
			/**
	    	 * @name removeTag
	    	 * @kind function
	    	 * @description
	    	 * 	This function is called to remove a tag
	    	 */
			scope.removeTag = function(index,iObj){
				if(scope.callBackBeforeRemove && typeof scope.callBackBeforeRemove == 'function'){
					scope.callBackBeforeRemove({selection:iObj,callback: function(){
						_removeTag(index);
					}});
				}else{
					_removeTag(index);
				}
			};
			
			scope.focusOnTab = function(iEvent,iPrm)
			{
				if(iEvent)
					iEvent.stopPropagation();
				scope.suggestionChange=true;
				var arr = scope.listingData;
				
				//callBackInChange({type:scope.changeInInviteeParentFuncParam,tagOnFocus:scope.tagOnFocus},3)
				//scope.changeInInviteeField({type:scope.changeInInviteeParentFuncParam,tagOnFocus:scope.tagOnFocus},3);
			};
			
			
			scope.$on('$destroy',function(){
	  			  _templateScopeHoldingVar && _templateScopeHoldingVar.destroyTemplate();
	  		  	});
	    	
	    }
		
	}
	
}])

function makeImagePath(iImg) {
    if (iImg && iImg.CML_IMAGE_PATH)
        iImg = iImg.CML_IMAGE_PATH;
    if (iImg) {

        if (iImg != 'null' && iImg != 'undefined' && iImg != undefined && iImg != globalVars.NginxUrl && !iImg.match('public')) {
            return globalVars.NginxUrl + unescape(iImg);
        } else if (iImg.match('public') || iImg.match('https://') || iImg.match('http://')) {
            return iImg;
        } else {
            return "Images/icons/If no Profile photo.png";
        }

    }
    return "Images/icons/If no Profile photo.png";
}

// added code by dinesh for loading templates dynamically

function genericMethodsForLoadingTemplatesDynamically(templateName, templatePath, iCallBack, full) {
    var $http = angular.injector(["ng"]).get("$http");

    var $templateCache = angular.injector(["ng"]).get("$templateCache");
    var _templateId;
    var _returnedObject = {
        id: parseInt(Math.random() * 1000000) + '' + parseInt(Math.random() * 1000000),
        _elmentDef: $templateCache.get(templateName),
        setTemplate: function (iData) {
            var s1 = document.createElement('div'),
            s2 = document.getElementById('mainwrapper');
            _templateId = s1.id = this.id;
            s1.className = "customeContent";
            if (full) {
                s1.style.height = "100%"
                s1.style.width = "100%"
            }
            s1.innerHTML = iData;
            s2.appendChild(s1);
            return s1;
        },
        destroyTemplate: function () {
            var s2 = document.getElementById('mainwrapper');
            var s1 = document.getElementById(this.id);
            s1 && s2.removeChild(s1);
        }
    };


    var _newAppendedElement;
    if (!_returnedObject._elmentDef) {

        $http.get(templatePath, { cache: $templateCache }).then(function (response) {
            if (response.statusText === "OK" && response.status === 200) {
                _newAppendedElement = _returnedObject.setTemplate(response.data);
                iCallBack && iCallBack(_newAppendedElement, _templateId);
            }
        });
    }
    else {
        _newAppendedElement = _returnedObject.setTemplate(_returnedObject._elmentDef);
        iCallBack && iCallBack(_newAppendedElement);
    }

    return _returnedObject;
}

