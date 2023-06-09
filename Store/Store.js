import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { shaderFragments, itemsList } from '@/config'
import { updateColor, createMaterial } from './ThreeUtils'
export const useStore = create((set, get) => ({
    created: false,
    activeRoute: undefined,
    darkTheme: true,
    audio: false,
    selectedItem: 1,
    selectedZone: 0,
    shader: undefined,
    itemList: itemsList[0],
    material: undefined,
    textures: [],
    Actions: {

        async setMaterial() {
            const selected = get().selectedItem - 1
            const { setShader } = get().Actions
            const { material, shader } = await createMaterial(shaderFragments[selected], itemsList[selected], setShader)

            set(({ material: material, shader: shader }))
        },
        setColor(zonaUn, color) {
            const { material, shader } = get()
            if (!material)
                return
            set(({ itemList }) => ({ ...itemList, Zonas: itemList.Zonas.map((zona) => zona.un !== zonaUn ? zona : { ...zona, newValue: color }) }))
            updateColor(material, shader, zonaUn, color)
        },
        setShader(shader) {
            set({ shader: shader })
        }
    }

}))



if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Store', useStore)
}

