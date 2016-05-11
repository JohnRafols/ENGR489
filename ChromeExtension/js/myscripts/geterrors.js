/**
 * +--------------------------------------------------------------------+

	aXe is by Deque


 * +--------------------------------------------------------------------+
 *
 */


var _errors = [];
var listOfErrorDescriptions = [];

var currentErrorColor = 1;

//This is the range of errors that user's want to see
var errorsToShow = [];

// For toggling the errors?
var errorsDisplayed = false;



/*
 * +--------------------------------------------------------------------+

	Errors:
		- Rating of the error
		- Description of the error
		- The DOM
		- The original CSS info 
		- How the error was detected?
		- URL for more info

	In axe.js
	 	Get all errors
			(results.violations);	
		Get the impact/rating
			(results.violations[0].nodes[0].impact);	
		Get the HTML object (String only)
			(results.violations[0].nodes[0].html);
		Get the selectors for the HTML object (Note, target is an array)
			(results.violations[i].nodes[j].target[0]);	
		Violation info
			(results.violations[0].help);	
		Why it's important info:
			(results.violations[0].description);	
		How to fix the error (Note, any is an array):
			(results.violations[0].nodes[0].any[0].message);	
		URL Page on more information
			(results.violations[0].helpUrl)
	
 * +--------------------------------------------------------------------+

*/


function error(ratting, description, dom, cssInformation, solutions, externalPageInfo){
    this.ratting = ratting;
    this.description = description;
    this.dom = dom;
    this.cssInformation = cssInformation;
    this.solutions = solutions;
    this.externalPageInfo = externalPageInfo;
}

/*
	Relevant Css information of errors:
		- The full padding
		- The background color
*/

function cssInformation(padding, backgroundColor){
	this.padding = padding;
	this.backgroundColor = backgroundColor;
}



/*
	This gets all the errors via axe.js
*/


function getErrorsAxe(){
   axe.a11yCheck(document, function (results) {
		//Get all errors
		for(var i = 0; results.violations.length >i ; i++){	

			//	results.violations[0].description;	
			//	results.violations[0].nodes[0].any[0].message;	

			//This is the general description of the error, there's an elaborate one as well...
	    	var description = results.violations[i].help;
	    	//This is a list of the descriptions/kind of errors found on the page
	    	listOfErrorDescriptions.push(description);

	    	//This leads to an external URL for more information on the error
	    	var externalPageInfo = results.violations[0].helpUrl;

	    	//The nodes have the actual number of errors
	    	for(var j = 0; results.violations[i].nodes.length > j; j++){

				var ratting = errorImpactToInt(results.violations[i].nodes[j].impact);	
				// Dom's an HTML string. 
		    	var htmlString = results.violations[i].nodes[j].html;

				// These are the selectors for getting the html object off the page
				var dom = results.violations[i].nodes[j].target[0];
				
				// We'll need to test sites with iframes...

				// var targets = results.violations[i].nodes[j].target;
				// var selectors = "";
				// for(var k = 0; targets.length > k; k++){
				// 	selectors = selectors + targets[k];
				// }
				//console.log(targets);


		    	//Get relevant Css info:
		    	var paddingInfo = $(dom).css('padding');
		    	var colorInfo = $(dom).css('background-color')
		    	var cssInfo = new cssInformation(paddingInfo, colorInfo);


		    	//Possible solutions:
		    	var solutions = [];
		    	for(var k = 0; results.violations[i].nodes[j].any.length > k; k++){
		    		solutions[k] = results.violations[i].nodes[j].any[k].message;
 				}

		    	//Add
		    	_errors.push(new error(ratting, description, dom, cssInfo, solutions, externalPageInfo));
	    	}
		}

		//Maybe initialize everything here?
		listOfErrorDescriptions = ArrNoDupe(listOfErrorDescriptions);

	});
}



// Translates the impact to a number
function errorImpactToInt(impact){
	switch (impact) {
		case "minor":
			return 1;
			break;
		case "moderate":
			return 2;
			break;
		case "serious":
			return 3;
			break;
		case "critical":
			return 4;
			break;
		default:
			return 1;
			break;
	}
}

// Translates the impact to a number
function errorIntToImpact(impact){
	switch (impact) {
		case 1:
			return "minor";
			break;
		case 2:
			return "moderate";
			break;
		case 3:
			return "serious";
			break;
		case 4:
			return "critical";
			break;
		default:
			return "minor";
			break;
	}
}



function colorError(index, error, color){

	//Color the background in an overlay
	$('#overlay').css({
		    "background-color" : "rgba(0,0,0,0.5)", 
		    "position" : "fixed", 
		    "width" : "100%", 
		    "height" : "100%", 
		    "top" : "0px", 
		    "left" : "0px", 
		    "z-index" : 10
	});


	// Color the error as normal:
	// Either red "#ff0033", or white

 	$(error.dom)
 		//It may be better to change the css of the parent instead...
		.css({
			"background-color" : "#ff0033",
			"padding" : "30px",
			"position" : "relative",
			"z-index" : 10000
		})
		//When a user hovers over an error, they see information on the element:
		.mouseover(function() {
		    $(this).css("background-color", "green");
		    showErrorInformation(error);
  		})
  		.mouseout(function(){
  			$(this).css("background-color", "#ff0033");	
  		})

  		//Remove the possibility of linking anywhere else.
  		.removeAttr("href")
  		//Add an anchor for navigation. Wrap the dom with a parent
  		.wrapAll('<a class = "errorContainer" id = " ' + ("error" + (index+1)) + ' " name = "' + ("error" + (index+1)) + '"= >')
  		//.attr("name", ("error" + (index+1)) )
}


function restoreAllErrors(ratting){
	for(var i = 0; _errors.length>i; i++){
		if(_errors[i].ratting == ratting){
			//Get Information
			var originalDom = _errors[i].dom;
			var originalPadding = _errors[i].cssInformation.padding;
			var originalBackgroundColor = _errors[i].cssInformation.backgroundColor;
			//console.log((originalPadding));
			//Revert css
	 		$(originalDom).css({
	 			"padding" : originalPadding,
	 			"background-color" : originalBackgroundColor,
	 			"z-index" : 0
	 		})
 		}
	}
}


//Colors all errors of a certain raiting

function colorAllErrors(ratting){
 	for(var i = 0; _errors.length>i; i++){
		if(_errors[i].ratting == ratting){
			colorError(i, _errors[i], "red");
		} 	
	}
}

//Toggles the overlay

function toggleOverlay(){
	$('#overlay').toggle()
}


/*
	This function in particular will show given error information
	- It calls the UI Controller  

*/


function showErrorInformation(error){
	$('#errorController').empty();

	var solutions = "";
	for(var i = 0; i < error.solutions.length; i++){
		solutions = solutions + (i+1) + ".) " + error.solutions[i] + " <br>";
	}


	var errorDiv = "<div id = '" +  error.toString() + " '> " ;

 	$('#errorController')
		.append("Rating: " + errorIntToImpact(error.ratting) + " <br><br>")
		.append(error.description + " <br><br>")
		.append("Fix any of the following: <br>" + solutions + "<br>")
		.append("<a target = '_blank' href = ' " + error.externalPageInfo + " ' > Click here for more information </a>");	

}


/*
	This function shows all the errors as a list

*/


function showAllErrorInformation(){
	$('#errorController').empty();
	var list = "";
	for(var i = 0; i < _errors.length; i++){
		//Note that I'm making anchor tags to lead to the error when the entry is clicked
		list = list + "<li> <a href='#error" + (i+1) + "'> Error "+ (i+1) + ".) " + _errors[i].description + "</a></li> <br>";
	}
	$('#errorController').append(list)	
}




/*
	Create a jquery UI interface:

*/

function buildController(){
	// Create a draggable / resizable dialog box
	if($('#errorController').length == 0){
		$('html').append("<div id = 'errorController'>")
		$('#errorController')
			.css({
				"word-wrap" : "break-word",
				"font-size" : "18px"
			});
	}	

  $('#errorController').dialog({
	    draggable: true, // Set true by default
	    height: 300, 
	    width: 300,
	    position:'center',
	    // Define a delay for showing or hiding it
	    show: 500,
	    stack: "div",
	    hide: '500',
	    autoOpen: true, // Open true by default
	    // create buttons for the dialog
	    // Refer to the controller variable
	    buttons : {
	      "Show Errors" : function(){
			  	for(var i = 1; i<5 ; i++){
		  			colorAllErrors(i);
		  		}
	      },
	      "Clear Errors": function(){
	      		for(var i = 1; i<5 ; i++){
		  			restoreAllErrors(i);
		  		}
	      },
	      "Toggle Overlay": function(){
	      	 toggleOverlay();
	      },
	      "Error List": function(){
	      	 showAllErrorInformation();
	      }
	    }
  })


  //.parent().draggable().dialog();

  //Make sure the controller follows the screen
  $('.ui-dialog')
  		.css({
  			"position": "fixed",
  			"z-index" : 10000
  		});


}



/*


	Temporary Controller for debugging



*/


$(document).keypress(function(e) {
	  var keyPressed = String.fromCharCode(e.which)

	  //Color errors depending of error
	  if (keyPressed == 2) {
	  	//Change the error
	  	if(currentErrorColor > 4){
	  		currentErrorColor = 1;
	  	}
	  	// First clean the screen
	  	restoreAllErrors(currentErrorColor);
 	  	// Color the screen:
	  	colorAllErrors(currentErrorColor);
	  	currentErrorColor++;
	  }

	  //Clean the screen
	  if (keyPressed == 3) {
	  	for(var i = 1; i<4 ; i++){
	  		restoreAllErrors(i);
	  	}
	  }


	 //Toggle overlay
	 if (keyPressed == 4) {
	  	 $('#overlay').hide()
	 }
	 if (keyPressed == 5) {
	  	 $('#overlay').show()
	 }
	
 	 if (keyPressed == 7) {
		initialize()
 	 }
})


//Initialize Everything 
function initialize(){
	if($('#overlay').length == 0){
		getErrorsAxe();
		//getErrors();
		console.log("Errors Caught")
		$('html').append("<div id = 'overlay'>")
		//Import relevant files
		//$('head').append('<link rel="stylesheet" href="http://localhost/HTML_CodeSniffer/customScripts/jquery-ui-1.11.4/jquery-ui.css" type="text/css" />');
	}	
		buildController();
}



/*
	This filters errors by any way

*/

function filterErrors(type, description){
	for(var i = 0; _errors.length>i; i++){
		if( eval("_errors[" + i + "]." + type) == description ){
			colorError(i, _errors[i], "red");
		} 	
	}
}


/*
	This removes all duplicates in an array:
*/

function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}


/*
	Create a Controller for the UI Interface:

*/


var controller = new function(){
	var ds;

	this.getIssue = function(issueNumber){
		console.log('testing');
	};

}

/*
	This initializes all the code

*/


$(document).ready(function(){
	console.log('Catching Errors...')
	initialize();

});
