
import ndarray from 'ndarray'

import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, SIZES} from 'core/constants/game'
import {getViewport} from 'core/service/viewport'

/**
 * Render an individual cell
 */
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

/**
 * Maps over the matrix rendering cells
 * Translate is relative to the chunk div
 */
const render = (mat, translate) => {
  return ndMap(mat, (mat, x, y) => {
    let block = mat.get(x, y)
    return renderCell({
      ...block,
      position: [x + translate[0], y + translate[1]]
    })
  })
}

/**
 * Calculate the viewport, render just the viewport and pass the offset to
 * the entities renderer so they can render in the correct places.
 */
const Map = ({map, entities}) => {
  let mat = ndarray(map.data, [map.width, map.height])

  let char = entities[0]
  let v = getViewport(mat, ...char.position)

  let view = mat.hi(v.p2[0], v.p2[1]).lo(v.p1[0], v.p1[1])
  let blocks = render(view, [0, 0])

  return (
    <div className='Map' style={{
      width: SIZES.VIEWPORT_WIDTH * SIZES.CELL_WIDTH,
      height: SIZES.VIEWPORT_HEIGHT * SIZES.CELL_HEIGHT
    }}>
      {blocks}
      <Entities
        entities={entities}
        translate={[-v.p1[0], -v.p1[1]]}
        map={map}
      />
    </div>
  )
}

export default Map
