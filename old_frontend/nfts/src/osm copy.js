import { FC, useRef, useEffect, useMemo } from 'react'
import L from 'leaflet'
import { setCurrentAreaNodes, setSelectedStore } from './features/counter/counterSlice'
import { useDispatch, useSelector } from 'react-redux'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
require('leaflet.markercluster/dist/leaflet.markercluster-src')

delete L.Icon.Default.prototype._getIconUrl;

// Importing images from locally stored assets to address a bug
// in CodeSandbox: https://github.com/codesandbox/codesandbox-client/issues/3845

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('./images/marker-icon.png'),
    iconUrl: require('./images/marker-icon.png'),
    shadowUrl: require('./images/marker-icon.png')
});

// When importing into your own app outside of CodeSandbox, you can import directly
// from the leaflet package like below
//
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

export default function MapWrapper() {
    const mapRef = useRef();
    const dispatch = useDispatch()
    const schneiderCollection = useSelector((state) => state.counter?.taskCount);
 
    useEffect(() => {
        const map = L.map('map').setView([52.5162, 13.3777], 13)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map)
        const icon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
            iconSize: [30, 30]
        })
        function onEachFeature(feature, layer) {
            let popupContent = `<p>${(feature.properties.name)}</p>`;
            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }
            layer.bindPopup(popupContent);
        }
        const schneiderLayer = L.geoJSON(schneiderCollection, {
            style(feature) {
                return feature.properties && feature.properties.style;
            },
            onEachFeature,
            pointToLayer(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: '#ff7800',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).on("click", (schneiderMarker) => { changeSelected(schneiderMarker.target.feature) });
            }
        }).addTo(map);
        console.log(schneiderLayer)
        //marker.bindPopup("`<p>${"Name"}</p>`")
        //const marker2 = L.marker(new L.LatLng(52.5162, 13.37), { icon })
        //markers.addLayer(marker)
        //markers.addLayer(marker2)
        // if ( !Name ) return;
        // markers.bindPopup(`<p>${"Name"}</p>`);
        //  schneiderJSON.addTo(map);
        return () => {
            map.off()
            map.remove()
        }
    }, [])
    return <div id='map' className="w-full  h-full"></div>
}


