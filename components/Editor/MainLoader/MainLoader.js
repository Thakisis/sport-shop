"use client"
import { useStore } from "@/Store"


export function MainLoader(props) {
    const threeParams = useStore(state => state.threeParams)
    if (!threeParams)
        return (
            <div className="absolute w-full h-full flex justify-center items-center text-2xl bg-black" style={{ zIndex: 99999 }}>Loading...</div>
        )

    return
}

