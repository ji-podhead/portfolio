import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ErrorModal1({ open, setOpen, errRef }) {
    const [width, setWidth] = useState(100);
    const cancelButtonRef = useRef(null)
   
    useEffect(() => {
        console.log('starting errorModal timerr');
        console.log(Date().toLocaleString())
   if(width>=0){
        countDown()
   }  
    }); 
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const countDown = async () => {
            await delay(10)
            console.log(Date().toLocaleString())
            setWidth(width-1)
            console.log("with " + JSON.stringify(width))
            if(width==0||open==false)
            {
         setOpen(false)
         (console.log("fin"))
          return
            }
    }
    return (
          
        <Transition.Root show={open} as={Fragment} >
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                 <div>{"i: " + width}</div> 
                   <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                Keine GPS Daten vorhanden!
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                   Bitte aktivieren sie die Standortabfrage in ihrem Browser!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-2 py-3 flex-row  items-center rounded sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full h-3/5  rounded-md border border-transparent bg-red-600 px-4 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            OK
                                        </button>
                                        <div className='w-4/5 m-4   h-4 border-4 rounded border-black bg-red-900 flex'>
                                            <div style={{ width: `${width}%` }} className='bg-red-600 w-[70%] rounded h-full'>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
       
    )
}