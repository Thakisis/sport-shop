"use client"

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
const Canvas = dynamic(() => import('@/components/Canvas'), {
    ssr: false,
    loading: () => <div className="absolute w-full h-full flex justify-center items-center text-2xl bg-black" style={{ zIndex: 99999 }}>Loading...</div>,
})

export function CanvasWrapper(props) {

    return (
        <div>
            <Suspense>
                <Canvas></Canvas>
            </Suspense>
        </div>
    )
}
