import create from 'zustand';

const useStore = create((set) => ({
    stage: "landing",
    setStage: (stage) => set({ stage }),
    paused: false,
    setPause: (paused) => set({ paused }),
    textExist: false,
    setTextExist: (textExist) => set({ textExist }),
    speed: 2,
    setSpeed: (speed) => set({ speed }),
    distort: 0.3,
    setDistort: (distort) => set({ distort }),
    timer: 0.0,
    setTimer: (timer) => set({ timer })
}))

export default useStore;