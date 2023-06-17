"use client"
import { Drawer as MDrawer } from '@mantine/core'
import { useStore } from '@/Store'
import * as Panels from './Panels'
export function Drawer({ children, panel, ...props }) {
    const panelData = useStore(state => state.panelPositions.find(({ title }) => title === panel))
    const Content = Panels[panel]

    return (
        <MDrawer
            key={panel}
            //onClose={() => closeHandler({ side, panel: name })}
            {...panelData}
            overlayProps={{ display: "none" }}
        >
            <Content></Content>
        </MDrawer>
    )
}

