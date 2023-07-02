import { PATTERN, COLOR, SHADER } from '@/config/Constants'
import { Zones as p } from './Zones'

export const patternsList =
{
    TshirtA: {
        base: {
            nombre: "Color Solido",
            image: "Solido.webp",
            background: "#ff00ff",

            Design: {

            }
        },
        design1: {
            nombre: "Diseño Diagonal",
            image: "Diagonal.webp",
            background: "#ffffff",
            Design: {

                main: {

                    type: PATTERN,
                    noMasked: ["cuello"],
                    masked: ["Color2", "Zona2", "Zona3"],
                    pattern: p.diagonal
                },
                cuello: {
                    type: PATTERN,
                    masked: ["Color1"],
                    pattern: p.cuello
                },
                Zona2: {
                    type: PATTERN,
                    masked: ["Color3"],
                    pattern: p.aleta

                },
                Zona3: {
                    type: PATTERN,
                    masked: ["Color4"],
                    pattern: p.adorno
                },
                Color1: {
                    type: COLOR,
                    name: "color1",
                    value: "#ff0000"

                },
                Color2: {
                    type: COLOR,
                    name: "color2",
                    value: "#000000"

                },
                Color3: {
                    type: COLOR,
                    name: "color3",
                    value: "#00ffff"

                },
                Color4: {
                    type: COLOR,
                    name: "color4",
                    value: "#0000ff"

                },


            }
        },
        design2: {
            nombre: "Diseño Diagonal",
            image: "Diagonal.webp",
            background: "#000000",
            Design: {


                main: {
                    type: PATTERN,
                    noMasked: ["cuello"],
                    masked: ["Color2"],
                    pattern: p.diagonal
                },
                cuello: {
                    type: PATTERN,
                    masked: ["Color1"],
                    pattern: p.cuello
                },
                Color1: {
                    type: COLOR,
                    name: "color1",
                    value: "#ff0000"

                },
                Color2: {
                    type: COLOR,
                    name: "color2",
                    value: "#00ff00"

                }



            }
        }
    }



}











