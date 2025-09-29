import { Fragment, useRef, useState, useEffect, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import icons from "./images/svgListe.json"
import { useSpring, useSpringRef, animated, useTrail, } from '@react-spring/web'
const svgIcons = icons.icons

export default function LoadingModal({ mode, modalref, smallNavbarStyle,  sizeMain }) {
    // alert(JSON.stringify(size))
    const [width, setWidth] = useState(100);

    const [open, setOpen] = useState(false);
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
        const divs = new Array(6)
        loadingText.map((object) => {
            divs.push(
                <div className="h-full w-full   flex flex-row items-center content-center justify-center"
                    style={{
                        width: (sizeMain.width * 0.3) / loadingText.length + "px",

                    }}>
                    <svg className={'w-full h-[80%] '} viewBox={object.view} style={{ "strokeWidth": 1 + "px" }}  >
                        <path d={object.path} className='fill-none stroke-white opacity-100'></path>
                    </svg>
                </div>
            )
        })
        return (divs)
    }, [smallNavbarStyle])

    const LoadingIcon = () => {
        return (
            <div className={"h-full w-full  flex flex-auto items-center content-center justify-center"}>
                <svg className={'h-[80%] '} viewBox={"-2 -2 20 20"} style={{ "strokeWidth": smallNavbarStyle.height * 0.052 + "px" }}  >
                    <path d={svgIcons.loading[0]} className='stroke-white fill-slate-700 opacity-80'></path>
                    <path d={svgIcons.loading[1]} className='stroke-white fill-white opacity-100'></path>
                </svg>
                {/* <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors>*/}
            </div>
        )
    }
    const [styles, set, stop] = useSpring(() => ({ x: 0 }))
    set({
        x: 1,
    })
    const cancelButtonRef = useRef(null)
    useEffect(() => {
        //alert(mode)
        if (mode == "loading") {
            setOpen(true)
            console.log('starting errorModal timerr' + Date().toLocaleString());
        } else if (mode == "idle") {
            setOpen(true)
            console.log('stopping errorModal timerr' + Date().toLocaleString());
        }
    }, [mode]);
    const config = { mass: 5, tension: 2000, friction: 200 };
    const [state, setState] = useState(true);
    const trail = useTrail(LoadingTextNoFill.length, {
        config,
        from: { opacity: 0, x: 20 },
        to: { opacity: state ? 1 : 0, x: state ? 20 : 10 }
    });
    return (

        <Transition.Root show={open} as={Fragment} >
            <Dialog as="div" className="relative z-10 w-full h-full" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gradient-to-t from-slate-700 bg-black bg-opacity-90  transition-opacity"/>
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto ">
                    <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0" style={{
                        width: sizeMain.width,
                        height: sizeMain.height
                    }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-5000"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-5000"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative w-full h-full transform overflow-hidden rounded-lg  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="flex flex-col items-center content-center justify-center h-full w-full" >
                                <Dialog.Title as="h3" className="text-lg w-full h-[10%] font-medium leading-6 text-gray-900">
                                        <div className='w-full h-full'><LoadingIcon></LoadingIcon></div>
                                        </Dialog.Title>
                                    <Dialog.Title as="h3" className="text-lg w-full h-[30%] font-medium leading-6 text-gray-900">
                                        <div className="trails-div h-full w-full 0 flex flex-row items-center justify-center content-center" onClick={() => setState((state) => !state)}>
                                            {
                                            //LoadingTextNoFill.map((item) => {
                                            //    return (item)
                                            //})
                                            }
                                    {
                                    trail.map(({ x, ...otherProps }, i) => (
                                      <animated.div
                                        key={LoadingTextNoFill[i]}
                                        style={{
                                          ...otherProps,
                                          transform: x.interpolate((x) => `translate3d(${x}px, 0, 0)`)
                                        }}
                                        className="trails-text"
                                      ><animated.div>{LoadingTextNoFill[i]}</animated.div>
                                      </animated.div>
                                    ))
                                    }
                                        </div>
                                    </Dialog.Title>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>

    )
}