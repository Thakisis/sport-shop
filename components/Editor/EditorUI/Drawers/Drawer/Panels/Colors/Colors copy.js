import { useStore } from "@/Store"
import { Zone } from './Zone'
import { ArrowBarLeft } from "tabler-icons-react"
import { Button } from '@mantine/core'
export function Colors(props) {
    const { Zonas } = useStore((state) => state.patternSelected)
    const { setMenu } = useStore((state) => state.Actions)
    const UIZones = Zonas.map((zona) => <Zone key={zona.un} {...zona} />)
    return (
        <div className="flex flex-col justify-between h-full">

            {UIZones}

            <Button leftIcon={<ArrowBarLeft strokeWidth={2} />}
                variant="subtle"
                onClick={() => setMenu(0)}
            >
                Cambiar Patron
            </Button>
        </div>
    )
}

/* Component
import { useStore } from "@/Store"

import { TextInput } from '@mantine/core'
import "react-color-palette/lib/css/styles.css"
export function ZonesArea(props) {
    const { setNumber } = useStore((state) => state.Actions)

    return (
        <div className="flex flex-col justify-between h-full">
            {UIZones}
            <div>


                <TextInput

                    placeholder="Nombre"
                    defaultValue="TEXT"
                    radius="md"
                    maxLength={11}
                    onChange={(event) => setNumber({ name: event.currentTarget.value })}
                />
                <TextInput
                    defaultValue={0}
                    placeholder="Numero"
                    radius="md"
                    maxLength={2}
                    onChange={(event) => setNumber({ number: event.currentTarget.value })}
                />
            </div>
            <div>
                <button
                    className="bg-white hover:bg-slate-400  text-black font-bold py-2 px-4 rounded"
                    onClick={() => {
                        //const link = document.createElement('a')
                        //link.setAttribute('download', 'canvas.png')
                        //link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
                        //link.click()
                        setNumber()
                    }}>
                    DOWNLOAD
                </button>
            </div>
        </div>
    )
}


*/