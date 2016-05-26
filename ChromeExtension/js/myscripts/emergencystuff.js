 .directive("errorsOnDisplay", ['filterFilter', function($filter) {
  		return function (scope, element, attrs) {
    			var errorsOnDisplay = element //.children();
    			for(i = 0; i < errorsOnDisplay.length; i++){
      		  	errorsOnDisplay.eq(i).css("background-color", "red");
    			}

          //console.log(angular.element(element).hasClass('errorContainer'))
          //console.log(angular.element(element).find("#error1"))
          // var maybe = $filter(scope.errorData, {ratting: 4}); 
          // angular.forEach(maybe, function(value, key) {
          //     console.log(value)
          // }), 

          scope.errorData = _errors;

          scope.displayType = function(description){
              for(var i = 0; i< scope.errorData.length; i++){
                if(scope.errorData[i].description == description){
                    console.log('??')
                    angular.element(element).getElementsByClassName('error' + i)
                }
              }
          }
  		}
    }])