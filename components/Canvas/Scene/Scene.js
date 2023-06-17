"use client"
import { Environment, Center, CameraControls, Stage } from "@react-three/drei"
import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { useStore } from "@/Store"





export default function Scene({ children }) {
    const setThree = useStore(state => state.Actions.setThree)
    const threeParams = useStore(state => state.threeParams)
    const threeReferences = useThree()


    const { mesh, material } = useStore((state) => state.threeSelected)

    const Model = mesh ? <mesh geometry={mesh.geometry} material={material}></mesh> : <group></group>
    return (
        <>
            <group>

                <Environment preset="city" />
                <Center shadows="accumulative" precise disableZ
                    onCentered={({ container, height }) => container.scale.setScalar(1)}
                >
                    <mesh>
                        <boxGeometry />
                    </mesh>

                    {Model}
                </Center>
            </group>
        </>
    )
}
