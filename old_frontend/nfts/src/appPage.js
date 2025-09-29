
import React, { useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer'
import * as utm from "utm"
import * as proj4 from "proj4/projs"
import * as BigNumber from "big-number"
import "./myMath"
import MapWrapper from './osm';
import TaskManager, { initializeMap } from './taskManager';
import OverView from './overView';
import Navbar from './navBar';
import { setCurrentAreaNodes, setSelectedStore ,State} from './features/counter/counterSlice'
import ErrorModal1 from './errorpop';
import LoadingModal from './loadingModal';

// http://overpass-api.de/api/interpreter?data=[out:json];(node["shop"]["name"~"Schuh"](52.3,13.0,52.6,13.7);node["craft"="shoemaker"](52.3,13.0,52.6,13.7);node["shop"="shoemaker"](52.3,13.0,52.6,13.7););out body;>;out skel qt;
const delay = ms => new Promise(res => setTimeout(res, ms));
function Round2Places(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
const earthLength = 6371.001
const erdeUmfang = 40030
const alphabet = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "w", "X", "Y", "Z"]
const buttonBaseClass = "w-[30%] h-full border-black border"
{/*++++++++++++++++__MAIN FUNCTION__++++++++++++++++++*/ }
export default function AppPage({mainData,styles}) {
  const dispatch = useDispatch()
  const mainRef = useRef();
  const overViewRef = useRef()
  const errRef1 = useRef()
  const [userGPS, setUserGPS]=useState() 
  const useSize = (ref) => {
    const [size, setSize] = React.useState()
    React.useLayoutEffect(() => {
      setSize(ref.current.getBoundingClientRect())
    }, [ref])
    useResizeObserver(ref, (entry) => setSize(entry.contentRect))
    return size
  }
  //const sizeMain = useSize(mainRef)
  //                >>Modal<<
  const [loadingModal, setLoadingModal] = useState(true);
  const [ErrM1, setErrM1] = useState(false);
  //               >> smallView <<
  const updateUserGPS =(()=>{
     return  new Promise((resolve)=>{

    navigator.geolocation.getCurrentPosition(function(position) {
   const GPSLocation  =[position.coords.latitude, position.coords.longitude]
       setUserGPS(GPSLocation)
       resolve(GPSLocation)
     });
})
  })
  useEffect(()=>{
    if(mainData.mode!="init"){
    updateUserGPS().then((temp)=>{
      if(temp==undefined){
        setErrM1(true)
      }else{
        mainData.userGPS=temp
      }
      console.log(JSON.stringify(temp))
       initializeMap(dispatch,temp)
   })
  }},[])
  {/*++++++++++++++++__Events__++++++++++++++++++*/ }
  const InputF = event => {
    let range1 = parseFloat(event.currentTarget.value)
  }
  const submitForm = event => {
    const link = "http://overpass-api.de/api/interpreter?data=[out:json];%20%20%20way[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out%20geom;relation[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out;way(r)[!%22building:part%22];out%20geom;"
  }
//  <<< ++++++++++ >>> >>> BODY <<<  <<< BODY >>> BODY <<< +++++++++++ >>> 
  return (
    <div className='h-full w-full'>
    {loadingModal==false&&<div>
        {ErrM1 && <ErrorModal1 open={ErrM1} setOpen={setErrM1} errRef={errRef1}></ErrorModal1>}
        {/*++++++++++++++++__NavBar__++++++++++++++++++*/}
        <div className='w-full' style={styles.navBarStyle}>
         {mainData.mode!="loading"&& <Navbar size={styles.navBarStyle} sizeMain={styles.sizeMain} submitForm={submitForm} />}
        </div>
        {/*++++++++++++++++__Map__++++++++++++++++++*/}
        <div className='' style={styles.mapStyle}>
          {mainData.mode!="loading"&&false&&<MapWrapper  {...mainData}> </MapWrapper>}
        </div>
        {/*++++++++++++++++__OverView__++++++++++++++++++*/}
      {mainData.mode!="loading"&&<OverView ref={overViewRef} smallNavbarStyle={styles.smallNavbarStyle} overViewStyle={styles.overViewStyle} mainData={mainData} updateUserGPS={updateUserGPS}/>}
        {/*++++++++++++++++__Buttons__++++++++++++++++++*/}
      </div>}
      {<LoadingModal mode={mainData.mode} size={styles.mainWindowStyle} closeModal={setLoadingModal} smallNavbarStyle={styles.smallNavbarStyle} ></LoadingModal>}
    </div>
  );
}
/*
<div style={buttonStyle.divContainer} id='2' classname="  text-white z-10 flex ml-70 w-10 flex-row  items-center justify-center bg-black"  >
  <button className={"bg-white" + `${[buttonBaseClass]}`} id="index" name="index" onClick={InputF}>
  </button>
  <button className={"bg-white  " + `${[buttonBaseClass]}`} id="index" name="index" onClick={InputF}>
  </button>
  <button className={"bg-white " + `${[buttonBaseClass]}`} id="index" name="index" onClick={InputF}>
  </button>
</div>


(
  // query part for: “shop=* and name=Schlüsseldienst”
  nwr["shop"]["name"~"Schuh|Schlüßel"]({{bbox}});
  // query part for: “shop=* and brand=Costco”
 nwr["shop"]["name"~"Schneider"]({{bbox}});
  // query part for: “shop=* and brand=Costco”
    node["shop"="tailor"]["name"~"Schneider|schneider|Änderung|änderung"]({{bbox}});    node["shop"="clothes"]["name"~"Schneider|schneider|Änderung|änderung"]({{bbox}});
node["shop"="boutique"]["name"~"Schneider|schneider|Änderung|änderung"]({{bbox}});
 

);
// print results
out body;
>;
out skel qt;
*/