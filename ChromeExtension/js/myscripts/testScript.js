

// var iFrame  = document.createElement ("iframe");
// iFrame.src  = chrome.extension.getURL ("html/controller.html");

// document.body.insertBefore (iFrame, document.body.firstChild);

alert("Code Executed ... ");

//Alternatively:
$.get(chrome.extension.getURL('html/controller.html'), function(data) {
	
	$($.parseHTML(data)).appendTo('body');


	//Testing AngularJS
	angular.module('plunker', [])
	  .controller('MainCtrl', function($scope) {
	    $scope.name = 'AngularJS!'
	})


	$('#go').click(function() {
		$(this).html('<div ng-controller=MainCtrl>' + 'Hello, {{name}}</div>');
	    angular.bootstrap(this, ['plunker'])
	})

	//
	angular.bootstrap($('#angularJStest'))


});

