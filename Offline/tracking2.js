var map = new ol.Map({
 /* layers: [
    
	new ol.layer.Tile({
      source: new ol.source.OSM()
    })//, osm_points_layer, vectorLayer0, vectorLayer , vectorLayer2//, countries_layer
  ],*/
  target: 'map2d',
  controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }),
  view: new ol.View({
    center: [935495.605 , 6276032.261],
    zoom: 20,
	minZoom: 16,
	maxZoom: 21
  }),
  loadTilesWhileAnimating: true,
});

var initialExtent = {
	extent: map.getView().calculateExtent(map.getSize()),
	zoom : map.getView().getZoom(),
	center : map.getView().getCenter()
	};
console.log(initialExtent);
console.log(map.getView().calculateExtent(map.getSize()));
	
function setZoom(){
		map.getView().setZoom(10);
}

function resetMap(){
		map.setView(new ol.View({
			//extent : initialExtent.extent,
			zoom : 20,
			center : [935495.605, 6276032.261]
		}));
		console.log(map.getView().calculateExtent(map.getSize()));
}

function getCurrentViewParameters(){
	
	console.log("Zoom: "+ map.getView().getZoom());
	//console.log("LookUp: "+ camera.up);
}

var point = new ol.geom.Point([700000, 200000, 00000]);

var iconFeature = new ol.Feature({
  geometry: point
});


var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    src: 'data/geolocation_marker_heading.png'
  }))
});

iconFeature.setStyle(iconStyle);



      var styles = {
		/*'Point': new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				stroke: new ol.style.Stroke({
					color: 'black',
					width: 1
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,255,0,1)'
				})
			})
			
		}),*/
		

        /*'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
          })
        }),
        'MultiLineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
          })
        }),*/
        
        'MultiPolygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 150, 0.1)'
          })
        }),
		'Polygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 150, 0.1)'
          })
        })
        /*'Polygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            lineDash: [4],
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        })*/
      };

      

 /*     var style_simple = new ol.style.Style({
		fill: new ol.style.Fill({
		  color: '#ADD8E6'
		}),
		stroke: new ol.style.Stroke({
		  color: '#880000',
		  width: 1
		})
	  });

  function simpleStyle(feature) {
    return style_simple;
  }
*/

var styleFunction = function(feature){
	return styles[feature.getGeometry().getType()];
};



var vectorSource2 = new ol.source.Vector({
  features: [iconFeature]
});
var imageVectorSource = new ol.source.Vector({
  source: vectorSource2
});
var vectorLayer2 = new ol.layer.Image({
  source: imageVectorSource
});

var countries_source = new ol.source.Vector({
	//projection : 'EPSG:3857',
    url: 'data/geojson/countries.geojson',
	format: new ol.format.GeoJSON()

});

/*var osm_points_source = new ol.source.Vector({
	//projection : 'EPSG:3857',
    url: 'points_no_nulls.geojson',
	format: new ol.format.GeoJSON()

});*/
//countries_source.getFeatures().getGeometry().transform('EPSG:4326', 'EPSG:3857');

var countries_layer = new ol.layer.Vector({
	title : "Countries",
	source : countries_source,
	style: styleFunction	
});


/*var osm_points_layer = new ol.layer.Vector({
	title : "OSM Points",
	source : osm_points_source,
	style: osm_points_styleFunction	
});*/



var features = countries_layer.getSource().getFeatures();
features.forEach(function(feature) {
   feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
});

/*var osm_points_features = osm_points_layer.getSource().getFeatures();
features.forEach(function(feature) {
   feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
});*/


var geometry = new ol.geom.Polygon([
    [ [10.689697265625, -25.0927734375], [34.595947265625, -20.1708984375], [38.814697265625, -35.6396484375],
      [13.502197265625, -39.1552734375], [10.689697265625, -25.0927734375] ]
]);
geometry.transform('EPSG:4326', 'EPSG:3857');

var vectorL = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [new ol.Feature({
            geometry: geometry
        })]
    }),
	style: styleFunction
});








var replacer = function(key, value) {
	if (value.geometry) {
	  var type;
	  var rawType = value.type;
	  var geometry = value.geometry;

	  if (rawType === 1) {
		type = 'MultiPoint';
		if (geometry.length == 1) {
		  type = 'Point';
		  geometry = geometry[0];
		}
	  } else if (rawType === 2) {
		type = 'MultiLineString';
		if (geometry.length == 1) {
		  type = 'LineString';
		  geometry = geometry[0];
		}
	  } else if (rawType === 3) {
		type = 'Polygon';
		if (geometry.length > 1) {
		  type = 'MultiPolygon';
		  geometry = [geometry];
		}
	  }

	  return {
		'type': 'Feature',
		'geometry': {
		  'type': type,
		  'coordinates': geometry
		},
		'properties': value.tags
	  };
	} else {
	  return value;
	}
  };

  var tilePixels = new ol.proj.Projection({
	code: 'TILE_PIXELS',
	units: 'tile-pixels'
  });


  var joined = {
	"type": "FeatureCollection",
	"name": "KARLSRUHE LINES REDUCED",
	"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
	"features": []
  }
   
 
  
  


  //console.log(joined);

  
/*  for (var i=0 ; i < geojson.features.length ; i++){
	  
	  points.features.push(geojson.features[i]);
	  
  }
  
  for (var i=0 ; i < points.features.length ; i++){
	  
	  lines.features.push(points.features[i]);
	  
  }
 
  console.log(lines);*/
 
//var url0 = 'countries.geojson'
$.getJSON('countries.geojson', function(countries) {
    //data is the JSON string

  
  var url = 'lines_ka_reduced_2.geojson';
  $.getJSON('lines_ka_reduced.geojson', function(lines) {
	  
	var url2 = 'points_no_nulls.geojson';
	$.getJSON('points_no_nulls.geojson', function(points) {
		  console.log(points);
	 /* for (var i=0 ; i < lines.features.length ; i++){
	  
		  points.features.push(lines.features[i]);
		  
	  }*/
	

 
	  
	  
	var styleFunction = function(feature, resolution){

		  if (feature.getGeometry().getType() == 'Point' && resolution < map.getView().getResolutionForZoom(18)){
			 var point_style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: 'black',
						width: 1
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255,255,0,1)'
					})
				}),
				text: new ol.style.Text({
						font: '12px',
						text: feature.getProperties().amenity
				})
			  });
			  //console.log(point_style);
				return point_style;
		  }
		  else if ((feature.getGeometry().getType() == 'MultiLineString' || feature.getGeometry().getType() == 'LineString') ){
			  //console.log(resolution);
			  var line_style;
			  
			  if (resolution == map.getView().getResolutionForZoom(16) || resolution == map.getView().getResolutionForZoom(17)){
				  
				  if (feature.getProperties().highway == "motorway" || feature.getProperties().highway == "motorway_link"){
					 
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#7f95b3',
							width: 9,
							strokeLinecap: 'butt',
							strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "trunk" || feature.getProperties().highway == "trunk_link"){
					  
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#88b788',
							width: 9,
							strokeLinecap: 'butt',
							strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line',
							color : 'white'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "primary" || feature.getProperties().highway == "primary_link"){
					
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#cc8e8f',
							width: 7,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				   else if (feature.getProperties().highway == "secondary" || feature.getProperties().highway == "secondary_link"){
					  
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8d5a9',
							width: 5,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "tertiary" || feature.getProperties().highway == "tertiary_link"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8f8ba',
							width: 3,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "residential"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'white',
							width: 2,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "unclassified"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#fefefe',
							width: 4,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  
				  }
				  

			  }
			  else if (resolution == map.getView().getResolutionForZoom(18) || resolution == map.getView().getResolutionForZoom(19)){
				  
				  if (feature.getProperties().highway == "motorway" || feature.getProperties().highway == "motorway_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#7f95b3',
							width: 14,
							strokeLinecap: 'butt',
							strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "trunk" || feature.getProperties().highway == "trunk_link"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#88b788',
							width: 14,
							strokeLinecap: 'butt',
							strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line',
							color : 'white'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "primary" || feature.getProperties().highway == "primary_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#cc8e8f',
							width: 12,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "secondary" || feature.getProperties().highway == "secondary_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8d5a9',
							width: 10,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "tertiary" || feature.getProperties().highway == "tertiary_link"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8f8ba',
							width: 8,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "residential"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'white',
							width: 6,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "service"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#fefefe',
							width: 4,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "unclassified"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#fefefe',
							width: 4,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  /*else if (feature.getProperties().highway == "platform"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'grey',
							width: 1,
							lineDash: 5
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }*/
					  
			  }
			  else if (resolution == map.getView().getResolutionForZoom(20) || resolution == map.getView().getResolutionForZoom(21)){
				  
				  if (feature.getProperties().highway == "motorway" || feature.getProperties().highway == "motorway_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#7f95b3',
							width: 14,
							linecap: 'butt',
							lineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "trunk" || feature.getProperties().highway == "trunk_link"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#88b788',
							width: 14,
							strokeLinecap: 'butt',
							strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line',
							color : 'white'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "primary" || feature.getProperties().highway == "primary_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#cc8e8f',
							width: 12,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "secondary" || feature.getProperties().highway == "secondary_link"){
		
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8d5a9',
							width: 10,
							strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "tertiary" || feature.getProperties().highway == "tertiary_link"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#f8f8ba',
							width: 8,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "residential"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'white',
							width: 6,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "service"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#fefefe',
							width: 4,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else if (feature.getProperties().highway == "unclassified"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: '#fefefe',
							width: 4,
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  /*else if (feature.getProperties().highway == "platform"){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'grey',
							width: 1,
							lineDash: 5
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }*/
				  else if (!feature.getProperties().highway){

					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'grey',
							width: 1,
							//lineDash: 5
							//strokeLinecap: 'round'//,
							//strokelineJoin: 'miter' 
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
				  }
				  else{
					  line_style = new ol.style.Style({
						  stroke: new ol.style.Stroke({
							color: 'green',
							width: 2
						  }),
						text: new ol.style.Text({
							font: '12px',
							text: feature.getProperties().name,
							placement: 'line'
						})
					 });
					  
				  }
					  
			  }
			  
			  
			  
			 
			  //console.log(line_style);
			 return line_style;
		  } 
		  else 
			  return styles[feature.getGeometry().getType()];
		
      };
	  
	  var osm_points_styleFunction = function(feature){
		  return [
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: 'black',
						width: 1
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255,255,0,1)'
					})
				}),
				text: new ol.style.Text({
					font: '12px',
					text: "pointfdsg"
				})
			})
		  ];

	  }  
	  

	//////////////////////////
	var tileIndex0 = geojsonvt(countries, {
	  extent: 4096,
	  debug: 1
	});

	var vectorSource0 = new ol.source.VectorTile({
	  format: new ol.format.GeoJSON(),

	  tileLoadFunction: function(tile) {
		var format = tile.getFormat();
		var tileCoord = tile.getTileCoord();
		var data0 = tileIndex0.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
		//console.log(tileIndex.tileCoords);
		var features = format.readFeatures(
		  JSON.stringify({
			type: 'FeatureCollection',
			features: data0 ? data0.features : []
		  }, replacer));
		tile.setLoader(function() {
		  tile.setFeatures(features);
		  tile.setProjection(tilePixels);
		});
	  },
	  url: 'data:', // arbitrary url, we don't use it in the tileLoadFunction
	  

	});
	var vectorLayer0 = new ol.layer.VectorTile({
	  title : 'countries',
	  source: vectorSource0,
	  style: styleFunction
	});  
	 
	  
	///////////////////////////////  
	var tileIndex = geojsonvt(points, {
	  extent: 4096,
	  debug: 1
	});

	var vectorSource = new ol.source.VectorTile({
	  format: new ol.format.GeoJSON(),

	  tileLoadFunction: function(tile) {
		var format = tile.getFormat();
		var tileCoord = tile.getTileCoord();
		var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
		//console.log(tileIndex.tileCoords);
		var features = format.readFeatures(
		  JSON.stringify({
			type: 'FeatureCollection',
			features: data ? data.features : []
		  }, replacer));
		tile.setLoader(function() {
		  tile.setFeatures(features);
		  tile.setProjection(tilePixels);
		});
	  },
	  url: 'data:', // arbitrary url, we don't use it in the tileLoadFunction
	  

	});
	var vectorLayer = new ol.layer.VectorTile({
	  title : 'points',
	  source: vectorSource,
	  style: styleFunction
	});
	
	
	//////////////////////////
	var tileIndex2 = geojsonvt(lines, {
	  extent: 4096,
	  debug: 1
	});

	var vectorSource2 = new ol.source.VectorTile({
	  format: new ol.format.GeoJSON(),

	  tileLoadFunction: function(tile) {
		var format = tile.getFormat();
		var tileCoord = tile.getTileCoord();
		var data2 = tileIndex2.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
		//console.log(tileIndex.tileCoords);
		var features = format.readFeatures(
		  JSON.stringify({
			type: 'FeatureCollection',
			features: data2 ? data2.features : []
		  }, replacer));
		tile.setLoader(function() {
		  tile.setFeatures(features);
		  tile.setProjection(tilePixels);
		});
	  },
	  url: 'data:', // arbitrary url, we don't use it in the tileLoadFunction
	  

	});
	var vectorLayer2 = new ol.layer.VectorTile({
	  title : 'lines',
	  declutter: true,
	  preload: 4,
	  source: vectorSource2,
	  style: styleFunction
	});
	
	
	/////////////////////////////////////

	
	vectorSource2.on('tileloadend', function(){
		
		//console.log("Lines Source loaded " + coords[0] +" "+ coords[1]);
		/*setInterval(function(){ 
			var coords = map.getView().getCenter();
			map.getView().setCenter(ol.proj.transform([coords[1] , coords[0]+1], 'EPSG:3857', 'EPSG:3857'))  
			
		}, 1000);*/
		//map.getView().getCenter();
		
		
		/*map.getView().animate({
		  center: ol.proj.transform([coords[1] , coords[0]+0.5], 'EPSG:3857', 'EPSG:3857'),
		  duration: 10000
		});*/
				
		
	});

	//console.log(this.loaded);
	
var zoom=0;
var coords = map.getView().getCenter();

 



function doPan(location) {
	// pan from the current center
	var pan = ol.animation.pan({
	  source: map.getView().getCenter()
	});
	map.beforeRender(pan);
	// when we set the new location, the map will pan smoothly to it
	map.getView().setCenter(location);
}



function zoomChanged(evt){
	var map = evt.map;
	console.log("Zoom : "+ map.getView().getZoom());
	
  zoom = map.getView().getZoom();
  /*if (zoom <=17)
  {
    vectorLayer2.setVisible(false);
	vectorLayer.setVisible(false);
	/*map.removeLayer(vectorLayer2);
	map.removeLayer(vectorLayer);*/

 /* }
  else
  {*/
	 // console.log("IN >17");
	/*var check = false;
    map.getLayers().forEach(function (layer) {
		if (layer == vectorLayer2) {
			console.log(layer);
			check = true;
			return;
		}
		if (!check){

			//check = false;
			map.addLayer(vectorLayer2);
		}
	});*/
/*	vectorLayer2.setVisible(true);
	vectorLayer.setVisible(true);*/
  //}
}

map.on('moveend', zoomChanged);

	
//this.map.addLayer(vectorL);


//this.map.addLayer(countries_layer);

map.getLayers().extend([vectorLayer0, vectorLayer , vectorLayer2]);


});
});
});

//var extent = vectorL.getSource().getExtent();
//map.getView().fit(extent, map.getSize());

//console.log(map.getLayers().getTitle());

/*map.getLayers().forEach(function(layer, i) {
   //console.log(layer.getSource().getFeatures());
});
*/


//var ol3d = new olcs.OLCesium({map: map/*, target: 'map3d'*/});
//var scene = ol3d.getCesiumScene();

//var camera = scene.camera;

//camera.setView.orientation.heading(Cesium.Math.toRadians(135));
//camera.getHeading();
//scene.terrainProvider = Cesium.createWorldTerrain();
/*var terrainProvider = new Cesium.CesiumTerrainProvider({
  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles',
  requestVertexNormals: false
});*/
//scene.terrainProvider = terrainProvider;

//ol3d.setEnabled(true);
//camera.lookUp(Cesium.Math.toRadians(80));
//console.log(camera);


//console.log(camera.moveDown(Cesium.Math.toRadians(120)));


/*camera.setView({
          destination : Cesium.Cartesian3.fromDegrees(8 , 49, 0),
          orientation : {
              //heading : Cesium.Math.toRadians(50.0),
              pitch : Cesium.Math.toRadians(-35.0),
              roll : 0.0
          }
		});*/

/*
function NaviMode(){
	ol3d.setEnabled(true);
	if (map.getView().getZoom() < 21 ){
		camera.lookUp(Cesium.Math.toRadians(0));
		/*camera.flyTo({
          destination : Cesium.Cartesian3.fromDegrees(8 , 49, 0),
          orientation : {
              //heading : Cesium.Math.toRadians(175.0),
              //pitch : Cesium.Math.toRadians(-35.0),
              //roll : 0.0
          }
		});*/
		/*map.getView().setZoom(18);
		camera.lookUp(Cesium.Math.toRadians(60));
		
	}
	
	
}

function getCurrentViewParameters(){
	
	console.log("Zoom: "+ map.getView().getZoom());
	console.log("LookUp: "+ camera.up);
}



var tracking = false;
function toggleTracking() {

  tracking = !tracking;
  ol3d.trackedFeature = tracking ? iconFeature : undefined;
}

setInterval(function() {
  var old = point.getCoordinates();
  point.setCoordinates([
    old[0] + 1000 * Math.random(),
    old[1] + 1000 * Math.random(),
    old[2]
  ]);
  
  iconFeature.changed();
}, 100);

*/