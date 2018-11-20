var tilegrid = ol.tilegrid.createXYZ({tileSize: 512, maxZoom: 14});





function get_url_js(){
	//return "<?php echo get_url(); ?>"
	console.log('https://maps.tilehosting.com/data/v3/'+10+'/'+1+'/'+0+'.pbf?key=' + apiKey);
	return 'https://maps.tilehosting.com/data/v3/{z}/{x}/{y}.pbf?key=' + apiKey;
	
}


/*$.ajax({url: 'https://maps.tilehosting.com/data/v3/'+1+'/'+1+'/'+0+'.pbf?key=' + apiKey, responseType : 'arraybuffer', success: function(result){
		var geojson = geobuf.decode(new Pbf(result));
        //console.log(geojson);
}});*/
var layer = new ol.layer.VectorTile({
  source: new ol.source.VectorTile({
    attributions: '© <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
      '© <a href="http://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
    format: new ol.format.MVT(),
    tileGrid: tilegrid,
    tilePixelRatio: 8,
    url: get_url_js(),
	renderMode:'vector'
  })
});




var view = new ol.View({
  center: [935495.605 , 6276032.261],//[-10654711.29 , 4451686.97],
  //resolution: 2445,
  //maxResolution: 78271.51696402048,
  zoom : 16,
  minZoom: 1,
  maxZoom: 22
});

var map = new ol.Map({
  target: 'map',
  interactions: ol.interaction.defaults().extend([
          new ol.interaction.DragRotateAndZoom()
  ]),
  view: view,
  loadTilesWhileAnimating: true
});
var style = 'https://maps.tilehosting.com/styles/basic/style.json?key=' + apiKey;
$.getJSON(style, function(response) {

    olms.applyStyle(layer,response, 'openmaptiles').then(function() {
      map.addLayer(layer);
    });
});

var wms = new ol.layer.Tile({
  extent: [-13884991, 2870341, -7455066, 6338219],
  zIndex :0,
  source: new ol.source.TileWMS({
	url: 'https://ahocevar.com/geoserver/wms',
	params: {'LAYERS': 'topp:states', 'TILED': true},
	serverType: 'geoserver'
  })
});

map.addLayer(wms);

var geojsonObject = {

	  'type': 'FeatureCollection',
	  'features': [{
		  'type' : 'Feature',	
		  'geometry': {
			'type': 'LineString',
			'coordinates': [[4e6, -2e6], [8e6, 2e6]]
		  },
		  'properties' : {
			  'bearings' : []
		  }
		}
	   ]

};
	
	
function toDegrees (angle) {
	  return angle * (180 / Math.PI);
	}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}

const positions = new ol.geom.LineString([], /** @type {module:ol/geom/GeometryLayout} */ ('XYM'));


var myLocation = new ol.Feature({
	type: 'geolocation',
	geometry: new ol.geom.Point([935495.605 , 6276032.261])
});

var routeLayer;
function getRoute(){
	
	var a = document.getElementById('search1').value;
	var b = document.getElementById('search2').value;
	
	var lat1,lon1,lat2,lon2;
	if (a != undefined && b != undefined){
		
		$.getJSON("https://geocoder.api.here.com/6.2/geocode.json?searchtext="+a+"&app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8", function (response){
			//console.log(response.Response.View[0].Result[0].Location);
			lat1 = response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
			lon1 = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
			console.log(lat1,lon1);
		
		
		$.getJSON("https://geocoder.api.here.com/6.2/geocode.json?searchtext="+b+"&app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8", function (response){
			//console.log(response.Response.View[0].Result[0].Location);
			lat2 = response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
			lon2 = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
			console.log(lat2,lon2);
			alert("2nd");
		



$.getJSON("http://www.yournavigation.org/api/1.0/gosmore.php?format=geojson&flat="+lat1+"&flon="+lon1+"&tlat="+lat2+"&tlon="+lon2+"&v=motorcar&fast=1&instructions=1", function (response){
	console.log(response);
	alert("in Your");
	//var route = response.routes;
	//console.log(response.coordinates);
	
	var coords = response.coordinates;
	var projCoords = [];
	
	
	for (var i=0; i<coords.length; i++){
		projCoords.push(ol.proj.transform(coords[i], 'EPSG:4326', 'EPSG:3857'));
	}
	console.log(projCoords);
	var newCoords = [];
	
	var lat1,lat2,long1,long2,y,x,brng;
	var bearArray=[];
	for (var i=0; i<coords.length-1 ; i++){
		//console.log(coords[i]);
		lat1 = toRadians(coords[i][1]); long1 = toRadians(coords[i][0]);
		lat2 = toRadians(coords[i+1][1]); long2 = toRadians(coords[i+1][0]);
		
		
		
		y = Math.sin(long2-long1) * Math.cos(lat2);
		x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1);
		brng = Math.atan2(y, x);
		
/*			  var line = turf.lineString([[coords[i][0],coords[i][1]], [coords[i+1][0], coords[i+1][1]]]);
			 
			  var options = {units: 'kilometers'};
		
			  var along = turf.along(line, 0.001, options);
			  //console.log(along);
			  var subPoint = along.geometry.coordinates;
			  var dist = turf.distance(subPoint,[coords[i+1][0], coords[i+1][1]],options);
			  //console.log(subPoint,[coords[i+1][0], coords[i+1][1]]);
			  projCoords.splice(i+1,0,ol.proj.transform(subPoint, 'EPSG:4326', 'EPSG:3857'));
			  var j = i+1;
			  while(dist>0.001){
				  j= j+1;
				  var line = turf.lineString([subPoint, [coords[i+1][0], coords[i+1][1]]]);
	
				  var options = {units: 'kilometers'};
			
				  var along = turf.along(line, 0.001, options);
				  //console.log(along);
				  var subPoint = along.geometry.coordinates;
				  var dist = turf.distance(subPoint,[coords[i+1][0], coords[i+1][1]], options);
				  console.log(subPoint,j);
				  projCoords.splice(j,0,ol.proj.transform(subPoint, 'EPSG:4326', 'EPSG:3857'));
			  }
			  
			  var projPoint = ol.proj.transform(subPoint,"EPSG:4326","EPSG:3857");
			  console.log(ol.proj.transform(along.geometry.coordinates,"EPSG:4326","EPSG:3857"));
			  
*/

		
		//console.log(brng);
		bearArray.push(brng);
		
		positions.appendCoordinate([projCoords[i][0], projCoords[i][1], brng]);
	}
	console.log(projCoords);

	
	geojsonObject.features[0].geometry.coordinates = projCoords;
	geojsonObject.features[0].properties.bearings = bearArray;
	//console.log(geojsonObject);
	//console.log(positions.getCoordinates());
	
	
	var desc = response.properties.description;
	var desc_list = desc.split("<br>");
	//console.log(desc_list);
	var list = document.createElement('ul');
	for (var i = 0; i<desc_list.length; i++){
		var listItem = document.createElement('li');
		listItem.appendChild(document.createTextNode(desc_list[i]));
		listItem.style.borderBottom = "solid grey";
		list.appendChild(listItem);
		
	}
	list.style.listStyle = 'decimal border-bottom:1px solid blue';
	
	var dir = document.getElementById('directions');
	//dir.innerHTML = '<html>'+response.properties.description+'</html>'
	dir.appendChild(list);
	
	
	
	var routeCoords = projCoords;
    var routeLength = coords.length;
	//console.log(coords);
	var geoMarker = new ol.Feature({
        type: 'geoMarker',
        geometry: new ol.geom.Point(routeCoords[0])
    });
	
	var startMarker = new ol.Feature({
		type: 'icon',
		geometry: new ol.geom.Point(routeCoords[0])
	});
	var endMarker = new ol.Feature({
		type: 'icon',
		geometry: new ol.geom.Point(routeCoords[routeLength - 1])
	});


    var styles = {
		/*'LineString' : new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 4
          })
        }),*/
        'icon': new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'resources/icon.png'
          })
        }),
		'geoMarker': new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: 'resources/geolocation_marker_heading.png'
			})
		})
	};
	
	var animating = false;
    var speed=2, now;
    //var speedInput = document.getElementById('speed');
    var startButton = document.getElementById('start-animation');

    /*var vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [routeFeature, geoMarker, startMarker, endMarker]
        }),
        style: function(feature) {
          // hide geoMarker if animation is active
          if (animating && feature.get('type') === 'geoMarker') {
            return null;
          }
          return styles[feature.get('type')];
        }
    });*/
	//alert("ok");
	
	var routeSource = new ol.source.Vector({
		//projection :'EPSG:3857',
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });
	routeSource.addFeatures([startMarker,geoMarker,endMarker]);
	if (routeLayer != undefined){
		routeLayer.getSource().clear();
	}
	routeLayer = new ol.layer.Vector({
        source: routeSource,
        renderBuffer: 1366,
		zIndex :1,
        style: 	function(feature) {
          // hide geoMarker if animation is active
		  if (feature.getGeometry().getType()=='LineString'){
			  return new ol.style.Style({
				  stroke: new ol.style.Stroke({
					color: 'blue',
					width: 4
				  })
				});
		  }
          if (animating && feature.get('type') === 'geoMarker') {
            return null;
          }
          return styles[feature.get('type')];
        }
      });
	/*var features = routeLayer.getSource().getFeatures();
	features.forEach(function(feature) {
	   feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
	   
	});*/
	
	map.addLayer(routeLayer);
	
	/*map.getLayers().forEach(function (layer) {
		console.log(layer);
		var extent = routeLayer.getSource().getExtent();
		if (routeLayer != undefined){
			//map.getView().fit(extent, map.getSize());
		}
	});*/
	


	var moveFeature = function(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;

        if (animating) {
          var elapsedTime = frameState.time - now;
          // here the trick to increase speed is to jump some indexes
          // on lineString coordinates
          var index = Math.round(speed * elapsedTime / 1000);

          if (index >= routeLength) {
            stopAnimation(true);
            return;
		  }

		  var bear = geojsonObject.features[0].properties.bearings[index];
		  //map.getView().setCenter(routeCoords[index]);
		    if (bear <=0){
			  bear = bear*-1;
			}
			else{
				bear = bear*-1
			}
			
			//console.log(index);
			  

		  
		  //map.getView().setRotation(bear);
		  if (index==routeCoords.length-1)
			  return;
		  map.setView(new ol.View({
				//extent : initialExtent.extent,
				zoom : 20,
				center : routeCoords[index],
				rotation : bear
				
		  }));
		  
		  var currentPoint = new ol.geom.Point(routeCoords[index]);
		  var feature = new ol.Feature(currentPoint);
	      vectorContext.drawFeature(feature, styles.geoMarker);
          
        }
        // tell OpenLayers to continue the postcompose animation
        map.render();
      };
	  
	  
	  
	    // recenters the view by putting the given coordinates at 3/4 from the top or
		// the screen
		function getCenterWithHeading(position, rotation, resolution) {
		  const size = map.getSize();
		  const height = size[1];

		  return [
			position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
			position[1] + Math.cos(rotation) * height * resolution * 1 / 4
		  ];
		}

		
	  

      function startAnimation() {
        if (animating) {
          stopAnimation(false);
        } else {
          animating = true;
          now = new Date().getTime();
          //speed = speedInput.value;
          startButton.textContent = 'Cancel Navigation';
          // hide geoMarker
          geoMarker.setStyle(null);
          // just in case you pan somewhere else
         // map.getView().setCenter(center);
          map.on('postcompose', moveFeature);
          map.render();
        }
      }


      /**
       * @param {boolean} ended end of animation.
       */
      function stopAnimation(ended) {
        animating = false;
        startButton.textContent = 'Start Navigation';

        // if animation cancelled set the marker at the beginning
        var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
        /** @type {module:ol/geom/Point~Point} */ (geoMarker.getGeometry()).setCoordinates(coord);
        //remove listener
        map.un('postcompose', moveFeature);
      }

      startButton.addEventListener('click', startAnimation, false);
	
	
});
});

		});
}
	} ///end of getRoute() function
	
/*var autocomplete = new kt.OsmNamesAutocomplete(
          'search', 'https://geocoder.tilehosting.com/', 'mO3jQINgBlfAmR5zEWWk');
      autocomplete.registerCallback(function(item) {
        alert(JSON.stringify(item, ' ', 2));
});*/



function findAddress(){
	var address = document.getElementById('address').value;
	console.log(address);
	if (address != undefined){
		
		$.getJSON("https://geocoder.api.here.com/6.2/geocode.json?searchtext="+address+"&app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8", function (response){
			console.log(response.Response.View[0].Result[0].Location);
			var lat = response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
			var lon = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
			alert(response.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
		});
	}
}
var feature;
var placesSource = new ol.source.Vector({});

var placesLayer = new ol.layer.Vector({
	source : placesSource,
	renderBuffer: 1366,
	zIndex :1,
	style : function(feature) {
				if (feature.get('type') === 'geolocation') {
					return new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 1],
							src: 'resources/geolocation_marker.png'
						})
					})
				}
				//if(feature.get('type') === 'place'){
				  return new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: 'resources/places.png'
					})
				  })
				//}
			  
			}
	
});
map.addLayer(placesLayer);
function findPlaces(){
	console.log(myLocation.getGeometry().getCoordinates()[0]);
	placesLayer.getSource().clear();
	placesSource.addFeature(myLocation);
	var query = document.getElementById('address').value;
	//alert(query);
	
	var coords4326 = ol.proj.transform([myLocation.getGeometry().getCoordinates()[0],myLocation.getGeometry().getCoordinates()[1]], 'EPSG:3857', 'EPSG:4326');

	if (myLocation != undefined && query !=undefined){
		
		$.getJSON("https://places.cit.api.here.com/places/v1/discover/search?at="+coords4326[1]+","+coords4326[0]+"&q="+query+"&tf=plain&app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8", function (response){
			console.log(response.results.items);
			var items = response.results.items;
			for (var z = 0; z<items.length; z++){
				feature = new ol.Feature({
					type : 'place',
					geometry: new ol.geom.Point(ol.proj.transform([items[z].position[1], items[z].position[0]], 'EPSG:4326', 'EPSG:3857')),
				    name: items[z].title,
					openingHours: items[z].openingHours
				});
				placesSource.addFeature(feature);
			}
			console.log(placesSource.getFeatures());
			//var lat = response.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
			//var lon = response.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
			//alert(response.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
			//alert(response.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
		});
	}
}

var i=0;
function resetMap(){
		map.setView(new ol.View({
			//extent : initialExtent.extent,
			zoom : 16,
			center : [935495.605, 6276032.261]
		}));
		i=0;
}

function moveNext(){
	/*for (var i = 0; i<geojsonObject.geometry.coordinates.length; i++){
	}*/
	
	map.getView().setRotation(0);
	var bear = geojsonObject.features[0].properties.bearings[i];
	console.log(toDegrees(bear));
	if (bear <=0){
		bear = bear*-1;
	}
	else{
		bear = bear*-1
	}
	map.setView(new ol.View({
		//extent : initialExtent.extent,
		zoom : 21,
		center : ol.proj.transform(geojsonObject.features[0].geometry.coordinates[i],"EPSG:4326","EPSG:3857"),
		//rotation : bear
		
	}));

	map.getView().setRotation(bear);
	
	
	i = i+1;
}



function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  console.log(arr.length);
  /*execute a function when someone writes in the text field:*/
  //inp.addEventListener("input", function(e) {
	  
      var a, b, i, val = inp.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
	  
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", inp.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
	  
      /*append the DIV element as a child of the autocomplete container:*/
      inp.parentNode.appendChild(a);
	  console.log(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
		console.log(arr.length);
        /*check if the item starts with the same letters as the text field value:*/
       // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			//alert();
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
         /* b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
			 // alert($(this).attr('id'));
			  //console.log(inp.getElementsByTagName("input"));
              //inp.value = $(this).val;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              //closeAllLists();
          //});

			$(b).click(function() {

				inp.value = $(this).text();
				closeAllLists();
			});

          a.appendChild(b);
        //}
      }
  //});
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/

var source = document.getElementById("search1");
source.addEventListener("input", function(e) {
	var query = this.value;
	var searchResults = [];
	$.getJSON("http://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8&query="+query+"&beginHighlight=<b>&endHighlight=</b>", function (response){
		//console.log(response);
		for (var i=0; i<response.suggestions.length ; i++){
			searchResults.push(response.suggestions[i].label);
		}
		
		//console.log(searchResults);
		autocomplete(document.getElementById("search1"), searchResults);
	});
});

var destination = document.getElementById("search2");
destination.addEventListener("input", function(e) {
	var query = this.value;
	var searchResults = [];
	$.getJSON("http://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=Z6WnGSltuUkvcYhC6LMA&app_code=QCY-bXblhuMnQyJrE_ASSg&gen=8&query="+query+"&beginHighlight=<b>&endHighlight=</b>", function (response){
		//console.log(response);
		for (var i=0; i<response.suggestions.length ; i++){
			searchResults.push(response.suggestions[i].label);
		}
		
		//console.log(searchResults);
		autocomplete(document.getElementById("search2"), searchResults);
	});
});
//autocomplete(document.getElementById("search2"), countries);