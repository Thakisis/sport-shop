export const panelPositions = [
    {
        position: "left",
        panel: "Models",
        title: "Models",
        size: "120",
        opened: true,
    },
    {
        position: "left",
        panel: "Patterns",
        title: "Patterns",
        opened: false,
        size: "xs"
    },
    {
        position: "right",
        panel: "Colors",
        title: "Colors",
        opened: false,
        size: "xs"
    },
    {
        position: "right",
        panel: "Numbers",
        title: "Numbers",
        opened: false,
        size: "xs"
    },
    {
        position: "right",
        panel: "Logos",
        title: "Logos",
        opened: false,
        size: "xs"
    },
]
function getpanelData() {
    return panelPositions
}

export const panelPosition = getpanelData()