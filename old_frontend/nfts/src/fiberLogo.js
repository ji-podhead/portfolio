import * as THREE from 'three'
import { useMemo, useRef,useState,useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail, Float, Line, Sphere, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSpring, animated } from '@react-spring/three'
import { a } from "@react-spring/three";
import { SVGLoader } from 'three-stdlib'
import a0 from "./images/logo/svg/a0.svg"
import SvgLoaderTest from './canvas3d'
//<a href="https://iconscout.com/illustrations/welcome" target="_blank">Welcome Illustration</a> by <a href="https://iconscout.com/contributors/pixel-true-designs">Pixel True</a> on <a href="https://iconscout.com">IconScout</a>
export default function Fiberlogo({open}) {
    const [animating, setAnimating] = useState(false)
   let [fader,setFader]=useState(0)
    const config = { mass: 5, tension: 2000, friction: 200 };
    const [opacitySprings, opacityApi] = useSpring(() => ({
        immediate: false,
        opacity: 0,
       onChange: props => {
           console.log(props.value.opacity)
          setFader(props.value.opaciaty)
       },
        onStart: (() => { setAnimating(true) }),
        onRest: (() => { setAnimating(false) }),
        config: config.slow,
    }))
    opacityApi.start(
        {
            from: {  opacity:0 }, to: {    opaciaty:0 },
        })
    useEffect(()=>{
        if(open==true){
            
        opacityApi.start(
            {
                from: { opacity:0}, to: {   opaciaty:1},
            })
        }
        else{
            opacityApi.start(
                {
                    from: { opacity:1}, to: {   opaciaty:0},
                })  
        }
        
    },[open])
    const [active, setActive] = useState(0);
    // create a common spring that will be used later to interpolate other values
    const { spring } = useSpring({
      spring: active,
      config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
    });
    // interpolate values from commong spring
    const scale = spring.to([0, 1], [1, 5]);
    const rotation = spring.to([0, 1], [0, Math.PI]);
    const color = spring.to([0, 1], ["#6246ea", "#e45858"]);
    return (
    <Canvas camera={{ position: [0, 0, 10] }} gl={{premultipliedAlpha:0}}>
    <a.mesh
        rotation-y={rotation}
        scale-x={scale}
        scale-z={scale}
        onClick={() => setActive(Number(!active))}
      />
      <SvgLoaderTest></SvgLoaderTest>
     {/* <color attach="background" args={['black']} />*/}
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
      <Stars saturation={0} count={fader*400} speed={1} />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
function Atom(props) {
  const points = useMemo(() => new THREE.EllipseCurve(1, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
  return (
    <group {...props}>
      {/*   <Line worldUnits points={points} color="turquoise" lineWidth={0.3} rotation={[0, 0, -1]} />
        <Electron position={[0, 0, 0.5]} rotation={[0, 0, -Math.PI / 3]} speed={7} />
      <Sphere args={[0.55, 64, 64]}>
        <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
      </Sphere>*/}
    </group>
  )
}
function Electron({ radius = 20, speed = 1, ...props }) {
  const ref = useRef()
// useFrame((state) => {
//   const t = state.clock.getElapsedTime() * speed
//   ref.current.position.set(Math.sin(t) * radius, (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 2, 0)
// })
  return (
    <group {...props}>
      <Trail local width={5} length={6} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
        <mesh ref={ref}>
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  )
}
