
import ndarray from 'ndarray'

import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, SIZES, CHUNK_STATES} from 'core/constants/game'
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
 * Render a chunk, which is absolutely positioned so pass a [0, 0] translate
 * to cells within the chunk, this is not removed from code awaiting testing.
 */
const Chunk = ({mat, translate}) => {
  return (
    <div className='Chunk' style={{
      width: SIZES.CHUNK_WIDTH * SIZES.CELL_WIDTH,
      height: SIZES.CHUNK_HEIGHT * SIZES.CELL_HEIGHT,
      left: translate[0] * SIZES.CELL_WIDTH,
      top: translate[1] * SIZES.CELL_HEIGHT
    }}>
      {render(mat, [0, 0])}
    </div>
  )
}

/**
 * Chunk update function, checks the chunk dirty flag to see if it should
 * recalculate the DOM. As we are potentially rendering a large number of nodes
 * per map this chunking helps to reduce draw calls to only chunks that have
 * actually changed.
 */
const shouldChunkUpdate = (node, last, next, a) => {
  return next.isDirty !== CHUNK_STATES.CLEAN
}

/**
 * Calculate the viewport, render just the viewport and pass the offset to
 * the entities renderer so they can render in the correct places.
 */
const Map = ({map, entities}) => {
  let mat = ndarray(map.data, [map.width, map.height])

  let char = entities[0]
  let v = getViewport(mat, ...char.position)

  // @TODO use the viewport to render visible chunks.

  let chunks = map.chunks.map(chunk => {
    return (
      <Chunk
        mat={mat.hi(
          chunk.translate[0] + SIZES.CHUNK_WIDTH,
          chunk.translate[1] + SIZES.CHUNK_HEIGHT
        ).lo(...chunk.translate)}
        translate={chunk.translate}
        isDirty={chunk.state}
        onComponentShouldUpdate={shouldChunkUpdate}
      />
    )
  })

  return (
    <div className='Map'>
      {chunks}
      <Entities
        entities={entities}
        translate={[-v[0], -v[1]]}
      />
    </div>
  )
}

export default Map
