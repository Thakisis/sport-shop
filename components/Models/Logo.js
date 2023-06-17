
import React, { useRef } from 'react'
import { useGLTF, useMatcapTexture, Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function Logo(props) {
  const logoRef = useRef()
  const [matcap] = useMatcapTexture('C35C04_F9C30C_EE9F04_E08304')
  const { nodes, materials } = useGLTF('/models/logobjo-transformed.glb')

  useFrame(() => {
    logoRef.current.rotation.y += 0.01
  })
  return (
    <group  {...props} dispose={null} >
      <Billboard
        position={[0, 0, -0]}
        follow={true}
        lockX={true}
        lockY={true}
        lockZ={true} // Lock the rotation on the z axis (default=false)
      >
        <mesh ref={logoRef} geometry={nodes.path2705.geometry} scale={[2, 2, .5]} matrixAutoUpdate={false}>
          <meshMatcapMaterial matcap={matcap} />
        </mesh>
      </Billboard>
    </group>
  )
}

useGLTF.preload('/models/logobjo-transformed.glb')
