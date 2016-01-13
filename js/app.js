// HTML parsed event (other resources not loaded yet)

document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById('searchbutton');
    //console.log(button);
    button.addEventListener('click', searchPlaces);

    
});

// Set up map immediately 

// Get current location using browser's navigator.geolocation API
navigator.geolocation.getCurrentPosition(locationFound, error);

var map;
var service; 

// Success retrieving location
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
            zoom: 14
        })
        
       
        
        marker = new google.maps.Marker({
                map: map,
                position: currentLocation,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                animation: google.maps.Animation.DROP
        })
        
}

// Error retrieving location
function error(err) {
    console.log('error', err.code);
    if (err.code == 1 ) {
        alert('Please enable location services in order to use this app! Also note that Chrome will block geolocation services automatically if serving this site from file://');
    }
}

    
function searchPlaces() {
       
    var infoWindow;
    var userInput = document.getElementById('searchinput').value;
    //console.log(userInput);
  
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
                console.log(results[i]);
            }
          }
        }
        
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var placeId = place.place_id;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            
            google.maps.event.addListener(marker, 'click', function() {

                // Grab all the relevant details about the clicked place
                var request = {
                    placeId: placeId
                }
                service.getDetails(request, callback);
                function callback(loc, stat) {
                    // loc contains all the relevant data about the clicked place
                    console.log(loc, status);
                    
                    // Pull out left side modal and populate with info 
                
                    var pane = document.getElementById('info-pane');
                    pane.style.webkitTransform = 'translate3d(0, 0, 0)';
                    pane.style.transform = 'translate3d(0, 0, 0)';


                    if (place.photos) {
                        var img = document.getElementById('loc-image');
                        img.src = place.photos[0].getUrl({ 'maxWidth': 3500, 'maxHeight': 3500 });
                        console.log(place.photos[0].getUrl({ 'maxWidth': 3500, 'maxHeight': 3500 }));
                    }

                    console.log(place.formatted_phone_number, place.website);

                    var title = document.getElementById('title');
                    var website = document.getElementById('website');
                    var address = document.getElementById('address');
                    var phone = document.getElementById('phone');
                    var description = document.getElementById('description'); 

                    title.innerHTML = loc.name;
                    website.href = loc.website;
                    website.innerHTML = loc.website;
                    address.innerHTML = loc.formatted_address;
                    phone.innerHTML = loc.formatted_phone_number;
                    
                    
                };

                
                


                // Set the infoWindow (above element) to show name of place
                infoWindow.setContent(place.name);
                infoWindow.open(map, this);
              });
        
        }
        

    
}





