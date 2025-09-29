
import React, { useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer'
import "./myMath"
import ErrorModal1 from './errorpop';
import AppPage from './appPage';
import InitModalModal from './initModal';
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
export default function MainPage() {
  const dispatch = useDispatch()
  const mainRef = useRef();
  const overViewRef = useRef()
  const errRef1 = useRef()
const selected =useSelector((state) => state.counter?.auswahl)
const currentAreaNodes1 =useSelector((state) => state.counter?.currentAreaNodes)
const currentAreaSchneider =currentAreaNodes1?.schneider
const currentAreaSchlüssel =currentAreaNodes1?.schlüssel
const currentAreaSchuh =currentAreaNodes1?.schuh
const mode = useSelector((state) => state.counter?.mode);
  const useSize = (ref) => {
    const [size, setSize] = React.useState()
    React.useLayoutEffect(() => {
      setSize(ref.current.getBoundingClientRect())
    }, [ref])
    useResizeObserver(ref, (entry) => setSize(entry.contentRect))
    return size
  }

  const sizeMain = useSize(mainRef)
  const [startApp, setStartApp] = useState(false);
  //                >>Modal<<
  const [initModal, setInitModal] = useState(true);
  const [ErrM1, setErrM1] = useState(false);
  //               >> smallView <<
  const [smallview,setSmallview]=useState(
    window.innerHeight/window.innerWidth>2?true:false
  )
  //              >> mainWindowSize <<
  const [mainWindowStyle, setMainWindowtyle] = useState({
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight}px`
  })
  //              >>  NavBarStyle  <<
  const [navBarStyle, setNavBarStyle] = useState({
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight * 0.7}px`
  })
    const [smallNavbarStyle, setSmallNavbarStyle] = useState({
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight * 0.75}px`
  })
  //              >>  OverViewStyle  <<
  const [overViewStyle, setOverViewStyle] = useState({
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight * 0.4725}px`
  })
  //              >>  ButtonStyle  <<
  const [buttonStyle, setButtonStyle] = useState({
    divContainer: {
      "margin-left": `${-window.innerWidth * 0.5}px`,
      "margin-top": `${-window.innerHeight * 0.5}px`
    },
    buttons: {
      width: `${window.innerWidth * 0.125}px`,
      height: `${window.innerHeight * 0.125}px`,
    }
  })
  //              >>  MapStyle  <<
  const [mapStyle, setMapStyle] = useState({
    width: [`${window.innerWidth}px`],
    height: [`${window.innerHeight * 0.4725}px`],
  })
  //               >> userGPS <<
  const [durchSchnittsQuad, setDurchSchnittsQuad] = useState(
   ()=>{
    let tempArr=[window.innerWidth,window.innerHeight]
    tempArr=[Math.max(tempArr[0],tempArr[1]),Math.min(tempArr[0],tempArr[1])]
   const durchs =tempArr[1]/tempArr[0]
    const dif=(durchs*tempArr[0])
    return(durchs*tempArr[0])
    }
  )
  //

  {/*++++++++++++++++__Responsive Size__++++++++++++++++++*/ }
  const mainData ={
    schneider:currentAreaSchneider,
    schlüssel:currentAreaSchlüssel,
    schuh:currentAreaSchuh,
    mode:mode,
    userGPS:{}
  }
  const styles={
    durchSchnittsQuat:durchSchnittsQuad,
    sizeMain:sizeMain,
    navBarStyle:navBarStyle,
    smallNavbarStyle:smallNavbarStyle,
    overViewStyle:overViewStyle,
    buttonStyle:buttonStyle,
    mapStyle:mapStyle,
    mainWindowStyle:mainWindowStyle,
    smallview:smallview

  }
  useMemo(() => {
    if (sizeMain == undefined) {
      return
    }
   // alert(JSON.stringify(sizeMain))
  //  alert(JSON.stringify(sizeMain))
    const smallViewTemp=sizeMain.height/sizeMain.width>2?true:false
   let navBarTemp,smallNavBarTemp,overViewTemp,MapStyleTemp
   // if(smallViewTemp==true){
      navBarTemp={x:sizeMain.width,y:sizeMain.height * 0.07}
      smallNavBarTemp={x:sizeMain.width,y:sizeMain.height * 0.045}
      overViewTemp={x:sizeMain.width,y:sizeMain.height * 0.4725}
      MapStyleTemp={x:sizeMain.width,y:sizeMain.height - navBarStyle.height - overViewStyle.height}
  // }else{
  //   navBarTemp={x:sizeMain.width,y:sizeMain.height * 0.07}
  //   smallNavBarTemp={x:sizeMain.width,y:sizeMain.height * 0.045}
  //   overViewTemp={x:sizeMain.width,y:sizeMain.height * 0.4725}
  //   MapStyleTemp={x:sizeMain.width,y:sizeMain.height - navBarStyle.height - overViewStyle.height}
  // }
  function ds(){
    let tempArr=[sizeMain.height,sizeMain.width]
    tempArr=[Math.max(tempArr[0],tempArr[1]),Math.min(tempArr[0],tempArr[1])]
   const durchs =tempArr[1]/tempArr[0]
   return(durchs*tempArr[0])
  }
  setDurchSchnittsQuad(ds())
   setSmallview(smallViewTemp)
    setNavBarStyle({
      width: `${navBarTemp.x}px`,
      height: `${navBarTemp.y}px`
    }) 
    setSmallNavbarStyle({
      width: `${smallNavBarTemp.x}`,
      height: `${smallNavBarTemp.y}`
    })
    setOverViewStyle({
      width: `${overViewTemp.x}px`,
      height: `${overViewTemp.y}px`
    })
    setMapStyle({
      width: [`${MapStyleTemp.x}px`],
      height: [`${MapStyleTemp.y}px`]
    })
    setButtonStyle(
      {
        divContainer: {
          "margin-top": `${-sizeMain.height * 0.6}px`,
          "margin-left": `${sizeMain.width * 0.8}px`,
          width: `${sizeMain.width * 0.15}px`,
          height: `${sizeMain.height * 0.15}px`
        }
      },)
      setMainWindowtyle({
        width: `${sizeMain.width}`,
        height: `${sizeMain.height}`
      })
      //  alert(JSON.stringify (mainWindowStyle))
    if(overViewRef.current!=undefined){
    //  overViewRef.current.styles={smallNavbarStyle:{width:10,height:10},
    //    overViewStyle:overViewStyle}
     }
     console.log("small view" + smallview+ " "+ +sizeMain.height/sizeMain.width+ JSON.stringify(sizeMain))
  }, [sizeMain])


  {/*++++++++++++++++__Events__++++++++++++++++++*/ }
// const [mousePos, setMousePos] = useState({x:0,y:0});
//
// const mousePosition = useEffect(() => {
//   const handleMouseMove = (event) => {
//     setMousePos({ x: event.clientX, y: event.clientY });
//   };
//   window.addEventListener('mousemove', handleMouseMove);
//   return () => {
//     window.removeEventListener(
//       'mousemove',
//       handleMouseMove
//     );
//   };
// }, []);

  const InputF = event => {
    let range1 = parseFloat(event.currentTarget.value)
  }
  const submitForm = event => {
    const link = "http://overpass-api.de/api/interpreter?data=[out:json];%20%20%20way[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out%20geom;relation[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out;way(r)[!%22building:part%22];out%20geom;"
  }
//  <<< ++++++++++ >>> >>> BODY <<<  <<< BODY >>> BODY <<< +++++++++++ >>> 
  return (
    <div >
    <div id='1' className="w-full h-full -z-1 min-h-screen  "  ref={mainRef} style={{
                        
                    }} ></div>
      <div id='2' className=" h-full w-full flex flex-col min-h-full min-w-full  z-0 items-center content-center bg-white justify-center">

    {initModal==false&&<AppPage mainData={mainData} styles={styles} ></AppPage>}
   {ErrM1 && <ErrorModal1 open={ErrM1} setOpen={setErrM1} errRef={errRef1}></ErrorModal1>}
    
    {sizeMain!=undefined&&<InitModalModal smallNavbarStyle={smallNavbarStyle} sizeMain1={sizeMain} styles={styles} durchSchnittsQuat={styles.durchSchnittsQuat}></InitModalModal>}
</div>
</div>
  );
}
