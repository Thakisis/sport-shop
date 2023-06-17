import * as THREE from 'three'
import { GLTFLoader, KTX2Loader, DRACOLoader } from 'three-stdlib'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

import { shaderFragments, modelList, patternsList } from '@/config'
import { svgToPng } from './svgToPng'
import { PATTERN, COLOR, SHADER } from '@/config/Constants'
import * as dshader from './defaultShader'

//create loader instances
const loader = new THREE.TextureLoader()
const gltfloader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const ktx2Loader = new KTX2Loader()
// setup loaders extensions

export async function loadModel({ modelId, modelFile, gl, onProgress }) {
    dracoLoader.setDecoderPath('/libs/draco/')
    gltfloader.setDRACOLoader(dracoLoader)
    ktx2Loader.setTranscoderPath('/libs/basis/')
    ktx2Loader.detectSupport(gl)
    gltfloader.setKTX2Loader(ktx2Loader)
    return new Promise((resolve) => {
        gltfloader.loadAsync(`/models/${modelFile}`,
            //progress function
            (xhr) => {
                onProgress({ modelId, sizeLoaded: xhr.loaded })

            },
        ).then((gltf) => {
            let elements = undefined
            gltf.scene.traverse(function (node) {
                if (node.name.startsWith("ref") && node.isMesh) {
                    node.castShadow = true
                    node.receiveShadow = true
                    const nameNode = node.name.split("_")[1]
                    elements = node
                }
            })
            resolve(elements)
        })
    })
}


export const defaultMaterial = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, color: 0xff0000 })

// Load image
export async function loadImage(name, path = "", textureToLoad, onProgress) {
    return new Promise((resolve) => {
        loader.loadAsync(
            `${path}/${textureToLoad}`,
            (xhr) => { console.log(xhr) },

        ).then((texture) => {
            texture.flipY = false
            resolve({ name, texture })
        })
    })
}


// Load images 
export async function loadImages(maps, path, modelId) {

    const ImagesPromise = maps.map(({ name, file }) => loadImage(name, path, file))

    return Promise.all(ImagesPromise)
}
//recursive funcion to read all images
export function getDesign(model, pattern) {
    const design = patternsList[model][pattern].Design
    const maps = Object.values(design).reduce((acum, value) => value.pattern ? [...acum, value.pattern] : acum, [])
    return { maps, design }
}


export function createMaterial(design, textures) {
    const { fs, maps, uniforms: colorUniforms } = createfs(design)
    const textureData = Object.keys(textures).reduce((acum, name) => {
        const newUniforms = { ...acum.uniforms, [`${name}_u`]: { value: textures[name] } }
        const newHeader = `${acum.header}${fsh(name)}`
        const newSampler = `${acum.sampler}${fss(name)}`
        return { uniforms: newUniforms, header: newHeader, sampler: newSampler }
    }, { uniforms: {}, header: '', sampler: '' })
    const fsCode = fs.toReversed().reduce((acum, code) => fsj`${acum}${code}`, '')
    const colorHeader = Object.keys(colorUniforms).reduce((acum, name) => `${acum} ${fsc(name)}`, '')
    const newUniforms = { ...textureData.uniforms, ...colorUniforms }


    const frHeader = `
        ${textureData.header}
        ${colorHeader}
    `
    const frBody = `
        ${textureData.sampler}
        ${fsCode}
        
    `
    const material = new CustomShaderMaterial({
        baseMaterial: THREE.MeshBasicMaterial,
        uniforms: newUniforms,
        vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
        }
    `,
        fragmentShader: `
        varying vec2 vUv;
        ${frHeader}
        void main() {
            ${frBody}
           csm_DiffuseColor = vec4(main, 1.);
        }
    `,
    })
    material.side = THREE.DoubleSide
    return { material, textures: textureData.uniforms, colors: colorUniforms }
}


// extract information needed for build the fragment shader and load the maps
export function createfs(design) {


    const maps = []
    const uniforms = {}
    const fs = getFragmentList(design, "main", [], maps, uniforms)
    return { fs, maps, uniforms }
}








function getFragmentList(patternDesc, name, list = [], maps = [], uniforms = {}) {
    const { type, values, pattern } = patternDesc[name]
    if (!pattern) {
        uniforms[`${name}_c`] = { value: new THREE.Color(values) }
        return ([`vec3 ${name}=${name}_c`])
    }

    const part0 = type[0] === PATTERN ? getFragmentList(patternDesc, values[0], list, maps, uniforms) : []
    const part1 = type[1] === PATTERN ? getFragmentList(patternDesc, values[1], list, maps, uniforms) : []

    const newUniforms = type.map((type, index) => {
        if (type === COLOR) {
            uniforms[`${name}_${index + 1}_c`] = { value: new THREE.Color(values[index]) }
            return `${name}_${index + 1}_c`
        }
        return values[index]
    })
    const newlist = [...list, `vec3 ${name}=mix(${newUniforms[0]},${newUniforms[1]},${pattern.name}_t.r)`, ...part0, ...part1]
    return newlist
}

// functions to generate code for fragment shaders
// creae Samplers
function fss(name) {
    return `vec4 ${name}_t= texture2D( ${name}_u, vUv ); 
    `
}
// create simaple uniforms
function fsh(name) {
    return `uniform sampler2D ${name}_u; 
    `
}
//join fs for main function of shader
function fsj(string, prev, code) {
    return `${prev} ${code}; 
    `
}
//create color uniforms
function fsc(name) {
    return `uniform vec3 ${name}; 
    `
}


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

