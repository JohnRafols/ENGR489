/**
 * +--------------------------------------------------------------------+

	This code is mainly for the controller of the application
	It utilizes Angular.js to take advantage of its scope and filter options

            Ratting: {{error.ratting}} || {{error.description}}



Error format:
    this.ratting = ratting;
    this.description = description;
    this.dom = dom;
    this.cssInformation = cssInformation;
    this.solutions = solutions;
    this.externalPageInfo = externalPageInfo;

 * +--------------------------------------------------------------------+
 *
 */

//Here we run geterrors.js now we'll have the variables we need.
var _errors, listOfErrorDescriptions;
console.log('Catching Errors...')

initialize(function(){
  //All of the errors
  _errors = getErrors();
  console.log("Errors Caught");
  //List of error Descriptions
  listOfErrorDescriptions = getErrorDescriptions();

  //These are all the views
  //Maybe seperate this into another
  var controllerView = chrome.extension.getURL('views/controller.html');

  $.get(controllerView, function(data) {
  	$($.parseHTML(data)).appendTo('body');
  	angular.bootstrap(document, ['plunker'])

    //Make it draggable
     $('#angularJStest').dialog({
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
    })

      $('.ui-dialog')
      .css({
        "position": "fixed",
        "z-index" : 10000
      });

  });






  //Testing AngularJS
  angular.module('plunker', ['angular.filter'])

    //This is the main controller
    .controller('MainCtrl', ['$scope', 'filterFilter', function($scope, $filter) {
       // All of the errors 
      $scope.errorData = _errors;
      // Errors filtered by ratting
      $scope.criticalErrors = $filter($scope.errorData, {ratting: 4}); 
      $scope.seriousErrors = $filter($scope.errorData, {ratting: 3}); 
      $scope.moderateErrors = $filter($scope.errorData, {ratting: 2}); 
      $scope.minorErrors = $filter($scope.errorData, {ratting: 1}); 

      //Errors filtered by kind:
      $scope.listOfErrorDescriptions = listOfErrorDescriptions;
      
      //My custom on-click filters
      $scope.filters = {};

      $scope.toggle = function() {
        console.log('?')
          $scope.opened = !$scope.opened;
          console.log($scope.opened);
          $scope.$apply();
      };

    }])

   
    //We should make a bunch of directives...
    //ex: error list, error, and summarylist
    .directive("logic", function($compile) {
      return {
  	 	template: '{{text}}',
          link: function (scope, element, attrs) {
              scope.text = '1';
              scope.onClick = function() {
  			         scope.text = '2';
              };
          }
      }
    })

    .directive("test", function($compile) {
      return {
        // scope: {},
        // controller : "@", // @ symbol
          //restrict: 'E',

          //Check scope and $broadcast and $on
          replace: true,
          transclude: true,
          template: '<div class="my-div" ng-class= "ratting" ng-transclude></div>',
          link: function (scope, element, attrs) {
              scope.text = '1';
              var errorsOnDisplay = element.children();
              for(i = 0; i < errorsOnDisplay.length; i++){
                  errorsOnDisplay.eq(i).css("background-color", "red");
              }
          }
      }
    })

    .directive("errorsOnDisplay", ['filterFilter', function($filter) {
  		return function (scope, element, attrs) {
    			var errorsOnDisplay = element //.children();
    			for(i = 0; i < errorsOnDisplay.length; i++){
      		  	errorsOnDisplay.eq(i).css("background-color", "red");
    			}
          


          scope.errorData = _errors;

          scope.displayType = function(description){
              for(var i = 0; i< scope.errorData.length; i++){
                if(scope.errorData[i].description == description){
                    //console.log('??')
                    var error = scope.errorData[i];
                    //..Try to keep it simple, color the error
                 }
              }
          }
  		}
    }])

    .controller('displayCtrl', ['$scope', 'filterFilter', function($scope, $filter) {
       // All of the errors 
      $scope.errorData = _errors;
     
    }])


    .directive("errorsInController", function($compile) {
      return function (scope, element, attrs) {

        var errorsOnDisplay = element //.children();
    
        scope.errorByRatting = function(ratting){
            var lengthOfErrors = 0;
             for(var i = 0; $scope.errorData.length>i; i++){
              if($scope.errorData[i].ratting == ratting){
                //scope.errorCount = ;
              }   
            }   
        }
        
      }
    })
    


})
 

//  For some reason, ng-class won't work
//  But directives work supposedly
//  may a parent directive, then add a template {{}}
//  Make that template responsive
//  we'll have to add the stuff here, not there the jquery way








// angular.module('test', ['ngRoute'])
//   .config(function($routeProvider){
// 		$routeProvider
// 		.when('/', { 
// 	  		controller: MainCtrl, 
// 	  		templateUrl : chrome.extension.getURL('views/views1.html')
// 	  	})
// 	  	.when('/view2', { 
// 	  		controller: MainCtrl, 
// 	  		templateUrl : chrome.extension.getURL('views/views2.html')
// 	  	})
// 		.otherwise({redirectTo:'/'});
// })
   
 



//MVC Pattern:


// var errorData = [];

// function getErrorsAxe(){
//    axe.a11yCheck(document, function (results) {
// 		errorData = results; 
// 		console.log(results);
// 	});
// }


// //Controller?
// $.get(chrome.extension.getURL('views/controller.html'), function(data) {
// 	//Not sure if you can parse this the angular.js way...
// 	$($.parseHTML(data)).appendTo('body');

// 	//Testing AngularJS
// 	angular.module('plunker', [])
// 	  .controller('MainCtrl', function($scope) {
// 	    	$scope.name = 'AngularJS!'
// 	    	$scope.errorList = errorData;
// 	})


// 	$('#go').click(function() {
// 		$(this).html('<div ng-controller=MainCtrl>' + 'Hello, {{errorList}}</div>');
// 	    angular.bootstrap(this, ['plunker'])
// 	})

// 	angular.bootstrap($('#angularJStest'))

// });

