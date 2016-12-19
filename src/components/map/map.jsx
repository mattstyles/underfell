
import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, BLOCK_SIZE} from 'core/constants/game'

const renderCell = cell => {
  if (cell.state === BLOCK_STATES.INVISIBLE) {
    return null
  }

  let renderProps = {
    opacity: cell.light
  }

  if (cell.state === BLOCK_STATES.DISCOVERED) {
    renderProps.opacity = 0.25
  }

  return (
    <span
      className='Block'
      style={{
        color: cell.color,
        left: cell.position[0] * BLOCK_SIZE.WIDTH,
        top: cell.position[1] * BLOCK_SIZE.HEIGHT,
        ...renderProps
      }}
    >{cell.char}</span>
  )
}

// @TODO this is a rendering bottleneck, need to split up which parts of the
// map get rendered to stop re-drawing unchanging cells. Use pure render
// mixin for componentShouldUpdate.
const render = mat => {
  return ndMap(mat, (mat, x, y) => {
    let block = mat.get(x, y)
    return renderCell({
      ...block,
      position: [x, y]
    })
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
