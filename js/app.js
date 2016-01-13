// HTML parsed event (other resources not loaded yet)

document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById('searchbutton');
    //console.log(button);
    button.addEventListener('click', searchPlaces);

    
});

    
function searchPlaces() {
    // Maps JS
    
    var map;
    var service;    
    var infoWindow;
    var userInput = document.getElementById('searchinput').value;
    //console.log(userInput);
    
    // Get current location using browser's navigator.geolocation API
    navigator.geolocation.getCurrentPosition(locationFound, error);
    
    // Successfully retrieved current location
    function locationFound(pos) {
        var position = pos.coords;
        var latitude = position.latitude;
        var longitude = position.longitude;
        
        // Create a LatLng to be used in google search
        currentLocation = new google.maps.LatLng(latitude, longitude);
        console.log(currentLocation);
        
        // Set up our map
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentLocation, 
            zoom: 10
        })
        
        
        // Options for PlacesService request, includes loc obtained above from browser, plus radius
        var request = {
            location: currentLocation,
            radius: 500, 
            query: userInput
        }
        
        // Creating a PlacesService instance using our map
        service = new google.maps.places.PlacesService(map);
        infoWindow = new google.maps.InfoWindow();

        // Submit request using search results
        service.textSearch(request, callback);
        
        function callback(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }
        
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(place.name);
            infoWindow.open(map, this);
          });
        
        }
        


        
    }

    // Error retrieving location
    function error(err) {
        console.log('error', err.code);
        if (err.code == 1 ) {
            alert('Please enable location services in order to use this app! Also note that Chrome will block geolocation services automatically if serving this site from file://');
        }
    }
    
    

    
}





