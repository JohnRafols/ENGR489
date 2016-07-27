//This file has all access to the chrome API's
// $(document).ready(function(){
//     $("p").click(function(){
//         $(this).hide();
//     });
// });

// console.log('hello world');


// //chrome.tabs.executeScript(null, {file: "js/testScript.js"});

// //
// var iframe  = document.createElement ("iframe");
// iframe.src  = chrome.extension.getURL ("html/controller.html");
// var yourDIV = document.getElementById("openModal");
// yourDIV.appendChild(iframe);
 
//Message passing API
// chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
// 	//Response, the data from the content scripts
// 	//sender, the tab id from the sender
// 	//sendResponse, used send back to content scripts
//  })


//Fired when User Clicks ICON
chrome.browserAction.onClicked.addListener(function (tab) { 

	//Testing angularjs integration
	chrome.tabs.insertCSS(null, {file: "css/angular-csp.css"});
	chrome.tabs.executeScript(null, {file: "js/lib/angular.min.js"});
	chrome.tabs.executeScript(null, {file: "js/lib/angular-route.min.js"});
	chrome.tabs.executeScript(null, {file: "js/lib/angular-filter.min.js"});


	//All relevant libraries:
	chrome.tabs.executeScript(null, {file: "js/lib/jquery-2.2.3.min.js"});
	chrome.tabs.executeScript(null, {file: "js/lib/jquery-ui-1.11.4/jquery-ui.min.js"});
	chrome.tabs.insertCSS(null, {file: "js/lib/jquery-ui-1.11.4/jquery-ui.structure.min.css"});
	chrome.tabs.insertCSS(null, {file: "js/lib/jquery-ui-1.11.4/jquery-ui.min.css"});
	chrome.tabs.insertCSS(null, {file: "js/lib/jquery-ui-1.11.4/jquery-ui.theme.min.css"});

	//aXe API
	chrome.tabs.executeScript(null, {file: "js/lib/node_modules/axe-core/axe.min.js"});

	//My work:
	chrome.tabs.insertCSS(null, {file: "css/controllerStyling.css"});
	chrome.tabs.executeScript(null, {file: "js/myscripts/geterrors.js"});
	chrome.tabs.executeScript(null, {file: "js/myscripts/mainAngularApp.js"});

	//chrome.tabs.insertCSS(null, {file: "css/yourcss.css"});
	
});









