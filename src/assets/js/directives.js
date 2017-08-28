angular.module('sportium.directives',[])
.directive('tagEnter', function () {
  return function(scope, element, attrs) {

     element.bind("keydown keypress", function(event) {
         var keyCode = event.which || event.keyCode;

         // If enter key is pressed
         if (keyCode === 13) {
             scope.$apply(function() {
                     // Evaluate the expression
                 scope.$eval(attrs.dlEnterKey);
             });

             event.preventDefault();
         }
     });
   }
})
.directive('threeKeys', function () {
    return function (scope, element, attrs) {
        var numKeysPress=0;
        element.bind("keydown keypress", function (event) {   
                 numKeysPress++;
                     if(numKeysPress>=3){
                        scope.$apply(function (){
                            scope.$eval(attrs.myOnKeyDownCall);
                        });
                        event.preventDefault();
                      }
                });
    };
})
.directive('myAutocomplete', function() {
    return {
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '=',
            address1: "=",
            city: "=",
            state: "=",
            country: "=",
            zip: '=',
        },
        template: '<input class="form-control" type="text" data-tap-disabled>',
        link: function(scope, element, attrs, model) {
            var options = {
                // types: [],
                // componentRestrictions: {}
            };    

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                scope.$apply(function() {
                    var place = autocomplete.getPlace();
                    var components = place.address_components;  // from Google API place object   

                    scope.address1 = components[0].short_name + " " + components[1].short_name;
                    scope.city = components[3].short_name;
                    scope.state = components[5].short_name;
                    scope.country = components[6].long_name;
                    scope.zip = components[7].short_name;

                    model.$setViewValue(element.val());   
                });
            });
        }
    }
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
})

.directive('disabletap', ['$timeout', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('type-selector').blur();
        });
       // container2 = document.getElementsByClassName('originput');
       //  // disable ionic data tab
       //  angular.element(container2).attr('data-tap-disabled', 'true');
       //  // leave input field if google-address-entry is selected
       //  angular.element(container2).on("click", function(){
       //      document.getElementById('type-selector').blur();
       //  });

      },500);

    }
  };
}])
.directive('onLongPress', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attrs) {
            $elm.bind('touchstart', function(evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                $timeout(function() {
                    if ($scope.longPress) {
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function() {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);
            });

            $elm.bind('touchend', function(evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;
                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {
                    $scope.$apply(function() {
                        $scope.$eval($attrs.onTouchEnd)
                    });
                }
            });
        }
    };
}])
.directive('myDirective', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'         },
      
        templateUrl: 'mytemplate.html',
        controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { } //DOM manipulation
    }
})
.directive('ngDrag', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      // element.css({
      //  position: 'relative',
      //  border: '1px solid red',
      //  backgroundColor: 'lightgrey',
      //  cursor: 'pointer'
      // });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}]);
