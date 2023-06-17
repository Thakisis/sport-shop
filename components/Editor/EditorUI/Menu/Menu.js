"use client"
import { useMemo, useCallback } from 'react'
import { SegmentedControl, Box, Center } from '@mantine/core'
import { ColorSwatch, CircleNumber5, Photo, Brush, ShirtSport, ArrowBarLeft, ArrowBarRight, Download } from 'tabler-icons-react'
import { useStore } from '@/Store'
import { ArrowBarToLeft } from 'tabler-icons-react'



export function Menu() {
    const { menu, menu0, menu1 } = useStore(state => state.menuSelected)
    const { setPanel, setMenu } = useStore((state) => state.Actions)
    const clickPanel = useCallback(({ menu, type, value }) => {

        if (type === 0) {
            return setMenu((menu + 1) % 2)
        }
        if (type === 1) {
            return setPanel(value, menu)
        }
        const link = document.createElement('a')
        link.setAttribute('download', 'canvas.png')
        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
        link.click()
    }, [setMenu, setPanel])

    const menuData = useMemo(() => getMenuData(menu).map(({ value, Icon, text, disabled, menu, type }) => ({
        value,
        label: (
            <Center onClick={() => clickPanel({ menu, type, value })}>
                <Icon size="1rem" />
                <Box ml={10}>{text}</Box>
            </Center>
        ),
        disabled: disabled
    })), [menu, clickPanel])

    return (
        <SegmentedControl
            value={menu === 0 ? menu0 : menu1}
            radius="xl"
            color="yellow"
            data={menuData}
        />
    )
}




function getMenuData(menuSel) {

    const DataMenu = [{
        value: "Models",
        Icon: ShirtSport,
        text: "Seleccionar Prenda",
        menu: 0,
        type: 1,
        disabled: false,

    }, {
        value: "Patterns",
        Icon: Brush,
        text: "Seleccionar Patron",
        menu: 0,
        type: 1,
        disabled: false,
    }, {
        value: "Next",
        Icon: ArrowBarRight,
        text: "Editar",
        menu: 0,
        type: 0,
        disabled: false,
    },
    {
        value: "Previous",
        Icon: ArrowBarToLeft,
        text: "Volver atras",
        menu: 1,
        type: 0,
        disabled: false,
    },
    {
        value: "Colors",
        Icon: ColorSwatch,
        text: "Editar Colors",
        menu: 1,
        type: 1,
        disabled: false,
    },
    {
        value: "Numbers",
        Icon: CircleNumber5,
        text: "Editar Numero",
        menu: 1,
        type: 1,
        disabled: false,
    },

    {
        value: "Logos",
        Icon: Photo,
        text: "Editar Logotipos",
        menu: 1,
        type: 1,
        disabled: false,
    }

    ]
    const menuScreenShot = {
        value: "Screenshot",
        Icon: Download,
        text: "Descargar Imagen",
        menu: 1,
        type: 2,
        disabled: false,

    }
    const Menus = DataMenu.filter(({ menu }) => menu === menuSel)

    return [...Menus, menuScreenShot]
}