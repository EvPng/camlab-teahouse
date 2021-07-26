import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from 'react-three-fiber';
import { useAspect, useTexture, Box, shaderMaterial } from "@react-three/drei";
import useStore from './store';
import videoUrl from './video/Universe_in_the_Tea_Graded_v2.mp4';

export default function VideoPlane() {

    const stage = useStore(state => state.stage);
    const setStage = useStore(state => state.setStage);
    const paused = useStore(state => state.paused);
    const setPause = useStore(state => state.setPause);
    const setTextExist = useStore(state => state.setTextExist);
    const setTimer = useStore(state => state.setTimer);
    const setSpeed = useStore(state => state.setSpeed);
    const setDistort = useStore(state => state.setDistort);

    // const [isPlaying, setPlaying] = useState(false); // passive state receiving
    // const [paused, setPause] = useState(false); // active state setting
    const [x, y] = useAspect("cover", 960, 544);

    // const [loading, setLoading] = useState(true);

    const [video] = useState(()=>{
        const vd = document.createElement("video");
        vd.src = videoUrl;
        vd.crossOrigin = "Anonymous";
        vd.preload = "meta";
        vd.loop = false;
        vd.autoplay = false;
        vd.muted = false;
        // vd.poster = './video/loading.gif';
        vd.addEventListener('ended', () => {
            setStage("credit");
            // setPause(true);
            // vd.src = null;
            vd.muted = true;
            vd.loop = false;
        }, true);
        return vd;
    });

    const onBlur = () => {
        console.log('Tab is blurred');
        setPause(true);
    };

    useEffect(() => {
        window.addEventListener('blur', onBlur);
        return () => {
            window.removeEventListener('blur', onBlur);
        }
    });

    useFrame(state => {
        setTimer(video.currentTime);
        console.log(stage);
        switch (stage) {
            case "landing":
                video.load();
                let playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        video.pause();
                    })
                    .catch(error => {
                        console.log("Video hasn't started autoplay.")
                    });
                }
                break;
            case "start":
                video.play();
                // setPlaying(true);
                if (video.currentTime>=17.15 && video.currentTime<= 17.25) {
                    console.log(video.currentTime);
                    setStage("interactionA");
                }
                break;
            case "interactionA":
                video.playbackRate = 0.1;
                break;
            case "textAppear":
                video.playbackRate = 1;
                setTextExist(true);
                if (video.currentTime>=52.21 && video.currentTime<=52.31) {
                    console.log(video.currentTime);
                    setStage("interactionB");
                }
                break;
            case "interactionB":
                video.playbackRate = 0.1;
                break;
            case "textCollide":
                video.playbackRate = 1;
                setSpeed(9);
                setDistort(0.5);
                if (video.currentTime>=88.51 && video.currentTime<=88.61) {
                    console.log(video.currentTime);
                    setStage("interactionC");
                }
                break;
            case "interactionC":
                video.playbackRate = 0.1;
                break;
            case "textTremble":
                video.playbackRate = 1;
                setDistort(0.7);
                if (video.currentTime>=136.15 && video.currentTime<= 136.25) {
                    console.log(video.currentTime)
                    setStage("textDisappear");
                }
                break;
            case "textDisappear":
                setSpeed(2);
                setDistort(0.3);
                if (video.currentTime>=172.55 && video.currentTime<= 172.75) {
                    console.log(video.currentTime);
                    // setStage("ending");
                    setTextExist(false);
                }
                break;
            default:
                break;
        }

        paused ? video.pause() : video.play();
    })

    const handleDoubleClick = (e) => {
        // console.log('double!');
        // setPlaying(!isPlaying);
        setPause(!paused);
        // console.log(video.paused)
    }

    return (
        <>
            <mesh position={[0, 0, 0]} scale={[x, y, 1]} onDoubleClick={handleDoubleClick}>
                <planeBufferGeometry args={[0.6, 0.6]} />
                <meshBasicMaterial>
                    <videoTexture attach="map" args={[video]} />
                </meshBasicMaterial>
            </mesh>
        </>
    );
}

