import { Fragment, useRef, useState, useEffect, useMemo } from 'react'
import icons from "./images/svgListe.json"
import { useSpring, useSpringRef, animated, useTrail, } from '@react-spring/web'
//white #fbfbfb
//<a href="https://iconscout.com/illustrations/maps" target="_blank">Maps Illustration</a> by <a href="https://iconscout.com/contributors/manypixels-gallery">Manypixels Gallery</a> on <a href="https://iconscout.com">IconScout</a>
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
import Fiberlogo from './fiberLogo'
import SvgLoaderTest from './canvas3d'
import { AnimationUtils } from 'three'
const goldenerSchnitt = { a: 61.8, b: 38.2 }
const svgIcons = icons.icons
const toolSrc0 = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13]
const logoTime = 900
//let toolSrc2 = [0, 1010, 12, 1, 13, 2, 4, 3, 9, 5, 10, 13, 8, 7, 10, 10, 6, 3, 43, 9, 510, 12, 1, 13, 2, 4, 3, 9, 5, 10, 13, 8, 7, 10, 10, 6, 3, 4, 3, 4]
let toolSrc2 = [9, 1, 13, 3, 2, 12]
//,12,6]

let amount = toolSrc2.length
let toolSrc = new Array(toolSrc2.length)
export const lerp = (x, y, a) => x * (1 - a) + y * a;
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const invlerp = (x, y, a) => clamp((a - x) / (y - x));
export const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
amount = toolSrc2.length
for (let i = 0; i < toolSrc2.length; i++) {
    toolSrc[i] = { src: toolSrc0[toolSrc2[i]], positions: [], rotations: [] }
    // console.log(toolSrc[i])
}
//console.log (toolSrc)
const logoText =
    [
        { view: svgIcons.logo.l.view, path: svgIcons.logo.l.path, rotation: 0, scale: [1, 1], transform: [10 + 50 - 100, +40] },
        { view: svgIcons.logo.o.view, path: svgIcons.logo.o.path, rotation: 0, scale: [-1, -1], transform: [10 + -20 - 100, +40] },
        { view: svgIcons.logo.c.view, path: svgIcons.logo.c.path, rotation: -45, scale: [1, 1], transform: [10 + 10 - 100, +40] },
        { view: svgIcons.logo.a.view, path: svgIcons.logo.a.path, rotation: 60, scale: [1, 1], transform: [10 + 0 - 100, 0 + 40] },
        { view: svgIcons.logo.l2.view, path: svgIcons.logo.l2.path, rotation: 0, scale: [1, 1], transform: [10 + 20 - 100, +35] },
        { view: svgIcons.logo.c2.view, path: svgIcons.logo.c2.path, rotation: -45, scale: [1, 1], transform: [20 + 50, 0] },
        { view: svgIcons.logo.r.view, path: svgIcons.logo.r.path, rotation: 0, scale: [-1, -1], transform: [20 + 25,] },
        { view: svgIcons.logo.a2.view, path: svgIcons.logo.a2.path, rotation: 60, scale: [1, 1], transform: [20 + 25] },
        { view: svgIcons.logo.t.view, path: svgIcons.logo.t.path, rotation: 0, scale: [1.2, 1.2], transform: [20 + 25,] },
        { view: svgIcons.logo.f.view, path: svgIcons.logo.f.path, rotation: 0, scale: [1, 1], transform: [20, 0] },
        { view: svgIcons.logo.s.view, path: svgIcons.logo.s.path, rotation: 0, scale: [1.2, -1.2], transform: [20, 0] },

    ]
export default function InitModal({ mode, modalref, smallNavbarStyle, sizeMain1, styles, durchSchnittsQuat }) {
    const [open, setOpen] = useState(false);

    const mainRef = useRef()
    const transpGradientRef = useRef()
    const animationStart = Date.now()

    const currentTime = () => {
        return ((Date.now() - animationStart) / (60 * 1000))
    }
    const initializing = async () => {
        await delay(logoTime).then(() => {
            console.log("opening 3dModal  " + currentTime() + " s")
            setOpen(true)
        })
    }
    const delay = ms => new Promise(res => setTimeout(res, ms));
    //  const startScrolling = async () => {
    //      await delay(logoTime * 1.5).then(() => {
    //          //  console.log("allowing scroll events after  " + currentTime() + " s")
    //          mainRef.current.style["pointer-events"] = "none"
    //      })
    // }
    //                                >> INIT USEEFFECT << 
    useEffect(() => {
        //mainRef.current.scrollTop = 0
        initializing()
        //     startScrolling()
        trailApi.start(
            {
                from: { controll: 0 },
                to: { controll: 1 }
            })
    }, [])
    //                                   >> LOGO TEXT <<
    const logoTextArray = useMemo(() => {
        if (sizeMain1 == undefined) return
        const divs = new Array(logoText.length)
        logoText.map((object, i) => {
            divs[i] = (
                <svg className={'   w-full h-full fill-slate-100 flex flex-auto justify-center items-center content-center'} viewBox={"0 0 500 500"} style={{ "strokeWidth": 10 + "px", transform: `translate(${object.transform[0]}%, ${object.transform[1]}%) rotate(${object.rotation}deg) scale(${object.scale[0]},${object.scale[1]})`, filter: `drop-shadow(0px 0px 2px #3B82F6 )` }} >
                    {typeof object.path == "string" && <path d={object.path} className=' scale-[60%]   stroke-[#E0E7FF] opacity-100' ></path>}
                    {typeof object.path != "string" &&
                        <>
                            <path d={object.path[0]} className='  scale-[60%]   stroke-[#E0E7FF] opacity-100'></path>
                            <path d={object.path[1]} className='  scale-[60%]  stroke-[#E0E7FF] opacity-100'></path>
                        </>}
                </svg>
            )
        })
        return (divs)
    }, [sizeMain1])
    const logoTextConfig = { mass: 5, tension: 9000, friction: 200 };
    const [state, setState] = useState(true);
    const logoTextTrail = useTrail(logoText.length + 1, {
        logoTextConfig,
        from: { opacity: 0, y: -50 },
        to: { opacity: 1, y: 0 }
    },);
    //                                   >> TOOLS <<
    const toolDivs = useMemo(() => {
        //  console.log(styles)
        // alert(styles.smallview)
        const toolRotations = [

            [1, -0.1], //faden
            [0.6, -0.07], //blatt
            [0.6, -0.6], //mass
            [0.6, -0.05], //faden
            [0.2, -0.], //eimer
            [0.6, -0.42], //klebeer
        ]
        const toolPositionsBig = [
            [0, 1, 0.21, 0.68 ],
            [0, 0.8, 0.15 - 0.14 ],
            [0, 0.85, 0.65 + 0.2],
            [0, 0.92, 0.3 + 0.2],
            [0, 0.9, 0.25 - 0.13 ],
            [0, 0.99, 0.48 + 0.2],

        ]
        const toolPositionsSmall = [
            [0, 0.7, 0.15],
            [0, 0.75, 0],
            [0, 0.78, 0.45],
            [0, 0.85, 0.],
            [0, 0.82, 0.0],
            [0, 0.86, 0.19],
        ]
        const toolPositions = styles.smallview ? toolPositionsSmall : toolPositionsBig
        const StartPosition = new Array(2)
        const endPosition = new Array(2)
        const divs = new Array(amount)
        for (let i = 0; i < amount; i++) {
            const halfSize = durchSchnittsQuat * 0.82 / 2
            StartPosition[0] = range(0, 1, -sizeMain1.width, sizeMain1.width / 3 + halfSize, toolPositions[i][0])
            StartPosition[1] = range(0, 1, -sizeMain1.height * 2, sizeMain1.height - halfSize, toolPositions[i][1])
            endPosition[0] = range(0, 1, -sizeMain1.width / 3, sizeMain1.width / 3, toolPositions[i][2])
            endPosition[1] = toolPositions[i][3] != undefined ? range(0, 1, -sizeMain1.height / (halfSize / sizeMain1.height), sizeMain1.height, toolPositions[i][3]) : StartPosition[1]
            const startRotation = range(-1, 1, -180, 180, toolRotations[i][0])
            const endRotation = range(-1, 1, -180, 180, toolRotations[i][1])
            toolSrc[i].position = [StartPosition[0], StartPosition[1], endPosition[0], endPosition[1]]
            toolSrc[i].rotations = [startRotation, endRotation]
            const pos = new Array(2)
            const src = toolSrc[i].src
            divs[i] = (
                <img src={src} className='w-0 h-0  ' alt={i}
                    style={{
                        filter: `drop-shadow(1px 1px 1px #ffffff)`,
                        width: styles.smallview ? durchSchnittsQuat * 0.75 : durchSchnittsQuat * 0.05,
                        height: styles.smallview ? durchSchnittsQuat * 0.75 : durchSchnittsQuat * 0.05,

                    }}
                />)
        }
        return (divs)
    }, [sizeMain1, styles.smallview])
    const config = { mass: 5, tension: 2000, friction: 200 };

    const [showLogoPage, setShowLogoPage] = useState(true);
    const trailConfig = { mass: 0.5, tension: 2000, friction: 200 };
    const [trail, trailApi] = useTrail(amount, () => ({
        from: { controll: 0 },
        config: trailConfig,
    }), []);

    useMemo(() => {
        if (showLogoPage == true) {
            trailApi.start(
                {
                    from: { controll: 0 },
                    to: { controll: 1 }
                }
            )
        } else {
            trailApi.start(
                {
                    to: { controll: 0 },
                    from: { controll: 1 },
                }
            )
        }
    }, [showLogoPage])
    //                      >> scrollEvents <<
    let scrollPage = -1
    const [currentlyScrolling, setCurrentlyScrolling] = useState(false);
    const [y, setScrollY] = useSpring(() => ({
        immediate: false,
        y: (mainRef.current == undefined ? 0 :
            mainRef.current.scrollTop),
        onChange: props => {
            //  console.log(props.value.y)
            //  console.log(scrollPage)
            mainRef.current.scrollTop = -props.value.y
        },
        onStart: ((props) => {
            setCurrentlyScrolling(true)
            //  console.log(props.value.y)

        }),
        onRest: ((props) => {
            setCurrentlyScrolling(false)
            //  console.log(props.value.y)
        }),
        config: config.slow,
    })
    );
    const eventMemo = useMemo(() => {

    })
    const scrollEvent = event => {
        // console.log("currentTime " + currentTime())
        if (currentlyScrolling) { return }
        if (scrollPage == -1) {
            scrollPage = 1
        } else {
            if (event.currentTarget.scrollTop > y.y) {
                if (event.currentTarget.scrollTop > ((scrollPage) * sizeMain1.height)) {
                    scrollPage += 1
                }
            } else {
                if (event.currentTarget.scrollTop < ((scrollPage) * sizeMain1.height)) {
                    scrollPage -= 1
                }
                //     console.log("scrollscrollPage " + scrollPage + " y " + y + " scroll " + event.currentTarget.scrollTop)
            }
        }
        // console.log("temp " + scrollPage + " y " + " scroll " + event.currentTarget.scrollTop)
        setScrollY({ y: -sizeMain1.height * scrollPage })
        if (scrollPage == 0) {
            setShowLogoPage(true)
        } else {
            setShowLogoPage(false)
        }
        //transpGradientRef.current.style.transform= `translate(${0}px, ${event.currentTarget.scrollTop*0}px)` 
    }
    // useEffect(()=>{
    //     console.log(JSON.stringify(mousePosition))
    //   },[mousePosition])

    const canvas3d = useMemo(() => {
        if (open == false || sizeMain1 == undefined) { return }
        return (<SvgLoaderTest styles={styles} durchSchnittsQuat={durchSchnittsQuat} className="opacity-0" setOpen={setOpen} sizeMain={sizeMain1}></SvgLoaderTest>)
    }, [sizeMain1, open])
    //                             >> BODY <<
    return (
        <div>
            <div >
                <div className="relative z-0 w-full h-full flex-col flex " >
                    <div className="fixed pointer-events-none inset-0 h-[8%] w-full  -z-[10]   bg-slate-600 shadow-sm shadow-slate-900" />

                    <div className='w-full h-full  flex flew-row items-end content-end justify-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform='translate(20px,100px)'>
                            <path fill="#00cba9" fill-opacity="1" d="M0,96L80,90.7C160,85,320,75,480,106.7C640,139,800,213,960,213.3C1120,213,1280,139,1360,101.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                        </svg>
                    </div>

                    <div className="fixed inset-0 z-1 overflow-hidden pointer-events-none ">
                        <div className="flex flex-col min-h-full items-end justify-center  text-center sm:items-center" style={{
                            width: sizeMain1.width,
                            height: sizeMain1.height
                        }}>
                            {/* <div className=' w-full h-full bg-white absolute -z-1'  style={{width:`${sizeMain1.width}px`, height: `${sizeMain1.height}px,`}}>*/}


                            <div className="relative w-full h-full  overflow-hidden  "    >

                                <div className="inset-0 h-full w-full flex-none  items-center content-center justify-center"
                                    style={{
                                        height: `${sizeMain1.height * goldenerSchnitt.a}`
                                    }}
                                >
                                    {false&&trail.map(({ controll, controll2, ...otherProps }, i) => {
                                        const transTemp = controll.get()
                                        //   console.log(" " + transTemp) 
                                        return (
                                            <animated.div
                                                style={{
                                                    ...otherProps,
                                                    opacity: controll.interpolate((op1) => {

                                                        return (op1 * 1)
                                                    }),
                                                    transform: controll.interpolate(
                                                        (controll1) => `translate(
                                                            ${range(0, 1, toolSrc[i].position[0], toolSrc[i].position[2], controll1)}px, 
                                                             ${(range(0, 1, toolSrc[i].position[1], toolSrc[i].position[3], controll1))}px)
                                                             `
                                                    ),
                                                    // `translate(
                                                    //    ${(toolSrc[i].position[0]*transTemp)}px,
                                                    //    ${(toolSrc[i].position[1]*transTemp)}px) `
                                                }}
                                                className="trails-text flex-none  ">
                                                <animated.div className=' flex-none absolute'
                                                    style={{
                                                        ...otherProps,
                                                        transform: controll.interpolate(
                                                            (controll1) => "rotate(" + `${(range(0, 1, toolSrc[i].rotations[0], toolSrc[i].rotations[1], controll1))}` + "deg)")
                                                    }}>
                                                    {toolDivs[i]}
                                                    { }

                                                </animated.div>
                                            </animated.div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0  pointer-events-auto -z-[1] overflow-hidden " style={{
                        width: sizeMain1.width,
                        height: sizeMain1.height,
                        //transform:`translate(${0}px,${sizeMain1.height/4}px)`
                    }}>
                        {open && canvas3d}
                    </div>
                </div>
                <div>
                </div>
            </div>
            {/* ----- BG ----- 
            <div className={"w-full  h-full flex flex-auto  pointer-events-none z-25  bg-white content-center justify-center items-end"}
                style={{ width: sizeMain1.width }}
            >
                <div className={(styles.smallview==true?" h-[60%]  bg-gradient-to-t from-black via-black  ":" bg-gradient-to-t from-black h-[60%]")+

                '  fixed w-full  '}
                 />
                 <div ref={transpGradientRef} ></div>
        
            </div>*/}
            {/* ++++++++++++++++++++++ scrollPages ++++++++++++ +++++++++ */}
            {/* ----- Container ----- */}

            <div ref={mainRef} id="main" className={"pointer-events-none  flex flex-col  z-21 inset-0 absolute overflow-y-scroll"}
                onScroll={scrollEvent}
                style={{ width: sizeMain1.width, height: sizeMain1.height }}>
                {/* ------ PAGE 1 ------ */}
                <div className='z-[500] fixed w-full h-full stroke-white' style={{ strokeWidth: `20px` }}>
                    <line points='0 0 10 10'  ></line>
                </div>
                <div className='w-full h-[full] border-2 flex flex-col items-end content-end justify-end border-red-500 '
                    style={{ minWidth: sizeMain1.width, minHeight: sizeMain1.height }}>
                </div>
            </div>
        </div>
    )

}