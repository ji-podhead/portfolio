import tShirt0  from "./images/schneider/tShirt0.jpg"
import tShirt1  from "./images/schneider/tShirt1.jpg"
import tShirt2  from "./images/schneider/tShirt2.jpg"
import tShirtIcon  from "./images/schneider/tShirtIcon.jpg"
import jacke0  from "./images/schneider/jacke0.jpg"
import jacke1  from "./images/schneider/jacke1.jpg"
import jacke2  from "./images/schneider/jacke2.jpg"
import jackeIcon  from "./images/schneider/jackeIcon.jpg"
import hose0  from "./images/schneider/hose0.jpg"
import hose1  from "./images/schneider/hose1.jpg"
import hose2  from "./images/schneider/hose2.jpg"
import hoseIcon  from "./images/schneider/hoseIcon.jpg"
import mantel0  from "./images/schneider/mantel0.jpg"
import mantel1  from "./images/schneider/mantel1.jpg"
import mantel2  from "./images/schneider/mantel2.jpg"
import mantelIcon  from "./images/schneider/mantelIcon.jpg"
import bluse0  from "./images/schneider/bluse0.jpg"
import bluse1  from "./images/schneider/bluse1.jpg"
import bluse2  from "./images/schneider/bluse2.jpg"
import bluseIcon  from "./images/schneider/bluseIcon.jpg"
import hut0  from "./images/schneider/hut0.jpg"
import hut1  from "./images/schneider/hut1.jpg"
import hut2  from "./images/schneider/hut2.jpg"
import hutIcon  from "./images/schneider/hutIcon.jpg"
import weste0  from "./images/schneider/weste0.jpg"
import weste1  from "./images/schneider/weste1.jpg"
import weste2  from "./images/schneider/weste2.jpg"
import westeIcon  from "./images/schneider/westeIcon.jpg"
import unterwäshe0  from "./images/schneider/unterwäsche0.jpg"
import unterwäsche1  from "./images/schneider/unterwäsche1.jpg"
import unterwäsche2  from "./images/schneider/unterwäsche2.jpg"
import unterwäscheIcon  from "./images/schneider/unterwäscheIcon.svg"
export const ImageLoader=()=>
{
const images= new Map()
images.set("weste",{ images:[weste0,weste1,weste2], icon:westeIcon})
images.set("unterwäshe",{ images:[unterwäshe0,unterwäsche1,unterwäsche2], icon:unterwäscheIcon})
images.set("tshirt",{ images:[tShirt0,tShirt1,tShirt2], icon:tShirtIcon})
images.set("hut",{ images:[hut0,hut1,hut2], icon:hutIcon})
images.set("bluse",{ images:[bluse0,bluse1,bluse2], icon:bluseIcon})
images.set("mantel",{ images:[mantel0,mantel1,mantel2], icon:mantelIcon})
images.set("weste",{ images:[jacke0,jacke1,jacke2], icon:jackeIcon})
images.set("hose",{ images:[hose0,hose1,hose2], icon:hoseIcon})
return(images)
}