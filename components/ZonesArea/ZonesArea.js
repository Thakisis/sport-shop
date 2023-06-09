import { useStore } from "@/Store"
import { Zone } from './Zone'

import "react-color-palette/lib/css/styles.css"
export function ZonesArea(props) {
    const { Zonas } = useStore((state) => state.itemList)
    const UIZones = Zonas.map((zona) => <Zone key={zona.un} {...zona} />)
    return (
        <div>
            {UIZones}
        </div>
    )
}

