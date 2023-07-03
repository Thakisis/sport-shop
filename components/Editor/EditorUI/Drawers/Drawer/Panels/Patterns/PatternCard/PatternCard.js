"use client"
import { Divider, Center } from '@mantine/core'
import Image from 'next/image'
import { useStore } from '@/Store'
import { mc } from '@/utils'
import styles from './PatternCard.module.scss'
export function PatternCard({ patternId, nombre, modelId, image }) {

    const { pattern: selectedPattern } = useStore((state) => state.selected)
    const { setPattern } = useStore((state) => state.Actions)



    const ClickPattern = () => {
        setPattern(patternId)
    }

    return (
        <>
            <div >
                <Divider my="xs" label={name} labelPosition="center" />
                <Center className={mc` rounded-2xl ${` `}`} onClick={ClickPattern}>

                    <div className={` flex  w-44 h-44 justify-center items-center `} >
                        <div className={`absolute flex  w-44 h-44  ${styles.placeholder}`} style={patternId === selectedPattern ? { backgroundColor: "orange" } : { backgroundColor: "Sienna" }}

                        >

                        </div>


                        <Center>
                            <Image className={styles.imageModel} src={`/images/designs/${modelId}/${image}`} width="120" height="120" alt={nombre}></Image>
                        </Center>

                    </div>


                </Center>
            </div >

        </>
    )
}
