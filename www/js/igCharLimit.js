angular.module('igCharLimit', []).directive('charLimit', function(){
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes){
      var limit = $attributes.charLimit;

      $element.bind('keypress', function(event){
        // Once the limit has been met or exceeded, prevent all keypresses from working
        if ($element.val().length >= limit){
          // Except backspace
          if (event.keyCode != 8){
            event.preventDefault();
          }
        }
      });
    }
  };
});