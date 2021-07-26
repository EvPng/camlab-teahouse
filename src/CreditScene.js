import React, { useRef } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { Text, useAspect } from "@react-three/drei";
import cover from './img/Tea_1.17.1.png';
import useStore from './store';

const creditRaw = [`哈佛大学中国艺术实验室出品`, 
`Presented by Harvard FAS Chinese Art Media Lab`, 
`总策划:  汪悦进；吕晨晨`, `Director:  Eugene Wang; Chenchen Lu`, 
`项目经理:  邓莹晶`, `Project Manager:  Yingjing Deng`, 
`研究助理:  周忻贝; 彭雪扬; 方炜宁`, `Research Assistant:  Beryl Zhou; April Peng; Weining Fang`, 
`视频拍摄:  苏禹宁; 李铭悦; 左刘季一; 黎若宇; 陈正尧; 谢雨彤`, `Filming Team:  Yuning Su; Mingyue Li; Fletcher Zuo; Ruoyu Li; Aaron Chen; Jessie Xie`, 
`视频剪辑:  左刘季一`, `Video Editor: Fletcher Zuo`, 
`音效设计:  王武剑`, `Sound Designer: Wujian Wang`, 
`网页编程:  彭诗依`, `Web Programmer: Shiyi Peng`, 
`页面视觉设计:  王汕`, `UI Designer: Sammi Wang`, 
`市场助理:  潘励之；杨亦嘉; 陈明佳`, `Marketing Assistant:  Elenore Pan; Alina Yang; Sabrina Chen`]

const Image = ({ hovered, setHover, setStage }) => {
    const texture = useLoader(THREE.TextureLoader, cover);
    const [x, y] = useAspect("cover", 960, 544);
    return (
        <mesh position={[-7, 0, 0]} scale={[x, y, 1]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("landing")}>
            <planeBufferGeometry attach="geometry" args={[0.3, 0.3]} />
            <meshBasicMaterial attach="material" map={texture} color={hovered ? "#0C0F12" : '#DCCEC5'} />
        </mesh>
    )
}


const CreditScene = ({ hovered, setHover, setStage, trackShape }) => {

    // const mesh = useRef();

    // useFrame(() => {
    //     mesh.current.position.y = mesh.current.position.y + 0.05;
    // })

    return (
        creditRaw.map((line, index) => (
            <>
                <Text
                    position={[6, 4.8-index/2, 0]}
                    color="#D3D3D3"
                    font={index % 2 === 0 ? "/OPPOSans-R.ttf" : "/DMSans-Regular.ttf"}
                    fontSize={0.28}
                    maxWidth={60}
                    lineHeight={1}
                    letterSpacing={0.02}
                    textAlign={'left'}
                >
                    {line}
                </Text>
                <Image hovered={hovered} setHover={setHover} setStage={setStage} />
                {/* <mesh castShadow position={[-3, -3, 3]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={() => setStage("landing")} >
                    <circleBufferGeometry args={[1, 32]} />
                    <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.8} />
                </mesh> */}
                {/* <mesh position={[-4, 0.5, 3]} scale={[0.24, 0.2, 1]} rotation={[0, 0, Math.PI / 2]}>
                    <shapeBufferGeometry attach="geometry" args={[trackShape, 12]} />
                    <meshPhongMaterial color={hovered ? '#DCCEC5' : "#0C0F12"} transparent={true} opacity={0.2}  />
                </mesh> */}
                <Text position={[-7.5, 0.65, 0.5]} color={hovered ? '#a8a7ab' : '#DCCEC5'} fontSize={0.32} font="/OPPOSans-R.ttf">重新体验</Text>
                <Text position={[-5.8, 0.65, 0.5]} color={hovered ? '#a8a7ab' : '#DCCEC5'} fontSize={0.32} font="/DMSans-Regular.ttf">|  Start Over</Text>
            </>
        ))
    );
};

export default CreditScene;