import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useTransition, useSpring, a } from '@react-spring/three'
import './svgStyle.css'
import { Trail, Float, Line, Sphere, Stars, Html, Stage, PresentationControls } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Stats } from '@react-three/drei';
import icons from "./images/svgListe.json"
import { AccumulativeShadows, RandomizedLight, Center, Environment, OrbitControls } from '@react-three/drei'
import * as d3 from "d3";
import * as d3Geo from "d3-geo"
import { Sky, PerspectiveCamera, MapControls, GizmoHelper, GizmoViewcube, } from "@react-three/drei";

const svgIcons = icons.icons
const infoText =
  [
    { header: "Finde Betriebe \r   in deiner nähe.", info: "Mit unseren Tools kannst du dir einen Überblick über die Leistungen lokaler Handwerker verschaffen" },
    { header: "Buche private Handwerker.", info: "Auf unserer P2P Börse kann jeder seine Dienstleistungen und Werkstücke anbieten. Auf welchen Preis oder Tausch ihr euch einigt bleibt euch überlassen, für unsere Services entstehen keine zusätzliche Kosten " },
    { header: "Tausche dein Wissen aus.", info: "Chatte mit Handwerkern und anderen kreativen Köpfen in deiner nähe." },
    { header: "Lerne neue Freunde kennen.", info: "Chatte mit Handwerkern und anderen kreativen Köpfen in deiner nähe." },

  ]
const colors = ['#21242d', '#ea5158', '#0d4663',]
const goldenerSchnitt = { a: 61.8, b: 38.2 }
const urls = [
["animatedSvgs/0maps3.svg","animatedSvgs/0maps3.svg"],
["animatedSvgs/0Markers.svg",""],
["animatedSvgs/0Mann.svg",""],
["animatedSvgs/browser.svg",""],
["animatedSvgs/flubber.svg",""],
["animatedSvgs/mapsBlank.svg",""],
["animatedSvgs/browserWindow0.svg",""],
["animatedSvgs/browserWindow1.svg",""],
["animatedSvgs/browserWindow3.svg",""],
["animatedSvgs/localSvg.svg",""],
["animatedSvgs/craftsSvg.svg",""],
["animatedSvgs/localBackGroundSvg.svg",""],
["animatedSvgs/craftsBackGroundSvg.svg",""],
["animatedSvgs/bg.svg","animatedSvgs/bg.svg"]]

function Shape({shape, rotation, position,extrude, color, color2, opacity, index, scale, originalScale }) {

  if (!position) return null
  const color2temp = color2.get()
  const colorNew = color
  colorNew.r = color.r 
  colorNew.g = color.g 
  colorNew.b = color.b 
  const bevel = 3;
  const extrudeSettings = {

    steps: 6,
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 20
  };
  const Geometry=()=>{
if(extrude==true){return(<a.extrudeGeometry  args={[shape, extrudeSettings]}/>)}
else{
return(<a.shapeGeometry  args={[shape]}/>)
}
  }
  return (
    <a.mesh colorNeedsUpdate={true}  castShadow={true} receiveShadow={true} scale={scale} rotation={rotation}  position={position.to((x, y, z) => ([x, y, z ]))}
    >
      <a.meshStandardMaterial  color={colorNew} opacity={opacity} side={THREE.DoubleSide} depthWrite={false} transparent  />
     <Geometry/>
    </a.mesh>

  )
}


function Atom(props) {
  const points = useMemo(() => new THREE.EllipseCurve(1, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
  return (
    <group {...props}>
      <Line worldUnits points={points} color="turquoise" lineWidth={0.3} />
      <Line worldUnits points={points} color="turquoise" lineWidth={0.3} rotation={[0, 0, 1]} />
      <Line worldUnits points={points} color="turquoise" lineWidth={0.3} rotation={[0, 0, -1]} />
      <Sphere args={[0.55, 64, 64]}>
        <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
      </Sphere>
    </group>
  )
}
const uniforms = {
  time: { value: 0.0 },
  mouse: { value: new THREE.Vector2(0, 0) },
  u_resolutions: { value: new THREE.Vector2(0, 0) },
  ofset: { value: { x: 0.0, y: 0.0 } }
};

const vertexShader = `
// Vertex shader
precision highp float;
//attribute vec3 position;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`
const fragmentShader=
`varying vec2 vUv;
uniform float time;
uniform vec2 mouse;
uniform vec2 u_resolutions;
 vec4 AQUA= vec4(8.0/255.0,220.0/255.0,220.0/255.0,1.0);
 vec4 BLUE= vec4(1.0/255.0,129.0/255.0,127.0/255.0,1.0);
//#define AQUA vec4(0.7,0.7,0.7,1.0)
//#define BLUE vec4(0.0,0.0,0.0,1.0)
 vec4 RIBBONCOLOR= vec4(1.0,1.0,1.0,0.5);
 vec4 TRANSP= vec4(0.0,0.0,0.0,0.0);
 float RIBWIDTH =float(0.03);
// 0..1 returns 0..1
float sin01(float x){
    float x2 = fract(x);
	return 0.5 + 0.5 * smoothstep(0.,1., sin(x2 * 6.28318530718));   
}
// outer color
vec4 color1(){
  float  COLORTIME =float(time / 22.0 + 0.3);
    float x = COLORTIME;
    float darken = 0.8;
	return vec4(darken*sin01(x),darken*sin01(x+1.0/3.0),darken*sin01(x+2.0/3.0),1.0);
}
// inner color
vec4 color2(){
  float  COLORTIME =float(time / 22.0 + 0.3);
    float x = COLORTIME;
    float offset = 0.05;
	return vec4(sin01(x + offset),sin01(x+1.0/2.0+offset),sin01(x+2.0/3.0+offset),1.0);
}
vec4 background(vec2 uv){
    float dist = 1.4142*length(uv - vec2(0.5,0.5));
    return mix(color1(),color2(),1.0-dist);
}
vec4 foreground(vec2 uv){
    return vec4(color2().rgb,0.3 );
}
vec4 saturateColors(vec4 c1, vec4 c2){
    // return c1 ++ c2
    vec3 newColor = c1.rgb * c2.rgb;
    float newAlpha = 1.0;
    return mix(c2,vec4(newColor,newAlpha),c1.a);
}
// source-over alpha composite
vec4 addColors(vec4 c1, vec4 c2){
	vec4 color =  mix(c2,c1,c1.a);   
    color.a = 1.0;
    return color;
}
float rand(float n){
    return fract(sin(n) * 43758.5453123);
}
float wave(float x){
    return sin(x) * cos(x*3.0) * sin(0.7*x);
}
vec4 ribbon(float seed, vec2 uv){
    float phase = rand(seed+0.2)*10.0;
    float speedMod = 1.0 + rand(seed+0.123);
    float width = RIBWIDTH*(seed-1.0+0.1);
 float AA= float(1./u_resolutions.y);
 float time2 =float(100.0 + time / 15.0);
    float warpY = uv.y+0.3 + wave(uv.x*1.0 + time2*speedMod + phase)*0.5;
    
    #ifdef HILLS
    float alpha = seed*0.22 + 0.25;
    float inRibbon = warpY + RIBWIDTH*8.0 + width;
    #endif        
    #ifndef HILLS
    float alpha = 1.0 - seed*0.22 + 0.25;
    float inRibbon = max(warpY-width, 1.0 - width - warpY);
    #endif
    inRibbon = smoothstep(0.5 - AA,0.5 + AA,1.0-inRibbon);
    return vec4(RIBBONCOLOR.rgb,mix(alpha,0.0,1.0-inRibbon));
}
vec4 ribbon(vec2 uv){
	return ribbon(1.0,uv);
}
vec4 circle(vec2 uv){
 float AA= float(1./u_resolutions.y);
	float inCircle = length(uv - vec2(0.333,0.866))+0.4; 
    inCircle = smoothstep(0.5 - AA,0.5 + AA,1.0-inCircle);
    return vec4(RIBBONCOLOR.rgb,inCircle*0.9);
}
float clamp01(float x){
    return clamp(x,0.0,1.0);
}
vec4 plus(vec2 uv){
 float AA= float(1./u_resolutions.y);
	float r1 = max(clamp01(max(1.1 - uv.x, uv.x-0.15)),clamp01(max(1.15 - uv.y, uv.y-0.35)));
    float r2 = max(clamp01(max(1.025 - uv.x, uv.x-0.225)),clamp01(max(1.225 - uv.y, uv.y-0.275)));
    float inPlus = min(r1,r2);
    inPlus = smoothstep(0.5 - AA,0.5 + AA,1.0-inPlus);
    return vec4(RIBBONCOLOR.rgb,inPlus*0.9);
}

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv=gl_FragCoord.xy/u_resolutions.xy;
    vec2 uvc = gl_FragCoord.xy/min(u_resolutions.x,u_resolutions.y);
    vec4 bgColor = background(uv);
   // gl_FragColor = bgColor;
    gl_FragColor = addColors(ribbon(1.0,uv), gl_FragColor);
    gl_FragColor = addColors(ribbon(2.0,uv), gl_FragColor);
    gl_FragColor = addColors(ribbon(3.0,uv), gl_FragColor);
    //gl_FragColor = addColors(circle(uvc), gl_FragColor);
    //fragColor = addColors(plus(uvc), gl_FragColor);
   // gl_FragColor = saturateColors(foreground(uv), gl_FragColor);
    vec3 c1 = vec3(0.8,0.2,0.2);
  // gl_FragColor=vec4(c1*coord,1.);
}
       `
const fragmentShader2 =
  `varying vec2 vUv;
      uniform float time;
      uniform vec2 mouse;
      uniform vec2 u_resolutions;
      vec3 c1 = vec3(255./16.,  255./161.,  255./157.);
      vec3 c2 = vec3(255./84.,  255./3.,    255./117.);
      vec3 c3 = vec3(255./255., 255./112.,  255./0.01);
      vec3 c4 = vec3(255./2.,   255./95.,   255./152.);
      vec3 c5 = vec3(255./0.01, 255./132.,  255./168.);
      vec3 c7 = vec3(255./0.01, 255./168.,  255./171.);
      vec3 c8 = vec3(255./32.01, 255./201.,  255./155.);
      vec3 c9 = vec3(255./107., 255./106.,  255./172.);
      vec3 c10 = vec3(255./174.,255./109., 255./178.);
      vec3 c11 = vec3(255./185.,255./112., 255./177.);
      float circle(in vec2 _st, in float _radius, in vec2 _center){
        vec2 dist = _st;
        return 1.-smoothstep(_radius-0.02, _radius+0.02, distance(_st, _center));
        }
  
  // k ist der amount, die anderen beiden sind die objeckte
  float sMin(float a, float b, float k)
  {
           float h= clamp(0.5+0.5*(b-a)/k,0.0,1.0);
           return(mix(b,a,h)-k*h*(1.0-h));
   }
   mat2 Rot(float a)
   {
       float s = sin(a);
       float c = cos(a);
       return mat2(c, -s, s, c);
   }
   
   vec2 hash( vec2 p )
   {
       p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
     return fract(sin(p)*43758.5453);
   }
   
   float noise( in vec2 p )
   {
       vec2 i = floor( p );
       vec2 f = fract( p );
     
     vec2 u = f*f*(3.0-2.0*f);
   
       float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                           dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                      mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                           dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
     return 0.5 + 0.5*n;
   }  
   float map(vec2 coord, vec2 mouse){
   float circ1=1.-smoothstep(-0.5, 5.2, distance(coord, vec2(0.5+sin(time*0.1),0.5+cos(time*0.1))));
   float circ2=1.-smoothstep(0.1, 1.5, distance(coord, vec2(0.5,0.5)));
  //float circ2=1.-smoothstep(0.5, 0.8, distance(coord, mouse));
        float circ3 = circle(coord,0.8,vec2(0.5,0.5));
         //float circ2 = circle(coord,0.01,vec2(0.5,0.5));
             float quad= length(max(abs(coord-vec2(0.,0.))-vec2(1.,1.),0.0));
             float quadCirc= sMin(quad,circ2,0.5);
             float main = sMin(circ2,circ1,1.5);
           
             return (sMin(main,circ3,1.));
            
   }
    
  void main()	{

  

      vec3 c1 = vec3(0.8,0.2,0.2);
      vec3 c2 = vec3(0.5,0.5,0.5);
      vec2 coord=gl_FragCoord.xy/u_resolutions.xy;
      vec3 gradient1 =mix(coord.x*c2,coord.y*c3,0.5);
      vec2 mouseFixed=mouse/u_resolutions;
      vec2 mouseFixedCenter =vec2(mouseFixed.y,mouseFixed.x);
      vec3 circle1= vec3(circle(coord,0.2,mouseFixed)*c4);
      float step1=step(0.0,-map(coord,mouseFixed));
  float fract = fract(max(0.,map(coord,mouseFixed)*20.));
  float firstMarch=step1+fract;
  vec3 color= firstMarch*c1;
  vec3 colorMain= color;
        //vec4(c1*vec3(coord.x,coord.y,1.),1.);
      float circ1 = circle(coord,0.1,mouseFixed);
      gl_FragColor=vec4(color,0.);
      

    }
`;

//</div></div>//

export default function SvgLoaderTest({ sizeMain, durchSchnittsQuat, styles }) {

  const [infoBox, setInfoBox] = useState(0);
  const divRef1 = useRef();
  const controllRef1 = useRef();

const delay = ms => new Promise(res => setTimeout(res, ms));

const countDown = async () => {
        await delay(4000)
        if(infoBox<1){
          setInfoBox((infoBox+1))
        }else{
          setInfoBox(0)
        }
        console.log(infoBox)
      return(countDown())
      }
     
  const Marker = () => {
    <div className={"h-full w-full  flex flex-auto items-center content-center justify-center bg-white"} style={{ minWidth: durchSchnittsQuat * 0.5 + "px" }}>

      {/* <HiScissors className=" h-full w-full fill-white " strokeWidth={"1rem"} fill="currentColor"></HiScissors>*/}
    </div>
  }
  function Svg1(ref1) {
    let Svg
    useEffect(() => {
      Svg = d3.select("body").append("svg").attr("width", 700).attr("height", 300)

        .selectAll("circle")
        .append("circle")
        .attr("r", 20)
        .style("fill", "#2a5d8d")
        .attr("style", "fill: #2a5d8d")
        .attr("stroke", "#183f55")
        .attr("stroke-width", 2)
        .attr("fill-opacity", 1)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr('transform', 'translate(' + -(0) + ',' + (0) + ')scale(' + 2 + ')');
      Svg
        .append('path')
        .attr("viewBox", svgIcons.startView)
        .attr("viewBox", svgIcons.startView)
        .attr("d", svgIcons.star)
        .attr('fill', '#fc0')
        .style('stroke', '#000')
        .style("stroke-width", "4px")
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1)
        .attr('transform', 'translate(' + -5 + ',' + (0) + ')scale(' + 10 + ')')

    }, [])

    //    .on('mouseover', function() { //function to add mouseover event
    //      console.log("mouse")
    //  }) 
    if (Svg != undefined) {

      return <Svg className="w-full h-full bg-red-500"></Svg>
    }
  }
  function AllSvgs(){
    const { viewport } = useThree()
    function Svg({animate,extrude,opacity,  urlIndex, position, rotation, scale, color2, trail, originalScale,}) {
      const [page, setPage] = useState(0)
      useEffect(() => { 
      if(animate) {
        setInterval(() => setPage((i) => (i + 1) % urls[urlIndex].length), 3500)
      }
    }, [animate])

      const data = useLoader(SVGLoader, urls[urlIndex][page])
      const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))), [
        data
      ])
      console.log(opacity)
      const transition = useTransition(shapes, {
        from: {opacity:opacity[0], color2: color2[0], scale: scale[0], rotation: rotation[0], position: position[0], opacity: 0, originalScale: { originalScale } },
        enter: {opacity:opacity[1], color2: color2[1], scale: scale[1], rotation: rotation[1], position: position[1], opacity: 1, originalScale: { originalScale } },
        leave: {opacity:opacity[0], color2: color2[2], scale: scale[2], rotation: rotation[2], position: position[0], opacity: 0, originalScale: { originalScale } },
        trail: trail,
      })
      return (
        <>
            <group position={[viewport.width / 2, viewport.height / 4, 0]} rotation={[0, 0, Math.PI]} scale={[0.001,0.001,1]}>
 
            {transition((props, item) => (
              <Shape {...item} {...props} extrude={extrude}  />
            ))}
          </group>
        </>
      )}

      const heightShift = useMemo(()=>{
    //   alert(JSON.stringify(styles.smallview))
        if(styles.smallview==true){
          return(100)
        }else{
          return 0
        }
      },[sizeMain.height])
    
    return(
      <>
      <group position={[0,1,0]}>
   {/* */}       <group rotation={[0,0,0]}>
          <Svg infoBox={infoBox} extrude={true} animationIndex={0} animate={true} urlIndex={4} trail={4} 
            color2={[[1, 1, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
            scale={[[1, 1, 1],[13,13, 1], [1, 0.002, 1]]}
             position={[[0, 0, 0], [1000, 1000 , -0]]}
             rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
             opacity={[0,1,0]} />
             </group>
          <Svg infoBox={infoBox} extrude={true} animationIndex={0} animate={false} urlIndex={3} trail={10} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[0, 0, 0], [5, 5, 1], [1, 0.002, 1]]}
           position={[[1, 0, 0], [2000, 2000, 1]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]}
           opacity={[0,1,0]} />
        
       
        <Svg infoBox={infoBox} animationIndex={1} extrude={false} animate={false} urlIndex={0} trail={10} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[1.5, 1, 0.1], [1.42, 1.17, 1], [1, 0.002, 0.1]]}
           position={[[1, 0, 5], [2300, 2350, 1.05]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
           opacity={[0,1,0]}  /> 
           
           <Svg infoBox={infoBox} animationIndex={1} extrude={true} animate={false} urlIndex={2} trail={10} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[1.5, 1, 0.1], [4, 4, 0.1], [1, 0.002, 0.1]]}
           position={[[1, 0, 5], [2500, 1500, 2]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
           opacity={[0,0,0]}  /> 
           
           </group>
         </>
         
    )
  }
  function LowerBar() {
    let Svg
    useEffect(() => {
      const size = durchSchnittsQuat * 0.1
      if (divRef1.current == undefined) return
      Svg = d3.select(divRef1.current).append("svg").attr("width", size).attr("height", size)
        .append("path")
        .attr("viewBox", svgIcons.storeView)
        .attr("d", svgIcons.store)
        .style("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 0.3)
        .attr("fill-opacity", 1)
        .attr("ponter-events", "auto")
      console.log(Svg)
    }, [divRef1, durchSchnittsQuat])
const bubble=[
            (
              <div>
          <div className='    flex-wrap fixed  items-center content-center justify-center'
            style={{ width: durchSchnittsQuat * 0.5, height: durchSchnittsQuat * 0.5, transform: `translate(${durchSchnittsQuat * 0.148}px,${-durchSchnittsQuat * 0.12}px)` }} >
            <svg className=' relative z-0   bg-opacity-90" w-full h-full text-black ' viewBox={svgIcons.speachbubble[1].view} style={{ filter: `drop-shadow(1px 0.3px 0.7px #FFFFFF )`, strokeOpacity: 0.5, transform: `translate:(200px,200px)` }} >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ "stop-color": "rgb(236, 81, 112)", stopOpacity: 0.5 }} />
                  <stop offset="30%" style={{ "stop-color": "rgb(236, 81, 112)", stopOpacity: 0.8 }} />
                  <stop offset="40%" style={{ "stop-color": "rgb(236, 81, 112)", stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ "stop-color": "rgb(236, 81, 112)", stopOpacity: 0.5 }} />
                </linearGradient>
                <filter id="innershadow" x0="-50%" y0="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
                  <feOffset dy="7" dx="10"></feOffset>
                  <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>
                  <feFlood flood-color="#444444" flood-opacity="0.75"></feFlood>
                  <feComposite in2="shadowDiff" operator="in"></feComposite>
                  <feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>
                  <feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>
                  <feOffset dy="-7" dx="-10"></feOffset>
                  <feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>
                  <feFlood flood-color="#444444" flood-opacity="0.75"></feFlood>
                  <feComposite in2="shadowDiff" operator="in"></feComposite>
                  <feComposite in2="firstfilter" operator="over"></feComposite>
                </filter>
              </defs>
              <path strokeWidth={durchSchnittsQuat * 0.001} d={svgIcons.speachbubble[1].path} filter="url(#innershadow)" fill="url(#grad1)" className='    stroke-[rgb(0,0,0)]  opacity-100' ></path>
            </svg>

            <div className=' font-mono text-slate-100  decoration-8  font-bold  flex z-1    flex-auto items-center content-center justify-center'
              style={{
                fontSize: `${durchSchnittsQuat * 0.01691}px`,
                width: (`${durchSchnittsQuat * 0.085}px`),
                height: (`${durchSchnittsQuat * 0.085}px`),
                // textShadow: `${durchSchnittsQuat*0.0013}px ${durchSchnittsQuat*0.0013}px ${1}px #F44BB2`,
                fontFamily: 'Amatic SC',
                transform: `translate(${durchSchnittsQuat * 0.028}px,${-durchSchnittsQuat * 0.1282}px)`
              }}>
              {infoText[0].header}
            </div>
          </div>
          </div>
          ),
          (<div>
          {/*                                    >>     BUBBLE 2     <<                             */}
          <div className='    flex-wrap fixed  items-center content-center justify-center'
            style={{ width: durchSchnittsQuat * 0.14, height: durchSchnittsQuat * 0.14, transform: `translate(${durchSchnittsQuat * 0.05}px,${-durchSchnittsQuat * 0.12}px)` }}  >
            <svg className=' relative z-0   bg-opacity-90" w-full h-full text-black ' viewBox={svgIcons.speachbubble[1].view} style={{ filter: `drop-shadow(1px 0.5px 0px #FFFFFF )`, strokeOpacity: 0.8, transform: `translate:(200px,200px)` }} >
              <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ "stop-color": "rgb(30, 170, 171)", stopOpacity: 0.5 }} />
                  <stop offset="30%" style={{ "stop-color": "rgb(45, 170, 171)", stopOpacity: 0.8 }} />
                  <stop offset="40%" style={{ "stop-color": "rgb(45, 170, 171)", stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ "stop-color": "rgb(30, 170, 171)", stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              <path strokeWidth={durchSchnittsQuat * 0.001} filter="url(#innershadow)" d={svgIcons.speachbubble[2].path} fill="url(#grad2)" className='    stroke-[rgb(255,255,255)]  opacity-100' ></path>
            </svg>

            <div className=' font-mono text-slate-100  decoration-8  font-extrabold flex z-1    flex-auto items-center content-center justify-center'
              style={{
                fontSize: `${durchSchnittsQuat * 0.01691}px`,
                width: (`${durchSchnittsQuat * 0.085}px`),
                height: (`${durchSchnittsQuat * 0.085}px`),
                // textShadow: `${durchSchnittsQuat*0.0013}px ${durchSchnittsQuat*0.0013}px ${1}px #F44BB2`,
                fontFamily: 'Amatic SC',
                transform: `translate(${durchSchnittsQuat * 0.021}px,${-durchSchnittsQuat * 0.1082}px)`
              }}>
              {infoText[1].header}
            </div>
          </div>
          {/*                                    >>     BUBBLE 3     <<                             */}
          <div className='    flex-wrap fixed  items-center content-center justify-center'
            style={{ width: durchSchnittsQuat * 0.145, height: durchSchnittsQuat * 0.145, transform: `translate(${durchSchnittsQuat * 0.15}px,${durchSchnittsQuat * 0.043}px)` }}  >
            <svg transform={`scale(-1.28 1.28)`} className=' relative z-0   bg-opacity-90" w-full h-full text-black ' viewBox={svgIcons.speachbubble[1].view} style={{ filter: `drop-shadow(1px 0.5px 0px #FFFFFF )`, strokeOpacity: 0.8, }} >
              <defs>

                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ "stop-color": "rgb(4, 172, 235)", stopOpacity: 0.5 }} />
                  <stop offset="30%" style={{ "stop-color": "rgb(80, 172, 235)", stopOpacity: 0.8 }} />
                  <stop offset="40%" style={{ "stop-color": "rgb(80, 172, 235)", stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ "stop-color": "rgb(4, 172, 235)", stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              <path strokeWidth={durchSchnittsQuat * 0.001} filter="url(#innershadow)" d={svgIcons.speachbubble[4].path} fill="url(#grad3)" className='    stroke-[rgb(255,255,255)]  opacity-100' ></path>
            </svg>
            <div className=' font-mono text-slate-100   decoration-8  font-extrabold flex z-1    flex-auto items-center content-center justify-center'
              style={{
                fontSize: `${durchSchnittsQuat * 0.01691}px`,
                width: (`${durchSchnittsQuat * 0.1295}px`),
                height: (`${durchSchnittsQuat * 0.085}px`),
                // textShadow: `${durchSchnittsQuat*0.0013}px ${durchSchnittsQuat*0.0013}px ${1}px #F44BB2`,
                fontFamily: 'Amatic SC',
                transform: `translate(${durchSchnittsQuat * 0.014}px,${-durchSchnittsQuat * 0.1182}px)`
              }}>
              {infoText[2].header}
            </div>
          </div>
          </div>),
          (
          <div>
          {/*                                    >>     BUBBLE 4     <<                             */}
          <div className='    flex-wrap fixed  items-center content-center justify-center'
            style={{ width: durchSchnittsQuat * 0.14, height: durchSchnittsQuat * 0.14, transform: `translate(${durchSchnittsQuat * 0.25}px,${-durchSchnittsQuat * 0.03}px)` }}  >
            <svg transform={`scale(1.28 1.28)`} className=' relative z-0   bg-opacity-90" w-full h-full text-black ' viewBox={svgIcons.speachbubble[1].view} style={{ filter: `drop-shadow(1px 0.5px 0px #FFFFFF )`, strokeOpacity: 0.8, }} >
              <defs>

                <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ "stop-color": "rgb(243, 150, 98)", stopOpacity: 0.5 }} />
                  <stop offset="30%" style={{ "stop-color": "rgb(243, 190, 98)", stopOpacity: 0.8 }} />
                  <stop offset="40%" style={{ "stop-color": "rgb(243, 190, 98)", stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ "stop-color": "rgb(243, 150, 98)", stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              <path strokeWidth={durchSchnittsQuat * 0.001} filter="url(#innershadow)" d={svgIcons.speachbubble[6].path} fill="url(#grad4)" className='    stroke-[rgb(255,255,255)]  opacity-100' ></path>
            </svg>

            <div className=' font-mono text-slate-100    decoration-8  font-extrabold flex z-1    flex-auto items-center content-center justify-center'
              style={{
                fontSize: `${durchSchnittsQuat * 0.01691}px`,
                width: (`${durchSchnittsQuat * 0.120}px`),
                height: (`${durchSchnittsQuat * 0.085}px`),
                // textShadow: `${durchSchnittsQuat*0.0013}px ${durchSchnittsQuat*0.0013}px ${1}px #F44BB2`,
                fontFamily: 'Amatic SC',
                transform: `translate(${durchSchnittsQuat * 0.00710}px,${-durchSchnittsQuat * 0.1282}px)`
              }}>
              {infoText[3].header}
            </div>
          </div>
          </div>)]
          return(bubble[0])
  }
  const bgMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
  let bgGeo = new THREE.PlaneGeometry(1000, 1000)
  function Background() {
    const { viewport } = useThree()
    const [animationTime,setAnimationTime]=useState(0)
    useMemo(() => {
      bgGeo.width =
        uniforms.u_resolutions.value.x = sizeMain.width
      uniforms.u_resolutions.value.y = sizeMain.height
    }, [sizeMain])
    useFrame(({ mouse }, delta) => {

      //const x = ((mouse.x) * viewport.width) / 2
     // const y = ((mouse.y) * -viewport.height) / 2
      uniforms.time.value += delta
     // uniforms.mouse.value.y = -y
     // uniforms.mouse.value.x = x
    })
    return (
      <mesh  position={[0,0,-10]} receiveShadow={false} material={bgMaterial} geometry={bgGeo} />
    )
    // <directionalLight intensity={0.5} position={[300, 30000, 2300]}></directionalLight>
    // <ambientLight intensity={0.1} />
  }

  function CamController(){
    const { camera } = useThree()
  const forVertigo = { width: 1 };

  function vertigo() {
    camera.updateProjectionMatrix();
    const width = forVertigo.width;
    const fov = camera.fov;
    const distance = width / (2 * Math.tan(THREE.MathUtils.degToRad(fov * 0.5)));
  
    const lerpDist = distance / controllRef1.current.getDistance();
    camera.position.lerpVectors(controllRef1.current.target, camera.position, lerpDist);
  }
}
  return (
    <Canvas flat linear shadows>
         <Stats showPanel={0} className="stats" />
     <fog attach="fog" args={['black', 0, 40]} />
     <EffectComposer>
          <DepthOfField focusDistance={2} ></DepthOfField>
          <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
        </EffectComposer>
      <Stage intensity={1} preset={"portrait"}   environment="city" shadows={true} adjustCamera={false}>
       
      <group position={[10, 100, -0]}>
        <Html
          // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
          as='div' // Wrapping element (default: 'div')
          distanceFactor={1}>
        </Html>
      </group>
      <Html
        center
        scale={2}
        // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
        as='div' // Wrapping element (default: 'div')
        distanceFactor={10} // 
      >
      </Html>
      </Stage> 
        <PerspectiveCamera fov={50}   near={0.001} far={2000 }/>
        <PresentationControls ref={controllRef1} snap global zoom={1}  rotation={[0, -0.15, 0]} polar={[-Math.PI / 20, Math.PI / 20]} azimuth={[-Math.PI / 40, Math.PI / 20]}>
         <Suspense fallback={null}>
          
          <AllSvgs></AllSvgs>
            {/*   <Svg urlIndex={0} trail={10} color2={[[0, 1, 0], [0, 0, 0], [0, 0, 0]]} scale={[[0.0068, 0.0068, 0.0068], [0.0068, 0.0068, 0.0068], [1, 1, 1]]} position={[[-0.450, 0, 1], [0.235, 0, 1]]} rotation={[[0, 0, 0], [0, 6.5, 0], [0, 0, 0]]} > </Svg>
        
          <Svg urlIndex={2} trail={1} color2={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} scale={[[0, 0, 0], [0.001, 0.001, 0.001], [1, 1, 1]]} position={[[10, 50, 0], [0.070, 0.700, 30]]} rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} />
      
          <Svg urlIndex={9} trail={2} color2={[[0, 0.3, 0], [0, 0, 0], [0, 0, 0]]} scale={[[1.0, 0, 0], [-0.1, 0.1, 0], [-1, 1, 1]]} position={[[5, 0, 0], [4, -1000, 0]]} rotation={[[6, 0, 0], [0, 0, 0], [0, 0, 0]]} />
         <Svg urlIndex={11} trail={1} color2={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} scale={[[0, 0, 0], [0.1, 0.1, 0], [1, 1, 1]]} position={[[5, 0, 0], [4, 0, 0]]} rotation={[[6, 0, 0], [0, 0, 0], [0, 0, 0]]} />
          <Svg urlIndex={10} trail={2} color2={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} scale={[[0, 0, 0], [0.1, 0.1, 0], [1, 1, 1]]} position={[[3, 0, 0], [3, 0, 0]]} rotation={[[6, 0, 0], [0, 0, 0], [0, 0, 0]]} />
          <Svg urlIndex={12} trail={2} color2={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} scale={[[-0, 0, 0], [0.1, 0.1, 0], [1, 1, 1]]} position={[[3, 0, 0], [3, 0, 0]]} rotation={[[6, 0, 0], [0, 0, 0], [0, 0, 0]]} />
  */}
        </Suspense>
     
        </PresentationControls>
<Background></Background>

    
 
    </Canvas>
  )
}
{/*
vec2 p = - 1.0 + 2.0 * vUv;
float a = 1.+sin(time) * 1.0;
vec2 mc = vec2(mouse.x, u_resolutions.y - mouse.y);
float d = length((mc - gl_FragCoord.xy) / u_resolutions.xy);



return(
     <div>
     <div  className=' flex flex-auto h-[100%] shrink-0 bg-white  w-full items-center justify-center content-center '        
     style={{
      height:`${sizeMain.height}px`,width:`${ sizeMain.width}px`,
 
   }} >
    <div clipPath={svgIcons.markerPath}className=' w-[10%] h-[10%]   ' >
     <svg className='   fill-slate-100 w-full h-full text-black' viewBox={svgIcons.markerView} style={{ "strokeWidth": 1 + "px",filter: `drop-shadow(0px 0px 2px #3B82F6 )`  }} >
     <defs>
    <clipPath id="path"  viewBox='0 0 200 200'>
    <path d={svgIcons.markerPath}  ></path>
    </clipPath></defs>
     <path d={svgIcons.markerPath} id="myClip" className='    stroke-[#E0E7FF] opacity-100' ></path>
     
     <foreignObject x="0" y="0" width="100%" height="100%" clip-path="url(#path)" className='bg-green-600 w-full h-full flex flex-col tracking-tight items-center content-center justify-center'>
    <div className='   text-black w-[100%] h-[100%] '  style={{fontSize:`${durchSchnittsQuat*0.0041}px`}}>
     <div className=' h-[50%] w-full '  >
     {infoText.header}
        </div>
        <div className=' w-full h-[50%] bg-red-600'> 
        aaa
        </div>
        </div>
         </foreignObject>
       

   </svg>
</div>
    
 

</div>
 </div>


  )
}



*/}



