import { twMerge } from 'tailwind-merge'

export function mc(mainClasses, newClass1, newClass2 = "", newClass3 = "", newClass4 = "") {

    return twMerge(`${mainClasses[0]} ${newClass1} ${newClass2 && newClass2} ${newClass3} ${newClass4}`)
}