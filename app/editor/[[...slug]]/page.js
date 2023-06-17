import { Editor } from "@/components/Editor"
export default function Page({ params }) {

    //const [modelId, patternId] = params.slug 
    let props = {}
    if (params.slug) {
        const propKeys = ["modelId", "patternId"]

        props = params.slug.reduce((acum, value, index) => ({ ...acum, [propKeys[index]]: value }), {})

    }
    else {

    }

    const [modelId, patternId] = typeof params.slug === "Array" ? params.slug : [0, 0]

    return (<Editor {...props}></Editor>)
}