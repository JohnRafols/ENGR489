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
    this.htmlInfo = htmlInfo;

 * +--------------------------------------------------------------------+
 *
 */



//Here we run geterrors.js now we'll have the variables we need.
var _errors;
console.log('Catching Errors...')

initialize(function(){
  //All of the errors
  _errors = getErrors();
  console.log("Errors Caught");

  //These are all the views
  //Maybe seperate this into another
  var controllerView = chrome.extension.getURL('views/controller.html');

  $.get(controllerView, function(data) {
  	$($.parseHTML(data)).appendTo('body');
  	angular.bootstrap(document, ['plunker'])



    //This is jQueryUI code, completely seperated from AngularJS

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


    $( "#accordionFilters" ).accordion({
      // Slide animation or not or length
      animate: 200,
      // Collapsible if same tab is clicked
      collapsible: true,
      active: false,
      // Event that triggers
      event: "click",
      // Height based on content (content) or largest (auto)
      heightStyle: "content"
    });

    



  });



  //Remove all links to anywhere (Ask for opinion here).
  $('a').removeAttr('href')
 
  // $("#angularJStest").css({
  //       "position": "fixed",
  //       "z-index" : 10000
  // });
  // $("#angularJStest").draggable();
  // $("#accordion").accordion();

/**
 * +--------------------------------------------------------------------+

    
    This is the start of the AngularJS code


 * +--------------------------------------------------------------------+
 *
 */


  //Testing AngularJS
  angular.module('plunker', ['angular.filter'])

    //This is the main controller
    .controller('MainCtrl', ['$scope', '$filter', function($scope, $filter) {


       // All of the (current) errors being manipulated 
      $scope.errorData = _errors;

      // Errors filtered by ratting
      $scope.criticalErrors = $filter('filter')($scope.errorData, {ratting: 4}); 
      $scope.seriousErrors = $filter('filter')($scope.errorData, {ratting: 3}); 
      $scope.moderateErrors = $filter('filter')($scope.errorData, {ratting: 2}); 
      $scope.minorErrors = $filter('filter')($scope.errorData, {ratting: 1}); 

      //Errors filtered by kind:
      $scope.listOfErrorDescriptions =  $filter('unique')($scope.errorData, 'description'); 
          
      //My custom on-click filters
      //http://stackoverflow.com/questions/14882370/filter-list-of-items-when-clicking-category-link
      $scope.filters = {};

      $scope.toggle = function() {
          $scope.opened = !$scope.opened;
          console.log($scope.opened);
          $scope.$apply();
      };


      //This is for the CSS transition for selecting individual errors
      $scope.selectedIndexRatting = -1; 

      $scope.itemClickedRatting = function ($index) {
          $scope.selectedIndexRatting = $index; 
      };

     
      //Communicate with errorsOnDisplay and change the error classes on-screen
      //Unless allErrors
      $scope.filterErrorsByRatting = function(value){
        if(value == 'allErrors'){
            //Restart everything
        }
        $scope.$broadcast('displayErrorByRatting', value);

      }


    }])

   




/**
 * +--------------------------------------------------------------------+

    
    This directive is responsible for all the errors onscreen


 * +--------------------------------------------------------------------+
 *
 */

    .directive("errorsOnDisplay", ['$rootScope', '$filter', function($rootScope, $filter) {
      return {
          restrict: 'A',
          scope: {
            value: "@",
            iconValue: "@"

          },
          //scope: true,
          controller: 'MainCtrl',
          //Check scope and $broadcast and $on
          replace: true,
          transclude: true,
          //<div> vs <span>, ask for opinion
          template: '<div style = "position: relative" ng-class= "defaultClass">' +
                    '<ng-transclude></ng-transclude>' +
                    '<a name = error{{value}} ng-click="onClick($event)" ng-class = "icon" value="{{value}}">{{iconValue()}}</a>' +
                    '</div>',

          link: function (scope, element, attrs) {

              var errorsOnDisplay = element.children();


              //Restart the showing/hiding
              scope.$on('restartEverything',  function(newval,oldval){
                 var errorIndex = attrs.value;
                 var impact = scope.errorData[errorIndex].ratting;
                 getErrorClass(impact);

                 element.removeClass('None');
                 //From showIndividualErrorOnScreen
                 element.removeClass('individualError');

              });

              /**
               * +--------------------------------------------------------------------+          
                   Icon
               * +--------------------------------------------------------------------+
               */

              scope.iconValue = function(){
                 var errorIndex = attrs.value;
                 var currentDesc = scope.errorData[errorIndex].description;           
                 for (var i = 0; i < scope.listOfErrorDescriptions.length; i++) {
                    if(currentDesc == scope.listOfErrorDescriptions[i].description){
                      var filterIndex = String.fromCharCode(65 + i);
                    }
                 }
                 return filterIndex + ':' + (parseInt(errorIndex)+1);
              };

        

              /**
               * +--------------------------------------------------------------------+          
                    Filter by Type
               * +--------------------------------------------------------------------+
               */

              //This is for filtering by type
              scope.$on('filterByType', function (event, result){
                  scope.receivedData = result.data;
                  errorsByType(result.data);

              });


              //This is to filter by the description of the error (ex, contrast, etc.)
              function errorsByType(description){
                var errorIndex = attrs.value;
                var error = scope.errorData[errorIndex];
                var impact = scope.errorData[errorIndex].ratting;

                if(error.description == description){
                  
                    // element.addClass('byType');
                    getErrorClass(impact);
                }
                else{
                    //scope.defaultClass =  "";
                    // "None", is a css class that makes an element invisible. 
                    //element.addClass('None');
                    getErrorClass('None');

                 }
                 
              }



            /**
             * +--------------------------------------------------------------------+          
                  Individual Errors
             * +--------------------------------------------------------------------+
             */

              //Show specific error
              scope.$on('showIndividualErrorOnScreen',  function(event, data){
                 var errorIndex = attrs.value;
                 var impact = scope.errorData[errorIndex].ratting;
                 var errorRatting = errorIntToImpact(impact);


                 // Remove the previous individual error's class if it is selected
                 if(element.hasClass("individualError")){
                    getErrorClass(impact);
                 }

                 if(attrs.value == data){
                    //element.addClass('individualError')
                    scope.defaultClass = "individualError";
                 }

              });


              scope.onClick = function($event){

                  var errorIndex = $event.currentTarget.attributes.value.value
 
                  scope.$emit('individualErrorInformation', {
                    errorIndex: errorIndex
                  });



              }



            /**
             * +--------------------------------------------------------------------+          
                  Filter by Ratting
             * +--------------------------------------------------------------------+
             */


              scope.$on('displayErrorByRatting', function(event, ratting) { 

                var errorIndex = attrs.value;
                var impact = scope.errorData[errorIndex].ratting;
                var errorRatting = errorIntToImpact(impact);
                
  
                  if(ratting == 'noFilter' || ratting == 'allErrors'){
                      getErrorClass(impact);
                  }
                  else if(errorRatting == ratting){
                      getErrorClass(impact);
                  }
                  else{
                      getErrorClass('None');
                  }


                // Okay, next thing is to hide what's in the error list...
      
                  scope.$emit('hideByFilter', {
                    hide: ratting
                  });
                
              });




            /**
             * +--------------------------------------------------------------------+          
                  Misc.
             * +--------------------------------------------------------------------+
             */

              //This is the default css class of the node depending on its ratting
              // scope.defaultClass = '';
              // var errorIndex = attrs.value;
              // var impact = scope.errorData[errorIndex].ratting;
              // getErrorClass(impact);
              scope.icon = "iconHide"


              function getErrorClass(impact){
                  switch (impact) {
                    case 1:
                      scope.defaultClass = "Minor";
                      scope.icon = "icon"
                      break;
                    case 2:
                      scope.defaultClass =  "Moderate";
                      scope.icon = "icon"

                      break;
                    case 3:
                      scope.defaultClass =  "Serious";
                      scope.icon = "icon"

                      break;
                    case 4:
                      scope.defaultClass =  "Critical";
                      scope.icon = "icon"
                      break;
                    default:
                      scope.defaultClass =  "None";
                      scope.icon = "iconHide"
                      break;
                  }

              }




          }
      }
    }])




/**
 * +--------------------------------------------------------------------+

     
     This directive represents the errors being presented within the Pop-up controller


 * +--------------------------------------------------------------------+
 *
 */
 
    .directive("errorsInController", ['$rootScope', '$filter', function($rootScope, $filter) {

      return function (scope, element, attrs) {

           
          //List of unique
          // scope.listOfErrors = $filter('unique')(scope.errorData, 'description'); 
          // for (var i = 0; i < scope.listOfErrors.length; i++) {
          //   var typeIndex =  String.fromCharCode(65 + i);
          //   var description = scope.listOfErrors[i].description;
          // }



          scope.restartEverything = function(){
               // Restart filters
               // scope.hideByFilter = 0;
               scope.hideByType = null;
               scope.selectedIndex = -1; 
               scope.selectedIndexFilter = -1;


               //Restart individual error
               scope.description = '';
               scope.htmlSnippet = '';
               scope.solution = '';
               scope.moreInfo = ''; 
               scope.individualError = '';


               //$rootScope.$broadcast('restartEverything', '');
          }


          /**
           * +--------------------------------------------------------------------+          
                Individual Errors
           * +--------------------------------------------------------------------+
           */

          scope.$on('individualErrorInformation', function(event, data) { 

              //scope.individualError = data.individualErrorInformation
              //Simulate a click on the error
              scope.itemClicked(data.errorIndex)
          });


          function buildIndividualErrorInfo(description, htmlSnippet, solution, moreInfo){
              scope.description = description;
              scope.htmlSnippet = htmlSnippet;
              scope.solution = solution;
              scope.moreInfo = moreInfo;
          }

          //This communicates to the other directive to emphasize the specified error
          function showIndividualErrorOnScreen(index){
              $rootScope.$broadcast('showIndividualErrorOnScreen', index);
          }

          //Css
          scope.selectedIndex = -1; 
          scope.itemClicked = function ($index) {
             scope.selectedIndex = $index;
             //This is for the individual error information
             scope.individualError =  scope.errorData[$index];
             //Show the error
             showIndividualErrorOnScreen($index);

          };


          /**
           * +--------------------------------------------------------------------+          
                Filtering by types
           * +--------------------------------------------------------------------+
           */
          scope.hideByType = null;

          scope.typeIndex = function(index){
            return String.fromCharCode(65 + index);
          }

          // scope.typeAndErrorIndex = function(index){
          //    var currentDesc = scope.errorData[index].description;           
          //    for (var i = 0; i < scope.listOfErrorDescriptions.length; i++) {
          //       if(currentDesc == scope.listOfErrorDescriptions[i].description){
          //         var filterIndex = String.fromCharCode(65 + i);
          //       }
          //    }
          //    return filterIndex + ':' + (parseInt(errorIndex)+1);
          // };


          scope.displayType = function(description, filterIndex){
              //Communicate this with the errors-on-display directive via broadcast
              $rootScope.$broadcast('filterByType', {
                    data: description
              });

              scope.hideByType = description;
          }

          //Css
          scope.selectedIndexFilter = -1; 
          scope.filterClicked = function ($index){
              scope.selectedIndexFilter = $index;
          }

          scope.filterErrorListByType = function(error, ratting){
            if(scope.hideByType == null){
              if(ratting == 0 || error.ratting == ratting){
                return true;
              }
            }
            else if(scope.hideByType == error.description){
              if(ratting == 0 || error.ratting == ratting){
                return true;
              }
            }
            return false;
          }


          /**
           * +--------------------------------------------------------------------+          
                Filtering by ratting
           * +--------------------------------------------------------------------+
           */



          //'Hiding test' 
          // Hiding elements in the error list in conjunction with the ratting 
 
          scope.hideByFilter = 0;

          scope.$on('hideByFilter', function(event, data) { 
              scope.hideByFilter = errorImpactToInt(data.hide);
          });

          scope.filterErrorListByRatting = function(error){
             if(scope.hideByFilter == 0){
                return true;
             } 
             else if(scope.hideByFilter == error.ratting){
                return true;
             }
             return false;
          }





  

      }
    }])



})
 

