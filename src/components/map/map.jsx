
import Entities from 'components/entities/entities'
import {getById} from 'core/models/blocks'
import {ndMap} from 'core/utils/ndarray'

const render = mat => {
  return ndMap(mat, (mat, x, y) => {
    let block = getById(mat.get(x, y))
    return (
      <span
        className='Block'
        style={{
          color: block.color,
          left: x * 9,
          top: y * 16
        }}
      >{block.char}</span>
    )
  })
}

const Map = ({mat, entities}) => {
  return (
    <div className='Map'>
      {render(mat)}
      <Entities entities={entities} />
    </div>
  )
}

export default Map
