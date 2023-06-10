import * as THREE from 'three'
const loader = new THREE.TextureLoader()
import toImg from 'react-svg-to-image'
import { svgToPng } from './svgToPng'



export async function loadImage(name, textureToLoad) {
    return new Promise((resolve) => {
        loader.load(
            textureToLoad,
            (textureLoaded) => resolve({ name: name, texture: textureLoaded }),
            (textureLoaded) => resolve({ name: name, texture: textureLoaded })
        )
    })
}


export async function createMaterial(shaderInfo, itemList, setShader) {

    const { mapFiles, Zonas } = itemList

    const texturesPromise = mapFiles.map(({ name, file }) => loadImage(name, file))

    const textures = await Promise.all(texturesPromise)
    const texturesUniforms = textures.reduce((acum, { name, texture }) => ({ ...acum, [name]: { value: texture } }), {})
    const zonasUniforms = Zonas.reduce((acum, { un, defaultValue }) => ({ ...acum, [un]: { value: new THREE.Color(defaultValue) } }), {})
    const newUniforms = { ...shaderInfo.uniforms, ...texturesUniforms, ...zonasUniforms }
    const { frHeader, frBody } = shaderInfo
    const material = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide })
    const uniforms2 = {
        Zones1: { value: textures[0].texture },
        background: { value: new THREE.Color(0xff00ff) },
        ColorA: { value: new THREE.Color(0xff0000) },
        ColorB: { value: new THREE.Color(0x00ff00) },
        ColorC: { value: new THREE.Color(0x0000ff) },
    }
    material.defines = { USE_UV: "" }
    let savedShader = null

    material.onBeforeCompile = shader => {

        shader.uniforms = { ...shader.uniforms, ...newUniforms }
        shader.fragmentShader = frHeader + shader.fragmentShader
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <map_fragment>`, frBody)
        setShader(shader)
    }

    return { material }
}
export function updateColor(material, shader, uniform, color) {

    shader.uniforms[uniform].value = new THREE.Color(color)
}

export async function updateNumber(shader) {

    const svgEl = document.getElementById("svgNumber")
    const svgTexture = await svgToPng({ domSvg: svgEl, width: 2048, quality: 1 })


    //let mytexture = new THREE.CanvasTexture(svgEl)
    //console.log(mytexture)
    shader.uniforms["Number"].value = svgTexture



}

