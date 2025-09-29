import { FC, useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { State } from './features/counter/counterSlice'
import { useDispatch, useSelector } from 'react-redux'
//GiWashingMachine GiRunningShoe GiHouseKeys AiOutlineOrderedList HiScissors AiFillQuestionCircle
import { BsDiagram3, BsInfoCircle } from "react-icons/bs"
import { HiLink } from "react-icons/hi"
import {  GiPositionMarker,GiWashingMachine, GiRunningShoe, GiHouseKeys} from "react-icons/gi"
import { HiScissors} from "react-icons/hi"
import { AiFillQuestionCircle} from "react-icons/ai"
import icons from "./images/svgListe.json"
import * as Geo from "geo-three"
const svgIcons=icons.icons
export const borderS2 = ["zero:border-[0.07rem]  xs:border-[0.072rem] sm:border-[0.074rem] md:border-[0.076rem] lg:border-[0.078rem] xl:border-[0.085rem] 2xl:border-[0.09rem] 3xl:border-[0.096rem] max:border-[0.88rem] "]
function Vector2Distance(y1, y2, x1, x2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }
export default function OverView({mainData,smallNavbarStyle,overViewStyle,updateUserGPS}) {
    const [nodeMenuText, setNodeMenuText] = useState("Nodes");
    const [graphInfo, setgraphInfo] = useState(false);
    const [fixedStoreName,setFixedStoreName]=useState("please Select a Store")
    const [distanz,setDistanz]=useState("bitte aktivieren sie die Standortabfrage")
    const selected =useSelector((state) => state.counter?.auswahl)
    const smallView = true
    const currentGraph = 0
      useEffect(()=>{
console.log(selected)
        },[selected])
        
    const changeNodeInfoF = event => {
        if (event.currentTarget.value === "nodeInfo") {
            setgraphInfo(0)
            setNodeMenuText("Nodes")
            alert("change nodeInfo" + graphInfo)
        }
        else if (event.currentTarget.value === "nodePath") {
            setgraphInfo(1)
            setNodeMenuText("Start- and EndPoint")
            alert("change nodeInfo" + graphInfo)
        }
        else if (event.currentTarget.value === "linkInfo") {
            setgraphInfo(2)
            setNodeMenuText("Links")
            alert("change nodeInfo" + graphInfo)
        }
    }  
    const StoreIcon=()=>{
        <div className={"h-full w-full  flex flex-auto items-center content-center justify-center"}>
        <svg className={'rounded-md border-1   border-black bg-slate-300  h-[80%] '} viewBox={svgIcons.storeView} style={{"border-width":smallNavbarStyle.height*0.05+"px"}} >
            <path d={svgIcons.store[0]} className='stroke-black '></path>
            <path d={svgIcons.store[1]} className='stroke-black '></path>
        </svg>
       {/* <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors>*/}
    </div>
    }
    const SchneiderIcon= ()=>{
        return(
                 <div className={"h-full w-full  flex flex-auto items-center content-center justify-center"}>
                <svg className={'h-[80%] '} viewBox={"-1 -2 20 20"}  >
                    <path d={svgIcons.schneiderPaths2} className='fill-none stroke-white [#2a5d8d] 'style={{"strokeWidth":smallNavbarStyle.height*0.02+"px"}}></path>
                </svg>
               {/* <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors>*/}
            </div>
    )}
       const PositionButton=()=>{
        return(
            <div className=""> <button type="button" value="nodePath" onClick={changeNodeInfoF}
            class={borderS2 + " h-[100%]"  + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                (currentGraph == 0 ? " aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white" : "")}>
            <div className=" [w-80%] h-[80%]"> <GiPositionMarker className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></GiPositionMarker></div>
        </button>
        </div>
        )}
    const SchneiderButton= ()=>{
        return(
                 <button className={"h-full w-full  flex flex-auto items-center content-center justify-center"} type="button" value="nodePath" onClick={changeNodeInfoF}>
                <svg className={'rounded-md border-1   border-black bg-slate-300  h-[80%] '} viewBox={"-1 -2 20 20"} style={{"border-width":smallNavbarStyle.height*0.05+"px"}} >
                    <path d={svgIcons.schneiderPaths2} className='fill-[#2a5d8d] stroke-black '></path>
                </svg>
               {/* <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors>*/}
            </button>
    )}
    const SchlüsselButton=()=>{
        return(
            <div className=""> <button type="button" value="nodePath" onClick={changeNodeInfoF}
                className={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                    (currentGraph == 0 ? " aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white" : "")}>
                <div className=" [w-80%] h-[80%]"> <GiHouseKeys className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></GiHouseKeys></div>
            </button>
            </div>
    )}
    const SchuhButton=()=>{
        return(
            <div className=""> <button type="button" value="nodePath" onClick={changeNodeInfoF}
                className={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                    (currentGraph == 0 ? " aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white" : "")}>
                <div className=" [w-80%] h-[80%]"> <GiRunningShoe className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></GiRunningShoe></div>
            </button>
            </div>
    )}
    const questionMarkButton=()=>{
        return(
            <div className=""> <button type="button" value="nodePath" onClick={changeNodeInfoF}
                className={borderS2 + (smallView <= 1 ? " h-[100%]" : " w-[full]") + "aspect-square rounded-md  items-center transition duration-150 ease-in-out " +
                    (currentGraph == 0 ? " aspect-square  items-center justify-center border-white hover:bg-black  hover:rounded-full hover:w-[30%] focus:z-10 focus:ring-2 hover:text-xs focus:bg-gray-900 focus:text-white" : "")}>
                <div className=" [w-80%] h-[80%]"> <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors></div>
            </button>
            </div>
    )}
   useEffect(()=>{
        if(mainData.userGPS!=-1){
            console.log(mainData.userGPS)
             const erdeUmfang = 40030
            const coords1 = Geo.UnitsUtils.sphericalToDatums(selected?.object?.geometry.coordinates[1] ,selected?.object?.geometry.coordinates[0] );
            const coords2 = Geo.UnitsUtils.sphericalToDatums(mainData.userGPS[1] , mainData.userGPS[0] );
            const distance = Vector2Distance(coords1.latitude, coords2.latitude , coords1.longitude,coords2.longitude )
           console.log(coords1)
           console.log(coords2)
            console.log("dist" + distance*6371.001)
            //setDistanz()
        }
        let name=selected?.object?.details.infoStore.name
        if(name==undefined)return
        console.log(name.length)
        if (name.length > 25) {
        name = name.replace("Änderungsschneiderei", "Änderungsschn.")
        name = name.replace("Reinigungsannahme", "Reinigungsann.")
        name = name.replace("Vollreinigung", "Vollr.")
        name = name.replace("Express", "Expre.")
        }
        if (name.length > 32) {
            name = name.substr(0, 30) + "..."
        }
        setFixedStoreName(name)
      
    },[selected?.object?.details.infoStore.name])
    useEffect(()=>{
       console.log( smallNavbarStyle)
   //  alert(smallNavbarStyle.height)
    },[smallNavbarStyle])
    return (
        <div className="h-full w-full  rounded flex flex-col items-center content-center  bg-white" style={overViewStyle}>
         {/*++++++++++++++++++++++ first nav  ++++++++++++++++  */}
            <div className='w-full h-[10%] flex flex-row items-center content-center bg-slate-600 rounded-t' style={{width:smallNavbarStyle.width+"px", height:smallNavbarStyle.height+"px"}} >
             <div className='w-[15%] h-full flex  items-center content-center justify-center'>
                 { selected?.type=="schneider"&& < SchneiderIcon className="h-full"></SchneiderIcon>}
                 { selected?.type=="schlüssel"&&<SchlüsselButton></SchlüsselButton>}
                 {  selected?.type=="schuh"&&<SchuhButton></SchuhButton>}
            </div>
            <div className='w-[70%] h-full flex text-white   text-lg items-center content-center justify-center'>
            {fixedStoreName}
           
            </div>
            {selected?.type!=undefined&& <  PositionButton className="h-full w-[15%]"> </PositionButton>}
            </div>
            {/*++++++++++++++++++++++ second nav  ++++++++++++++++  */}
            <div className='w-full h-full border flex flex-row items-center content-center bg-slate-400' style={{height:smallNavbarStyle.height*0.8+"px"}} >
            <div className='w-full h-full bg-slate-100 text-black'>
            {"Entfernung: " + mainData.selected?.object.details.infoStore.entfernung!=undefined?(mainData.selected?.object.details.infoStore.entfernung):"kein Standort"}
            </div>
             
              </div>
           {/*++++++++++++++++++++++ DETAIls  ++++++++++++++++  */}
            <div className='w-full h-[60%] flex flex-col items-center content-center justify-center'>
                <div className='w-[10%] h-[10%] border border-black'>
                    {"Öffnungszeiten: " + mainData.selected?.object}
                </div>
            </div>
        </div>
    )

}