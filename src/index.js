import * as THREE from 'three';
import ReactDOM from 'react-dom';
import React, { Suspense, useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber';
import { Physics, useBox, useCylinder, usePlane, useSphere } from '@react-three/cannon';
import { MeshDistortMaterial } from '@react-three/drei';

// import { a, useSpring } from "@react-spring/three"
// import create from 'zustand'
import useStore from './store';
import VideoPlane from './VideoScene';
import Interface from './Interface';
import lerp from 'lerp';
import './styles.css';


function Plane({ ...props }) {
    const [ref] = usePlane(() => ({
        material: { friction: 0.0, restitution: 0.2 },
        ...props
    }))
    return (
        <mesh ref={ref}>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#575757" colorWrite={false} depthWrite={false} renderOrder={1} />
        </mesh>
    )
}

function Background({ ...props }) {
    const [ref] = usePlane(() => ({
        material: { friction: 0.0, restitution: 0.2 },
        ...props
    }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#292929" transparent={true} opacity={0.5} />
        </mesh>
    )
}

function Box({ mouse }) {
    const { size, viewport } = useThree()
    const aspect = size.width / viewport.width

    const [ref, api] = useBox(() => ({ 
        mass: 1, 
        args: [2, 2, 6], 
        type: 'Static'
    }))
        // isKinematic: true }))

    useFrame(state => {
        const t = state.clock.getElapsedTime()
        // api.position.set(Math.sin(t * 2) * 9, Math.cos(t * 2) * 5, 3)
        api.position.set(mouse.current[0] / aspect, - mouse.current[1] / aspect, -3)
        api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0)
    })

    return (
        <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" args={[2, 2, 6]} />
            {/* <meshLambertMaterial attach="material" color={"#333232"} side={THREE.DoubleSide} /> */}
            <meshLambertMaterial colorWrite={false} depthWrite={false} renderOrder={1} />
        </mesh>
    )
}

function Obstruction() {
    const stage = useStore(state => state.stage);

    const [ref] = useBox(() => ({
        mass: 1, 
        args: [17, 10, 29.5], 
        position: [0, 0, -15], 
        type: 'Static'
    }))

    return (
        <mesh ref={ref} >
             <boxBufferGeometry attach="geometry" args={[17, 10, 29.5]} />
             {/* <meshLambertMaterial attach="material" color={"#333232"} side={THREE.DoubleSide} /> */}
             <meshLambertMaterial colorWrite={false} depthWrite={false} renderOrder={1} />
        </mesh>
    )
}

function InstancedSpheres({ number = 100 }) {
    const stage = useStore(state => state.stage)
    const timer = useStore(state => state.timer)
    const speed = useStore(state => state.speed)
    const distort = useStore(state => state.distort)
    const textExist = useStore(state => state.textExist)

    const font = useLoader(THREE.FontLoader, '/LongCang_Regular.json')
    const config = useMemo(() => ({ 
        font,
        size: 1.5,
        height: 0.03, //0.05
        curveSegments: 12, //6
        // bevelEnabled: true,
        // bevelThickness: 0.03, //0.01
        // bevelSize: 0.02, //0.01
        // bevelOffset: 0,
        // bevelSegments: 3, //3
    }), [font])

    const [ref] = useSphere(index => ({
        mass: 1,
        // fixedRotation: true,
        position: [(9 + Math.random() * 8) * (Math.round(Math.random()) ? -1 : 1), (4 + Math.random() * 3) * (Math.round(Math.random()) ? -1 : 1), Math.random() - 24],
        // position: [-4 + (Math.random() * 8), (-2 + Math.random() * 4), Math.random() - 24],
        // position: [-5, 0, 0],
        material: { friction: 0.1, restitution: 0.2 },
        linearDamping: 0.99,
        angularDamping: 0.99,
        angularFactor: [0.05, 0.05, 0.1],
        args: Math.random() * 2 + 0.5
    }))

    const colors = useMemo(() => {
        const shadesOfGray = ['#e1ded6', '#b8b4b0', '#c9c5c5', '#8c8d8f', '#a8a7ab']
        const array = new Float32Array(number * 3)
        const color = new THREE.Color()
        for (let i = 0; i < number; i++)
        color
            .set(shadesOfGray[Math.floor(Math.random() * 5)])
            .convertSRGBToLinear()
            .toArray(array, i * 3)
        return array
    }, [number])

    return (

        <instancedMesh ref={ref} castShadow={textExist} visible={textExist} args={[null, null, number]}>
            <textBufferGeometry attach="geometry" args={["念", config]}>
                <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
            </textBufferGeometry>
            <MeshDistortMaterial attach="material" vertexColors={THREE.VertexColors} emmisive={'white'} 
                emmisiveIntensity={0.3} roughness={0.2} speed={speed} 
                distort={distort} radius={stage==="textDisappear" ? ((173 - timer) * 0.04) : Math.log(timer - 16) * 0.3} />
        </instancedMesh>

    )
}



function Rig({ mouse, children }) {
    const ref = useRef()
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.x = lerp(ref.current.position.x, mouse.current[0] / aspect / 50, 0.05);
            ref.current.rotation.x = lerp(ref.current.rotation.x, 0 + mouse.current[1] / aspect / 300, 0.05);
        }
    })
    return <group ref={ref}>{children}</group>
}

function App() {
    const mouse = useRef([0, 0])
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => {
        mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]
    }, [])

    const stage = useStore(state => state.stage)
    // const textExist = useStore(state => state.textExist);
    

    return (
        <Canvas concurrent 
                pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
                shadowMap gl={{ alpha: false }} 
                camera={{ position: [0, 0, 10] }} 
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.LinearToneMapping
                    gl.setClearColor(new THREE.Color('#000000'))
                  }}
                colorManagement={false} 
                onMouseMove={onMouseMove} >
            <Suspense fallback={null}>
                <hemisphereLight intensity={1} />
                <Rig mouse={mouse} >
                    <spotLight position={[30, 0, 30]} angle={0.7} distance={175} penumbra={1} intensity={1.5} castShadow shadow-mapSize-width={128} shadow-mapSize-height={128} />
                    {/* stage > 0 && */}
                    {(stage !=="landing" && stage !=="credit") && 
                        <VideoPlane /> 
                    }
                    <Interface />
                </Rig>
            {/* {(stage ===3) && <Sparks count={20} mouse={mouse} colors={['#BFBFBF', '#F2F1EF', '#BDC3C7', '#ECF0F1', '#D2D7D3', '#ABB7B7']} radius={35} />} */}
                <Physics gravity={[0, 0, 3]}>
                    <Background position={[0, 0, -30]} />
                    <Plane position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
                    <Plane position={[-19, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
                    <Plane position={[19, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
                    <Plane position={[0, 9, 0]} rotation={[Math.PI / 2, 0, 0]} />
                    <Plane position={[0, -9, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                    <Obstruction />
                    <Box mouse={mouse} />
                    <InstancedSpheres number={isMobile ? 50 : 200} />
                </Physics>
            </Suspense>
        </Canvas>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
