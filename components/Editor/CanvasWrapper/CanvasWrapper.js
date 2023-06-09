"use client"

import React from 'react'
import dynamic from 'next/dynamic'
const Canvas = dynamic(() => import('@/components/Canvas'), {
    loading: () => <p>Loading...</p>,
})

export function CanvasWrapper(props) {

    return (
        <div>
            <Canvas></Canvas>
        </div>
    )
}

