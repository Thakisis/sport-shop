"use client"
import { useStore } from "@/Store"
import { useEffect } from "react"

export function InitStore(props) {
    const { initStore } = useStore(state => state.Actions)
    useEffect(() => {
        initStore(props)
    })
    return (
        <div>

        </div>
    )
}

