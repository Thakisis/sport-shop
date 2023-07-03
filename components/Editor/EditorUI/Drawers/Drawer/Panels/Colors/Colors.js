import { useStore } from "@/Store"
import { ColorCard } from './ColorCard'
export function Colors() {

    const { selected, dataModels } = useStore(state => ({ selected: state.selected, dataModels: state.PatternData }))

    if (!selected.modelId || !selected.pattern) {
        return (<div>Seleccione Modelo y Diseño</div>)
    }
    const { colors, images } = dataModels[`${selected.modelId}-${selected.pattern}`]
    const Colors = Object.keys(colors).map((key) => <ColorCard key={key} colorId={key} {...colors[key]} {...images} ></ColorCard>)
    console.log(colors, images)
    return (

        <div>{Colors}</div>

    )

}

