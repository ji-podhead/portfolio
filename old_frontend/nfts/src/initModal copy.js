import { Fragment, useRef, useState, useEffect, useMemo } from 'react'
import { Dialog, Tab, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import icons from "./images/svgListe.json"
import { useSpring, useSpringRef, animated, useTrail, } from '@react-spring/web'
//white #fbfbfb
import a0 from "./images/logo/svg/a0.svg"
import a1 from "./images/logo/svg/a1.svg"
import a2 from "./images/logo/svg/a2.svg"
import a3 from "./images/logo/svg/a3.svg"
import a4 from "./images/logo/svg/a4.svg"
import a5 from "./images/logo/svg/a5.svg"
import a6 from "./images/logo/svg/a6.svg"
import a7 from "./images/logo/svg/a7.svg"
import a8 from "./images/logo/svg/a8.svg"
import a9 from "./images/logo/svg/a9.svg"
import a10 from "./images/logo/svg/a10.svg"
import a11 from "./images/logo/svg/a11.svg"
import a12 from "./images/logo/svg/a12.svg"
import a13 from "./images/logo/svg/a13.svg"
import couple from "./images/logo/svg/couple.svg"
const svgIcons = icons.icons
const toolSrc = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13]
export default function InitModal({ mode, modalref, smallNavbarStyle, sizeMain1, smallView }) {
    // alert(JSON.stringify(size))
    const [scrollPage, setScrollPage] = useState(-1);
    const [open, setOpen] = useState(false);
    const mainRef =useRef()
    const transpGradientRef = useRef()
    useEffect(() => {
        setOpen(true)
    }, [])
    const loadingText =
        [
            { view: "0 0 20070.02", path: svgIcons.l },
            { view: "0 0 200 200", path: svgIcons.o },
            { view: "0 0 200 200", path: svgIcons.a },
            { view: "0 0 200 200", path: svgIcons.d },
            { view: "0 0 200 200", path: svgIcons.i },
            { view: "0 0 200 200", path: svgIcons.n },
            { view: "0 0 200 200", path: svgIcons.g }
        ]
    const LoadingTextNoFill = useMemo(() => {
        const divs = []
        loadingText.map((object) => {
            divs.push(
                <div className="h-full w-full   flex flex-row items-center content-center justify-center"
                    style={{
                        width: (sizeMain1.width * 0.3) / loadingText.length + "px",

                    }}>
                    <svg className={'w-full h-[80%] '} viewBox={object.view} style={{ "strokeWidth": 1 + "px" }}  >
                        <path d={object.path} className='fill-none stroke-white opacity-100'></path>
                    </svg>
                </div>
            )
        })
        return (divs)
    }, [smallNavbarStyle])

    const toolDivs = useMemo(() => {
        const divs = new Array(13)
        for (let i = 0; i < 14; i++) {
            divs[i] = (
                <img src={toolSrc[i]} className='w-full h-full' alt={i} />
            )
        }
        console.log(divs)
        return (divs)
    }, [sizeMain1])
    const CoupleIcon = () => {
        return (
            <div className={"flex transform -translate-y-40 flex-auto items-center  content-center justify-center "}>
                <img src={couple} className='h-full w-full ' alt={"couple"}/>
            </div>
        )
    }
    const [styles, set, stop] = useSpring(() => ({ x: 0 }))
    set({
        x: 1,
    })
    const cancelButtonRef = useRef(null)

    const config = { mass: 5, tension: 2000, friction: 200 };
    const [showLogoPage, setShowLogoPage] = useState(true);
    const [state, setState] = useState(true);
    const trail = useTrail(LoadingTextNoFill.length, {
        config,
        from: { opacity: 0, x: 20 },
        to: { opacity: state ? 1 : 0, x: state ? 20 : 10 }
    });
    const [coupleSprings, coupleApi] = useSpring(() => ({
        from: { x: sizeMain1.width * 1.2 },
    }))
    useEffect(() => {
      if(showLogoPage==-1){
        console.log('starting errorModal timerr' + Date().toLocaleString());
        setShowLogoPage(0)
         coupleApi.start(
            {
                from: {
                    x: sizeMain1.width * 1.2,
                    y: (smallView == true ? sizeMain1.width * 0.25 : sizeMain1.width * 0.25),
                },
                to: {
                    x: sizeMain1.width * 0.35,
                },
            }
        )
      }

    }, [showLogoPage])
    
    useEffect(() => {
        //alert(mode)
        // if (mode == "loading") {
        //     setOpen(true)
        //    
        // } else if (mode == "idle") {
        //     setOpen(true)
        //     console.log('stopping errorModal timerr' + Date().toLocaleString());
        // }
    }, [mode]);
const scrollEvent = event=>{
console.log()
transpGradientRef.current.style.transform= `translate(${0}px, ${event.currentTarget.scrollTop*0}px)` 
//event.currentTarget.scrollTop
}
    return (
        <div >
            <div >
     <div className="relative z-0 w-full h-full  " >
            <div className="fixed inset-0 bg-gradient-to-t from-slate-700 bg-black bg-opacity-90  transition-opacity" />
            <div className="fixed inset-0 z-1 overflow-hidden ">
                <div className="flex flex-col min-h-full items-end justify-center  text-center sm:items-center" style={{
                    width: sizeMain1.width,
                    height: sizeMain1.height
                }}>
                    <div className="relative w-full h-full transform overflow-hidden rounded-lg  text-left transition-all  flex flex-col items-center content-center justify-center"    >
                        <div className="trails-div h-full w-full 0 flex flex-row items-center justify-center content-center" onClick={() => setState((state) => !state)}>
                            {
                                toolDivs.map((item) => {
                                    {
                                        console.log(toolDivs)
                                        console.log(item)
                                    }
                                    return (
                                    <div className='text-white
                                            transform rotate-0' style={{ "--tw-rotate": "45deg" }}>{item}{item.key}</div>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
          </div>
          </div>
            {/* ----- BG ----- */}
              <div  className={"w-full  h-full flex flex-auto  z-25  bg-white content-center justify-center items-end"}
               style={{width:sizeMain1.width}}
              >
            <div ref={transpGradientRef} className=' fixed  w-full h-[50%]  bg-gradient-to-t from-black ' />
          </div> 
          {/* ++++++++++++++++++++++ scrollPages +++++++++++++++++++++ */}
                              {/* ----- Container ----- */} 
          <div ref ={mainRef} id="main"  className={"flex flex-col  z-21 inset-0 absolute overflow-y-scroll"}
          onScroll={scrollEvent}
          style={{width:sizeMain1.width,height:sizeMain1.height}}
          >
                               {/* ------ PAGE 1 ------ */}
               <div className='w-full h-full border-2 flex flex-col border-red-500 '
               style={{minWidth:sizeMain1.width,minHeight:sizeMain1.height}}>
                        <div className='h-[50%]'></div>
               <div className='flex flex-row h-[50%] w-full items-end justify-end content-end'>
                <div className='w-full h-full text-white text-center flex flex-auto  justify-center content-center border-2 border-white' style={{ width: (smallView == true ? "100%" : "100%") }}>
               aaaaaaaaaaa
                </div>
                <div className={"w-full h-full "}>
                <animated.div  
                 style={{
                        height: (smallView == true ? "15%" : "30%"),
                        width: (smallView == true ? "25%":"25%"),
                        ...coupleSprings,
                    }}>
                    <CoupleIcon className="w-full h-full"
                        style={{}}>
                    </CoupleIcon>
                </animated.div>
                </div>
                </div>
            </div>
                               {/* ------ PAGE 2 ------ */}
            <div className='w-full h-full border-2 border-green-500 '
              style={{minWidth:sizeMain1.width,minHeight:sizeMain1.height}}>
                    <div className='bg-white opacity-0 h-full w-full '>
                        aaaaaaaaaaa
                    </div>
            </div>
            </div>
            </div>
    )

}