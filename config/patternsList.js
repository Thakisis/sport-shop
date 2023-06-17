import { PATTERN, COLOR, SHADER } from '@/config/Constants'
import { designs as p } from './designs'

export const patternsList =
{
    TshirtA: {
        base: {
            nombre: "Color Solido",
            image: "Solido.webp",
            Design: {
                main: {
                    type: COLOR,
                    values: 0X4060FF,
                },
            }
        },
        design1: {
            nombre: "Diseño Diagonal",
            image: "Diagonal.webp",
            Design: {
                main: {

                    type: [PATTERN, PATTERN],
                    values: ["Zona3", "Zona1"],
                    pattern: p.diagonal
                },
                Zona1: {
                    type: [COLOR, PATTERN],
                    values: [0X00ff00, "Zona2"],
                    pattern: p.triangulo

                },
                Zona2: {
                    type: [COLOR, COLOR],
                    values: [0X0000ff, 0xff0000],
                    pattern: p.lateral


                },
                Zona3: {
                    type: [COLOR, COLOR],
                    values: [0xffff00, 0xff00ff],
                    pattern: p.cuello
                },
            }
        },
        design2: {
            nombre: "Diseño Diagonal",
            image: "Diagonal.webp",
            Design: {
                main: {

                    type: [COLOR, COLOR],
                    values: [0xff0000, 0x000000],
                    pattern: p.diagonal
                }

            }
        }



    }




}








