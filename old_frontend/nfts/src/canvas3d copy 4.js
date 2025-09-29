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
      vec3 c11 = vec3(255./185.,255./112., 255./177.);// Source edited by David Hoskins - 2013.
    float RING_MIN= 0.2;
    float RING_MAX =0.27;
      // I took and completed this http://glsl.heroku.com/e#9743.20 - just for fun! 8|
      // Locations in 3x7 font grid, inspired by http://www.claudiocc.com/the-1k-notebook-part-i/
      // Had to edit it to remove some duplicate lines.
      // ABC  a:GIOMJL b:AMOIG c:IGMO d:COMGI e:OMGILJ f:CBN g:OMGIUS h:AMGIO i:EEHN j:GHTS k:AMIKO l:BN m:MGHNHIO n:MGIO
      // DEF  o:GIOMG p:SGIOM q:UIGMO r:MGI s:IGJLOM t:BNO u:GMOI v:GJNLI w:GMNHNOI x:GOKMI y:GMOIUS z:GIMO
      // GHI
      // JKL 
      // MNO
      // PQR
      // STU
      
      vec2 coord;
      
      #define font_size 20. 
      #define font_spacing .05
      #define STROKEWIDTH 0.05
      #define PI 3.14159265359
      #define A_ vec2(0.,0.)
      #define B_ vec2(1.,0.)
      #define C_ vec2(2.,0.)
      //#define D_ vec2(0.,1.)
      #define E_ vec2(1.,1.)
      //#define F_ vec2(2.,1.)
      #define G_ vec2(0.,2.)
      #define H_ vec2(1.,2.)
      #define I_ vec2(2.,2.)
      #define J_ vec2(0.,3.)
      #define K_ vec2(1.,3.)
      #define L_ vec2(2.,3.)
      #define M_ vec2(0.,4.)
      #define N_ vec2(1.,4.)
      #define O_ vec2(2.,4.)
      //#define P_ vec2(0.,5.)
      //#define Q_ vec2(1.,5.)
      //#define R_ vec2(1.,5.)
      #define S_ vec2(0.,6.)
      #define T_ vec2(1.,6.)
      #define U_ vec2(2.0,6.)
      #define A(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,J_,p) + t(J_,L_,p);caret.x += 1.0;
      #define B(p) t(A_,M_,p) + t(M_,O_,p) + t(O_,I_, p) + t(I_,G_,p);caret.x += 1.0;
      #define C(p) t(I_,G_,p) + t(G_,M_,p) + t(M_,O_,p);caret.x += 1.0;
      #define D(p) t(C_,O_,p) + t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p);caret.x += 1.0;
      #define E(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,L_,p) + t(L_,J_,p);caret.x += 1.0;
      #define F(p) t(C_,B_,p) + t(B_,N_,p) + t(G_,I_,p);caret.x += 1.0;
      #define G(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,U_,p) + t(U_,S_,p);caret.x += 1.0;
      #define H(p) t(A_,M_,p) + t(G_,I_,p) + t(I_,O_,p);caret.x += 1.0;
      #define I(p) t(E_,E_,p) + t(H_,N_,p);caret.x += 1.0;
      #define J(p) t(E_,E_,p) + t(H_,T_,p) + t(T_,S_,p);caret.x += 1.0;
      #define K(p) t(A_,M_,p) + t(M_,I_,p) + t(K_,O_,p);caret.x += 1.0;
      #define L(p) t(B_,N_,p);caret.x += 1.0;
      #define M(p) t(M_,G_,p) + t(G_,I_,p) + t(H_,N_,p) + t(I_,O_,p);caret.x += 1.0;
      #define N(p) t(M_,G_,p) + t(G_,I_,p) + t(I_,O_,p);caret.x += 1.0;
      #define O(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,G_,p);caret.x += 1.0;
      #define P(p) t(S_,G_,p) + t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p);caret.x += 1.0;
      #define Q(p) t(U_,I_,p) + t(I_,G_,p) + t(G_,M_,p) + t(M_,O_, p);caret.x += 1.0;
      #define R(p) t(M_,G_,p) + t(G_,I_,p);caret.x += 1.0;
      #define S(p) t(I_,G_,p) + t(G_,J_,p) + t(J_,L_,p) + t(L_,O_,p) + t(O_,M_,p);caret.x += 1.0;
      #define T(p) t(B_,N_,p) + t(N_,O_,p) + t(G_,I_,p);caret.x += 1.0;
      #define U(p) t(G_,M_,p) + t(M_,O_,p) + t(O_,I_,p);caret.x += 1.0;
      #define V(p) t(G_,J_,p) + t(J_,N_,p) + t(N_,L_,p) + t(L_,I_,p);caret.x += 1.0;
      #define W(p) t(G_,M_,p) + t(M_,O_,p) + t(N_,H_,p) + t(O_,I_,p);caret.x += 1.0;
      #define X(p) t(G_,O_,p) + t(I_,M_,p);caret.x += 1.0;
      #define Y(p) t(G_,M_,p) + t(M_,O_,p) + t(I_,U_,p) + t(U_,S_,p);caret.x += 1.0;
      #define Z(p) t(G_,I_,p) + t(I_,M_,p) + t(M_,O_,p);caret.x += 1.0;
      #define STOP(p) t(N_,N_,p);caret.x += 1.0;
      vec2 caret_origin = vec2(3.0, .7);
      vec2 caret;
      //-----------------------------------------------------------------------------------
      float minimum_distance(vec2 v, vec2 w, vec2 p)
      {	// Return minimum distance between line segment vw and point p
          float l2 = (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); //length_squared(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
          if (l2 == 0.0) {
          return distance(p, v);   // v == w case
        }
        // Consider the line extending the segment, parameterized as v + t (w - v).
          // We find projection of point p onto the line.  It falls where t = [(p-v) . (w-v)] / |w-v|^2
          float t = dot(p - v, w - v) / l2;
          if(t < 0.0) {
          // Beyond the 'v' end of the segment
          return distance(p, v);
        } else if (t > 1.0) {
          return distance(p, w);  // Beyond the 'w' end of the segment
        }
          vec2 projection = v + t * (w - v);  // Projection falls on the segment
        return distance(p, projection);
      }
      
      //-----------------------------------------------------------------------------------
      float textColor(vec2 from, vec2 to, vec2 p)
      {
        p *= font_size;
        float inkNess = 0., nearLine, corner;
        nearLine = minimum_distance(from,to,p); // basic distance from segment, thanks http://glsl.heroku.com/e#6140.0
        inkNess += smoothstep(0., 1., 1.- 14.*(nearLine - STROKEWIDTH)); // ugly still
        inkNess += smoothstep(0., 2.5, 1.- (nearLine  + 5. * STROKEWIDTH)); // glow
        return inkNess;
      }
      //-----------------------------------------------------------------------------------
      vec2 grid(vec2 letterspace) 
      {
        return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
      }
      //-----------------------------------------------------------------------------------
      float count = 0.0;
      float gtime;
      float t(vec2 from, vec2 to, vec2 p) 
      {
        count++;
        if (count > gtime*20.0) return 0.0;
        return textColor(grid(from), grid(to), p);
      }
      //-----------------------------------------------------------------------------------
      vec2 r()
      {
        vec2 pos = gl_FragCoord.xy/u_resolutions.xy;
        pos.y -= caret.y;
        pos.x -= font_spacing*caret.x;
        return pos;
      }
      //-----------------------------------------------------------------------------------
      void _()
      {
        caret.x += 1.5;
      }
      //-----------------------------------------------------------------------------------
      void newline()
      {
        caret.x = caret_origin.x;
        caret.y -= .18;
      }
      //-----------------------------------------------------------------------------------
      void main()
      {
        vec2 mouseFixed=mouse/u_resolutions;
        vec2 xy = gl_FragCoord.xy/u_resolutions.xy;
     vec3 gradient1 =mix(gl_FragCoord.x/(c3),gl_FragCoord.y/(c3),1.);


          float time2 = mod(time, 11.0);
          gtime = time2;
      
        float d = 0.;
       // vec3 col = vec3(0.1, .07+0.07*(.5+sin(gl_FragCoord.y*3.14159*1.1+time2*2.0)) + sin(gl_FragCoord.y*.01+time2+2.5)*0.05, 0.1);
       vec3 col = c1*vec3(0.001);
        caret = caret_origin;
        // the quick brown
        newline();
          // fox jumps over 
        d +=  L(r()); d += E(r()); d += O(r());d += S(r());_();
        d += N(r()); d += F(r()); d += T(r()); _();
        d += D(r()); d += E(r()); d += M(r()); d += O(r()); _();
          d = clamp(d* (.75+sin(gl_FragCoord.x*PI*.5-time2*4.3)*.8), 0.0, 1.0);
          
          vec2  uv     = gl_FragCoord.xy/u_resolutions.xy;
          float ratio  = u_resolutions.x / u_resolutions.y;
          float dither = fract(dot(vec2(sin(time*0.01)+0.,-31.0),gl_FragCoord.xy)/71.0)-0.5;
          uv   -= vec2( 0.1 );
          uv.x *= ratio;
          uv.y *= 0.75;
          vec4  sines    = sin( (time + uv.y*80.0) * vec4(1.1,2.0234,3.73,2.444) );
          float gradient = min( uv.y, 0.0 );
          float offset   = sines.x*sines.y*sines.z*sines.w*gradient;
          uv   += vec2( offset, 0.0 );
          float dist = dot( uv, uv );
          float ring = step( RING_MIN*RING_MIN, dist ) * step( dist, RING_MAX*RING_MAX );
          d = max( 0.0, d + gradient * 3.0 );
          d = step( 0.5, d*d + dither ) * 0.8 + 0.2;
         // fragColor = vec4( vec3(d), 1.0 );


          col += vec3(d*.5, d, d*.85);
        col *= vec3(.4, .4, .3) + 0.5*pow(100.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), .4 );	
        gl_FragColor = vec4( col, 1.0 );
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

      </group>
      <Html
        center
        scale={2}
        as='div' // Wrapping element (default: 'div')
        distanceFactor={10} // 
      >
      </Html>
      <Suspense fallback={null}>
      {/*<AllSvgs></AllSvgs>*/}
      </Suspense>
      <Background></Background>
    </Canvas>
  )
}
