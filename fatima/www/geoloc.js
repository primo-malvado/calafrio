var projection = ol.proj.get('EPSG:3857');

var titleSource = new ol.source.XYZ({
    //url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    url: 'tiles/{z}/{x}/{y}.png'
});

var raster = new ol.layer.Tile({
    source: titleSource
})

setTimeout(function() {
    dist();
}, 2000);

var style = {
    'Point': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,0,0.4)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#ff0',
                width: 1
            })
        })
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            lineJoin: "miter",
            color: 'rgba(99, 221, 0.5)',
            width: 5,
            lineDash: [10, 10]
        })
    }),
    'MultiLineString': new ol.style.Style({

        stroke: new ol.style.Stroke({
            lineJoin: "miter",
            color: 'rgba(221, 99, 0, 0.5)',
            width: 5,
            lineDash: [10, 10]
        })
    })
};

var layers = [raster]

layers.push(new ol.layer.Vector({

    source: new ol.source.Vector({
        url: "santarita22.6.gpx",
        //url: "120.gpx",
        format: new ol.format.GPX()
    }),
    style: function(feature) {
        return myStyle2[feature.getGeometry()
            .getType()];
    }
}));

layers.push(

    new ol.layer.Vector({
        source: new ol.source.Vector({
            //strategies: [new OpenLayers.Strategy.BBOX({resFactor: 1.1})],
            //protocol: new OpenLayers.Protocol.HTTP({
            url: "textfile.json",
            format: new ol.format.GeoJSON()
        }),



        style: function(feature) {
            return myStyle.Point;
        }
    })
);


var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: 'red'
        })
    })
});

var bombeiroStyle = {

    'Polygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: "blue"
        })
    }),

    'Point': new ol.style.Style({

        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'blue'
            })
        })

    })
};




var points = [

];

var featureLine = new ol.Feature({
    geometry: new ol.geom.LineString(points)
});

var sourceLine = new ol.source.Vector({

    features: [featureLine]
});

var geoLine = new ol.layer.Vector({
    source: sourceLine,

    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(10, 255, 25, 0.)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

layers.push(geoLine);

var image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({
        color: 'green',
        width: 5
    })
});

var myStyle = {
    'Point': new ol.style.Style({
        image: image
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
        })
    }),
    'MultiPoint': new ol.style.Style({
        image: image
    }),
    'MultiPolygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'Polygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 1.0)',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'GeometryCollection': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'magenta',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'magenta'
        }),
        image: new ol.style.Circle({
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke({
                color: 'magenta'
            })
        })
    }),
    'Circle': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
};



var myStyle2 = {

    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 3
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 3
        })
    }),

};


var view = new ol.View({
    resolutions: [76.43702828517625, 19.109257071294063, 4.777314267823516, 1.194328566955879],
    //minZoom: 11,
    maxZoom: 17,

    center: ol.proj.transform([-8.70283, 41.32010], 'EPSG:4326', 'EPSG:3857'),
    projection: projection,
    extent: projection.getExtent(),
    zoom: 11,
    //zoomFactor: 2
});
var map = new ol.Map({

    renderer: 'canvas',
    layers: layers,
    target: 'map',
    controls: ol.control.defaults({
            attribution: false
        })
        .extend([
            new ol.control.ScaleLine()
        ]),
    view: view
});

var markerEl = document.getElementById('geolocation_marker');
var marker = new ol.Overlay({
    positioning: 'center-center',
    element: markerEl,
    stopEvent: false
});
map.addOverlay(marker);

// Geolocation Control
var geolocation = new ol.Geolocation(({
    projection: view.getProjection(),
    trackingOptions: {
        maximumAge: 10000,
        enableHighAccuracy: true,
        timeout: 600000
    }
}));

var heading = 0;
var position = null;

var wgs84Sphere = new ol.Sphere(6378.137);

function logDist(actual, accuracy, speed) {

    var sourceProj = map.getView()
        .getProjection();

    var position = ol.proj.transform(actual, 'EPSG:4326', sourceProj);

    var dist = distanceToDestino(actual)

    var html = [

        "Dist: " + dist + "km",
        'Position: ' + actual[0].toFixed(5) + ', ' + actual[1].toFixed(5),
        'Accuracy: ' + accuracy,
        'Speed: ' + (speed * 3.6)
        .toFixed(1) + ' km/h'
    ].join('<br />');

    document.getElementById('info')
        .innerHTML = html;

    if (speed > 0) {
        markerEl.src = 'data/geolocation_marker_heading.png';
    } else {
        markerEl.src = 'data/geolocation_marker.png';
    }

    marker.setPosition(position);

    map.getView()
        .set("center", position, true);
    map.render();

}

 
geolocation.on('change', function() {

    position = geolocation.getPosition();

   // addPasseiPor(position)

    var accuracy = geolocation.getAccuracy();
    var speed = geolocation.getSpeed() || 0;

    var sourceProj = map.getView()
        .getProjection();

    var actual = ol.proj.transform(position, sourceProj, 'EPSG:4326');

    logDist(actual, accuracy, speed)

});

geolocation.on('error', function() {
    alert('geolocation error');
    // FIXME we should remove the coordinates in positions
});

var useGPS = false;
document.getElementById("useGPS")
    .addEventListener('change', function() {

        useGPS = this.checked;
        geolocation.setTracking(useGPS);

    });

var useCompass = false;
document.getElementById("useCompass")
    .addEventListener('change', function() {
        useCompass = this.checked;
        deviceOrientation.setTracking(useCompass);
    });

function radToDeg(rad) {
    return rad * 360 / (Math.PI * 2);
}

var deviceOrientation = new ol.DeviceOrientation();

deviceOrientation.on(['change'], function(event) {
    heading = event.target.getAlpha() || 0;
    map.getView()
        .set("rotation", heading, true);
    map.render();
});

function toMapProj(point) {
    return ol.proj.transform(point, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
}

function distanceToDestino(point) {

    var lastDist = Infinity;
    var closestFeature = -1;

    for (var i = 0; i < listaLen; i++) {

        var distX = parseFloat(wgs84Sphere.haversineDistance(point, listaPoints[i])
            .toFixed(3));

        if (lastDist > distX) {
            lastDist = distX;
            closestFeature = i;
        } else {

        }

    }

    //console.log(listaDist[closestFeature])


    return Math.round(100 * (lastDist + (listaDist[listaLen - 1] - listaDist[closestFeature]))) / 100;


    //return lastDist + (listaDist[listaLen - 1] - listaDist[closestFeature]);

}

var listaDist = [0.0];
var listaPoints = [];
var listaLen = 0;

function dist() {

    var l = layers[1].getSource()
        .getFeatures()[0].getGeometry()
        .getCoordinates()[0];
    listaLen = l.length;

    var lastPoint = ol.proj.transform(l[0], ol.proj.get('EPSG:3857'), ol.proj.get('EPSG:4326'));

    listaPoints.push(lastPoint);

    for (var i = 1; i < l.length; i++) {

        var actual = ol.proj.transform(l[i], ol.proj.get('EPSG:3857'), ol.proj.get('EPSG:4326'));
        var dist = listaDist[i - 1] + parseFloat(wgs84Sphere.haversineDistance(lastPoint, actual)
            .toFixed(5));
        //console.log(dist);
        listaDist.push(dist);

        lastPoint = actual

        listaPoints.push(lastPoint);

    }
}

function toKML() {

    var f = layers[1].getSource()
        .getFeatures()[0];
    var g = f.getGeometry()
    var ng = g.simplify(5);
    f.setGeometry(ng)

    var a = new ol.format.KML()
        .writeFeatures(layers[1].getSource()
            .getFeatures(), {
                featureProjection: ol.proj.get('EPSG:3857'),
                dataProjection: ol.proj.get('EPSG:4326')

            });

    console.log(a);

}

function toGpx() {

    var f = layers[1].getSource()
        .getFeatures()[0];
    var g = f.getGeometry()
    var ng = g.simplify(10);
    f.setGeometry(ng)

    var a = new ol.format.GPX()
        .writeFeatures(layers[1].getSource()
            .getFeatures(), {
                featureProjection: ol.proj.get('EPSG:3857'),
                dataProjection: ol.proj.get('EPSG:4326')

            });

    console.log(a);

}


map.on("click", function(e) {

    var point = ol.proj.transform(e.coordinate, ol.proj.get('EPSG:3857'), ol.proj.get('EPSG:4326'));

    logDist(point, 0, 3)

    console.log(`<trkpt lat="${point[1]}" lon="${point[0]}"/>`);




});

 

//initPasseiPor();




function getBearing(p1, p2) {

    var y = Math.sin(p2[0] - p1[0]) * Math.cos(p2[1]);
    var x = Math.cos(p1[1]) * Math.sin(p2[1]) - Math.sin(p1[1]) * Math.cos(p2[1]) * Math.cos(p2[0] - p1[0]);
    return Math.atan2(y, x) / Math.PI * 180; // .toDegrees();
}



function getDistance(p1, p2) {
    var R = 6371000; // Radius of the earth in m
    var dLat = deg2rad(p2[1] - p1[1]); // deg2rad below
    var dLon = deg2rad(p2[0] - p1[0]);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(p1[1])) * Math.cos(deg2rad(p2[1])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}



function toString(poi) {


    var s = layers[2].getSource();


    var p1 = ol.proj.transform(poi, 'EPSG:4326', 'EPSG:3857');

    var point = s.getFeaturesAtCoordinate(p1);
    if (point[0]) {

        props = point[0].getProperties();



        return {
            Freguesia: props.Freguesia,
            Concelho: props.Concelho,
            Distrito: props.Distrito
        }
    } else {
        return {
            Freguesia: "",
            Concelho: "",
            Distrito: ""
        };
    }




} 