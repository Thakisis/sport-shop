import { ColorPicker as ColorDialog } from "react-color-palette"


export function ColorPicker({ color, setColor }) {
    return <ColorDialog width={456} height={228} color={color} onChange={setColor} hideHSV dark />
}

