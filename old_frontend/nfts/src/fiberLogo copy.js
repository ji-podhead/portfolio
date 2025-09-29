import * as THREE from 'three'
import { useMemo, useRef,useState,useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail, Float, Line, Sphere, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSpring, animated } from '@react-spring/three'

export default function Fiberlogo({open}) {
    const [animating, setAnimating] = useState(false)
    let opacity =0
    const config = { mass: 5, tension: 2000, friction: 200 };
    const [opacitySprings, opacityApi] = useSpring(() => ({
        from: { opacity: 0 },
       onChange: props => {
           console.log(props.value.opacity)
          opacity = props.value.opaciaty
       },
        onStart: (() => { setAnimating(true) }),
        onRest: (() => { setAnimating(false) }),
    }))
    useMemo(()=>{
        
        if(open==true){
        opacityApi.start(
            {
                from: {
                 opacity:0
                },
                to: {
                   opaciaty:1
                },
            }
            )
        }
        else{
            opacityApi.start(
                {
                    from: {
                     opacity:1
                    },
                    to: {
                       opaciaty:0
                    },
                }
                )  
        }
    },[open])
    return (
    <Canvas camera={{ position: [0, 0, 10] }}>
        {animating&&<Animations ></Animations>}
     {/* <color attach="background" args={['black']} />*/}
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Atom />
      </Float>
      <Stars saturation={0} count={400} speed={0.5} />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
function Animations(alpha){
    const { scene, gl, camera } = useThree();
    useEffect(()=>{
        gl.setClearAlpha(0)
  },[])
   
    useFrame(()=>{
        gl.setClearAlpha(alpha)
    })
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
