// Create a map object
var myMap = L.map("map", {
  center: [48.86, 2.35],
  zoom: 2
});

// Add a tile layer to the map
L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiZ2lvcmdpYTg4IiwiYSI6ImNqaGI3dXczZjB0cWczMG1mcXE2N3Q1dW4ifQ." +
      "dCT5tvVqZhHaUgdpRkHaJw"
	).addTo(myMap);
	
// Grabbing the data with d3..
d3.json("/bombed_locations", function(error, response) {

		var bombarded_locations = response

		console.log(bombarded_locations);

		for (var i = 0; i < bombarded_locations.length; i++) {
			L.marker(bombarded_locations[i].coordinates)
				.bindPopup(bombarded_locations[i].location_name)
				.addTo(myMap);
	};

});

