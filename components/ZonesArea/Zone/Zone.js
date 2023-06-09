import { useState } from 'react'
import { useStore } from "@/Store"
import { useColor } from 'react-color-palette'
import { ColorPicker } from './ColorPicker'
import { Popover } from '@mantine/core'

export function Zone({ nombre, defaultValue, un }) {
    const [opened, setOpened] = useState(false)
    const [color, setColor] = useColor("hex", defaultValue)
    const { setColor: storeColor } = useStore((state) => state.Actions)


    const handleColor = (color) => {

        setColor(color)
        storeColor(un, color.hex)

    }
    return (
        <div className='flex w-full flex-col mb-3 justify-center z-50 '>
            <h2 className='w-full p-4 bg-slate-950 cursor-pointer'>{nombre}</h2>
            <div className='flex items-center h-20 justify-center gap-10 cursor-pointer' >
                <Popover width={500} position="left" withArrow shadow="md" opened={opened} onChange={setOpened}>
                    <Popover.Target >
                        <div className='block w-10 h-10 border-r rounded-full' onClick={() => setOpened(true)} style={{ background: color.hex, zIndez: 9999, cursor: "pointer" }}></div>
                    </Popover.Target>
                    <Popover.Dropdown sx={{ border: "1px solid black", background: "#000000" }}>
                        <ColorPicker color={color} setColor={handleColor} ></ColorPicker>
                    </Popover.Dropdown>
                </Popover>


            </div>

        </div >
    )
}

