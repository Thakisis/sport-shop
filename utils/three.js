import * as THREE from 'three'
import { GLTFLoader, KTX2Loader, DRACOLoader } from 'three-stdlib'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { fragmentShaders } from '@/config'


//create loader instances
const loader = new THREE.TextureLoader()
const gltfloader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const ktx2Loader = new KTX2Loader()

export async function loadModel({ path = "models", modelFile, gl, onProgress }) {
    dracoLoader.setDecoderPath('/libs/draco/')
    gltfloader.setDRACOLoader(dracoLoader)
    ktx2Loader.setTranscoderPath('/libs/basis/')
    ktx2Loader.detectSupport(gl)
    gltfloader.setKTX2Loader(ktx2Loader)
    return new Promise((resolve) => {
        gltfloader.loadAsync(`/${path}/${modelFile}`,

            (xhr) => {
                onProgress({ modelFile, sizeLoaded: xhr.loaded })

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
export async function loadImages(maps, path) {

    const ImagesPromise = maps.map(({ name, file }) => loadImage(name, path, file))
    return Promise.all(ImagesPromise)
}

export function createMaterials() {
    const materials = [0, 1, 2, 3, 4].map((ntextures) => createMaterial(ntextures))
    return materials

}

//Create material
function createMaterial(numtextures) {

    const colorsUniforms = new Array(numtextures * 3).fill(0).reduce((acum, val, index) => {

        return ({ ...acum, [`Color${index + 1}`]: { value: new THREE.Color(0x000000) } })
    }, {})
    const colorsUniformsBasic = new Array(numtextures * 3).fill(0).reduce((acum, val, index) => {
        return { ...acum, [`Color${index + 1}`]: { value: new THREE.Color(0x000000) } }
    }, {})

    const texturesArray = new Array(numtextures).fill(0).map(() => createBlankTexture())

    const uniforms = {
        textures: { value: texturesArray },
        bgColor: { value: new THREE.Color(0xffffff) },
        ...colorsUniforms
    }


    const uniformsBasic = {
        textures: { value: [...texturesArray] },

        bgColor: { value: new THREE.Color(0xff00ff) },
        ...colorsUniformsBasic
    }


    const material = new CustomShaderMaterial({
        baseMaterial: THREE.MeshPhysicalMaterial,
        uniforms: uniforms,
        vertexShader: `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        void main() {
            vUv = uv;
            csm_vPosition = position;
        }
    `,
        fragmentShader: fragmentShaders[numtextures],
    })
    material.side = THREE.DoubleSide
    const materialBasic = new CustomShaderMaterial({
        baseMaterial: THREE.MeshBasicMaterial,
        uniforms: uniformsBasic,
        vertexShader: `
        varying vec2 vUv;
        varying vec3 csm_vPosition;
        void main() {
            vUv = uv;
            csm_vPosition = position;
        }
    `,
        fragmentShader: fragmentShaders[numtextures],
    })
    materialBasic.side = THREE.DoubleSide


    return { material, uniforms, materialBasic, uniformsBasic }
}

function createBlankTexture() {
    const data = new Uint8Array([0, 0, 0, 255])
    // Crear la textura utilizando los datos
    const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat)
    // Asegurarse de que la textura no se repita
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    // Actualizar la textura para reflejar los cambios
    texture.needsUpdate = true
    return texture
}

export function setUniform({ uniform, textures, color }) {
    if (textures) {
        uniform.value.forEach((texture) => {
            texture.dispose()
        })
        uniform.value = textures
        return
    }

    uniform.value = new THREE.Color(color)


}

export function renderTexture({ mesh, materialBasic, scene, textures, numColors }) {
    const container2 = document.getElementById("imagelayer")

    const renderer = new THREE.WebGLRenderer({ stencil: false, antialias: true, alpha: true })
    renderer.setSize(120, 120)

    const sceneImage = new THREE.Scene()
    sceneImage.environment = scene.environment
    const geometry = mesh.geometry
    const mymesh = new THREE.Mesh(geometry)
    sceneImage.add(mymesh)
    const camera = new THREE.OrthographicCamera(-.33, .33, .28, -.38, -1, 2000)
    //const container = document.getElementById("texturelayer")
    //container.appendChild(renderer.domElement)


    mymesh.material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    const whiteImage = createImageCanvas(renderer, sceneImage, camera)
    //container2.appendChild(whiteImage)

    mymesh.material = new THREE.MeshPhysicalMaterial({ color: 0x000000, side: THREE.DoubleSide })
    const blackImage = createImageCanvas(renderer, sceneImage, camera)
    //container2.appendChild(blackImage)

    mymesh.material = materialBasic
    const uniforms = materialBasic.uniforms
    uniforms.textures.value = textures


    uniforms.bgColor.value = new THREE.Color(0xffffff)
    const bgImage = createImageCanvas(renderer, sceneImage, camera)
    //container2.appendChild(bgImage)



    uniforms.bgColor.value = new THREE.Color(0x000000)
    const colorUniforms = Object.keys(uniforms).filter(key => key.startsWith("Color"))
    const colors = colorUniforms.reduce((acum, keyColorAct) => {
        const colorIndex = parseInt(keyColorAct.substring(5))

        if (colorIndex > numColors)
            return acum


        colorUniforms.forEach(colorKey => {
            const newColor = keyColorAct === colorKey ? new THREE.Color(0xffffff) : new THREE.Color(0x000000)
            uniforms[colorKey].value = newColor
        })
        const myimage = createImageCanvas(renderer, sceneImage, camera)
        return { ...acum, [keyColorAct]: myimage }
    }, {})

    return ({ black: blackImage, white: whiteImage, background: bgImage, ...colors })


}


function createImageCanvas(renderer, scene, camera) {
    renderer.render(scene, camera)
    const imageUrl = renderer.domElement.toDataURL("image/png", 0.8)
    const image = new Image()
    image.src = imageUrl

    return imageUrl

}

