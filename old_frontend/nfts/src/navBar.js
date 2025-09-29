
export default function Navbar(size,sizeMain,submitForm){

    return(
        <div className="h-full w-full bg-slate-600 flex flex-row items-center justify-center content-center"
        style={{ width: `${size?.width}px`, height: `${size?.height}px`, }}>
         <div  className="h-full  w-full flex flex-row pointer-events-none justify-center items-center content-center  ">
            {/*++++++++++++++++__search___++++++++++++++++++*/}
            <div className={"  flex-row flex bg-[${item.image}]   justify-items-center  shrink-0 opacity-100  w-full h-full border-r-4 overflow-hidden  border-b-[0.11rem]" +
              "   truncate  hover:text-white,bg-no-repeat text-white  border-darkBlue border-collapse  bg-slate-900 bg-opacity-30 opacity-40 "}>
              <form>
                <div className="relative pointer-events-auto text-white  z-20 w-[50%] h-full flex items-center content-center justify-center group">
                  <input type="email" onInput={submitForm} name="floating_email" id="floating_email" className="block   w-full h-full   text-sm text-gray-900 bg-transparent border-0 border-b-2  appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required
                    style={{ fontSize: `${window.innerHeight * 0.03}px`, }} />
                  <label htmlFor="floating_email" className={" w-full h-full peer-focus:font-medium transition  transform -translate-y-[10%] absolute text-sm text-gray-500  scale-75  -z-10  peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[20%]"}
                    style={{
                      fontSize: `${window.innerHeight * 0.03}px`   //.attr('transform','translate('+parseInt(props.data.width/2)+','+parseInt(props.data.height/2)+')')
                    }}>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
    )
}