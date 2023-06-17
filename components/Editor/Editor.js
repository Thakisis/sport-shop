import { EditorUi } from './EditorUI'
import { CanvasWrapper } from './CanvasWrapper'
import { InitStore } from './InitStore'
import { MainLoader } from './Mainloader'
export function Editor(props) {
    return (
        <div>
            <MainLoader />
            <EditorUi {...props}>
                <CanvasWrapper></CanvasWrapper>
            </EditorUi>
            <InitStore {...props} />
        </div>
    )
}

