# Google Maps & Places API Experiment 🗺 📍

```🚧🚧 **WARNING:** This is old. I was a young padawan. Don't use this. 🚧🚧```

A fun little experiment with the [Google Places & Google Maps libraries](https://developers.google.com/maps/documentation/javascript/places).


#### About
This little app lets you:

1. Search for places from the Google Places API, with a basic search input.
2. Get the results displayed in a nice-ish way.
3. Save those places in a list of 'Favorites.'

#### Details:

- Uses `localStorage` to save your favies. No server code here.
- Uses vanilla JS and CSS. Old school.

#### Setup Notes:

- Chrome blocks geolocation requests when serving your site from file://. I have it running on a local server over here, and I trust you have somebody over there who can do the same!(http://stackoverflow.com/questions/5423938/html-5-geo-location-prompt-in-chrome)
- Add an API key for Google Maps/Places in the `index.html` file, so that it looks something like this `<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=asdfasldkfjasldfjasd=places"></script>`
