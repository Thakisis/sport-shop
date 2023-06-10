"use client"

import React from 'react'
import dynamic from 'next/dynamic'
const Canvas = dynamic(() => import('@/components/Canvas'), {
    loading: () => <div className="absolute w-full h-full flex justify-center items-center text-2xl">Loading...</div>,
})

export function CanvasWrapper(props) {

    return (
        <div>
            <Canvas></Canvas>
        </div>
    )
}

