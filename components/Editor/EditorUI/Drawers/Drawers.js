
import { Drawer } from './Drawer'
import { panelPositions } from '@/config'



export function Drawers({ children }) {


    const panelsRender = panelPositions.map((props) => {


        return (<Drawer key={props.panel} {...props} className="overflow-x-visible" />)
    })


    return (
        <div>
            {panelsRender}
        </div>
    )
}
