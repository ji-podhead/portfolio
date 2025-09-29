import { FC, useRef, useEffect, useMemo } from 'react'
import L from 'leaflet'
import { setCurrentAreaNodes, setSelectedStore, State } from './features/counter/counterSlice'
import { useDispatch, useSelector } from 'react-redux'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { GiPositionMarker, GiWashingMachine, GiRunningShoe, GiHouseKeys } from "react-icons/gi"
import { HiScissors } from "react-icons/hi"
//import "./osm.css"
import icons from "./images/svgListe.json"
import * as d3 from "d3";
import * as d3Geo from "d3-geo"
import { geoEqualEarth, geoPath } from "d3-geo"
require('leaflet.markercluster/dist/leaflet.markercluster-src')
delete L.Icon.Default.prototype._getIconUrl;
export const borderS2 = ["zero:border-[0.07rem]  xs:border-[0.072rem] sm:border-[0.074rem] md:border-[0.076rem] lg:border-[0.078rem] xl:border-[0.085rem] 2xl:border-[0.09rem] 3xl:border-[0.096rem] max:border-[0.88rem] "]
const svgIcons =icons.icons
// Importing images from locally stored assets to address a bug
// in CodeSandbox: https://github.com/codesandbox/codesandbox-client/issues/3845

//L.Icon.Default.mergeOptions({
//    iconRetinaUrl: require('./images/marker-icon.png'),
//    iconUrl: require('./images/marker-icon.png'),
//    shadowUrl: require('./images/marker-icon.png')
//});
const smallView = 1
const SchneiderButton = () => {
    return (
        <div className=""> <button type="button" value="nodePath"
            class={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                (" aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white")}>
            <div className=" [w-80%] h-[80%]"> <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors></div>
        </button>
        </div>
    )
}
const SchlüsselButton = () => {
    return (
        <div className=""> <button type="button" value="nodePath"
            class={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                (" aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white")}>
            <div className=" [w-80%] h-[80%]"> <GiHouseKeys className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></GiHouseKeys></div>
        </button>
        </div>
    )
}
const SchuhButton = () => {
    return (
        <div className=""> <button type="button" value="nodePath"
            class={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                (" aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white")}>
            <div className=" [w-80%] h-[80%]"> <GiRunningShoe className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></GiRunningShoe></div>
        </button>
        </div>
    )
}
// When importing into your own app outside of CodeSandbox, you can import directly
// from the leaflet package like below
//
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

export default function MapWrapper(mainData) {
    const mapRef = useRef();
    let map
    const dispatch = useDispatch()
    let schneiderIcon, schneiderLogoContainer, popupContainer, schneider, textrec, textMain, clock, clockText
    const data = mainData.schneider;
    const selected =useSelector((state) => state.counter?.auswahl)
 
    function select(index){
        if(mainData.mode=="init")return
        d3.select(`g#schneiderLogo${index}`)
        .transition()
        .duration('150')
        .attr("opacity", 1) .attr("fill", "#fc0")
        .attr('transform', (' scale(1.2)'))
        if(data.selected!=-1){
         d3.select(`g#schneiderLogo${data.selected}`)
        .transition()
        .duration('150')
        .attr("opacity", 0.8)
        .attr('transform', (' scale(0.75)'))
        d3.select(`g#schneiderPop${data.selected}`)
            .transition()
            .duration('150')
            .attr("opacity", 0)
            .attr('transform', ('translate(' + (0) + ',' + (-10) + ') scale(0)'))
        }
        console.log(  d3.select(`g#schneiderLogoIcon${index}`))
        d3.select(`g#schneiderLogoIcon${index}`)
        .transition()
        .duration('150')
        .attr("stroke", "red")
       
        .attr ("fill-opacity", 0)
         d3.select(`g#schneiderPop${index}`)
            .transition()
            .duration('150')
            .attr("opacity", 1)
            .attr('transform', ('translate(' + (0) + ',' + (-10) + ') scale(1)'))

        data.selected=index
     }    
     //schaltet popup an und aus
    useEffect(()=>{
            if(mainData.mode == "idle"){
                if(selected.index!=data.selected){
                select(selected.index)
            }
            }
           },[selected])
           useEffect(() => {
       if (mainData.mode == "idle") {
            data.selected=-1
            console.log(mainData.schneider)
            map = L.map('map').setView([52.5162, 13.3777], 13)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19.5,
            }).addTo(map)
            const icon = L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
                iconSize: [30, 30]
            })
          //  function onEachFeature(feature, layer) {
          //      let popupContent = `<p>${(feature.properties.name)}</p>`;
          //      if (feature.properties && feature.properties.popupContent) {
          //          popupContent += feature.properties.popupContent;
          //      }
          //      layer.bindPopup(popupContent);
          //  }
            if (map == undefined) { return }
            // +++++++++++++++++++       D  3    ++++++++++++++++++++++++
            L.svg({ clickable: true }).addTo(map);
            const overlay = d3.select(map.getPanes().overlayPane)
            const svg = overlay.select('svg')
            .attr("pointer-events", "auto")
          // svg.selectAll("path")
          //     .append('path')
          //     .attr("d", schneiderPaths2)
          //     .attr('fill', 'white')
          //     .style('stroke', 'black')
          //     .style("stroke-width", 100)
          //     .attr("viewBox", schneiderView2)
          //     .attr("fill-opacity", 1)

            //  d3.select("#map")
            //      .select("svg")
            //      .attr("ponter-events","auto")
            //  //  .selectAll("g")?.remove()
            const mainIconSize = { w: 30, h: 30 }
            const starSize = 0.465
            const normalOptacy = 0.75
            const textCenterX = 0
            if(mainData.userGPS!=-1){
                svg.append("g")
                .attr("id", "userGPS")
               // .append("path")
               // .attr("d", svgIcons.clockPath)
               // .attr("viewBox", svgIcons.clockView)
               .append("rect")
               .attr("width",40)
               .attr("height",40)
                .style("fill", "#000")
                .attr("stroke", "black")
                .attr("stroke-width", 0.3)
                .attr("fill-opacity", .8)
                .attr('transform', 'translate(' + (-(0)) + ',' + -((0)) + ')scale(' + [1, 1] + ')')
            }
            for (let i = 0; i < data.length; i++) {
                schneider =
                    //        >>g<<
                    svg.append("g")
                        .attr("id", `schneider${i}`)
                schneiderLogoContainer = d3.select(`g#schneider${i}`)
                    .append("g")
                    .attr("id", `schneiderLogo${i}`)
                    .attr('transform', (' scale(0.75)'))
                    .attr("opacity", 0.8)
                    .lower()
                    .attr("z-index", 0)
                   .on("click",function () {
                    if(data.selected!=i){
                        select(i)
                        dispatch(setSelectedStore({type:"schneider",index:i}))
                    }
                    })
                    .on('mouseover', function () { //function to add mouseover event
                        const fixedC = map.latLngToLayerPoint([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]])
                       // d3.select(`g#schneiderLogoStar${i}`)
                       // .transition()
                       // .duration('150')
                       // .attr("opacity", 0  )
                       if(data.selected==i){return}
                        d3.select(`g#schneiderLogo${i}`)
                        .transition()
                        .duration('150')
                        .attr("opacity", 1)
                        .attr('transform', (' scale(1)'))
                        d3.select(`g#schneiderPop${i}`)
                            .transition()
                            .duration('150')
                            .attr("opacity", 0.8)
                            .attr('transform', ('translate(' + (0) + ',' + (-10) + ')scale(0.75)'))
                    })
                    .on('mouseout', function () {
                        console.log(selected)
                        console.log("selected " + JSON.stringify(selected)  +" i " + i) 
                        if(data.selected==i){return}
                        //function to add mouseover event
                        d3.select(`g#schneiderLogo${i}`)
                        .transition()
                        .duration('150')
                        .attr("opacity", 0.8)
                        .attr('transform', (' scale(0.75)'))
                        d3.select(`g#schneiderPop${i}`)
                            .transition()
                            .duration('150')
                            .attr("opacity", 0)
                            .attr('transform', ('translate(' + (0) + ',' + (-10) + ') scale(0)'))
                    });
                // >>controllCircle<<
                schneiderIcon = d3.select(`g#schneiderLogo${i}`)
                    .append("circle")
                    .attr("r", mainIconSize.w / 2)
                    .style("fill", "#2a5d8d")
                    .attr("style", "fill: #2a5d8d")
                    .attr("stroke", "#183f55")
                    .attr("stroke-width", 2)
                    .attr("fill-opacity", 1)
                    .attr("cx", 0)
                    .attr("cy", 0)
                //      >>logo SCHNEIDER <<
                d3.select(`g#schneiderLogo${i}`)
                    .append('path')
                    .attr("d", svgIcons.schneiderPaths2)
                    .attr('fill', 'white')
                    .style('stroke', 'black')
                    .style("stroke-width", 1)
                    .attr("viewBox", svgIcons.schneiderView2)
                    .attr("fill-opacity", 1)
                    .attr("id",`g#schneiderLogoIcon${i}`)
                    //    .on('mouseover', function() { //function to add mouseover event
                    //      console.log("mouse")
                    //  }) 
                    .attr('transform', 'translate(' + -((mainIconSize.w / 4) + 3.5) + ',' + ((-mainIconSize.w / 4) - 3) + ')scale(' + 1.2 + ')');
                //       >>star<<
                if (Math.random() >= 0.5) {
                    d3.select(`g#schneiderLogo${i}`)
                        .append('path')
                        .attr("id",`g#schneiderLogoStar${i}`)
                        .attr("viewBox", svgIcons.startView)
                        .attr("viewBox", svgIcons.startView)
                        .attr("d", svgIcons.star)
                        .attr('fill', '#fc0')
                        .style('stroke', '#000')
                        .style("stroke-width", "4px")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity",1)
                        .attr('transform', 'translate(' + -5 + ',' + (-mainIconSize.w / 2 - 14) + ')scale(' + starSize + ')')
                    }
                    // const projection = d3Geo.geoMercator().clipExtent([[,][size.width,size.height]])                 
                    // +++++++++++++++++ >>POPUP<< ++++++++++++++++++
                    popupContainer = d3.select(`g#schneider${i}`)
                        .append("g")
                        .attr("opacity", 0)
                        .attr('transform', ('translate(' + (0) + ',' + (-10) + ') scale(0)'))
                        .attr("id", `schneiderPop${i}`)
                        .raise()
                        .attr("z-index", 10)
                    const fontsize = 12
                 //   console.log(data[i].details.infoStore)
                    let string = data[i].details.infoStore.name
                    if (string.length > 25) {
                    string = string.replace("Änderungsschneiderei", "Änderungsschn.")
                    string = string.replace("Reinigungsannahme", "Reinigungsann.")
                    }
                    if (string.length > 25) {
                        string = string.substr(0, 23) + "..."
                    }
                    let offenText="-1"
                    let verbleibendText="keine Angabe"
                     const grün="#4bc741"
                    const orange="#f99d21"
                    const rot="#f54b3d"
                    let verbleibendFarbe=rot
                   if(data[i].details.infoStore.öffnungszeiten=="fehler"||data[i].details.infoStore.öffnungszeiten=="nicht angegeben")
                   {
                       verbleibendText="keine Angabe"
                       offenText="keine Angabe"
                       verbleibendFarbe="#000"
                   }else if(data[i].details.infoStore.öffnungszeiten=="24/7")
                   {
                        verbleibendFarbe=grün
                        offenText="geöffnet: "
                        verbleibendText="24/7"
                    }else{
                        if(data[i].details.infoStore.öffnungszeiten.geöffnet==true){
                            offenText="schließt in: "
                        }
                        else{
                            offenText="öffnet in: "
                        }
                        if(data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.tage>=1){
                            verbleibendText=new String(data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.tage+" T. " + data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.stunden +" St." )
                        }
                        else if(data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.stunden>=1){
                            if(data[i].details.infoStore.öffnungszeiten.geöffnet ==true){
                                verbleibendFarbe=grün
                            }
                            verbleibendText=new String(data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.stunden+" St. "+data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.minuten  + " Min.")
                        }
                        else {
                            verbleibendText=new String(data[i].details.infoStore.öffnungszeiten.zeitVerbleibend.minuten+" Min.")
                            if(data[i].details.infoStore.öffnungszeiten.geöffnet ==true){
                            verbleibendFarbe=orange
                            }
                        }
                    }
                   // console.log(string)
                    const clipPathWidth = Math.max(150  , (string.length * (fontsize * 0.6)))
                    const clipPathHeight = mainIconSize.h * 2
                    const clipPathScale = [clipPathWidth * 0.051, 2.3]
                    const clipPathOfset = clipPathWidth * 0.63
                    const fixedClip = [clipPathWidth * 0.051, 2]
                    //>>mainrect<<
                    textrec = d3.select(`g#schneiderPop${i}`)
                        .append("path")
                        .attr("d", svgIcons.markerPath)
                        .attr("viewBox", svgIcons.markerView)
                        .attr("id", `g#schneiderRec${i}`)
                        .style("fill", "white")
                        .attr("stroke", "black")
                        .attr("stroke-width", 0.3)
                        .attr("fill-opacity", 1)
                        .attr("ponter-events", "auto")
                        .attr('transform', 'translate(' + (-(clipPathOfset)) + ',' + -((mainIconSize.h * 2) + 2) + ')scale(' + clipPathScale + ')')
                        .raise()
                        .attr("z-index", 10)
                    // clippath
                    d3.select(`g#schneiderPop${i}`)
                        .append("clipPath")
                        .attr("id", "textRec")
                        .append("path")
                        .attr("d", svgIcons.markerPath)
                        .attr("viewBox", svgIcons.markerView)
                        .attr('transform', 'translate(' + (-clipPathOfset) + ',' + -((mainIconSize.h * 2) + 2) + ')scale(' + [4, 2] + ')')
                    //text
                    textMain = svg
                        .select(`g#schneiderPop${i}`)
                        .append("text")
                        .attr("stroke", "black")
                        .attr("stroke-opacity", 1)
                        .attr("fill-opacity", 1)
                        .attr("font-size", `${fontsize}px`)
                        .attr("stroke-width", `1px`)
                        // .attr('clip-path', `url(#textRec)`)
                        .attr("style", "sans-serif;text-anchor:middle;    ")
                        .attr("x", 0)
                        .attr("y", -mainIconSize.h - 12)
                        .text(string)
                    //clock
                    clock = d3.select(`g#schneiderPop${i}`)
                        .append("path")
                        .attr("d", svgIcons.clockPath)
                        .attr("viewBox", svgIcons.clockView)
                        .style("fill", "#000")
                        .attr("stroke", "black")
                        .attr("stroke-width", 0.3)
                        .attr("fill-opacity", .8)
                        .attr('transform', 'translate(' + (-(mainIconSize.w *2)) + ',' + -((mainIconSize.h + clipPathHeight * 0.12)) + ')scale(' + [0.6, 0.6] + ')')
                    clockText = d3
                        .select(`g#schneiderPop${i}`)
                        .append("text")
                        .attr("stroke", verbleibendFarbe)
                        .attr("stroke-opacity", 1)
                        .attr("fill-opacity", 1)
                        .attr("font-size", `${fontsize}px`)
                        .attr("stroke-width", `0.7px`)
                        // .attr('clip-path', `url(#textRec)`)
                        .attr("style", "sans-serif;text-anchor:middle;    ")
                        .attr("x", clipPathWidth*0)
                        .attr("y", -mainIconSize.h + clipPathHeight * 0.05)
                        .text(verbleibendText)
                     //  d3 .select(`g#schneiderPop${i}`)
                     //   .append("text")
                     //   .attr("stroke", "black")
                     //   .attr("stroke-opacity", 1)
                     //   .attr("fill-opacity", 1)
                     //   .attr("font-size", `${fontsize*0.9}px`)
                     //   .attr("stroke-width", `0.7px`)
                     //   // .attr('clip-path', `url(#textRec)`)
                     //   .attr("style", "sans-serif;text-anchor:middle;    ")
                     //   .attr("x", -clipPathWidth*0.05)
                     //   .attr("y", -mainIconSize.h + clipPathHeight * 0.05)
                     //   .text(offenText)
           
            }
            //  const ring = svg
            //  .selectAll("myCircles2")  
            //  .data(data)map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x

            //    .enter()
            //    .append("circle")
            //      .attr("r", 18)
            //      .style("fill", "green")
            //      .attr("stroke", "green")
            //      .attr("stroke-width", 7)
            //      .attr("fill-opacity", .4)

            //.data(data)
            //.enter()
            //.append("circle")
            //.attr("r", 18)
            //.attr("stroke-width", "4px")
            //.attr("z-index", 0)
            //.attr("stroke", "red")
            //.style("stroke-opacity", 0.5)
            //.attr("cx", function (d) { return map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x})
            //.attr("cy", function (d) { return map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y });
            // //nst clip = ring
            //  .data(data)
            //  .enter()
            //  .append('clipPath') //KLIPPATH immer vor circle appenden
            //  .attr('id', d => d.id + '-clip')
            //  .append('circle')
            //  .attr("r", 14)
            //  .attr("fill", "red")
            //  .attr("stroke", "red")
            //  .attr("stroke-width", "3px")
            //  .attr("cx", function (d) { return map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x})
            //  .attr("cy", function (d) { return map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y });
            map.on("moveend", update)
            update()
            return () => {
                map.off()
                map.remove()
            }
        }
    }, [mainData.mode])
    function update() {
       if(mainData?.userGPS!=-1){
        console.log(mainData.userGPS)
       //   const fixedUserGPS=map.latLngToLayerPoint(52, 13)
        //  console.log(fixedUserGPS)
          d3.select("g#userGPS")
             .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
       }
              for (let i = 0; i < data.length; i++) {
          
           const fixedC = map.latLngToLayerPoint([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]])
            d3.select(`g#schneider${i}`)
                .attr('transform', 'translate(' + fixedC.x + ',' + fixedC.y + ')')
            //   d3 .select(`g#schneiderRec${i}`)?.on({
            //    "mouseover": function (d) { console.log("d") },
            //    "mouseout": function (d) { console.log(d) },
            //    "click": function (d) { console.log("d") },
            //});
            // .attr("cx", fixedC.x)
            // .attr("cy", fixedC.y)
            // console.log(schneider._groups[0][i])
            //ring  .attr("cx", fixedC.x)
            //.attr("cy", fixedC.y)
        }
        // container.attr("cx", function (d) {
        //     d.geometry.fixedCoordinates = map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]])
        //     return d.geometry.fixedCoordinates.x
        // })
        //     .attr("cy", (d) => d.geometry.fixedCoordinates.y);
        // ring.attr('transform', d => 'translate(' + d.geometry.fixedCoordinates.x + ',' + d.geometry.fixedCoordinates.y + ')')
        //     .attr("cx", (d) => d.geometry.fixedCoordinates.x).attr("cy", (d) => d.geometry.fixedCoordinates.y);;
        //  
    }
    // If the user change the map (zoom or drag), I update circle position:
    return (
        <div id='map' className="w-full  h-full"></div>)

}


//  const  collection = data?.features.map((d) => Object.create(d));
//    const projection = d3.geoEqualEarth();
//    const geoGenerator = d3.geoPath(projection);
//    let canvas_container = d3.select(map.getPanes().overlayPane).append("div").attr("id","canvas-container"),
//	    leaflet_zoom_hide = canvas_container.append("div").attr("class", "canvas-leaflet-zoom-hide");
//	  let bounds = geoGenerator.bounds(collection),
//	      path = geoGenerator.path().projection(project);
//	  let feature = leaflet_zoom_hide.selectAll("div")
//	      .data(collection)
//	         .enter()
//	    	.append("div")
//	    	.attr("class","canvas-point-item");
//            console.log(feature)
//	  map.on("zoomstart", hideOverlay);
//	  map.on("zoomend", setOverlayContainerPosition);
//	  setOverlayContainerPosition();
//	  function hideOverlay(){
//	    leaflet_zoom_hide
//	    	.style('visibility','hidden');
//	  }
//	  function showOverlay(){
//	    leaflet_zoom_hide
//	    	.style('visibility','visible');
//	    	// .style("transform", "translate(-" + bottomLeft[0] + "px,-" + topRight[1] + "px)");
//	  }
//	  // Reposition the container to cover the features.
//	  function setOverlayContainerPosition() {
//	    let bottomLeft = project(bounds[0]),
//	        topRight = project(bounds[1]);
//	    canvas_container
//	    	.style("width", topRight[0] - bottomLeft[0] + 'px')
//	    	.style("height", bottomLeft[1] - topRight[1] + 'px');
//				// .style("left", bottomLeft[0] + "px")
//				// .style("top", topRight[1] + "px");
//			showOverlay()
//	    feature
//	    	.style("top", function(d){ return (project(d.geometry.coordinates)[1] +'px') })
//	    	.style("left", function(d){ return (project(d.geometry.coordinates)[0] +'px') })
//	  }
//	  // Use Leaflet to implement a D3 geographic projection.
//	  function project(x) {
//	    let point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
//	    return [point.x, point.y];
//	  }