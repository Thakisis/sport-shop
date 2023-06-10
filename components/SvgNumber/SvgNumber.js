import { useEffect } from 'react'
import { useStore } from "@/Store"
export function SvgNumber(props) {
    const { name, number } = useStore(state => state.numberData)
    const { setTextureNumber } = useStore(state => state.Actions)
    useEffect(() => {

        setTextureNumber()

    }, [name, number, setTextureNumber])


    return (
        <div id="svgcontainer" className=" absolute top-0 left-0 w-64 h-64 bg-red-300 hidden">
            <svg id="svgNumber" className='svgNumber' viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
                <defs>

                    <path
                        id="MyPath"
                        fill="none"
                        stroke="red"
                        strokeWidth={20}
                        d="m 244.0678,451.52542 c 0,0 377.89217,-143.36307 762.7119,-146.44067 C 1391.5994,302.00715 1800,451.52542 1800,451.52542" />
                </defs>

                <text fontSize={230} style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: "bold" }} >
                    <textPath href="#MyPath" startOffset={`${(12 - name.length) / 2 * 117}`}>{name.toUpperCase()}</textPath>
                </text>
                {number?.length === 2 &&
                    <>
                        <text style={{ fontFamily: "Arial, Helvetica, sans-serif", letterSpacing: "1rem" }} x="100" y="1800" fontSize={1600}>{[...number][0]}</text>
                        <text style={{ fontFamily: "Arial, Helvetica, sans-serif", letterSpacing: "1rem" }} x="1000" y="1800" fontSize={1600}>{[...number][1]}</text>
                    </>
                }
                {number?.length === 1 &&

                    < text style={{ fontFamily: "Arial, Helvetica, sans-serif", letterSpacing: "1rem" }} x="600" y="1800" fontSize={1600}>{[...number][0]}</text>

                }


            </svg>
        </div >
    )
}


