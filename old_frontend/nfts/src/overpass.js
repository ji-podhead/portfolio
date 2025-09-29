
import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
const link="http://overpass-api.de/api/interpreter?data=[out:json];%20%20%20way[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out%20geom;relation[%22building%22](around:50,52.554511405059024,%2013.349035807943519);out;way(r)[!%22building:part%22];out%20geom;"
export default function OverPass(){
  const [buildings,setBuildings]=useState([]);
  async function asyncCall() {
    await 
      fetch(link
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(myJson) {
        //+++++++++++TODO: REMOVE unnötigen key: "nodes ohne geo"+++++++++++++++
        setBuildings(myJson.elements)
      });   
}
useEffect(()=>{
asyncCall()

},[])
}
