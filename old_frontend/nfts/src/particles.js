import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import * as THREE from "three/src/Three"
import { Canvas, extend, useThree, useFrame, } from "@react-three/fiber";
import { useRef } from 'react';
import {Particles } from './workerParticles';
import ParticleAutoDisposal, { startParticleWorker, updateWorkerValues, workerUpdateSimulation } from './workerHelper';
export default function ParticlesMain(){
  const particle = new Particles()
  const childParticle = new Particles()
  function InitializeScene() {
    let amount = 1000
  const { scene, gl, camera } = useThree();
  useMemo(() => {      
let mat = new THREE.MeshLambertMaterial()
        mat.transparent=true
        const geometry=new THREE.BoxGeometry(1,1,1)
      const Mesh2 = new THREE.Mesh(geometry,mat )
      Mesh2.translateZ(-50)
      Mesh2.castShadow=true;
 particle.InitializeParticles(scene, Mesh2, amount)
      particle.setSpawnOverTime(true)
      particle.setSourceAttributes("opacity",[1],false)
      particle.setSourceAttributes("emission",[255,255,252],true[50,50,50],[250,250,250])
      particle.setSourceAttributes("scale",[1,1,1],true,30,100)
      particle.setSourceAttributes("rotation",[0,0,0],true,-45,45)
      particle.setSourceAttributes("emission",[10,10,10],false,-45,45)
      particle.setSourceAttributes("color",[254.5,254.0,0],false ,[50,50,50],[250,250,250])
      particle.setMaxLifeTime(1,true,1.25,3  ) 
      particle.setStartDirection(1,1,1,true,-50,50) 
      particle.setAttributeOverLifeTime("opacity", [0],[-0.1 ],false)
      particle.setAttributeOverLifeTime("rotation", [0,0,0], [2,20,2],false)
      particle.setAttributeOverLifeTime("force", [0,0,0], [0,0,0],false)
       particle.setAttributeOverLifeTime("color", [0,0,0],[1,0.1,0],false,[0,0,3],[5,0,0])
        //  particle.setForce([0, 100, 0])
 //    particle.setAttributeOverLifeTime("direction", [1, 1, 1],[1, 1, 1],false)
    particle.setSpawnFrequency(2)
      particle.setMaxSpawnCount(amount)
      particle.setBurstCount(amount)
      particle.setSpawnOverTime(true)
      particle.setForce([10,10,10])
  

   particle.startPS()
     particle.updateValues(["transform", "color","emission","opacity","rotation","scale"])
      
     // particle.setAttributeOverLifeTime("direction", [2, 2, 2],true)
     // particle.setAttributeOverLifeTime("direction", [2, 2, 2],true)
     // startParticleWorker(particle)
   //   startParticleWorker(childParticle)
     // for (let i =0;i<amount*4;i++){
     //   tempArr2.push(i*10)
     // }
     // tempArr2 =  new Float32Array(tempArr2)
     // console.log(tempArr2)
     alert(particle.burstCount)
     //particle.instance.instanceCount=amount
      //  particle.setNoise(20000)
      const geo = new THREE.SphereGeometry(8000, 5  , 5)
     //particle.setStartPositionFromGeometry(false, geo, 10,true,-500,500)
     // childParticle.InitializeParticles(scene, Mesh, 100000)
     // childParticle.setMaxSpawnCount(1000)
     // childParticle.setMaxLifeTime(0.5)
     // childParticle.setShaderAttribute("color",50,250,0)
     // childParticle.setForce([-50,-50,0])
     // childParticle.setScale([10,10 ,10])
     // childParticle.setAttributeOverLifeTime("color", [0, 1, 0])
     // childParticle.setAttributeOverLifeTime("emission", [0, 0, 0])
     // childParticle.setAttributeOverLifeTime("force", [1, 1, 0])
     // childParticle.setSpawnFrequency(1)
      function mainParticleKill(attributes){
     const pos= particle.getTransform(attributes.index)
    }
     // particle.onParticleBirth(mainParticleKill,{index:0})
 //     particle.addChildParticleSysthem(childParticle,0.5,0)

      //  setStartPositionFromArray(false,targets)
      //   const color =[500,0,0]
      //   const color2 =[1,1,1]
      //   setShaderAttribute("emission",i,color) 
      //   setShaderAttribute("color",i,color) 
      // }
      //particle.updateValues("transform")
    }, [])
    let counter=0

    useFrame((state, delta) => {
      counter += 1
     //animate1(delta)
      particle.updateSimulation(delta,true,true,true,)
     // childParticle.updateSimulation(delta,true,true,true,)

    //particle.updateSimulation(delta,true,true,true,false)
    particle.updateValues(["transform", "color","emission","opacity","rotation","scale"])
   // childParticle.updateValues(["transform", "color","emission","opacity","rotation","scale"])

    })  
    return (<scene />);
    
  }
  return(
    <>
    <InitializeScene></InitializeScene>
  <ParticleAutoDisposal></ParticleAutoDisposal>
  </>
  )
}