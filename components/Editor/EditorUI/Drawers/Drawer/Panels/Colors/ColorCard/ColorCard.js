
import { useStore } from '@/Store'
import { Divider, Center, Popover } from '@mantine/core'
import "react-color-palette/lib/css/styles.css"
import { mc } from '@/utils'
import styles from './ColorCard.module.scss'
import { ColorPicker, useColor, toColor } from 'react-color-palette'

export function ColorCard({ name, color, image, white, black, colorId, uniform }) {
    const setColor = useStore(state => state.Actions.setColor)

    console.log(`${colorId}: ${color}`)

    const changeColor = newColor => {
        setColor(colorId, newColor, uniform)
    }
    return (
        <Popover width="target" withArrow shadow="md" position="bottom">
            <Popover.Target  >
                <div>
                    <Divider my="xs" label={name} labelPosition="center" />
                    <Center className={mc` rounded-2xl ${` `}`}>

                        <div className={` flex  w-40 h-40 justify-center items-center `} >

                            <svg width="120" height="120" viewBox="0 0 120 120">

                                <mask id={`${colorId}mask`}>
                                    <rect x="0" y="0" fill="black" width="120" height="120"></rect>
                                    <image href={`${image}`} height="120" width="120" />
                                </mask>
                                <image href={`${black}`} height="120" width="120" />
                                <g mask={`url(#${colorId}mask)`} >
                                    <image href={`${white}`} height="120" width="120" />
                                    <rect x="0" y="0" fill={color} width="120" height="120" style={{ mixBlendMode: "multiply" }}></rect>
                                </g>
                            </svg>
                        </div>


                    </Center>
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <ColorPicker width={255} height={150} color={toColor("hex", color)} hideHSV hideRGB hideHEX onChange={changeColor} dark />
            </Popover.Dropdown>
        </Popover>
    )
}

/*
<div>
import { ColorPicker, Popover } from '@mantine/core'
            <ColorPicker withPicker onChange={onChange} value={`rgba(${r * 255} ${g * 255} ${b * 255})`} size="xs" />
            <div style={{ backgroundColor: `rgba(${r * 255} ${g * 255} ${b * 255})` }}>colocr</div>
        </div>
        */
