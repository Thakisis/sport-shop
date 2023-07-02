
import { useStore } from '@/Store'
import { Divider, Center } from '@mantine/core'
import { mc } from '@/utils'
import styles from './ColorCard.module.scss'

export function ColorCard({ name, color, image, white, black, colorId, uniform }) {





    //const { r, g, b } = color.value
    //const onChange = valor => {
    //    color.value = new THREE.Color(valor)
    //}
    return (
        <div >
            <Divider my="xs" label={name} labelPosition="center" />
            <Center className={mc` rounded-2xl ${` `}`}>

                <div className={` flex  w-44 h-44 justify-center items-center `} >
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <mask id={`${colorId}mask`}>
                            <rect x="0" y="0" fill="black" width="120" height="120"></rect>
                            <image href={`${image}`} height="120" width="120" />
                        </mask>
                        <image href={`${black}`} height="120" width="120" />
                        <g mask={`url(#${colorId}mask)`}>
                            <image href={`${white}`} height="120" width="120" />
                            <rect x="0" y="0" fill={color} width="120" height="120" style={{ mixBlendMode: "multiply" }}></rect>
                        </g>
                    </svg>
                </div>


            </Center>
        </div >
    )
}

/*
<div>
import { ColorPicker, Popover } from '@mantine/core'
            <ColorPicker withPicker onChange={onChange} value={`rgba(${r * 255} ${g * 255} ${b * 255})`} size="xs" />
            <div style={{ backgroundColor: `rgba(${r * 255} ${g * 255} ${b * 255})` }}>colocr</div>
        </div>
        */
