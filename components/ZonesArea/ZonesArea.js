import { useStore } from "@/Store"
import { Zone } from './Zone'

import "react-color-palette/lib/css/styles.css"
export function ZonesArea(props) {
    const { Zonas } = useStore((state) => state.itemList)
    const UIZones = Zonas.map((zona) => <Zone key={zona.un} {...zona} />)
    return (
        <div className="flex flex-col justify-between h-full">
            {UIZones}
            <div>
                <button
                    className="bg-white hover:bg-slate-400  text-black font-bold py-2 px-4 rounded"
                    onClick={() => {
                        const link = document.createElement('a')
                        link.setAttribute('download', 'canvas.png')
                        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
                        link.click()
                    }}>
                    DOWNLOAD

                </button>
            </div>
        </div>
    )
}

