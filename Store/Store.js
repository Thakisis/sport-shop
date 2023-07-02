import create from 'zustand'

import { mountStoreDevtool } from 'simple-zustand-devtools'
import { modelList, panelPosition, patternsList, COLOR, PATTERN, Zones } from '@/config'
import { loadModel, defaultMaterial, createMaterials, createSvg, setUniform, renderTexture, loadSVGfiles } from '@/utils'





export const useStore = create((set, get) => ({
    created: false,
    activeRoute: undefined,
    darkTheme: true,
    audio: false,
    selected: {},
    MaterialsProps: {},
    Zones: {},
    PatternData: {},
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

            //get all models loaded already
            const ModelMeshes = get().ModelMeshes
            set({ selected: { modelId } })

            //if model is not loaded load it
            if (!ModelMeshes[modelId]) {

                //find model in the array
                const modelFile = modelList.find(({ idModel }) => idModel === modelId).file
                //progress function to load model but model is actually small
                //todo add smart loading component
                const { onProgress } = get().Actions

                //gl is needed for check draco compresion features of renderer
                const { gl } = get().threeParams

                //load model
                const modelScene = await loadModel({ modelId, modelFile, gl, onProgress })
                //add model to loaded
                set(({ ModelMeshes }) => ({ ModelMeshes: { ...ModelMeshes, [modelId]: { mesh: modelScene, refMesh: "test" } } }))

                //set model and default material for r3f component
                set(() => ({ threeSelected: { mesh: modelScene, material: defaultMaterial } }))
                return
            }

            set(() => ({ threeSelected: { mesh: ModelMeshes[modelId].mesh, material: defaultMaterial } }))

            //: { mesh: underfined, material: undefined, shader: undefined },
        },
        async setPattern(pattern) {
            const PatternData = get().PatternData
            const { modelId } = get().selected

            if (PatternData[modelId] && PatternData[modelId][pattern]) {
                set(({ threeSelected }) => ({ threeSelected: { ...threeSelected, material: PatternData[modelId][pattern].material } }))
                return
            }
            const materials = get().Materials
            const design = patternsList[modelId][pattern].Design
            //get different zones and load the files
            const zones = Object.keys(design).filter((key) => design[key].type === PATTERN).map((key) => design[key].pattern)
            // load only those not loaded
            const zonesLoaded = get().Zones
            const newZones = zones.filter(({ name }) => zonesLoaded[name] === undefined)
            //load svg files and store in Zones
            const newZonesLoaded = await loadSVGfiles(newZones)
            const zonesUpdate = { ...zonesLoaded, ...newZonesLoaded }
            set({ Zones: zonesUpdate })
            // select those Zones used in the design
            const zonesUsed = zones.map(({ name }) => zonesUpdate[name])
            const { textures, colors, background } = await createSvg(patternsList[modelId][pattern], zonesUsed)
            //select material needed for the number of textures used

            const { material, uniforms, materialBasic } = materials[textures.length]
            //get scene to retrive envmap 
            const { scene } = get().threeParams
            const { mesh } = get().threeSelected

            // render images for zones ui using mesh the basicmaterial to get masks, textures, backgroundcolor and how many colors are
            const images = renderTexture({ mesh, materialBasic, background, scene, textures, numColors: colors.length })
            //store images
            const getModelData = get().Actions.getModelData


            const newPatternData = getModelData({ material: material, colors, images, background, textures, modelId, pattern, uniforms })
            const ModelData = { ...PatternData[modelId], [pattern]: { ...newPatternData } }
            set(({ PatternData }) => ({ PatternData: { ...PatternData, [modelId]: ModelData } }))
            set(({ threeSelected }) => ({ threeSelected: { ...threeSelected, material: material } }))
            set(({ selected }) => ({ selected: { ...selected, pattern } }))

        },
        getModelData({ material, colors, images, background, uniforms, textures }) {



            setUniform({ uniform: uniforms.textures, textures: textures })
            setUniform({ uniform: uniforms.bgColor, color: background })
            console.log(images)
            const colorPattern = colors.reduce((acum, zone) => {
                const { name, defaultColor, uniform } = zone
                setUniform({ uniform: uniforms[uniform], color: defaultColor })
                console.log(uniform)
                console.log(images[uniform])
                return ({ ...acum, [uniform]: { name, defaultColor, uniform: uniforms[uniform], color: defaultColor, image: images[uniform] } })

            }, { background: { name: "Color Principal", defaultColor: background, uniform: uniforms.bgColor, color: background, image: images.background } })
            const patterndata = { textures, material, colors: { ...colorPattern }, images: { black: images.black, white: images.white } }
            return patterndata



        },
        onProgress(props) {

        },
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
            //when canvas 3d is available create the materials
            const materials = createMaterials()
            set({ threeParams: threeParams })
            set({ Materials: materials })
        },
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

