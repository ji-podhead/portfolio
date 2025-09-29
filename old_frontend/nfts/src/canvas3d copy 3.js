import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useTransition, useSpring, a } from '@react-spring/three'
import './svgStyle.css'
import { Trail, Float, Line, Sphere, Stars, Html, Stage, PresentationControls, TrackballControls, Plane } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Stats } from '@react-three/drei';
import icons from "./images/svgListe.json"
import { AccumulativeShadows, RandomizedLight, Center, Environment, OrbitControls } from '@react-three/drei'
import * as d3 from "d3";
import * as d3Geo from "d3-geo"
import { Sky, PerspectiveCamera, MapControls, GizmoHelper, GizmoViewcube, } from "@react-three/drei";
import ParticlesMain from './particles'
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
  ["animatedSvgs/0maps3.svg", "animatedSvgs/0maps3.svg"],
  ["animatedSvgs/0Markers.svg", ""],
  ["animatedSvgs/0Mann.svg", ""],
  ["animatedSvgs/browser.svg", ""],
  ["animatedSvgs/flubber.svg", ""],
  ["animatedSvgs/mapsBlank.svg", ""],
  ["animatedSvgs/browserWindow0.svg", ""],
  ["animatedSvgs/browserWindow1.svg", ""],
  ["animatedSvgs/browserWindow3.svg", ""],
  ["animatedSvgs/localSvg.svg", ""],
  ["animatedSvgs/craftsSvg.svg", ""],
  ["animatedSvgs/localBackGroundSvg.svg", ""],
  ["animatedSvgs/craftsBackGroundSvg.svg", ""],
  ["animatedSvgs/mapmarker.svg", ""],
]
function Shape({ shape, rotation, zOfset, position, extrude, color, color2, opacity, index, scale, originalScale }) {
  if (!position) return null
  const color2temp = color2.get()
  const colorNew = color
  colorNew.r = color.r
  colorNew.g = color.g
  colorNew.b = color.b
  const bevel = 1;
  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 1
  };
  const Geometry = () => {
    if (extrude == true) { return (<a.extrudeGeometry args={[shape, extrudeSettings]} />) }
    else {
      return (<a.shapeGeometry args={[shape]} />)
    }
  }
  return (
    <a.mesh colorNeedsUpdate={true} castShadow={true} receiveShadow={true} scale={scale} rotation={rotation} position={position.to((x, y, z) => ([x, y, z + index * zOfset]))}
    >
      <a.meshStandardMaterial color={colorNew} opacity={opacity} depthWrite={true} transparent />
      <Geometry />
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
const fragmentShader =
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
float PI = 3.141592654;
float TAU =2.0*3.141592654;

float hash(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,58.233))) * 13758.5453);
}
float pmin(float a, float b, float k) {
  float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}
float hexagon(vec2 p, float r) {
//  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  const vec3 k = 0.5*vec3(-sqrt(3.0),1.0,sqrt(4.0/3.0));
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}
vec2 hextile(inout vec2 p) {
  const vec2 sz       = vec2(1.0, sqrt(3.0));
  const vec2 hsz      = 0.5*sz;
  vec2 p1 = mod(p, sz)-hsz;
  vec2 p2 = mod(p - hsz, sz)-hsz;
  vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
  vec2 n = ((p3 - p + hsz)/sz);
  p = p3;
  n -= vec2(0.5);
  // Rounding to make hextile 0,0 well behaved
  return round(n*2.0)*0.5;
}
float pmax(float a, float b, float k) {
  return -pmin(-a, -b, k);
}
vec2 pmin(vec2 a, vec2 b, float k) {
  vec2 h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}
vec2 pabs(vec2 a, float k) {
  return -pmin(-a, a, k);
}
vec2 dfsharp(vec2 p) {
  vec2 p0 = p;
  vec2 p1 = p;
  vec2 p3 = p;
  const float sm = 0.03;
  p0 = pabs(p0, sm);
  const vec2 n = normalize(vec2(1.0));
  float d0 = abs(dot(n, p0)-0.38)-0.12;
  float d1 = abs(p1.x)-0.025;
  float d2 = dot(n, p0)-0.19;
  float d3 = -p3.x-0.025;
  d2 = pmax(d2, -d3, sm);
  float d = d0;
  d = pmax(d, -d1, sm);
  d = min(d,  d2);
  return vec2(d, p.x > 0.0 ? 1.0 : 0.0);
}
float cellf(vec2 p, vec2 n) {
  const float lw = 0.01;
  return -hexagon(p.yx, 0.5-lw);
}
vec2 df(vec2 p, out vec2 hn0, out vec2 hn1) {
  const float sz = 0.25;
  p /= sz;
  vec2 hp0 = p;
  vec2 hp1 = p+vec2(1.0, sqrt(1.0/3.0));
  hn0 = hextile(hp0);
  hn1 = hextile(hp1);
  float d0 = cellf(hp0, hn0);
  float d1 = cellf(hp1, hn1);
  float d2 = length(hp0);
  float d = d0;
  d = min(d0, d1);
  return vec2(d, d2)*sz;
}
float random (in vec2 st) {
  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))
               * 43758.5453123);
}
float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  // Smooth Interpolation
  // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u = f*f*(3.0-2.0*f);
  // u = smoothstep(0.,1.,f);
  // Mix 4 coorners percentages
  return mix(a, b, u.x) +
          (c - a)* u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
}

vec3 effect(vec2 p, vec2 pp) {
  const float pa = 20.0;
  const float pf = 0.0025;
  const vec3 bcol0 = vec3(0.63, 0.85, 0.5);
  float aa = 4.0/u_resolutions.y;
  vec2 hn0;
  vec2 hn1;
  vec2 df2 = dfsharp(p);
  vec2 dfs2 = dfsharp(p-vec2(0.01, -0.01));
  vec2 pb = p + pa*sin(time*pf*vec2(1.0, sqrt(0.5)));
  vec2 d2 = df(pb, hn0, hn1);
  vec3 col = vec3(0.0);
  float h0 = hash(hn1);
  float l = mix(0.25, 0.75, h0);
  if (hn0.x <= hn1.x+0.5) {
    l *= 0.5;
  }
  if (hn0.y <= hn1.y) {
    l *= 0.75;
  }
  vec2 pos = vec2(p.x*1.5+time*0.3,p.y)*vec2(3.);

  float n = smoothstep(0.,noise(pos),p.x);
  col += l*n ;
  col = mix(col, vec3(0.), smoothstep(aa, -aa, d2.x));
  col *= mix(0.75, 1.0, smoothstep(0.01, 0.2, d2.y));
  col *= 1.25*smoothstep(1.5, 0.25, length(pp));

//  col *= mix(vec3(0.5), vec3(1.0),smoothstep(-0.9, 0.9, sin(0.25*TAU*p.y/aa+TAU*vec3(0.0, 1., 2.0)/3.0)));
  return col;
}
  void main()	{
      vec3 c1 = vec3(0.8,0.2,0.2);
      vec3 c2 = vec3(0.5,0.5,0.5);
      vec2 coord=gl_FragCoord.xy/u_resolutions.xy;
      vec2 mouseFixed=mouse/u_resolutions;
      
      
      vec3 gradient1 =mix(coord.x/(c3),coord.y/(c3),1.);
      //vec3 color= firstMarch*c1;
      //gl_FragColor+=vec4(color,1.);

      vec2 p = -1. + 2. * coord;
      vec2 pp = p;
      p.x *= u_resolutions.x/u_resolutions.y;
      vec3 col = effect(p, pp);
      col = sqrt(col*gradient1);
      gl_FragColor = vec4(col, 0.5);
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
    if (infoBox < 1) {
      setInfoBox((infoBox + 1))
    } else {
      setInfoBox(0)
    }
    console.log(infoBox)
    return (countDown())
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
  function AllSvgs() {
    const { viewport } = useThree()
    function Svg({ animate, extrude, opacity, zOfset, urlIndex, position, rotation, scale, color2, trail, originalScale, }) {
      const [page, setPage] = useState(0)
      useEffect(() => {
        if (animate) {
          setInterval(() => setPage((i) => (i + 1) % urls[urlIndex].length), 3500)
        }
      }, [animate])

      const data = useLoader(SVGLoader, urls[urlIndex][page])
      const shapes = useMemo(() => data.paths.flatMap((g, index) => g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))), [
        data
      ])
      console.log(opacity)
      const transition = useTransition(shapes, {
        from: { opacity: opacity[0], color2: color2[0], scale: scale[0], rotation: rotation[0], position: position[0], opacity: 0, originalScale: { originalScale } },
        enter: { opacity: opacity[1], color2: color2[1], scale: scale[1], rotation: rotation[1], position: position[1], opacity: 1, originalScale: { originalScale } },
        leave: { opacity: opacity[0], color2: color2[2], scale: scale[2], rotation: rotation[2], position: position[0], opacity: 0, originalScale: { originalScale } },
        trail: trail,
      })
      return (
        <>
          <group position={[viewport.width / 2, viewport.height / 2, 0]} rotation={[0, 0, Math.PI]} scale={[0.001, 0.001, 1]}>

            {transition((props, item) => (
              <Shape {...item} {...props} extrude={extrude} zOfset={zOfset} />
            ))}
          </group>
        </>
      )
    }
    const heightShift = useMemo(() => {
      //   alert(JSON.stringify(styles.smallview))
      if (styles.smallview == true) {
        return (100)
      } else {
        return 0
      }
    }, [sizeMain.height])
    return (
      <>
        <Svg infoBox={infoBox} extrude={true} animationIndex={0} animate={false} urlIndex={3} trail={10}
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]}
          scale={[[0, 0, 0], [15, 18, 1], [1, 0.002, -1]]}
          position={[[1, 0, 0], [-4500, -0, -3]]}
          rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]}
          opacity={[0, 1, 0]}
          zOfset={0.001} />{/* 
          <Svg infoBox={infoBox} animationIndex={1} extrude={false} animate={false} urlIndex={0} trail={10} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[1.5, 1, 0.1], [2.65, 2.9, 0.1], [1, 0.002, 0.1]]}
           position={[[1, 0, 0], [-3500, 0, -3]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
           opacity={[0,1,0]}
           zOfset={0.001}  />  
           <Svg infoBox={infoBox} animationIndex={1} extrude={true} animate={false} urlIndex={2} trail={10} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[7, 7, 0.1], [3, 3, 1], [1, 0.002, 0.1]]}
           position={[[1, 1000, 1], [-3000, 7000, 1-1]]}
           rotation={[[0,1, 0, 0], [0.1, 0, 0], [0, 0, 0]]} 
           opacity={[0,0,0]}
           zOfset={0.001}  /> 
           <Svg infoBox={infoBox} animationIndex={0} extrude={true} animate={false} urlIndex={13} trail={1} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[1.5, 1, 0.1], [2, 2, 1], [1, 0.002, 0.1]]}
           position={[[1, 0, 5], [-2000, 1500, 0.5]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
           opacity={[0,1,0]}
           zOfset={0.0001}  /> 
                      <Svg infoBox={infoBox} animationIndex={0} extrude={true} animate={false} urlIndex={13} trail={1} 
          color2={[[0.0151, 0.0151, 0.151], [0, 0, 0], [1, 1, 1]]} originalScale={[1, 1, 1]} 
          scale={[[1.5, 1, 0.1], [2, 2, 1], [1, 0.002, 0.1]]}
           position={[[0, 1500, 0], [-2000, 1500, 0.5]]}
           rotation={[[0, 0, 0], [0, 0, 0], [0, 0, 0]]} 
           opacity={[0,1,0]}
           zOfset={0.001}  /> */}
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
    const bubble = [
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
    return (bubble[0])
  }
  const preset = { value: 0.65, min: 0, max: 1 }
  const bgMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, })
  bgMaterial.side = THREE.DoubleSide
  let bgGeo = new THREE.PlaneGeometry(500, 500)
  function Background() {
    const { viewport } = useThree()
    const [animationTime, setAnimationTime] = useState(0)
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
      <mesh position={[0, -3.3, -100]} rotation={[-0, 0, 0]} castShadow={true} receiveShadow={true} material={bgMaterial} geometry={bgGeo} />
    )
    // <directionalLight intensity={0.5} position={[300, 30000, 2300]}></directionalLight>
    // <ambientLight intensity={0.1} />
  }

  function CamController() {
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
    <Canvas flat linear shadows >
      <Stats showPanel={0} className="stats" />
      <fog attach="fog" args={['black', 0, 30]} />
      <EffectComposer>
        <DepthOfField focusDistance={2} ></DepthOfField>
        <Bloom mipmapBlur luminanceThreshold={0.1} radius={0.5} />
      </EffectComposer>
      <spotLight position={[10, 0, 0]} intensity={1}></spotLight>
      <directionalLight intensity={0}></directionalLight>
      <OrbitControls target0={new THREE.Vector3(1000, 1000, 0)} minDistance={8} enableDamping={true} enablePan={false} maxDistance={10} ref={controllRef1} snap global zoom={0.5} rotation={[0, 0, 1]} minAzimuthAngle={-0.30} maxAzimuthAngle={30} minPolarAngle={0.8} maxPolarAngle={30} />
      <PerspectiveCamera fov={90} near={0.001} far={20000} />
      <Html
        as='div' // Wrapping element (default: 'div')
        distanceFactor={1}>
      </Html>
      <group position={[0,0,-50]}>
      <ParticlesMain></ParticlesMain>
      </group>
      <Html
        center
        scale={2}
        as='div' // Wrapping element (default: 'div')
        distanceFactor={10} // 
      >
      </Html>
      <Suspense fallback={null}>
        <AllSvgs></AllSvgs>
      </Suspense>
      <Background></Background>
    </Canvas>
  )
}
