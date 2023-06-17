"use Client"
import { useState } from 'react'
import { useStore } from "@/Store"
import { useColor } from 'react-color-palette'
import { ColorPicker } from './ColorPicker'
import { Popover } from '@mantine/core'
import Image from 'next/image'
import './Zone.css'
export function Zone({ nombre, defaultValue, un }) {
    const [opened, setOpened] = useState(false)
    const [color, setColor] = useColor("hex", defaultValue)
    const { setColor: storeColor } = useStore((state) => state.Actions)


    const handleColor = (color) => {

        setColor(color)
        storeColor(un, color.hex)

    }
    const name = "tshirt"
    return (
        <div className='flex w-full flex-col mb-3 justify-center z-50 '>

            <div className='flex items-center h-20 justify-center gap-10 cursor-pointer' >
                <Popover width={500} position="right" withArrow shadow="md" opened={opened} onChange={setOpened}>
                    <Popover.Target >

                        <div className="block relative w-36 h-36" onClick={() => setOpened(true)}>
                            <Image src={`/zones/${name}/fondo.webp`} width={144} height={144} className='absolute top-0 left-0 block w-36 h-36' alt="background"></Image>
                            <div className='block absolute top-0 left-0 w-36 h-36 layerColor '
                                style={{
                                    background: color.hex,
                                    WebkitMaskImage: `url(/zones/${name}/${un}.webp)`,
                                    maskImage: `url(/zones/${name}/${un}.webp)`,
                                    maskSize: "cover",
                                    WebkitMaskSize: "cover",
                                    maskMode: "luminance",
                                    WebkitMaskMode: "luminance",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                }}

                            >
                            </div>
                            <Image className="imageZone" src={`/zones/${name}/${un}.webp`} width={144} height={144} alt={`${nombre}`}></Image>

                        </div>


                    </Popover.Target>
                    <Popover.Dropdown sx={{ border: "1px solid black", background: "#000000" }}>
                        <ColorPicker color={color} setColor={handleColor} ></ColorPicker>
                    </Popover.Dropdown>
                </Popover>


            </div>

        </div >
    )
}

//<div className='block w-10 h-10 border-r rounded-full'  style={{ background: color.hex, zIndez: 9999, cursor: "pointer" }}></div>

