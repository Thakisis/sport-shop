"use client"
import { Environment, Center, CameraControls, Stage } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as Models from "@/components/Models"
import { useStore } from "@/Store"
import { SetWebgl } from './SetWebgl'
export function Canvasr3f({ children }) {



    const { mesh, material } = useStore((state) => state.threeSelected)
    const Model = mesh ? <mesh geometry={mesh.geometry} material={material}></mesh> : <group></group>
    return (
        <Canvas shadows
            camera={{ position: [0, 0, 2.5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            eventPrefix="client"
            style={{ position: "fixed", width: "100vw", height: "100vh", top: 0, left: 0, }}
        >
            <CameraControls></CameraControls>
            <SetWebgl />
            <Models.Logo />
            <Environment preset="city" />
            <Center shadows="accumulative" precise disableZ
                onCentered={({ container, height }) => container.scale.setScalar(1)}
            >

                {Model}
            </Center>







        </Canvas>
    )
}
