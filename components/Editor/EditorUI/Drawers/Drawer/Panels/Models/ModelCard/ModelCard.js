"use client"
import { Divider, Center } from '@mantine/core'
import Image from 'next/image'
import { useStore } from '@/Store'
import { mc } from '@/utils'
import styles from './ModelCard.module.scss'
export function ModelCard({ idModel, name, file, component, image }) {
    const { modelId: selectedModel } = useStore((state) => state.selected)
    const { setModel } = useStore((state) => state.Actions)
    const ClickModel = () => {
        setModel(idModel)
    }

    return (
        <>
            <div >
                <Divider my="xs" label={name} labelPosition="center" />
                <Center className={mc` rounded-2xl ${` `}`}>

                    <div className={` flex  w-44 h-44 justify-center items-center `} onClick={ClickModel}>
                        <div className={`absolute flex  w-44 h-44  ${styles.placeholder}`} style={idModel === selectedModel ? { backgroundColor: "orange" } : { backgroundColor: "Sienna" }}

                        >

                        </div>


                        <Center>
                            <Image className={styles.imageModel} src={`/images/models/${image}`} width={120} height="120" alt={name}></Image>
                        </Center>

                    </div>


                </Center>
            </div >

        </>
    )
}
