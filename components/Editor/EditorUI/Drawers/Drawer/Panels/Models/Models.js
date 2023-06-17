import { modelList } from '@/config'
import { ModelCard } from './ModelCard'
export function Models(props) {
    const modelsRender = modelList.map((propsModel) => (<ModelCard key={propsModel.idModel}{...propsModel} ></ModelCard>))
    return (
        <div>

            {modelsRender}

        </div>
    )
}
