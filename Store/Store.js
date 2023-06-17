import create from 'zustand'
import * as THREE from 'three'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { modelList, panelPosition } from '@/config'
import { updateColor, createMaterial, updateNumber, loadModel, getDesign, loadImages, defaultMaterial } from '@/utils'



export const useStore = create((set, get) => ({
    created: false,
    activeRoute: undefined,
    darkTheme: true,
    audio: false,
    selected: {},
    MaterialsProps: {},
    ModelMeshes: {},
    threeSelected: { mesh: undefined, material: undefined, shader: undefined },
    numberData: { name: "text", Number: 0 },
    panelPositions: panelPosition,
    menuSelected: { menu: 0, menu0: "Models", menu1: "Colors" },
    threeParams: undefined,
    textures: {},
    modelsInfo: {},

    Actions: {

        //set Model on click 
        async setModel(modelId) {
            const ModelMeshes = get().ModelMeshes

            set({ selected: { modelId } })
            if (!ModelMeshes[modelId]) {

                const modelFile = modelList.find(({ idModel }) => idModel === modelId).file
                const { onProgress } = get().Actions
                const { gl } = get().threeParams
                const modelScene = await loadModel({ modelId, modelFile, gl, onProgress })
                set(({ ModelMeshes }) => ({ ModelMeshes: { ...ModelMeshes, [modelId]: { mesh: modelScene, refMesh: "test" } } }))
                set(() => ({ threeSelected: { mesh: modelScene, material: defaultMaterial } }))

                return
            }

            set(() => ({ threeSelected: { mesh: ModelMeshes[modelId].mesh, material: defaultMaterial } }))

            //: { mesh: underfined, material: undefined, shader: undefined },
        },
        setPattern(patternId) {
            const modelId = get().selected.modelId
            const loadTextures = get().Actions.loadTextures
            set(({ selected }) => ({ selected: { ...selected, patternId: patternId } }))
            const { maps, design } = getDesign(modelId, patternId)

            loadTextures(maps, design)
        },
        async loadTextures(maps, design) {
            const { setMaterial } = get().Actions
            const { modelId } = get().selected
            const prevTextures = get().textures
            const newMaps = maps.filter(({ name }) => !prevTextures[modelId]?.[name])
            const mapImages = await loadImages(newMaps, `/textures/${modelId}/`, modelId)
            const addedMaps = mapImages.reduce((acum, { name, texture }) => ({ ...acum, [name]: texture }), {})
            set(({ textures }) => ({ textures: { ...textures, [modelId]: { ...textures[modelId], ...addedMaps } } }))

            setMaterial(maps, design)

        },
        setMaterial(maps, design) {

            const MaterialsProps = get().MaterialsProps
            const { modelId, patternId } = get().selected
            let findMaterialProps = MaterialsProps[modelId]?.[patternId]
            if (!findMaterialProps) {
                const texturesModel = get().textures[modelId]
                const texturesDesign = maps.reduce((acum, { name }) => ({ ...acum, [name]: texturesModel[name] }), {})
                const materialProps = createMaterial(design, texturesDesign)
                set(({ MaterialsProps }) => ({ MaterialsProps: { ...MaterialsProps, [modelId]: { ...MaterialsProps[modelId], [patternId]: { ...materialProps } } } }))

                findMaterialProps = materialProps
            }


            set(({ threeSelected }) => ({ threeSelected: { ...threeSelected, ...findMaterialProps } }))
        },






        //call back to store shader to be able to modify the uniforms
        setShader(shaderInfo) {
            const { modelId, patternId } = get().selected
            set(({ Shaders }) => ({ Shaders: { ...Shaders, [modelId]: { ...Shaders[modelId], [patternId]: shaderInfo } } }))
            set(({ threeSelected }) => ({ threeSelected: { ...threeSelected, shader: shaderInfo } }))
        },

        onProgress(props) {

        },

        // check method
        selectModel(props) {

            const modelSelected = !props ? modelList[0] : !props.model ? modelList[0] : modelList.find(({ idModel }) => idModel === props.model)
            set({ modelSelected: { ...modelSelected } })
            const { selectPattern } = get().Actions
            selectPattern(0)
        },
        //check to merge with setModel
        /*
        selectPattern(props) {
            const { idModel } = get().modelSelected
            const { setMaterial } = get().Actions
            const patternSelected = !props ? patternList[idModel][0] : !props.pattern ? patternList[idModel][props] : patternList[idModel].find(({ patron }) => patron === pattern)
        
            if (patternSelected)
                set({ patternSelected: patternSelected })
            setMaterial(idModel, patternSelected)
        },
            */
        // change meno in press next or previous
        setMenu(menu) {

            const menuSelected = get().menuSelected
            const { switchPanels } = get().Actions
            set(({ menuSelected }) => ({ menuSelected: { ...menuSelected, menu: menu } }))
            switchPanels(menuSelected[`menu${menu}`])
        },

        //change selected drawer
        setPanel(panelSelected, menu) {


            const { switchPanels } = get().Actions
            set(({ menuSelected }) => ({ menuSelected: { ...menuSelected, [`menu${menu}`]: panelSelected } }))
            switchPanels(panelSelected)
        },

        //set old panel on closed and new on open
        switchPanels(panelSelected) {

            set(({ panelPositions }) => {
                const newPositions = panelPositions.map(panel => panel.panel === panelSelected ? { ...panel, opened: true } : { ...panel, opened: false })
                return { panelPositions: newPositions }
            }
            )
        },
        // read route to check if user enter using some model
        initStore(params) {

            set({ selected: { ...params } })
        },

        //react canvas parameters needed for loader
        setThree(threeParams) {

            set({ threeParams: threeParams })
        },
        // create material from pattern
        /*
        async setMaterial(idModel, patternSelected) {
            const Materials = get().Materials
            const Shaders = get().Shaders
            const { setShader } = get().Actions
            const { idPatron } = patternSelected
        
            if (Materials[idPatron]) {
        
                set({ materialSelected: Materials[idPatron] })
                return
            }
        
            const material = await createMaterial(patternSelected, setShader)
        
            set(({ Materials }) => (
                { Materials: { ...Materials, [idPatron]: { ...Materials[idPatron], material: material } }, materialSelected: material }
            ))
        },*/
        //change color props
        setColor(zonaUn, color) {
            const { material, shader } = get()
            if (!material)
                return
            set(({ itemList }) => ({ ...itemList, Zonas: itemList.Zonas.map((zona) => zona.un !== zonaUn ? zona : { ...zona, newValue: color }) }))
            updateColor(material, shader, zonaUn, color)
        },



        //update Number texture on user change input
        setTextureNumber() {
            const shader = get().shader
            if (!shader)
                return
            updateNumber(shader)
        },

        //update number data to read in SVG it will trigger update on texture via component
        setNumber(newNumberData) {

            set(({ numberData }) => ({ numberData: { ...numberData, ...newNumberData } }))

        }

    }

}))



if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Store', useStore)
}

