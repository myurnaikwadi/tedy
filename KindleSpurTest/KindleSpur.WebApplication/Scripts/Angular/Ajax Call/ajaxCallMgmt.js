function msNewAjaxCall(){
	
	var sendDataToAjaxCall = function(iObj){
    	var parameters = JSON.stringify(iObj.dataObj);
    	var url =  iObj.url;
    	var mypostrequest = {};
    	if(window.XMLHttpRequest){
    		mypostrequest = new XMLHttpRequest();
        }else{
        	mypostrequest = new ActiveXObject('Microsoft.XMLHTTP');
        };
    	mypostrequest.onreadystatechange=function(){
    		console.info(mypostrequest)
    		 if (mypostrequest.readyState==4){
    		  if (mypostrequest.status==200){
    			  if(iObj.callBack){
    				  if(typeof mypostrequest.response == 'string'){
    					  var _callbackParam = JSON.parse(mypostrequest.response);
    					  console.error(_callbackParam)
    					  iObj.callBack(_callbackParam);
    				  }
    			  }
    		  }
    		  else{
    		   console.info("An error has occured making the request")
    		  }
    		 }
    	}
    	
		mypostrequest.open("POST", url, true);
		//mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		mypostrequest.send(parameters);
    };
    this.sendDataToAjaxCall = sendDataToAjaxCall;
}
