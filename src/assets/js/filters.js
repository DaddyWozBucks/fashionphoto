angular.module('sportium.filters', [])
.filter('OWMIcon', function() {
    return function(input) {
      return "http://openweathermap.org/img/w/"+ input +".png"
    }
})
.filter('kelvinFormat', function() {
    return function(input, key) {
      var temp;
      if (key == "C") {
        temp = Math.floor(input - 273.15);
        return temp + " " + key
      }else if (key == "F"){
        temp = Math.floor(input * 9/5 - 459.67);
        return temp + " " + key
      }

    }
})
.filter('capitalise', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.filter('kelvin', function() {
    return function(input, key) {
      var temp;
      if (key == "C") {
        temp = Math.floor(input - 273.15);
        return temp
      }else if (key == "F"){
        temp = Math.floor(input * 9/5 - 459.67);
        return temp
      }

    }
})
// Filters for converting raw values from OWM API
.filter('kph', function() {
    return function(input) {
    var speed = Math.floor(input * 3600/ 1000);
    return speed + " kph";
    }
})
