/**
 * Created by Galya on 22/03/2016.
 */


function loadDistrictsWFSfile() {

    var source = new ol.source.Vector({
        url: '../res/berlin_districts_25833.geojson',
        format: new ol.format.GeoJSON({
            defaultDataProjection: projection_25833
        })
    });

    districtsLayer = new ol.layer.Vector({
        source: source,
        style: defaultStyle,
    });

    var listenerKey = source.on('change', function (e) {
        if (source.getState() == 'ready') {
            if (!districtsLoaded) {
                addDistrictToSelectionDiv();
            }
            districtsLoaded = true;
        }
    });

    map.addLayer(districtsLayer);
}

function loadDBBuildings() {

    var buildingsSource = new ol.source.Vector({
        url: '../res/db.geojson',
        format: new ol.format.GeoJSON({
            defaultDataProjection: "EPSG:3857"
        })
    });
    DBbuildingsLayer = new ol.layer.Vector({
        source: buildingsSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 3
            })
        })
    });

    map.addLayer(DBbuildingsLayer);
    var top = document.getElementById('map').offsetTop; //Getting Y of target element
    window.scrollTo(0, top);
}

function loadBuildingsByDistrict(fileName) {
    console.log('loadBuildingsByDistrict');

    if (!isEmpty(buildingsLayer)) {
        console.log('Remove');
        map.removeLayer(buildingsLayer);
    }

    var buildingsSource = new ol.source.Vector({
        url: fileName,
        format: new ol.format.GeoJSON({
            defaultDataProjection: projection_25833
        })
    });
    buildingsLayer = new ol.layer.Vector({
        source: buildingsSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        })
    });

    map.addLayer(buildingsLayer);
}


function loadBuildingsLive() {

    vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON({
            defaultDataProjection: projection_25833
        }),
        url: function (extent, resolution, projection) {
            return '../php/chuppaproxy.php?SERVICE=WFS&VERSION=1.0.0&REQUEST=getfeature&TYPENAME=fis:re_alkis_gebaeude&MAXFEATURES=10&outputFormat=application/json&srsname=EPSG:25833&bbox='
                + box_coords.join(',') + ',EPSG:25833';
        },
        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
            maxZoom: 19
        }))
    });

    buildingsLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 45
            })
        })
    });

    map.addLayer(vector);
}