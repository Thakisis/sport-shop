import { useStore } from "@/Store"
import { ArrowBarLeft } from "tabler-icons-react"
import { Button } from '@mantine/core'

export function Numbers(props) {
    const { setMenu } = useStore((state) => state.Actions)
    return (
        <div>
            <Button leftIcon={<ArrowBarLeft strokeWidth={2} />}
                variant="subtle"
                onClick={() => setMenu(0)}
            >
                Cambiar Patron
            </Button>
        </div>
    )
}

