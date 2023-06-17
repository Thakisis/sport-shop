import { Menu } from "./Menu"
import { Drawers } from "./Drawers"
export function EditorUi({ children }) {

    return (
        <div className="flex w-screen h-screen relative ">

            <Drawers />
            <div className="absolute flex bottom-5  h-10 w-full justify-center ">
                <div className="w-25  ">
                    <Menu /></div>
            </div>
            {children}
        </div>
    )
}

