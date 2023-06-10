"use client"

import { SvgNumber } from "@/components/SvgNumber"
import { CanvasWrapper } from "./CanvasWrapper"
import { ZonesArea } from '@/components/ZonesArea'

export function Editor(props) {

    return (
        <div>

            <CanvasWrapper />
            <div className="flex flex-col fixed right-0 w-72 bg-red pt-2 bg-slate-800 grow item-middle justify-start h-full">
                <h1 className=" text-center mb-10 ">Areas</h1>
                <ZonesArea />

            </div>
            <SvgNumber></SvgNumber>

        </div>
    )
}

