// HTML parsed event (other resources not loaded yet)

document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById('searchbutton');
    //console.log(button);
    button.addEventListener('click', searchPlaces);
    
    var save = document.getElementById('savebutton');
    save.addEventListener('click', savePlace);

    var show = document.getElementById('favoritesbutton');
    show.addEventListener('click', showFavorites);
    
});

// Set up map immediately 

// Get current location using browser's navigator.geolocation API
navigator.geolocation.getCurrentPosition(locationFound, error);

var map;
var service; 
var markers = [];


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
        
       
        
        specialMarker = new google.maps.Marker({
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
    
    // Clear current markers 
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
       
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
    
}

var favorites = JSON.parse(localStorage['favorites']);

// Save place to favorites 
function savePlace() {
    
    // if the item is already in favorites, remove it, else add it
    
    var isFavorited = false;
    var index;
    
    for (var i = 0; i < favorites.length; i++ ) {
        if (favorites[i] == currentPlaceId) {
            isFavorited = true;
            index = i;
        } else {
        }
        
    }
    
    if ( isFavorited == true ) {
        console.log('removing');
        favorites.splice(index, 1);
        localStorage['favorites'] = JSON.stringify(favorites);
        
        showSaveButton();
        
    } else {
        console.log('adding');
        favorites.push(currentPlaceId);
        console.log(favorites);
        // Can't store arrays to localStorage, so stringify and then parse upon retrieval 
        localStorage['favorites'] = JSON.stringify(favorites);
    
        console.log(localStorage);
        
        showRemoveButton();
    }
    

}


// Remove place from favorites
function removePlace() {
    favorites.indexOf(currentPlaceId);
    console.log(index);
}


// When changes are made to favorites array, push them to the DOM
function showFavorites() {
        
    // Clear current markers 
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    
    if ( favorites.length == 0  ) {
        console.log('no favorites to show');
    } else {
        

        var favs = JSON.parse(localStorage['favorites']);
        console.log(favs);

        service = new google.maps.places.PlacesService(map);

        // For each favorite in our array, use the placeId to put the marker back on the map
        for ( var i = 0; i < favs.length; i++) {

            var request = {
                placeId: favs[i]
            }

            service.getDetails(request, callback);

            function callback(place, status) {
                createMarker(place);
            } 

        }
        
    }
    
        
}

// Store markers we add here, so we can remove them again on next search


// Show our locations on the map, with all relevant interactivity 
function createMarker(place) {
    
    var placeLoc = place.geometry.location;
            var placeId = place.place_id;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
                
            markers.push(marker);
    
            google.maps.event.addListener(marker, 'click', function() {

                // Grab all the relevant details about the clicked place
                var request = {
                    placeId: placeId
                }
                
                // add placeid to global scope, so we can access it in save function 
                currentPlaceId = placeId;
                
                var isAFavorite = false;
                
                // Check if that placeId is in the localStorage["favorites"] array
                var favs = JSON.parse(localStorage['favorites']);
                for (var i = 0; i < favs.length; i++) {
                    if ( favs[i] == currentPlaceId ) {
                        console.log('this is a favorited place');
                        // Change button out for 'remove' button -- it's already favorited
                        isAFavorite = true;
                    }
                }
                
                if ( isAFavorite == true) {
                    showRemoveButton();
                } else {
                    showSaveButton();
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
                    } else {
                        var img = document.getElementById('loc-image');
                        img.src = '';
                    }

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

                infoWindow = new google.maps.InfoWindow();
                
                // Set the infoWindow (above element) to show name of place
                infoWindow.setContent(place.name);
                infoWindow.open(map, this);
              });
        
        }



function showRemoveButton() {
    var btn = document.getElementById('savebutton');
    btn.style.background = '#FF3B30';
    btn.innerHTML = 'Remove From Favorites';
    
}

function showSaveButton() {
    var btn = document.getElementById('savebutton');
    btn.style.background = '#007AFF';
    btn.innerHTML = 'Save to Favorites';
}
