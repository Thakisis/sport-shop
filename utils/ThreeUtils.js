import * as THREE from 'three'
import { GLTFLoader, KTX2Loader, DRACOLoader } from 'three-stdlib'

//create loader instances
const loader = new THREE.TextureLoader()
const gltfloader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const ktx2Loader = new KTX2Loader()
// setup loaders extensions









//update uniforms of material on change parameters
export function updateColor(material, shader, uniform, color) {

    shader.uniforms[uniform].value = new THREE.Color(color)
}

//function to generate texture using SVG
//to do Editor and full texture
export async function updateNumber(shader) {

    const svgEl = document.getElementById("svgNumber")
    const svgTexture = await svgToPng({ domSvg: svgEl, width: 2048, quality: 1 })
    shader.uniforms["Number"].value = svgTexture
}

