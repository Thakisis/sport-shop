import { patternsList } from '@/config'
import { PatternCard } from './PatternCard'
import { useStore } from '@/Store'


export function Patterns(props) {
    const { modelId } = useStore(state => state.selected)
    const { setMenu } = useStore((state) => state.Actions)


    const patternModel = modelId ? Object.keys(patternsList[modelId]).map(patternKey => ({ patternId: patternKey, ...patternsList[modelId][patternKey] })) : []

    const listPattern = patternModel.map((pattern) => <PatternCard key={pattern.patternId} modelId={modelId} {...pattern} />)
    return (
        <div>

            {listPattern}
        </div >
    )
}

