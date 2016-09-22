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


// //In attempt to run this app to pages w/ angularjs already
// var chromeAngular = $.extend(true, {}, angular);

//Here we run geterrors.js now we'll have the variables we need.
var _errors;
console.log('Catching Errors...')

initialize(function(){
  //All of the errors
  _errors = getErrors();
  console.log("Errors Caught");

  // The HTML for the "Controller" of the errors
  var controllerView = chrome.extension.getURL('views/controller.html');

  //This code is for appending the controller on the side of any website
  var width = '250px';
  var html;
  if (document.documentElement) {
    html = $(document.documentElement); //just drop $ wrapper if no jQuery
  } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
    html = $(document.getElementsByTagName('html')[0]);
  } else if ($('html').length > -1) {//drop this branch if no jQuery
    html = $('html');
  } else {
    alert('no html tag retrieved...!');
    throw 'no html tag retrieved son.';
  }

  //position
  if (html.css('position') === 'static') { //or //or getComputedStyle(html).position
    html.css('position', 'relative');//or use .style or setAttribute
  }

  //top (or right, left, or bottom) offset
  var currentTop = html.css('left');//or getComputedStyle(html).top
  if (currentTop === 'auto') {
    currentTop = 0;
  } else {
    currentTop = parseFloat($('html').css('left')); //parseFloat removes any 'px' and returns a number type
  }
  html.css(
    'left',     //make sure we're -adding- to any existing values
    currentTop + parseFloat(width) + 'px'
  );



  $.get(controllerView, function(data) {

    var angularExists = $('[ng-app],[data-ng-app],[class*=ng-app], [ng-scope]').length > 0;
    console.log('Has Angular: ' + angularExists);

    // if(angularExists) {
    //   console.log('angular already exists.')
    //   $($.parseHTML(data)).appendTo('body');
    //   // var wrapper = '<div ng-non-bindable> </div>';
    //   // $('#angularJStest').wrap(wrapper);
    //   // $('a[errors-on-display]').wrap(wrapper);
    //   // Insert elements into the DOM
    //   $('#angularJStest, a[errors-on-display]').append(appRoot);
    //   window.name = '';
    //   angular.bootstrap( appRoot, ['webAccessibilityApp']);
    // } 
    // else{
    //   $($.parseHTML(data)).appendTo('body');
    //   window.name = '';   // To allow `bootstrap()` to continue normally
    //   angular.bootstrap(document, ['webAccessibilityApp'])
    // }

    $($.parseHTML(data)).appendTo('body');
    //window.name = '';   // To allow `bootstrap()` to continue normally
    //chromeAngular.bootstrap(document, ['webAccessibilityApp'])
    angular.bootstrap(document, ['webAccessibilityApp'])


    //This is jQueryUI code, completely seperated from AngularJS. It's for styling the error Controller
    $( "#accordionFilters > div" ).accordion({
      header: "h3",
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

    $('#tabEx').click(function() {
      $(this).next().toggle('slow');
      return false;
    }).next().hide();

    
    $('#individualInfoPanel').accordion({ active: 0 });
  });



/**
 * +--------------------------------------------------------------------+

    
    This is the start of the AngularJS code


 * +--------------------------------------------------------------------+
 *
 */


  angular.module('webAccessibilityApp', ['angular.filter'])
  //chromeAngular.module('webAccessibilityApp', ['chromeAngular.filter'])
    //This is the main controller
    .controller('ChromeExtensionCtrl', ['$scope', '$filter', function($scope, $filter) {


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
        if($scope.selectedIndexRatting == $index){
           $scope.selectedIndexRatting = -1; 
         }
        else{
          $scope.selectedIndexRatting = $index; 
        }
      };

     
      //Communicate with errorsOnDisplay and change the error classes on-screen
      //Unless allErrors
      $scope.filterErrorsByRatting = function(value, currentIndex){ 
        if($scope.selectedIndexRatting == currentIndex){
            //Restart everything in types...
            $scope.$broadcast('displayErrorByRatting', 'null');
            //Also Restart Everything in errors in controller
            $scope.currentRattingFilter = null;
        }
        else{
          $scope.$broadcast('displayErrorByRatting', value);
          $scope.currentRattingFilter = value;

        }
      }


      $scope.getTypeLetter = function(index){
          var currentDesc = $scope.errorData[index].description;      
          for (var i = 0; i < $scope.listOfErrorDescriptions.length; i++) {
                if(currentDesc == $scope.listOfErrorDescriptions[i].description){
                  var typeLetter = String.fromCharCode(65 + i);
                }
             }
          return typeLetter;
      }



      $scope.currentTypeFilter = null;
      $scope.currentRattingFilter = null;
      $scope.manualCount = 0;


      $scope.colorIndicator = function(impact){

        switch (impact) {
          case 1:
            return "Minor_Indicator";
          case 2:
            return  "Moderate_Indicator";
          case 3:
            return  "Serious_Indicator";
          case 4:
            return "Critical_Indicator";
          default:
            return  "None";
        }

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
          controller: 'ChromeExtensionCtrl',
          //Check scope and $broadcast and $on
          replace: true,
          transclude: true,
          template: '<span style = "position: relative" ng-class= "defaultClass">' +
                    '<ng-transclude></ng-transclude>' +
                    '<a name = error{{value}} ng-click="onClick($event)" ng-class = "icon" value="{{value}}">{{iconValue()}}</a>' +
                    '</span>',

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
              scope.$on('showIndividualErrorOnScreen',  function(event, data, alreadyExists){
                 var errorIndex = attrs.value;
                 var impact = scope.errorData[errorIndex].ratting;
                 var errorRatting = errorIntToImpact(impact);


                 // Remove the previous individual error's class if it is selected
                 if(element.hasClass("individualError")){
                    getErrorClass(impact);
                 }

                 if(attrs.value == data){
                    //element.addClass('individualError')
                    if(alreadyExists){
                      getErrorClass(impact);
                    }else{
                      scope.defaultClass = "individualError";
                    }
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
                
            
                if(ratting == 'noFilter' || ratting == 'allErrors' || errorRatting == ratting){
                    //need to check the type filter
                    // var errorDesc = scope.errorData[errorIndex].description; 
                    // if(scope.selectedIndexFilter != null && scope.selectedIndexFilter != -1){
                    //   if(errorDesc == scope.listOfErrorDescriptions[scope.selectedIndexFilter].description){
                    //       getErrorClass(impact);
                    //   }
                    // }else{
                    //       getErrorClass(impact);
                    // }          
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
 
    .directive("errorsInController", ['$rootScope', '$filter', 
      '$location', '$anchorScroll', function($rootScope, $filter, $location, $anchorScroll) {

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
              scope.gotoBottom();
              scope.showIndividualInformation(data.errorIndex)
          });


          function buildIndividualErrorInfo(description, htmlSnippet, solution, moreInfo){
              scope.description = description;
              scope.htmlSnippet = htmlSnippet;
              scope.solution = solution;
              scope.moreInfo = moreInfo;
          }


          //Css
          scope.selectedIndexIndividual = -1; 
          scope.showIndividualInformation = function ($index) {
       
             if(scope.selectedIndexIndividual == $index){
                 scope.selectedIndexIndividual = -1; 
                 scope.individualError = null;
                 $rootScope.$broadcast('showIndividualErrorOnScreen', index, true);
             }
             else{
                 scope.selectedIndexIndividual = $index;
                 scope.individualError =  scope.errorData[$index];
                 $rootScope.$broadcast('showIndividualErrorOnScreen', index, false);
             }

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

          scope.displayType = function(description, filterIndex){
              //Communicate this with the errors-on-display directive via broadcast
              if(scope.selectedIndexFilter == filterIndex){
                  //console.log('Restarting type filter')
                  $rootScope.$broadcast('filterByType', {
                        data: 'no'
                  });
                  scope.hideByType = null;
                  //scope.selectedIndexFilter = -1; 
              }

              else{
                  $rootScope.$broadcast('filterByType', {
                        data: description
                  });
                  scope.hideByType = description;

              }
          }

          //Css
          scope.selectedIndexFilter = -1; 
          scope.filterClicked = function ($index){
            if(scope.selectedIndexFilter == $index){
              scope.selectedIndexFilter = -1; 
              scope.currentTypeFilter = null;
            }
            else{
              scope.selectedIndexFilter = $index;
              scope.currentTypeFilter = String.fromCharCode(65 + $index);
            }
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


          //Due to the way errors were filtered, we'll have to manually count the errors...

          scope.totalCount =  function (){
            var x, y, z = [];
        
            if(scope.selectedIndexRatting == -1 && scope.selectedIndexFilter == -1)
              return scope.errorData.length;

            // 
            if(scope.selectedIndexRatting != -1 && scope.selectedIndexFilter == -1){
                x = $filter('filter')(scope.errorData, {
                  ratting: scope.selectedIndexRatting } 
                );
                if(scope.selectedIndexRatting == 0){
                  return scope.errorData.length;
                }
                  return x.length;
                
            } 

            
            if ( (scope.selectedIndexRatting == -1 || scope.selectedIndexRatting == 0)  && scope.selectedIndexFilter != -1 ){
                y = $filter('filter')(scope.errorData, {
                  description: scope.listOfErrorDescriptions[scope.selectedIndexFilter].description}
                );
               
                return y.length;
            } 

            else{

              z = $filter('filter')(scope.errorData,
                {ratting: scope.selectedIndexRatting, 
                 description: scope.listOfErrorDescriptions[scope.selectedIndexFilter].description}
              );
             
               return z.length;
            }
          }


          scope.gotoBottom = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            var old = $location.hash();
            $location.hash('individualInfoPanel');
            // call $anchorScroll()
            $anchorScroll();
            $location.hash(old);

          };
            
              

      }
    }])


  



})
 

