
import { Drawer } from './Drawer'
import { panelPositions } from '@/config'



export function Drawers({ children }) {


    const panelsRender = panelPositions.map((props) => {


        return (<Drawer key={props.panel} {...props} />)
    })


    return (
        <div>
            {panelsRender}
        </div>
    )
}
