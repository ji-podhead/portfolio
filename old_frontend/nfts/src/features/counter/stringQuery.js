// A mock function to mimic making an async request for data
import { useSelector } from "react-redux";
import data from "../../camData.json"
//const link = "http://overpass-api.de/api/interpreter?data=[out:json];%20%20%20way[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out%20geom;relation[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out;way(r)[!%22building:part%22];out%20geom;"

//import { linkS } from "./counterSlice";
const delay = ms => new Promise(res => setTimeout(res, ms));

export default async function StringQuery(controller,link1,name) {
  
  const link = link1
let canceled = false
console.log("starting querry" + name +" !!!!!!!!!!!!!!!!" ) 
return new Promise((resolve, reject) => {
    fetch(
      link
      ,{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      }
    )
      .then(function (response) {
        console.log("createJSON")
        return response.json();
      }).catch(error => {
        if (error.name === 'AbortError') { 
          return canceled=true,
          reject("catcherror"+error)
        }})
      .then(function (myJson) {
        if(!canceled){
          console.log("create elements from JSON")
          return  resolve({name:name, value:myJson.elements})
        }
        else{
          reject("cancled by user")
        }
      })
  }
  )
}

