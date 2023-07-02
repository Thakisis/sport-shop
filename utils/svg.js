import { masks } from "@/config"
import { PATTERN } from '@/config'
import * as THREE from 'three'


//create SVG for create the texture
export async function createSvg(designSelected, groupDef) {
    const { Design, background } = designSelected

    const { svg, groupMasked, defsNode } = createSvgBase(masks.mainPath.d)
    const { colors } = iterDesing({ design: Design, node: "main", parent: groupMasked })
    groupDef.forEach((group) => defsNode.appendChild(group))

    //create textures for threejs 
    const textures = await svgToTextures(svg, colors)
    svg.classList.add("svgmix")

    return { svg, textures, colors, background }

}
// read design and recursively generate each color masked by chaining groups with mask
function iterDesing({ design, node, parent, colors = [] }) {

    const actNode = design[node]
    if (!actNode) return { colors: [] }
    if (actNode.type === PATTERN) {
        // there are two children array one will be masked by own path
        // other will be without mask but under the zone masked
        // this allow to apply a primary color outside of the mask
        // so when you have a mask you can define color or patter inside the main mask and outise of them
        const zoneMask = createGroupMasked(`Mask_${actNode.pattern.name}`)
        const zoneNoMask = createSvgElement("g", {})
        //masked always should be over not masked
        // using inverse mask can produce lines between both zones due to antialiasing
        // in this ways those lines doesnt appear if color will be aacolumative
        parent.appendChild(zoneNoMask)
        parent.appendChild(zoneMask)
        const newColorsNoMasked = actNode.noMasked?.reduce((acum, children, index) => {
            const { colors: newColors } = iterDesing({ design, node: children, parent: zoneNoMask })
            return [...acum, newColors]
        }, []) ?? []
        const newColorsMasked = actNode.masked?.reduce((acum, children, index) => {
            const { colors: newColors } = iterDesing({ design, node: children, parent: zoneMask })
            return [...acum, newColors]
        }, []) ?? []


        return { colors: [...colors, ...newColorsNoMasked, ...newColorsMasked].flat(), parent }
    }

    const colorNode = createFullRect(actNode.value, actNode.name)
    const newColor = { uniform: node, name: actNode.name, node: colorNode, defaultColor: actNode.value }
    parent.appendChild(colorNode)

    return { colors: [...colors, newColor], parent }

}


//create a single mask 
function createMask({ id, groupPath, d }) {
    const mask = createSvgElement('mask', { id: `Mask_${id}` })
    if (groupPath) {
        mask.appendChild(groupPath)
        return mask
    }
    const bgMask = createFullRect("black")
    const maskPath = createSvgElement('path', { d, fill: "white" })
    mask.appendChild(bgMask)
    mask.appendChild(maskPath)
    defsNode.appendChild(mask)
    return mask

}

//create svg with texture size and a background
//TODO Background initially is black but maybe alpha channel can be used
function createSvgBase(maskModelPath) {
    const svgProps = {
        viewBox: "0 0 4096 4096",
        height: "900",
        width: "900",
    }
    const svg = createSvgElement("svg", svgProps)

    const bgSvg = createFullRect("black")
    const defsNode = createSvgElement('defs', {})

    const groupMasked2 = createGroupMasked("Mask_mainMask")
    const groupMasked = createSvgElement('g', { id: 'maingroup' })
    svg.appendChild(bgSvg)
    svg.appendChild(defsNode)
    svg.appendChild(groupMasked)
    return { svg, groupMasked, defsNode }
}



//create background for groups (masks or color masked)
function createFullRect(color, id) {
    const fullRectProps = {
        x: 0,
        y: 0,
        width: 4096,
        height: 4096,
        fill: color,
        id: id
    }
    const rect = createSvgElement('rect', fullRectProps)

    return rect
}


// create any svg children and set the props
function createSvgElement(type, props) {
    const newElement = document.createElementNS('http://www.w3.org/2000/svg', type)
    Object.keys(props).forEach((prop, index) => { newElement.setAttribute(prop, props[prop]) })
    return newElement
}

//create a group with a mask assinged
function createGroupMasked(mask) {
    const groupMasked = createSvgElement('g', { mask: `url(#${mask})` })
    groupMasked.style.mixBlendMode = "screen"
    return groupMasked

}

//Loader to load svg files
async function loadSVG({ name, location = "svg", file }) {
    return new Promise((resolve) => {
        fetch(`/${location}/${file}`)
            .then(response => response.text())
            .then(svg => {
                const parser = new DOMParser()
                const svgDoc = parser.parseFromString(svg, 'image/svg+xml')
                const groupPath = svgDoc.getElementById("zona")
                const groupDef = svgDoc.getElementById("defs")
                const maskSvg = createMask({ id: name, groupPath })
                const svgGroup = createSvgElement('g', { name: `g_${name}` })
                if (groupDef !== null) {
                    groupDef.setAttribute('id', `def_${name}`)
                    svgGroup.appendChild(groupDef)
                }
                svgGroup.appendChild(maskSvg)



                resolve({ name, svgGroup })
            })
    })
}
//loader for load a number of svg files
export async function loadSVGfiles(svgFiles) {

    const ImagesPromise = svgFiles.map(({ name, file }) => loadSVG({ name, file }))
    const svgLoaded = await Promise.all(ImagesPromise)
    const svgfiles = svgLoaded.reduce((acum, { name, svgGroup }) => ({ ...acum, [name]: svgGroup }), {})
    return svgfiles
}


export function SVGToImage(settings) {
    let _settings = {
        svg: null,
        mimetype: "image/png",
        quality: 1,
        width: "auto",
        height: "auto",
        outputFormat: "base64"
    }
    for (let key in settings) { _settings[key] = settings[key] }
    return new Promise(function (resolve, reject) {
        let svgNode
        // Create SVG Node if a plain string has been provided
        if (typeof (_settings.svg) == "string") {
            // Create a non-visible node to render the SVG string
            let SVGContainer = document.createElement("div")
            SVGContainer.style.display = "none"
            SVGContainer.innerHTML = _settings.svg
            svgNode = SVGContainer.firstElementChild
        } else {

            svgNode = _settings.svg

        }

        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let svgXml = new XMLSerializer().serializeToString(svgNode)
        let svgBase64 = "data:image/svg+xml;base64," + btoa(svgXml)
        const image = new Image()
        image.onload = function () {
            let finalWidth, finalHeight
            // Calculate width if set to auto and the height is specified (to preserve aspect ratio)
            if (_settings.width === "auto" && _settings.height !== "auto") {
                finalWidth = (this.width / this.height) * _settings.height
                // Use image original width
            } else if (_settings.width === "auto") {
                finalWidth = this.naturalWidth
                // Use custom width
            } else {
                finalWidth = _settings.width
            }
            // Calculate height if set to auto and the width is specified (to preserve aspect ratio)
            if (_settings.height === "auto" && _settings.width !== "auto") {
                finalHeight = (this.height / this.width) * _settings.width
                // Use image original height
            } else if (_settings.height === "auto") {
                finalHeight = this.naturalHeight
                // Use custom height
            } else {
                finalHeight = _settings.height
            }
            // Define the canvas intrinsic size
            canvas.width = 4096
            canvas.height = 4096
            this.width = 4096
            this.height = 4096
            // Render image in the canvas
            context.drawImage(this, 0, 0, finalWidth, finalHeight)
            const texture = new THREE.CanvasTexture(canvas)
            texture.flipY = false
            resolve(texture)
        }
        image.src = svgBase64
    })
}
// create all textures
async function svgToTextures(domSvg, colors) {
    //always acumulate colors to avoid antialising produce background color zones between two zones of same pattern
    const colorsHex = ["#ff0000", "#00ff00", "#0000ff"]

    //each texture allor to use the three channels r g b
    //so we will use 1 texture for each 3 colors, background color have a different uniform
    //split array in three colors first color will be background color 
    const colorsTri = chunks(colors, 3)



    const texturesPromises = colorsTri.filter((val, index) => index < 100).map((triColorArray) => {
        //turn all zones in black to avoid color contamination

        colors.forEach(({ node }, index) => {
            node.setAttribute("fill", "transparent")
        })
        //turn the three zonas in acumulative colors red -> green ->blue
        // as statted without acumulate color antiliasing of svg gonna produce undesired edges

        triColorArray.forEach(({ node }, index) => {
            node.setAttribute("fill", colorsHex[index])
        }
        )
        return svgToTexture(domSvg.cloneNode(true))
    })
    const textures = Promise.all(texturesPromises)
    return textures

}
function chunks(arr, size) {
    return arr.map((e, i) => {
        return i % size === 0 ? arr.slice(i, i + size) : null
    }).filter((e) => { return e })
}


async function svgToTexture(domSvg) {

    return new Promise((resolve, reject) => {
        SVGToImage({
            svg: domSvg,
            mimetype: "image/png",
            width: 4096,
            quality: 1
        }).then(function (texture) {
            resolve(texture)
        })
            .catch(function (err) {
                reject(err)
            })
    })
}


