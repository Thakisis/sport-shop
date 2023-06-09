"use client"
import { useEffect } from 'react'
import { Environment, Center, CameraControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Tshirt } from "@/components/Models"
import { useStore } from "@/Store"
export function Canvasr3f({ children }) {

    const shader = useStore((state) => state.Shaders)
    const { setMaterial } = useStore((state) => state.Actions)
    useEffect(() => {
        //const material = createMaterial(shader)
        const material = "aaa"
        setMaterial(material)
    }, [])
    return (
        <Canvas shadows
            camera={{ position: [0, 0, 2.5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            eventPrefix="client"
            style={{ position: "fixed", width: "100vw", height: "100vh", top: 0, left: 0, }}
        >
            <CameraControls
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
            />
            <Environment preset="city" />
            <Center>
                <Tshirt />
            </Center>

        </Canvas>
    )
}
