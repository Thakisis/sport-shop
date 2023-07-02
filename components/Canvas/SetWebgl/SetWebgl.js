import { useEffect } from "react"
import { useStore } from "@/Store"
import { useThree } from "@react-three/fiber"



// component needed to retrieve data from three since hook 
// only can be used  inside canvas
export function SetWebgl() {
    const setThree = useStore(state => state.Actions.setThree)
    const threeParams = useStore(state => state.threeParams)
    const threeReferences = useThree()
    useEffect(() => {
        if (!threeParams)
            setThree(threeReferences)
    }, [threeParams, setThree, threeReferences])

    return (
        <group></group>
    )
}

