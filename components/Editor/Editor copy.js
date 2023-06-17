"use client"
import { useStore } from '@/Store'
import { useState, useEffect } from 'react'
import { SvgNumber } from "@/components/SvgNumber"
import { CanvasWrapper } from "./CanvasWrapper"
import { Menu } from './Menu'
import { MantineProvider, Button } from '@mantine/core'
import { Download } from 'tabler-icons-react'
import { Drawers } from './Drawers'

export function Editor(props) {
    const [opened, setOpened] = useState({ left: { Models: true, Patterns: false, Colors: false }, right: { Numbers: false, Logos: false } })
    const { selectModel } = useStore((state) => state.Actions)
    const { menu, selMenu } = useState(0)
    useEffect(() => {
        selectModel(0)
    }, [selectModel])




    const switchOpened = (drawerData) => {

        setOpened((prevOpened) => {

            const { side, panel } = drawerData
            if (side === "left") {
                const leftFalse = { Models: false, Patterns: false, Colors: false }
                const newLeft = { ...leftFalse, [panel]: !prevOpened[side][panel] }
                return ({ ...prevOpened, left: newLeft })
            }
            const rightFalse = { Numbers: false, Logos: false }
            const newRight = { ...rightFalse, [panel]: !prevOpened[side][panel] }
            return ({ ...prevOpened, right: newRight })

        })

    }
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>

            <CanvasWrapper />

            <Drawers panelsData={opened} closeHandler={switchOpened} />
            <SvgNumber></SvgNumber>
            <div className="fixed bottom-4 w-screen  flex justify-center ">

                <Menu></Menu>


                <Button leftIcon={<Download strokeWidth={2} />}
                    onClick={() => {
                        const link = document.createElement('a')
                        link.setAttribute('download', 'canvas.png')
                        link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
                        link.click()

                    }}
                    variant="subtle"
                >
                    Descargar Captura
                </Button>

            </div>



        </MantineProvider>
    )
}



/*  
<SegmentedControl
                    data={[

                        {
                            value: 'back',
                            label: (
                                <Center>
                                    <ArrowBarLeft size="1rem" />
                                    <Box ml={10}></Box>
                                </Center>
                            ),
                        },
                        {
                            value: 'code',
                            label: (
                                <Center>
                                    <ColorSwatch size="1rem" />
                                    <Box ml={10}> Editar Colores</Box>
                                </Center>
                            ),
                        },
                        {
                            value: 'export',
                            label: (
                                <Center>
                                    <CircleNumber5 size="1rem" />
                                    <Box ml={10}> Editar Numero</Box>
                                </Center>
                            ),
                        },
                        {
                            value: 'export',
                            label: (
                                <Center>
                                    <Photo size="1rem" />
                                    <Box ml={10}> Editar Logotipos</Box>
                                </Center>
                            ),
                        },
                    ]}
                />


                <SegmentedControl


                    data={[
                        {
                            value: 'preview',
                            label: (
                                <Center>
                                    <ShirtSport size="1rem" />
                                    <Box ml={10}> Seleccionar Prenda</Box>
                                </Center>
                            ),
                        },
                        {
                            value: 'code',
                            label: (
                                <Center>
                                    <Brush size="1rem" />
                                    <Box ml={10}> Seleccionar Patron</Box>
                                </Center>
                            ),
                        },
                        {
                            value: 'next',
                            label: (
                                <Center>
                                    <ArrowBarRight size="1rem" />
                                    <Box ml={10}>Personalizar</Box>
                                </Center>
                            ),
                        },
                    ]}
                />





   <div className="fixed bottom-4 w-screen  flex justify-center hidden ">

                <Divider orientation="vertical" />
                <Button leftIcon={<ColorSwatch strokeWidth={2} />} onClick={() => switchOpened({ side: "left", panel: "Colors" })}>
                    Editar Colores
                </Button>
                <Divider orientation="vertical" />
                <Button leftIcon={<CircleNumber5 strokeWidth={2} />} onClick={() => switchOpened({ side: "right", panel: "Numbers" })}>
                    Editar Numero
                </Button>
                <Divider orientation="vertical" />
                <Button leftIcon={< Photo strokeWidth={2} />} onClick={() => switchOpened({ side: "right", panel: "Logos" })}>
                    Editar Logotipos
                </Button>
                <Divider orientation="vertical" />

            </div>
            */