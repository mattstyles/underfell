
import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, SIZES} from 'core/constants/game'
import {getViewport} from 'core/service/viewport'

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
        left: cell.position[0] * SIZES.CELL_WIDTH,
        top: cell.position[1] * SIZES.CELL_HEIGHT,
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

/**
 * Calculate the viewport, render just the viewport and pass the offset to
 * the entities renderer so they can render in the correct places.
 */
const Map = ({mat, entities}) => {
  let char = entities[0]
  let v = getViewport(mat, ...char.position)
  return (
    <div className='Map'>
      {render(mat.hi(v[2], v[3]).lo(v[0], v[1]))}
      <Entities
        entities={entities}
        translate={[-v[0], -v[1]]}
      />
    </div>
  )
}

export default Map
