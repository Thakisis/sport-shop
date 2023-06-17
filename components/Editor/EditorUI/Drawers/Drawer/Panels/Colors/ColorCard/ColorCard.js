import * as THREE from 'three'
import { ColorPicker, Popover } from '@mantine/core'
export function ColorCard({ color }) {
    const { r, g, b } = color.value
    const onChange = valor => {
        color.value = new THREE.Color(valor)
    }
    return (
        <div>
            <ColorPicker withPicker onChange={onChange} value={`rgba(${r * 255} ${g * 255} ${b * 255})`} size="xs" />
            <div style={{ backgroundColor: `rgba(${r * 255} ${g * 255} ${b * 255})` }}>colocr</div>
        </div>
    )
}

