import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader } from 'react-three-fiber';
import useStore from './store';
import { Text } from '@react-three/drei';
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import CreditScene from './CreditScene';

function Interface() {

    const stage = useStore(state => state.stage)
    const setStage = useStore(state => state.setStage)
    const timer = useStore(state => state.timer)
    const paused = useStore(state => state.paused);
    const setPause = useStore(state => state.setPause);

    const [hovered, setHover] = useState(false)
    // const [endHovered, setEndHover] = useState(false)
    // const { scale, color } = useSpring({ scale: hovered ? [1.5, 1.5, 1] : [1, 1, 1], color: hovered ? '#232424' : 'black' })
    // const { scale, color } = useMemo(() => { 
    //     const s = hovered ? [1.5, 1.5, 1] : [1, 1, 1];
    //     const c = hovered ? '#232424' : 'black'
    //     return { s, c }
    // }, [])
    useEffect(() => void (document.body.style.cursor = hovered ? "pointer" : "auto"), [hovered])

    // const specularShininess = Math.pow( 2, 0.8 * 10 );
    // const specularColor = new THREE.Color(0.8, 0.8, 0.8)

    const trackShape = useMemo(() => {
        return new THREE.Shape()
                    .moveTo(0, 0)
                    .lineTo( 0, 8 )
                    .absarc( 1, 8, 1, Math.PI, 0, true )
                    .lineTo( 2, 0 )
                    .absarc( 1, 0, 1, 2 * Math.PI, Math.PI, true )
    },[])


    const loadGif = useLoader(THREE.TextureLoader, '/loading.png');
    const animator = new PlainAnimator(loadGif, 1, 7, 7, 2);
    const loadTex = animator.init();
    const loadMesh = useRef();
    const animate = () => {
        animator.animate();
        requestAnimationFrame(animate);
    };

    return (
        <>
        {(stage==="landing") && (
            <>
            <Text position={[0, 2, 0]} color={'#DCCEC5'} fontSize={1.85} font="/LongCang-Regular.woff">一茶一宇宙 | Tea Cosmos</Text>
            <mesh position={[1.66, -2, -0.1]} scale={[0.5, 0.4, 1]} rotation={[0, 0, Math.PI / 2]}>
                <shapeBufferGeometry attach="geometry" args={[trackShape, 12]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.6}  />  {/* specular={specularColor} shininess={specularShininess} */}
            </mesh>
            <mesh position={[0, -1.49, 0]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("start")} >
                <Text position={[-0.6, 0, 0]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.42} font="/OPPOSans-R.ttf">开 始 </Text>
                <Text position={[0.6, 0, 0]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.42} font="/DMSans-Regular.ttf"> | Begin</Text>
            </mesh>
            {/* <a.mesh position={[0, -1.5, 0]} scale={scale} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={inc} >
                <Text color={'#DCCEC5'} fontSize={0.5} font="/OPPOSans-R.ttf">开 始</Text>
            </a.mesh> */}
            </>
        )}
        {(stage==="start" && timer<=0.0) && 
        <>
            <mesh ref={loadMesh} position={[0, 0, 1]} scale={[7, 1, 1]}>
                    <planeBufferGeometry args={[0.3, 0.3]} />
                    <meshPhongMaterial map={loadTex} transparent />
            </mesh>
            {animate()}
        </>}
        {(stage==="interactionA" && !paused) && (
            <>
            <mesh castShadow position={[0, 0, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("textAppear")} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.8} />
            </mesh>
            {/* <a.mesh castShadow position={[0, 0, 3]} scale={scale} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={inc} >
                <circleBufferGeometry args={[0.6, 32]} />
                <a.meshPhongMaterial color={color} transparent={true} opacity={0.6} specular={specularColor} shininess={specularShininess} />
            </a.mesh> */}
            <Text position={[0, 0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">敲击茶饼</Text>
            <Text position={[0, -0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">Hit The Tea Cake</Text>
            </>
        )}
        {(stage==="interactionB" && !paused) && (
            <>
            <mesh castShadow position={[0, 0, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("textCollide")} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.8} />
            </mesh>
            <Text position={[0, 0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">点火</Text>
            <Text position={[0, -0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">Light The Fire</Text>
            </>
        )}
        {(stage==="interactionC" && !paused) && (
            <>
            <mesh castShadow position={[0, 0, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("textTremble")} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.8} />
            </mesh>
            <Text position={[0, 0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">加水</Text>
            <Text position={[0, -0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">Add Water</Text>
            </>
        )}
        {/* {(stage==="endInteraction") && (
            <>
            <mesh castShadow position={[-2, 0, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("landing")} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.6} specular={specularColor} shininess={specularShininess} />
            </mesh>
            <Text position={[-2, 0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">重来</Text>
            <Text position={[-2, -0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">Start Over</Text>
            <mesh castShadow position={[2, 0, 3]} onPointerOver={() => setEndHover(true)} onPointerOut={() => setEndHover(false)} onClick={() => setStage("credit")} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={endHovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.6} specular={specularColor} shininess={specularShininess} />
            </mesh>
            <Text position={[2, 0.15, 3.1]} color={endHovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">结束</Text>
            <Text position={[2, -0.15, 3.1]} color={endHovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">End</Text>
            </>
        )} */}
        {(stage==="credit") && (
            <CreditScene hovered={hovered} setHover={setHover} setStage={setStage} trackShape={trackShape} />
        )}
        {(paused && stage!== "credit") && (
            <>
            <mesh castShadow position={[0, 0, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setPause(false)} >
                <circleBufferGeometry args={[1, 32]} />
                <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.8} />
            </mesh>
            <Text position={[0, 0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/OPPOSans-R.ttf">继续播放</Text>
            <Text position={[0, -0.15, 3.1]} color={hovered ? '#1f1f1f' : '#DCCEC5'} fontSize={0.22} font="/DMSans-Regular.ttf">Continue Playing</Text>
            </>
        )}
        </>
    )
}

export default Interface;